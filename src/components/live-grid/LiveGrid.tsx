'use client';

import {
  createContext, memo, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState,
  useSyncExternalStore, type CSSProperties, type MutableRefObject,
} from 'react';
import { batch, observable, type Observable } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Code, Pause, Play } from 'lucide-react';
import SegmentedControl from '@/components/arc/segmented-control/segmented-control';
import { Switch } from '@/components/arc/switch/switch';
import { Button } from '@/components/arc/button/button';
import { Badge } from '@/components/arc/badge/badge';
import { CodeBlock } from '@/components/arc/code-block/code-block';
import { FIELDS, ROW_SIZES, seedRows, type Field, type Row } from './seed';
import { createTickerWorker } from './ticker-worker';

/**
 * LiveGrid — a stress test for cell-level subscriptions.
 *
 * A Web Worker runs the random walk and streams [row, field, value] batches.
 * The table is virtualized with TanStack Virtual: only on-screen rows mount,
 * while every row in the store keeps updating.
 * Each batch is applied to one Legend State observable inside batch().
 *   Atomic: every cell subscribes to its own field (grid$.rows[r].last),
 *           so a tick re-renders only the cells whose value changed.
 *   Naive:  the table subscribes to the whole store and re-renders every
 *           cell on every tick, which is what a plain useState table does.
 * Every number in the readout is measured here, in this browser.
 */

type Mode = 'atomic' | 'naive';
type GridStore = Observable<{ rows: Row[] }>;
const ROW_H = 34;
const VIEW_ROWS = 13;

const DESKTOP_COLUMNS: Field[] = ['last', 'chg', 'chgPct', 'bid', 'ask', 'bidSize', 'askSize', 'volume', 'updated'];
const PHONE_COLUMNS: Field[] = ['last', 'chg', 'chgPct'];
const LABELS: Record<Field, string> = {
  last: 'Last', chg: 'Chg', chgPct: 'Chg %', bid: 'Bid', ask: 'Ask',
  bidSize: 'Bid size', askSize: 'Ask size', volume: 'Volume', updated: 'Updated',
};
/** Updates per row per second. The total rate scales with the table. */
const PER_ROW = [2, 8, 16];
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const BUDGET_MS = 1000 / 60;
const FLASHES: ReadonlySet<Field> = new Set(['last', 'chg', 'chgPct', 'bid', 'ask']);
const SIGNED: ReadonlySet<Field> = new Set(['chg', 'chgPct']);

const group = new Intl.NumberFormat('en-US');
const clock = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

function format(field: Field, v: number) {
  switch (field) {
    case 'chg': return (v > 0 ? '+' : '') + v.toFixed(2);
    case 'chgPct': return (v > 0 ? '+' : '') + v.toFixed(2) + '%';
    case 'bidSize': case 'askSize': return group.format(v);
    case 'volume': return (v / 1e6).toFixed(1) + 'M';
    case 'updated': return v ? clock.format(v) : '—';
    default: return v.toFixed(2);
  }
}

// ── Per-cell effects: commit counting, value flash, re-render outline ──
interface CellEnv {
  stats: { commits: number };
  highlight: MutableRefObject<boolean>;
  motion: MutableRefObject<boolean>;
  /** Per-cell outlines (atomic). Naive outlines the whole table once instead. */
  cellOutlines: MutableRefObject<boolean>;
}
const CellContext = createContext<CellEnv | null>(null);

function useCell(field: Field, value: number) {
  const env = useContext(CellContext)!;
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef(value);
  const mountedAt = useRef(0);

  // Runs once per commit of this cell: that's the "rendered" count.
  useLayoutEffect(() => {
    env.stats.commits++;
    if (!mountedAt.current) mountedAt.current = performance.now();
    const el = ref.current;
    const before = prev.current;
    const changed = before !== value;
    prev.current = value;
    // Skip the snapshot that lands right after a row scrolls into view.
    if (!el || !env.motion.current || performance.now() - mountedAt.current < 200) return;
    if (changed && FLASHES.has(field)) {
      el.animate(
        [{ backgroundColor: value > before ? 'rgb(123 196 127 / 0.24)' : 'rgb(229 138 120 / 0.24)' }, { backgroundColor: 'transparent' }],
        { duration: 650, easing: 'ease-out' },
      );
    }
    if (env.highlight.current && env.cellOutlines.current) {
      el.animate(
        [{ boxShadow: `inset 0 0 0 1px ${changed ? 'rgb(123 196 127 / 0.95)' : 'rgb(224 180 92 / 0.75)'}` }, { boxShadow: 'inset 0 0 0 1px transparent' }],
        { duration: 500, easing: 'ease-out' },
      );
    }
  });

  const tone = SIGNED.has(field) ? (value > 0 ? ' is-up' : value < 0 ? ' is-down' : '') : '';
  return { ref, className: 'live-grid__cell' + tone + (field === 'updated' ? ' is-muted' : '') };
}

