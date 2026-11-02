/**
 * Ticker worker: owns the random walk so the main thread only applies
 * results. Each batch is a Float64Array of [row, fieldIndex, value] triples,
 * transferred (not copied) to the main thread.
 *
 * Runs from a Blob URL (see createTickerWorker) because Turbopack currently
 * emits `new Worker(new URL(...))` targets as unbundled assets
 * (vercel/next.js#94015). So `tickerWorker` must stay self-contained: no
 * imports or outer variables. Rows and field names arrive in the init message.
 *
 * Conflation: while a batch is unacknowledged (the main thread is still
 * rendering), new updates collapse into the latest value per row and field.
 * A slow consumer gets fewer, larger batches instead of an unbounded backlog.
 *
 * Viewport streaming: every row keeps ticking here, but only rows inside the
 * rendered range (sent by the virtualizer) are shipped to the main thread.
 * Rows entering the range get a full snapshot, the way trading grids
 * subscribe to what's on screen. Main-thread cost tracks the viewport, so the
 * rate can scale with the table.
 *
 * In:  { type: 'init', rows, fields } | { type: 'rate', perSecond } | { type: 'range', start, end }
 *      | { type: 'start' } | { type: 'stop' } | { type: 'ack' }
 * Out: { type: 'batch', buffer: ArrayBuffer, events: number, shipped: number }
 */
import type { Field, Row } from './seed';

function tickerWorker() {
  type Msg = { type: string; rows?: Row[]; fields?: Field[]; perSecond?: number; start?: number; end?: number };
  const ctx = self as unknown as {
    postMessage: (message: unknown, transfer?: Transferable[]) => void;
    onmessage: ((event: MessageEvent<Msg>) => void) | null;
  };
  const TICK_MS = 16;
  let rows: Row[] = [];
  let index: Record<string, number> = {};
  let perSecond = 1000;
  let timer: ReturnType<typeof setInterval> | null = null;
  let carry = 0;
  let lastTick = 0;
  let inFlight = false;
  let pendingEvents = 0;
  let pendingShipped = 0;
  let rangeStart = 0;
  let rangeEnd = 30;
  const pending = new Map<number, number>(); // row * 16 + fieldIndex -> latest value

  function flush() {
    if (inFlight || pending.size === 0) return;
    const out = new Float64Array(pending.size * 3);
    let i = 0;
    pending.forEach((value, key) => {
      out[i++] = key >> 4;
      out[i++] = key & 15;
      out[i++] = value;
    });
    const events = pendingEvents;
    const shipped = pendingShipped;
    pending.clear();
    pendingEvents = 0;
    pendingShipped = 0;
    inFlight = true;
    ctx.postMessage({ type: 'batch', buffer: out.buffer, events, shipped }, [out.buffer]);
  }

  const round2 = (n: number) => Math.round(n * 100) / 100;
  // Box-Muller: a normal draw for the price walk.
  const gaussian = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());

  function tick() {
    const now = performance.now();
    carry += (perSecond * (now - lastTick)) / 1000;
    lastTick = now;
    const events = Math.floor(carry);
    carry -= events;
    if (events === 0 || rows.length === 0) return;

    const stamp = Date.now();
    const push = (row: number, field: Field, value: number) => { pending.set(row * 16 + index[field], value); };
    pendingEvents += events;

    for (let e = 0; e < events; e++) {
      const r = Math.floor(Math.random() * rows.length);
      const row = rows[r];
      const ship = r >= rangeStart && r <= rangeEnd;
      if (ship) pendingShipped++;
      if (Math.random() < 0.7) {
        // Price move: last, change, bid/ask, and the timestamp change together.
        const next = Math.max(1, round2(row.last * (1 + gaussian() * 0.0006)));
        if (next === row.last) continue;
        row.last = next;
        row.chg = round2(next - row.open);
        row.chgPct = (row.chg / row.open) * 100;
        row.bid = round2(next - 0.01 * (1 + Math.floor(Math.random() * 3)));
        row.ask = round2(next + 0.01 * (1 + Math.floor(Math.random() * 3)));
        row.updated = stamp;
        if (!ship) continue;
        push(r, 'last', row.last);
        push(r, 'chg', row.chg);
        push(r, 'chgPct', row.chgPct);
        push(r, 'bid', row.bid);
        push(r, 'ask', row.ask);
        push(r, 'updated', stamp);
      } else {
        // Book or trade update: one size changes, volume grows.
        const side: Field = Math.random() < 0.5 ? 'bidSize' : 'askSize';
        const size = 100 * (1 + Math.floor(Math.random() * 9));
        row[side] = size;
        row.volume += Math.floor(Math.random() * 400);
        if (!ship) continue;
        push(r, side, size);
        push(r, 'volume', row.volume);
      }
    }

    flush();
  }

  ctx.onmessage = (event) => {
    const msg = event.data;
    if (msg.type === 'init' && msg.rows && msg.fields) {
      rows = msg.rows;
      index = {};
      msg.fields.forEach((f, i) => { index[f] = i; });
    }
    if (msg.type === 'rate' && msg.perSecond) perSecond = msg.perSecond;
    if (msg.type === 'range' && msg.start !== undefined && msg.end !== undefined) {
      // Snapshot rows that just came into view; they've been ticking unseen.
      for (let r = msg.start; r <= msg.end && r < rows.length; r++) {
        if (r >= rangeStart && r <= rangeEnd) continue;
        for (const f in index) pending.set(r * 16 + index[f], (rows[r] as unknown as Record<string, number>)[f]);
      }
      rangeStart = msg.start;
      rangeEnd = msg.end;
      flush();
    }
    if (msg.type === 'ack') {
      inFlight = false;
      flush();
    }
    if (msg.type === 'start' && !timer) {
      lastTick = performance.now();
      carry = 0;
      timer = setInterval(tick, TICK_MS);
    }
    if (msg.type === 'stop' && timer) {
      clearInterval(timer);
      timer = null;
    }
    if (msg.type === 'start' || msg.type === 'init') inFlight = false;
  };
}

/** Starts the ticker in a real Web Worker. Call revoke() with terminate(). */
export function createTickerWorker(rows: Row[], fields: readonly Field[]) {
  const url = URL.createObjectURL(new Blob([`(${tickerWorker.toString()})()`], { type: 'text/javascript' }));
  const worker = new Worker(url);
  worker.postMessage({ type: 'init', rows, fields: [...fields] });
  return { worker, revoke: () => URL.revokeObjectURL(url) };
}
