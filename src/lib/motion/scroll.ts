/**
 * Animated in-page scrolling. Duration grows with distance (so a short hop is
 * quick and a long one still reads as travel), eased in and out, and it
 * stops the moment the visitor scrolls themselves. Reduced motion jumps.
 */

const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

let cancelCurrent: (() => void) | null = null;

export function smoothScrollTo(target: Element, { focus = true } = {}) {
  cancelCurrent?.();
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const startY = window.scrollY;
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  const endY = Math.max(0, Math.min(maxY, target.getBoundingClientRect().top + startY - margin));
  const distance = endY - startY;

  const finish = () => {
    if (!focus || !(target instanceof HTMLElement)) return;
    if (!target.hasAttribute('tabindex') && !target.matches('a, button, input, select, textarea')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };

  if (Math.abs(distance) < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, endY);
    finish();
    return;
  }

  const duration = Math.min(1200, Math.max(480, 440 + Math.abs(distance) * 0.35));
  const start = performance.now();
  let raf = 0;

  const stop = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('wheel', stop);
    window.removeEventListener('touchstart', stop);
    window.removeEventListener('keydown', stop);
    cancelCurrent = null;
  };
  cancelCurrent = stop;
  window.addEventListener('wheel', stop, { passive: true });
  window.addEventListener('touchstart', stop, { passive: true });
  window.addEventListener('keydown', stop);

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, startY + distance * easeInOutQuart(t));
    if (t < 1) raf = requestAnimationFrame(step);
    else {
      stop();
      finish();
    }
  };
  raf = requestAnimationFrame(step);
}

/** Scrolls to `#id` and records it in the URL. */
export function scrollToHash(hash: string, { push = true, delay = 0 } = {}) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return false;
  const run = () => {
    const target = document.getElementById(id);
    if (!target) return;
    const url = window.location.pathname + window.location.search + '#' + id;
    if (push && window.location.hash !== '#' + id) window.history.pushState(window.history.state, '', url);
    else if (!push) window.history.replaceState(window.history.state, '', url);
    smoothScrollTo(target);
  };
  if (delay) window.setTimeout(run, delay);
  else run();
  return Boolean(document.getElementById(id)) || delay > 0;
}
