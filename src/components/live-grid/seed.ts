/**
 * Shared by the server render, the client store, and the ticker worker, so
 * all three start from identical rows (no hydration mismatch, no jump).
 */
export const FIELDS = ['last', 'chg', 'chgPct', 'bid', 'ask', 'bidSize', 'askSize', 'volume', 'updated'] as const;
export type Field = (typeof FIELDS)[number];

export interface Row {
  symbol: string;
  open: number;
  last: number;
  chg: number;
  chgPct: number;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  volume: number;
  updated: number; // epoch ms; 0 until the first tick
}

const SYMBOLS = [
  'AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'TSM', 'AVGO', 'JPM', 'V',
  'XOM', 'LLY', 'UNH', 'MA', 'COST', 'HD', 'PG', 'JNJ', 'ORCL', 'ABBV',
  'BAC', 'KO', 'NFLX', 'CRM', 'AMD', 'PEP', 'TMO', 'ADBE', 'CVX', 'WMT',
  'MRK', 'CSCO', 'ACN', 'LIN', 'MCD', 'ABT', 'DIS', 'WFC', 'INTU', 'TXN',
  'QCOM', 'CAT', 'IBM', 'GE', 'AMGN', 'PM', 'NOW', 'SPGI', 'ISRG', 'UBER',
  'GS', 'BKNG', 'RTX', 'HON', 'AXP', 'PFE', 'LOW', 'BLK', 'SYK', 'MS',
];

/** Row counts the demo offers. The first is the 60 real tickers plus 1,000 generated ones. */
export const ROW_SIZES = [1060, 5000, 10000] as const;

/** mulberry32: small deterministic PRNG for the seed only. */
function prng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Real tickers first, then deterministic made-up ones for larger tables. */
function symbolsFor(count: number) {
  const rand = prng(7);
  const out = SYMBOLS.slice(0, count);
  const seen = new Set(out);
  while (out.length < count) {
    const len = 3 + Math.floor(rand() * 2);
    let s = '';
    for (let i = 0; i < len; i++) s += LETTERS[Math.floor(rand() * 26)];
    if (!seen.has(s)) { seen.add(s); out.push(s); }
  }
  return out;
}

export function seedRows(count: number = ROW_SIZES[0]): Row[] {
  const rand = prng(42);
  return symbolsFor(count).map((symbol) => {
    const open = Math.round((40 + rand() * 860) * 100) / 100;
    const last = Math.round(open * (1 + (rand() - 0.5) * 0.02) * 100) / 100;
    const chg = Math.round((last - open) * 100) / 100;
    return {
      symbol,
      open,
      last,
      chg,
      chgPct: (chg / open) * 100,
      bid: Math.round((last - 0.01) * 100) / 100,
      ask: Math.round((last + 0.01) * 100) / 100,
      bidSize: 100 * (1 + Math.floor(rand() * 9)),
      askSize: 100 * (1 + Math.floor(rand() * 9)),
      volume: Math.floor(2e6 + rand() * 4e7),
      updated: 0,
    };
  });
}
