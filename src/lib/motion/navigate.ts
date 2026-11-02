/**
 * Shared page-transition navigation. Link clicks (PageTransitions) and the
 * command palette both route through here, so every way of moving around
 * the site gets the same View Transition, direction, and shader pulse.
 */
type Router = { push: (href: string) => void };
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
  const target = url.pathname + url.search + url.hash;
  const doc = document as DocumentWithTransitions;
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (url.pathname === window.location.pathname || !doc.startViewTransition || reducedMotion) {
    root.dataset.navigated = 'true';
    router.push(target);
    return;
  }

  root.dataset.navDirection = directionBetween(window.location.pathname, url.pathname);
  root.dataset.navigated = 'true';
  if (origin) {
    window.dispatchEvent(new CustomEvent('portfolio:pulse', { detail: origin }));
  }

  const transition = doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        settle = resolve;
        router.push(target);
        window.setTimeout(resolve, 1500); // never hold the page hostage
      }),
  );
  transition.finished.finally(() => {
    delete root.dataset.navDirection;
    window.dispatchEvent(new Event('portfolio:transition-end'));
  });
}
