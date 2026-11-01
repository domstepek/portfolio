'use client';

import { useEffect, useRef } from 'react';

/**
 * TerminalTitle — the window's shell path. On client navigation it backspaces
 * to the shared prefix and types the new path, like `cd` in a terminal.
 * Server-rendered with the final text, so no-JS and first paint are correct.
 */
export function TerminalTitle({ path }: { path: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const full = `dom@portfolio: ${path}`;

  useEffect(() => {
    // PageTransitions records the outgoing path at click time. Reading it from
    // the root (instead of module state) keeps this StrictMode-safe.
    const root = document.documentElement;
    const el = textRef.current;
    const prev = root.dataset.prevTitle;
    if (!el || !prev || prev === full) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let shared = 0;
    while (shared < prev.length && shared < full.length && prev[shared] === full[shared]) shared++;

    const frames: string[] = [];
    for (let n = prev.length - 1; n >= shared; n--) frames.push(prev.slice(0, n));
    for (let n = shared + 1; n <= full.length; n++) frames.push(full.slice(0, n));

    const owner = el.parentElement;
    const step = Math.min(28, 420 / Math.max(frames.length, 1));
    el.textContent = prev;
    owner?.setAttribute('data-typing', 'true');

    let raf = 0;
    let done = 0;
    // Let the page transition land first; then type on the frame clock, so a
    // busy main thread skips ahead instead of flushing every frame at once.
    const start = performance.now() + (root.dataset.navDirection ? 280 : 0);
    const tick = (now: number) => {
      const i = Math.floor((now - start) / step);
      if (i >= 0) el.textContent = frames[Math.min(i, frames.length - 1)];
      if (i < frames.length - 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      done = window.setTimeout(() => {
        owner?.removeAttribute('data-typing');
        if (root.dataset.prevTitle === prev) delete root.dataset.prevTitle;
      }, 700);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
      el.textContent = full;
      owner?.removeAttribute('data-typing');
    };
  }, [full]);

  return (
    <code className="terminal-panel__title">
      <span ref={textRef}>{full}</span>
      <span className="terminal-panel__cursor" aria-hidden="true" />
    </code>
  );
}