/** Atomic: subscribes to exactly one field of one row. */
const AtomicCell = memo(function AtomicCell({ node$, field }: { node$: Observable<number>; field: Field }) {
  const value = useSelector(node$);
  const { ref, className } = useCell(field, value);
  return <div role="cell" ref={ref} className={className}>{format(field, value)}</div>;
});

/** Naive: a plain cell that re-renders whenever its parent does. */
function NaiveCell({ value, field }: { value: number; field: Field }) {
  const { ref, className } = useCell(field, value);
  return <div role="cell" ref={ref} className={className}>{format(field, value)}</div>;
}

/** Atomic row: memoized per index, so scrolling mounts new rows without touching old ones. */
const AtomicRow = memo(function AtomicRow({ grid$, index, start, columns }: { grid$: GridStore; index: number; start: number; columns: Field[] }) {
  const row$ = grid$.rows[index];
  return (
    <div role="row" aria-rowindex={index + 2} className="live-grid__row" style={{ transform: `translateY(${start}px)` }}>
      <div role="rowheader" className="live-grid__symbol">{row$.symbol.peek()}</div>
      {columns.map((f) => <AtomicCell key={f} node$={row$[f] as Observable<number>} field={f} />)}
    </div>
  );
});

function NaiveRow({ row, index, start, columns }: { row: Row; index: number; start: number; columns: Field[] }) {
  return (
    <div role="row" aria-rowindex={index + 2} className="live-grid__row" style={{ transform: `translateY(${start}px)` }}>
      <div role="rowheader" className="live-grid__symbol">{row.symbol}</div>
      {columns.map((f) => <NaiveCell key={f} value={row[f]} field={f} />)}
    </div>
  );
}

interface GridBodyProps {
  grid$: GridStore;
  mode: Mode;
  rowCount: number;
  columns: Field[];
  /** State, not a ref: the parent's ref attaches after this child's layout effect. */
  scrollEl: HTMLDivElement | null;
  visibleRows: MutableRefObject<number>;
  onRange: (start: number, end: number) => void;
}

const GridBody = memo(function GridBody({ grid$, mode, rowCount, columns, scrollEl, visibleRows, onRange }: GridBodyProps) {
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollEl,
    estimateSize: () => ROW_H,
    overscan: 4,
    initialRect: { width: 1000, height: ROW_H * VIEW_ROWS },
  });

  // Naive only: subscribe to the whole table, so any change re-renders every
  // visible row. Same render priority as useSelector (useSyncExternalStore).
  const version = useRef(0);
  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      mode === 'naive' ? grid$.rows.onChange(() => { version.current++; onStoreChange(); }) : () => {},
    [grid$, mode],
  );
  const tick = useSyncExternalStore(subscribe, () => version.current, () => 0);

  const env = useContext(CellContext)!;
  const groupRef = useRef<HTMLDivElement>(null);
  // Every visible cell re-rendered, so one outline around the table says it honestly.
  useLayoutEffect(() => {
    if (mode !== 'naive' || !tick || !env.highlight.current || !env.motion.current) return;
    groupRef.current?.animate(
      [{ boxShadow: 'inset 0 0 0 1px rgb(224 180 92 / 0.85)' }, { boxShadow: 'inset 0 0 0 1px transparent' }],
      { duration: 500, easing: 'ease-out' },
    );
  }, [tick, env, mode]);

  const items = virtualizer.getVirtualItems();
  visibleRows.current = items.length;
  const first = items[0]?.index ?? 0;
  const last = items[items.length - 1]?.index ?? 0;
  useEffect(() => { onRange(first, last); }, [first, last, onRange]);
  const rows = mode === 'naive' ? grid$.rows.peek() : null;

  return (
    <div role="rowgroup" ref={groupRef} className="live-grid__body" style={{ height: virtualizer.getTotalSize() }}>
      {items.map((v) =>
        rows
          ? <NaiveRow key={v.key} row={rows[v.index]} index={v.index} start={v.start} columns={columns} />
          : <AtomicRow key={v.key} grid$={grid$} index={v.index} start={v.start} columns={columns} />,
      )}
    </div>
  );
});

