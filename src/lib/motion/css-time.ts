/**
 * Read a CSS time token (e.g. --revert-hold) in milliseconds.
 * Minifiers rewrite `3000ms` as `3s`, so plain parseFloat is not enough.
 */
export function cssTime(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = parseFloat(raw);
  if (!Number.isFinite(value)) return fallback;
  return /ms$/i.test(raw) ? value : /s$/i.test(raw) ? value * 1000 : value;
}
