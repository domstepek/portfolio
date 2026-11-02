/**
 * Shared page-transition navigation. Link clicks (PageTransitions) and the
 * command palette both route through here, so every way of moving around
 * the site gets the same View Transition, direction, and shader pulse.
 */
import { scrollToHash } from './scroll';

type Router = { push: (href: string, options?: { scroll?: boolean }) => void };
type DocumentWithTransitions = Document & {
  startViewTransition?: (update: () => Promise<void>) => { finished: Promise<void> };
};

const SECTION_ORDER = ['', 'work', 'about', 'resume', 'notes', 'domains'];

function rank(pathname: string): [number, number] {
  const segments = pathname.split('/').filter(Boolean);
  return [segments.length, SECTION_ORDER.indexOf(segments[0] ?? '')];
}

export function directionBetween(from: string, to: string) {
  const [depthFrom, sectionFrom] = rank(from);
  const [depthTo, sectionTo] = rank(to);
  if (depthTo !== depthFrom) return depthTo > depthFrom ? 'forward' : 'back';
  return sectionTo >= sectionFrom ? 'forward' : 'back';
}

let settle: (() => void) | null = null;
const ENTER_MS = 900;

/** Called by PageTransitions once the new route has committed. */
export function settleTransition() {
  settle?.();
  settle = null;
}

export function navigateWithTransition(
  router: Router,
  href: string,
  origin?: { x: number; y: number },
) {
  const url = new URL(href, window.location.href);
  // Hash targets are scrolled to with animation after the page lands,
  // instead of the router's instant jump.
  const target = url.pathname + url.search;
  const doc = document as DocumentWithTransitions;
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (url.pathname === window.location.pathname) {
    if (url.hash) scrollToHash(url.hash);
    else window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    return;
  }

  if (!doc.startViewTransition || reducedMotion) {
    root.dataset.navigated = 'true';
    router.push(target);
    if (url.hash) scrollToHash(url.hash, { push: false, delay: 120 });
    return;
  }

  root.dataset.navDirection = directionBetween(window.location.pathname, url.pathname);
  root.dataset.navigated = 'true';
  if (origin) {
    window.dispatchEvent(new CustomEvent('portfolio:pulse', { detail: origin }));
  }

  root.dataset.scanning = '';
  const transition = doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        let done = false;
        const land = () => {
          if (done) return;
          done = true;
          // The new page's sections cascade in (live, under the old snapshot).
          root.dataset.entering = '';
          window.setTimeout(() => {
            delete root.dataset.entering;
            delete root.dataset.navDirection;
          }, ENTER_MS);
          resolve();
        };
        settle = land;
        router.push(target);
        window.setTimeout(land, 1500); // never hold the page hostage
      }),
  );
  transition.finished.finally(() => {
    window.setTimeout(() => delete root.dataset.scanning, 500);
    window.dispatchEvent(new Event('portfolio:transition-end'));
    if (url.hash) scrollToHash(url.hash, { push: false, delay: 260 });
  });
}
