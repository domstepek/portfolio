'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { navigateWithTransition, settleTransition } from '@/lib/motion/navigate';
import { scrollToHash } from '@/lib/motion/scroll';

/**
 * PageTransitions — wraps same-origin link navigation in a View Transition
 * (see lib/motion/navigate.ts). Reduced-motion users and browsers without
 * startViewTransition get plain navigation.
 */
export function PageTransitions() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    settleTransition();
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest('a');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) {
        // In-page anchors travel instead of jumping. The skip link stays instant.
        if (!url.hash || anchor.classList.contains('skip-link')) return;
        if (!document.getElementById(decodeURIComponent(url.hash.slice(1)))) return;
        event.preventDefault();
        scrollToHash(url.hash);
        return;
      }
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return; // files such as the resume PDF

      event.preventDefault();
      event.stopPropagation();
      navigateWithTransition(router, url.href, {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      });
    }

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, [router]);

  return null;
}
