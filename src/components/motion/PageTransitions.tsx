'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * PageTransitions — wraps same-origin link navigation in a View Transition.
 *
 * The terminal window is a shared element (it morphs between pages), page
 * content slides in the direction of travel, and the shader sends a pulse
 * from the click point. Reduced-motion users and browsers without
 * startViewTransition get plain navigation.
 *
 * Direction: deeper routes and later primary sections are "forward".
 */
const SECTION_ORDER = ['', 'about', 'resume', 'notes', 'domains'];

function rank(pathname: string): [number, number] {
  const segments = pathname.split('/').filter(Boolean);
  return [segments.length, SECTION_ORDER.indexOf(segments[0] ?? '')];
}

function directionBetween(from: string, to: string) {
  const [depthFrom, sectionFrom] = rank(from);
  const [depthTo, sectionTo] = rank(to);
  if (depthTo !== depthFrom) return depthTo > depthFrom ? 'forward' : 'back';
  return sectionTo >= sectionFrom ? 'forward' : 'back';
}

type DocumentWithTransitions = Document & {
  startViewTransition?: (update: () => Promise<void>) => { finished: Promise<void> };
};

export function PageTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const settle = useRef<(() => void) | null>(null);

  // Resolve the pending transition once the new route has committed.
  useEffect(() => {
    settle.current?.();
    settle.current = null;
  }, [pathname]);

  useEffect(() => {
    const doc = document as DocumentWithTransitions;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!doc.startViewTransition || reducedMotion.matches) return;

      const anchor = (event.target as Element | null)?.closest('a');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // in-page anchors
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return; // files such as the resume PDF

      event.preventDefault();
      event.stopPropagation();

      const root = document.documentElement;
      root.dataset.navDirection = directionBetween(window.location.pathname, url.pathname);
      root.dataset.navigated = 'true';
      const title = document.querySelector('.terminal-panel__title span')?.textContent;
      if (title) root.dataset.prevTitle = title;
      else delete root.dataset.prevTitle;
      window.dispatchEvent(
        new CustomEvent('portfolio:pulse', {
          detail: { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight },
        }),
      );

      const transition = doc.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            settle.current = resolve;
            router.push(url.pathname + url.search + url.hash);
            window.setTimeout(resolve, 1500); // never hold the page hostage
          }),
      );
      transition.finished.finally(() => {
        delete root.dataset.navDirection;
        window.dispatchEvent(new Event('portfolio:transition-end'));
      });
    }

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, [router]);

  return null;
}
