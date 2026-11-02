'use client';

import {
  createContext, memo, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState,
  useSyncExternalStore, type CSSProperties, type MutableRefObject,
} from 'react';
import { batch, observable, type Observable } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
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
 * Each batch is applied to one Legend State observable inside batch().
 *   Atomic: every cell subscribes to its own field (grid$.rows[r].last),
 *           so a tick re-renders only the cells whose value changed.
 *   Naive:  the table subscribes to the whole store and re-renders every
 *           cell on every tick, which is what a plain useState table does.
 * Every number in the readout is measured here, in this browser.
 */

type Mode = 'atomic' | 'naive';
type GridStore = Observable<{ rows: Row[] }>;
type FieldNodes = Record<Field, Observable<number>>;

const DESKTOP_COLUMNS: Field[] = ['last', 'chg', 'chgPct', 'bid', 'ask', 'bidSize', 'askSize', 'volume', 'updated'];
const PHONE_COLUMNS: Field[] = ['last', 'chg', 'chgPct'];
const LABELS: Record<Field, string> = {
  last: 'Last', chg: 'Chg', chgPct: 'Chg %', bid: 'Bid', ask: 'Ask',
  bidSize: 'Bid size', askSize: 'Ask size', volume: 'Volume', updated: 'Updated',
};
const RATES = [10, 100, 1000];
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

  // Runs once per commit of this cell: that's the "rendered" count.
  useLayoutEffect(() => {
    env.stats.commits++;
    const el = ref.current;
    const before = prev.current;
    const changed = before !== value;
    prev.current = value;
    if (!el || !env.motion.current) return;
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

const AtomicBody = memo(function AtomicBody({ nodes, symbols, columns }: { nodes: FieldNodes[]; symbols: string[]; columns: Field[] }) {
  return (
    <div role="rowgroup">
      {nodes.map((row, r) => (
        <div role="row" className="live-grid__row" key={symbols[r]}>
          <div role="rowheader" className="live-grid__symbol">{symbols[r]}</div>
          {columns.map((f) => <AtomicCell key={f} node$={row[f]} field={f} />)}
        </div>
      ))}
    </div>
  );
});

const NaiveBody = memo(function NaiveBody({ grid$, columns }: { grid$: GridStore; columns: Field[] }) {
  // Subscribe to the whole table: any field change re-renders every row.
  // useSyncExternalStore gives it the same render priority as useSelector.
  const version = useRef(0);
  const subscribe = useCallback(
    (onStoreChange: () => void) => grid$.rows.onChange(() => { version.current++; onStoreChange(); }),
    [grid$],
  );
  const tick = useSyncExternalStore(subscribe, () => version.current, () => 0);
  const env = useContext(CellContext)!;
  const groupRef = useRef<HTMLDivElement>(null);
  // Every cell re-rendered, so one outline around the table says it honestly.
  useLayoutEffect(() => {
    if (!tick || !env.highlight.current || !env.motion.current) return;
    groupRef.current?.animate(
      [{ boxShadow: 'inset 0 0 0 1px rgb(224 180 92 / 0.85)' }, { boxShadow: 'inset 0 0 0 1px transparent' }],
      { duration: 500, easing: 'ease-out' },
    );
  }, [tick, env]);
  const rows = grid$.rows.peek();
  return (
    <div role="rowgroup" ref={groupRef} className="live-grid__body">
      {rows.map((row) => (
        <div role="row" className="live-grid__row" key={row.symbol}>
          <div role="rowheader" className="live-grid__symbol">{row.symbol}</div>
          {columns.map((f) => <NaiveCell key={f} value={row[f]} field={f} />)}
        </div>
      ))}
    </div>
  );
});

// ── Measurements ──
interface Readout {
  updatesPerSecond: number;
  cellsPerTick: number;
  p95: number;
  work: number;
  bars: number[];
  applied: number;
}
const EMPTY: Readout = { updatesPerSecond: 0, cellsPerTick: 0, p95: 0, work: 0, bars: [], applied: 0 };

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

// One store for every row. The worker streams [row, field, value] triples.
const grid$ = observable({ rows: seedRows() })

worker.onmessage = ({ data }) => {
  const updates = new Float64Array(data.buffer)
  batch(() => {
    for (let i = 0; i < updates.length; i += 3) {
      grid$.rows[updates[i]][FIELDS[updates[i + 1]]].set(updates[i + 2])
    }
  })
  // Ack after React commits; until then the worker conflates to latest values.
  queueMicrotask(() => worker.postMessage({ type: 'ack' }))
}

// Each cell subscribes to one field, so a tick re-renders only that cell.
const Cell = memo(({ node$ }) => {
  const value = useSelector(node$) // e.g. grid$.rows[12].last
  return <td>{format(value)}</td>
})`;

export function LiveGrid() {
  const phone = useIsPhone();
  const columns = phone ? PHONE_COLUMNS : DESKTOP_COLUMNS;
  const [mode, setMode] = useState<Mode>('atomic');
  const [rate, setRate] = useState(1000);
  const [running, setRunning] = useState(true);
  const [inView, setInView] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [readout, setReadout] = useState<Readout>(EMPTY);

  const [rowCount, setRowCount] = useState<number>(ROW_SIZES[1]);
  // A new table size is a new store (and a new worker, below).
  const grid$ = useMemo<GridStore>(() => observable({ rows: seedRows(rowCount) }), [rowCount]);
  const symbols = useMemo(() => grid$.rows.peek().map((r) => r.symbol), [grid$]);
  const nodes = useMemo<FieldNodes[]>(
    () => symbols.map((_, r) => Object.fromEntries(FIELDS.map((f) => [f, grid$.rows[r][f]])) as unknown as FieldNodes),
    [grid$, symbols],
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const rateRef = useRef(rate);
  const activeRef = useRef(false);
  const highlightRef = useRef(false);
  const motionRef = useRef(true);
  const cellOutlinesRef = useRef(true);
  const env = useRef<CellEnv>({ stats: { commits: 0 }, highlight: highlightRef, motion: motionRef, cellOutlines: cellOutlinesRef });
  const windows = useRef({ events: [] as [number, number][], ticks: [] as [number, number][], frames: [] as [number, number][], work: [] as [number, number][], lastCommits: 0, applied: 0 });

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
    // Work per tick: JavaScript time from batch arrival to React's commit.
    // Store subscriptions render on React's sync lane, flushed in a microtask
    // queued during batch(); ours is queued after it, so it runs post-commit.
    worker.onmessage = (event: MessageEvent<{ type: string; buffer: ArrayBuffer; events: number }>) => {
      if (event.data.type !== 'batch') return;
      const w = windows.current;
      const now = performance.now();
      // Commits since the previous batch belong to the previous tick's render.
      const commits = env.current.stats.commits;
      w.ticks.push([now, commits - w.lastCommits]);
      w.lastCommits = commits;
      w.events.push([now, event.data.events]);
      w.applied += event.data.events;

      const updates = new Float64Array(event.data.buffer);
      batch(() => {
        for (let i = 0; i < updates.length; i += 3) {
          nodes[updates[i]][FIELDS[updates[i + 1]]].set(updates[i + 2]);
        }
      });
      queueMicrotask(() => {
        const done = performance.now();
        windows.current.work.push([done, done - now]);
        worker.postMessage({ type: 'ack' }); // ready for the next (conflated) batch
      });
    };
    // Fresh store: restart at the current play state and reset the windows.
    windows.current = { events: [], ticks: [], frames: [], work: [], lastCommits: env.current.stats.commits, applied: windows.current.applied };
    if (activeRef.current && document.visibilityState === 'visible') worker.postMessage({ type: 'start' });
    return () => {
      worker.terminate();
      revoke();
      workerRef.current = null;
    };
  }, [nodes, grid$]);

  useEffect(() => {
    rateRef.current = rate;
    workerRef.current?.postMessage({ type: 'rate', perSecond: rate });
  }, [rate]);

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
      w.ticks = w.ticks.filter(([t]) => now - t < 1000);
      w.frames = w.frames.filter(([t]) => now - t < 2000);
      w.work = w.work.filter(([t]) => now - t < 2000);
      const recent = w.frames.filter(([t]) => now - t < 2000).map(([, d]) => d);
      const tickCommits = w.ticks.map(([, c]) => c);
      setReadout({
        updatesPerSecond: w.events.reduce((s, [, n]) => s + n, 0),
        cellsPerTick: tickCommits.length ? Math.round(tickCommits.reduce((s, c) => s + c, 0) / tickCommits.length) : 0,
        p95: p95(recent),
        work: p95(w.work.map(([, d]) => d)),
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

  const totalCells = rowCount * columns.length;
  const overBudget = readout.p95 > BUDGET_MS * 1.05;

  return (
    <div
      ref={rootRef}
      className="surface live-grid"
      data-live-grid
      data-mode={mode}
      data-running={active ? 'true' : 'false'}
      data-applied={readout.applied}
      data-cells-per-tick={readout.cellsPerTick}
      data-total-cells={totalCells}
      data-work-ms={readout.work.toFixed(2)}
    >
      <div className="live-grid__header">
        <div className="live-grid__title">
          <div className="live-grid__name">
            <h3>Live grid</h3>
            <Badge pill>Simulated data</Badge>
          </div>
          <p>
            Simulated prices, generated in a Web Worker and streamed into a Legend State store. In atomic mode each cell
            subscribes to its own field, so the work per tick tracks how many values changed. Naive re-renders the whole
            table, so its work grows with the table. Make the table bigger and watch which one holds.
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
            options={ROW_SIZES.map((n) => ({ value: String(n), label: `${group.format(n * columns.length)} cells` }))}
            value={String(rowCount)}
            onValueChange={(v) => setRowCount(Number(v))}
          />
          <SegmentedControl
            label="Updates per second"
            options={RATES.map((r) => ({ value: String(r), label: r >= 1000 ? `${r / 1000}k/s` : `${r}/s` }))}
            value={String(rate)}
            onValueChange={(v) => setRate(Number(v))}
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
          <p>{active ? 'Measured, last second' : 'Paused'}</p>
        </div>
        <div>
          <dt>Cells rendered per tick</dt>
          <dd>{group.format(readout.cellsPerTick)} <span>of {group.format(totalCells)}</span></dd>
          <p>{mode === 'atomic' ? 'Only the cells that changed' : 'Every cell, every tick'}</p>
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

      <div className="live-grid__scroll">
        <div
          role="table"
          aria-label="Simulated prices"
          aria-rowcount={rowCount + 1}
          className={`live-grid__table${phone ? ' is-compact' : ''}`}
          style={{ '--cols': columns.length } as CSSProperties}
        >
          <div role="rowgroup" className="live-grid__head">
            <div role="row" className="live-grid__row">
              <div role="columnheader" className="live-grid__symbol">Symbol</div>
              {columns.map((f) => <div key={f} role="columnheader" className="live-grid__cell">{LABELS[f]}</div>)}
            </div>
          </div>
          <CellContext.Provider value={env.current}>
            {mode === 'atomic'
              ? <AtomicBody nodes={nodes} symbols={symbols} columns={columns} />
              : <NaiveBody grid$={grid$} columns={columns} />}
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