// ── Measurements ──
interface Readout {
  updatesPerSecond: number;
  shippedPerSecond: number;
  cellsPerTick: number;
  p95: number;
  work: number;
  visibleRows: number;
  bars: number[];
  applied: number;
}
const EMPTY: Readout = { updatesPerSecond: 0, shippedPerSecond: 0, cellsPerTick: 0, p95: 0, work: 0, visibleRows: 0, bars: [], applied: 0 };

function p95(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))];
}

function useIsPhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return phone;
}

const CODE = `import { batch, observable } from '@legendapp/state'
import { useSelector } from '@legendapp/state/react'
import { useVirtualizer } from '@tanstack/react-virtual'

// One store for every row. The worker streams [row, field, value] triples.
const grid$ = observable({ rows: seedRows(1060) })

worker.onmessage = ({ data }) => {
  const updates = new Float64Array(data.buffer)
  batch(() => {
    for (let i = 0; i < updates.length; i += 3) {
      grid$.rows[updates[i]][FIELDS[updates[i + 1]]].set(updates[i + 2])
    }
  })
  // Ack after React commits; until then the worker keeps only the latest values.
  queueMicrotask(() => worker.postMessage({ type: 'ack' }))
}

// Only on-screen rows mount, and the worker only streams those rows.
const rows = useVirtualizer({ count: 1060, estimateSize: () => 34, getScrollElement })
useEffect(() => worker.postMessage({ type: 'range', start: first, end: last }), [first, last])

// Each cell subscribes to one field, so a tick re-renders only that cell.
const Cell = memo(({ node$ }) => {
  const value = useSelector(node$) // e.g. grid$.rows[812].last
  return <div role="cell">{format(value)}</div>
})`;

