/**
 * Text morph — transitions.dev recipe 33.
 * Letters both labels share stay put; only the differing middle cross-blurs
 * while its width eases. Pair with the .t-morph* rules in globals.css.
 */
type MorphElement = HTMLElement & { _morphTimer?: number };

import { cssTime } from './css-time';

export function morphText(target: HTMLElement, next: string) {
  const el = target as MorphElement;
  const prev = el.dataset.text ?? el.textContent ?? '';
  if (prev === next) return;
  el.dataset.text = next;
  window.clearTimeout(el._morphTimer);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = next;
    return;
  }

  let a = 0;
  while (a < prev.length && a < next.length && prev[a] === next[a]) a++;
  let b = 0;
  while (b < prev.length - a && b < next.length - a && prev[prev.length - 1 - b] === next[next.length - 1 - b]) b++;

  const swap = document.createElement('span');
  swap.className = 't-morph-swap';
  const out = document.createElement('span');
  out.className = 't-morph-old';
  out.setAttribute('aria-hidden', 'true');
  out.textContent = prev.slice(a, prev.length - b);
  const inn = document.createElement('span');
  inn.className = 't-morph-new';
  inn.textContent = next.slice(a, next.length - b);
  swap.append(out, inn);

  el.textContent = '';
  el.append(next.slice(0, a), swap, next.slice(next.length - b));

  swap.style.width = `${out.getBoundingClientRect().width}px`;
  void swap.offsetWidth; // reflow so the width transitions
  swap.classList.add('is-morphing');
  swap.style.width = `${inn.getBoundingClientRect().width}px`;

  el._morphTimer = window.setTimeout(() => {
    el.textContent = next;
  }, Math.max(cssTime('--text-morph-dur', 180), cssTime('--text-morph-resize-dur', 240)) + 40);
}
