'use client';

/**
 * Fullscreen fixed canvas that renders the dither shader behind all page content.
 * Place as the first child of <body> so it sits below every stacking context.
 *
 * Ports all behavior from the Astro ShaderBackground.astro:
 *   - Pointer tracking (pointermove → setPointer + addRipple)
 *   - Click/tap ripple (pointerdown → addRipple with force)
 *   - Reduced-motion handling (pause + data-shader-motion="frozen")
 *   - Visibility-change pause/resume
 *   - Proper cleanup via instance.destroy()
 *
 * Observability:
 *   - `data-shader-renderer` attribute set by initDitherShader engine
 *   - `data-shader-motion` attribute set by this component
 *   - Console: `[shader] using <renderer>` on success
 *   - Console: `[shader] ...` warnings on failure
 *   - Inspect: document.querySelector('[data-shader-renderer]')
 */

import { useEffect, useRef } from 'react';
import type { ShaderInstance } from '@/lib/shader/types';

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let instance: ShaderInstance | null = null;
    let destroyed = false;

    // Track listeners for cleanup
    const abortController = new AbortController();
    const { signal } = abortController;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function applyMotionPref(reduced: boolean) {
      if (!instance || !canvas) return;
      if (reduced) {
        instance.pause();
        canvas.dataset.shaderMotion = 'frozen';
      } else {
        instance.resume();
        canvas.dataset.shaderMotion = 'animating';
      }
    }

    async function init() {
      // Dynamic import keeps the shader engine out of SSR bundles entirely
      const { initDitherShader } = await import('@/lib/shader/dither-shader');

      // Guard against StrictMode double-mount: if cleanup ran before init resolved, bail out
      if (destroyed) return;

      const result = await initDitherShader(canvas!);
      if (destroyed) {
        result?.destroy();
        return;
      }

      instance = result;
      if (!instance) return;

      // ── Cursor tracking ─────────────────────────────────────────
      document.addEventListener(
        'pointermove',
        (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth;
          const ny = e.clientY / window.innerHeight;
          instance!.setPointer(nx, ny);
          instance!.addRipple(nx, ny);
        },
        { passive: true, signal },
      );

      // ── Tap/click ripple (mobile + desktop) ─────────────────────
      document.addEventListener(
        'pointerdown',
        (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth;
          const ny = e.clientY / window.innerHeight;
          instance!.addRipple(nx, ny, true);
        },
        { passive: true, signal },
      );

      // ── Reduced motion: freeze to one static frame ──────────────
      applyMotionPref(motionQuery.matches);
      motionQuery.addEventListener(
        'change',
        (e) => applyMotionPref(e.matches),
        { signal },
      );

      // ── Tab visibility: pause when hidden ───────────────────────
      document.addEventListener(
        'visibilitychange',
        () => {
          if (!instance) return;
          if (document.hidden) {
            instance.pause();
          } else if (!motionQuery.matches) {
            instance.resume();
          }
        },
        { signal },
      );
    }

    init();

    // ── Cleanup (StrictMode-safe: idempotent) ───────────────────
    return () => {
      destroyed = true;
      abortController.abort(); // removes all listeners at once
      instance?.destroy();
      instance = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="shader-bg"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    />
  );
}