export function LiveGrid() {
  const phone = useIsPhone();
  const columns = phone ? PHONE_COLUMNS : DESKTOP_COLUMNS;
  const [mode, setMode] = useState<Mode>('atomic');
  const [perRow, setPerRow] = useState(PER_ROW[2]);
  const [running, setRunning] = useState(true);
  const [inView, setInView] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [readout, setReadout] = useState<Readout>(EMPTY);

  const [rowCount, setRowCount] = useState<number>(ROW_SIZES[0]);
  // A new table size is a new store (and a new worker, below).
  const grid$ = useMemo<GridStore>(() => observable({ rows: seedRows(rowCount) }), [rowCount]);

  const rootRef = useRef<HTMLDivElement>(null);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const visibleRows = useRef(VIEW_ROWS + 4);
  const workerRef = useRef<Worker | null>(null);
  const rateRef = useRef(0);
  const rangeRef = useRef<[number, number]>([0, 30]);
  const activeRef = useRef(false);
  const highlightRef = useRef(false);
  const motionRef = useRef(true);
  const cellOutlinesRef = useRef(true);
  const env = useRef<CellEnv>({ stats: { commits: 0 }, highlight: highlightRef, motion: motionRef, cellOutlines: cellOutlinesRef });
  const windows = useRef({ events: [] as [number, number][], shipped: [] as [number, number][], ticks: [] as [number, number][], frames: [] as [number, number][], work: [] as [number, number][], lastCommits: 0, applied: 0 });

  useEffect(() => { highlightRef.current = highlight; }, [highlight]);
  useEffect(() => { cellOutlinesRef.current = mode === 'atomic'; }, [mode]);

  // Reduced motion: start paused, no flashes.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      motionRef.current = false;
      setRunning(false);
    }
  }, []);

  // Only tick while the widget is on screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The worker: random walk off the main thread, batches into the store.
  useEffect(() => {
    const { worker, revoke } = createTickerWorker(grid$.rows.peek().map((r) => ({ ...r })), FIELDS);
    workerRef.current = worker;
    worker.postMessage({ type: 'rate', perSecond: rateRef.current });
    worker.postMessage({ type: 'range', start: rangeRef.current[0], end: rangeRef.current[1] });
    // Work per tick: JavaScript time from batch arrival to React's commit.
    // Store subscriptions render on React's sync lane, flushed in a microtask
    // queued during batch(); ours is queued after it, so it runs post-commit.
    worker.onmessage = (event: MessageEvent<{ type: string; buffer: ArrayBuffer; events: number; shipped: number }>) => {
      if (event.data.type !== 'batch') return;
      const w = windows.current;
      const now = performance.now();
      // Commits since the previous batch belong to the previous tick's render.
      const commits = env.current.stats.commits;
      w.ticks.push([now, commits - w.lastCommits]);
      w.lastCommits = commits;
      w.events.push([now, event.data.events]);
      w.shipped.push([now, event.data.shipped]);
      w.applied += event.data.events;

      const updates = new Float64Array(event.data.buffer);
      batch(() => {
        for (let i = 0; i < updates.length; i += 3) {
          grid$.rows[updates[i]][FIELDS[updates[i + 1]]].set(updates[i + 2]);
        }
      });
      queueMicrotask(() => {
        const done = performance.now();
        windows.current.work.push([done, done - now]);
        worker.postMessage({ type: 'ack' }); // ready for the next (conflated) batch
      });
    };
    // Fresh store: restart at the current play state and reset the windows.
    windows.current = { events: [], shipped: [], ticks: [], frames: [], work: [], lastCommits: env.current.stats.commits, applied: windows.current.applied };
    if (activeRef.current && document.visibilityState === 'visible') worker.postMessage({ type: 'start' });
    return () => {
      worker.terminate();
      revoke();
      workerRef.current = null;
    };
  }, [grid$]);

  const rate = rowCount * perRow;
  rateRef.current = rate;
  useEffect(() => {
    workerRef.current?.postMessage({ type: 'rate', perSecond: rate });
  }, [rate]);
  const onRange = useCallback((start: number, end: number) => {
    rangeRef.current = [start, end];
    workerRef.current?.postMessage({ type: 'range', start, end });
  }, []);

  const active = running && inView;
  activeRef.current = active;
  useEffect(() => {
    const worker = workerRef.current;
    if (!worker) return;
    const sync = () => worker.postMessage({ type: active && document.visibilityState === 'visible' ? 'start' : 'stop' });
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => {
      document.removeEventListener('visibilitychange', sync);
      worker.postMessage({ type: 'stop' });
    };
  }, [active]);

  // Frame intervals, measured with rAF while ticking.
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      windows.current.frames.push([now, now - last]);
      last = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  // Readout, four times a second (the readout itself is not a grid cell).
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      const w = windows.current;
      const now = performance.now();
      w.events = w.events.filter(([t]) => now - t < 1000);
      w.shipped = w.shipped.filter(([t]) => now - t < 1000);
      w.ticks = w.ticks.filter(([t]) => now - t < 1000);
      w.frames = w.frames.filter(([t]) => now - t < 2000);
      w.work = w.work.filter(([t]) => now - t < 2000);
      const recent = w.frames.filter(([t]) => now - t < 2000).map(([, d]) => d);
      const tickCommits = w.ticks.map(([, c]) => c);
      setReadout({
        updatesPerSecond: w.events.reduce((s, [, n]) => s + n, 0),
        shippedPerSecond: w.shipped.reduce((s, [, n]) => s + n, 0),
        cellsPerTick: tickCommits.length ? tickCommits.reduce((s, c) => s + c, 0) / tickCommits.length : 0,
        p95: p95(recent),
        work: p95(w.work.map(([, d]) => d)),
        visibleRows: visibleRows.current,
        bars: w.frames.slice(-24).map(([, d]) => d),
        applied: w.applied,
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [active]);

  const changeMode = useCallback((value: string) => {
    windows.current.ticks = [];
    windows.current.frames = [];
    windows.current.work = [];
    windows.current.lastCommits = env.current.stats.commits;
    setMode(value as Mode);
  }, []);

  const visibleCells = (readout.visibleRows || VIEW_ROWS + 4) * columns.length;
  const overBudget = readout.p95 > BUDGET_MS * 1.05;

  return (
    <div
      ref={rootRef}
      className="surface live-grid"
      data-live-grid
      data-mode={mode}
      data-running={active ? 'true' : 'false'}
      data-applied={readout.applied}
      data-cells-per-tick={readout.cellsPerTick.toFixed(2)}
      data-visible-cells={visibleCells}
      data-work-ms={readout.work.toFixed(2)}
    >
      <div className="live-grid__header">
        <div className="live-grid__title">
          <div className="live-grid__name">
            <h3>Live grid</h3>
            <Badge pill>Simulated data</Badge>
          </div>
          <p>
            Simulated prices for {group.format(rowCount)} rows, generated in a Web Worker. Every row ticks, but the worker
            only streams the rows on screen into a Legend State store, and TanStack Virtual keeps only those rows in the
            DOM. In atomic mode each cell subscribes to its own field and re-renders only when that value changes. Naive
            re-renders every visible cell on every tick.
          </p>
        </div>
        <div className="live-grid__controls">
          <SegmentedControl
            label="Update strategy"
            options={[{ value: 'atomic', label: 'Atomic' }, { value: 'naive', label: 'Naive' }]}
            value={mode}
            onValueChange={changeMode}
          />
          <SegmentedControl
            label="Table size"
            options={ROW_SIZES.map((n) => ({ value: String(n), label: `${group.format(n)} rows` }))}
            value={String(rowCount)}
            onValueChange={(v) => setRowCount(Number(v))}
          />
          <SegmentedControl
            label="Updates per second"
            options={PER_ROW.map((n) => ({ value: String(n), label: `${compact.format(rowCount * n)}/s` }))}
            value={String(perRow)}
            onValueChange={(v) => setPerRow(Number(v))}
          />
          <Button
            variant="secondary"
            size="sm"
            className="icon-button live-grid__pause"
            aria-label={running ? 'Pause updates' : 'Resume updates'}
            aria-pressed={!running}
            onClick={() => setRunning((r) => !r)}
          >
            {running ? <Pause size={16} strokeWidth={1.75} aria-hidden="true" /> : <Play size={16} strokeWidth={1.75} aria-hidden="true" />}
          </Button>
        </div>
      </div>

      <dl className="live-grid__metrics" aria-live="off">
        <div>
          <dt>Updates per second</dt>
          <dd>{group.format(readout.updatesPerSecond)}</dd>
          <p>{active ? `${group.format(readout.shippedPerSecond)} of them on screen` : 'Paused'}</p>
        </div>
        <div>
          <dt>Cells rendered per tick</dt>
          <dd>{readout.cellsPerTick < 10 ? readout.cellsPerTick.toFixed(1) : group.format(Math.round(readout.cellsPerTick))} <span>of {group.format(visibleCells)} on screen</span></dd>
          <p>{mode === 'atomic' ? 'Only on-screen cells whose value changed' : 'Every on-screen cell, every tick'}</p>
        </div>
        <div className={readout.work > BUDGET_MS / 2 ? 'is-bad' : undefined}>
          <dt>Render work per tick</dt>
          <dd>{readout.work ? readout.work.toFixed(1) : '0.0'} ms</dd>
          <p>p95 JavaScript time, batch to commit</p>
        </div>
        <div className={overBudget ? 'is-bad' : undefined}>
          <dt>Frame time</dt>
          <dd>{readout.p95 ? readout.p95.toFixed(1) : '0.0'} ms</dd>
          <p>{overBudget ? 'Over the 16.7 ms budget' : 'p95 frame interval, last 2 s'}</p>
        </div>
      </dl>

      <div className="live-grid__chart" aria-hidden="true">
        <div className="live-grid__chart-legend">
          <span>Frame time, last {phone ? 16 : 24} frames</span>
          <span>16.7 ms budget</span>
        </div>
        <div className="live-grid__bars">
          <span className="live-grid__budget" />
          {readout.bars.slice(phone ? -16 : -24).map((d, i) => (
            <span key={i} className={d > BUDGET_MS * 1.05 ? 'is-over' : undefined} style={{ height: `${Math.min(100, (d / 36) * 100)}%` }} />
          ))}
        </div>
      </div>

      <div className="live-grid__scroll" ref={setScrollEl}>
        <div
          role="table"
          aria-label="Simulated prices"
          aria-rowcount={rowCount + 1}
          className={`live-grid__table${phone ? ' is-compact' : ''}`}
          style={{ '--cols': columns.length } as CSSProperties}
        >
          <div role="rowgroup" className="live-grid__head">
            <div role="row" aria-rowindex={1} className="live-grid__row">
              <div role="columnheader" className="live-grid__symbol">Symbol</div>
              {columns.map((f) => <div key={f} role="columnheader" className="live-grid__cell">{LABELS[f]}</div>)}
            </div>
          </div>
          <CellContext.Provider value={env.current}>
            <GridBody grid$={grid$} mode={mode} rowCount={rowCount} columns={columns} scrollEl={scrollEl} visibleRows={visibleRows} onRange={onRange} />
          </CellContext.Provider>
        </div>
      </div>

      <div className="live-grid__footer">
        <Switch label="Highlight re-renders" checked={highlight} onCheckedChange={setHighlight} />
        <p>
          {highlight
            ? mode === 'atomic'
              ? 'Green outlines: cells React re-rendered because their value changed.'
              : 'Amber outline: the whole table re-rendered on the last tick, changed or not.'
            : 'Outline each cell React re-renders.'}
        </p>
        <Button variant="secondary" size="sm" aria-expanded={showCode} onClick={() => setShowCode((s) => !s)}>
          <Code size={16} strokeWidth={1.75} aria-hidden="true" />
          {showCode ? 'Hide code' : 'View code'}
        </Button>
      </div>
      {showCode && (
        <div className="live-grid__code">
          <CodeBlock code={CODE} filename="live-grid.tsx" language="tsx" />
        </div>
      )}
    </div>
  );
}
