/**
 * Public orchestrator for the dither shader engine.
 *
 * Detection chain: WebGPU → WebGL2 → null.
 * Reads palette colors from CSS custom properties at init time,
 * converts to linear RGB, and delegates to the active renderer.
 */

import type {
  Renderer,
  ShaderColors,
  ShaderInstance,
  ShaderOptions,
} from './types';
import { srgbToLinear } from './types';
import { WebGPURenderer } from './webgpu-renderer';
import { WebGL2Renderer } from './webgl2-renderer';

// ── Color helpers ───────────────────────────────────────────────────

/** Read CSS custom property value from :root. */
function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Build full ShaderColors from CSS vars, with optional overrides. */
function resolveColors(overrides?: Partial<ShaderColors>): ShaderColors {
  const bg = overrides?.bg ?? srgbToLinear(getCSSVar('--bg') || '#0a0a0a');
  const accent = overrides?.accent ?? srgbToLinear(getCSSVar('--accent') || '#6fba7f');
  const strong = overrides?.strong ?? srgbToLinear(getCSSVar('--accent-strong') || '#7fd48f');
  return { bg, accent, strong };
}

// ── Renderer detection ──────────────────────────────────────────────

type RendererTag = 'webgpu' | 'webgl2';

interface DetectionResult {
  renderer: Renderer;
  tag: RendererTag;
}

async function detectRenderer(
  canvas: HTMLCanvasElement,
  colors: ShaderColors,
): Promise<DetectionResult | null> {
  // 1. Try WebGPU first
  if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
    const r = new WebGPURenderer();
    if (await r.init(canvas, colors)) {
      return { renderer: r, tag: 'webgpu' };
    }
  }

  // 2. Fall back to WebGL2
  const r = new WebGL2Renderer();
  if (await r.init(canvas, colors)) {
    return { renderer: r, tag: 'webgl2' };
  }

  return null;
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Initialize the dither shader on a canvas element.
 *
 * Tries WebGPU first, then WebGL2. Returns `null` if neither is available.
 * The returned `ShaderInstance` controls the animation lifecycle.
 */
export async function initDitherShader(
  canvas: HTMLCanvasElement,
  options?: ShaderOptions,
): Promise<ShaderInstance | null> {
  const colors = resolveColors(options?.colors);
  const result = await detectRenderer(canvas, colors);

  if (!result) {
    console.warn('[shader] no gpu api available');
    canvas.dataset.shaderRenderer = 'none';
    return null;
  }

  const { renderer, tag } = result;
  console.info(`[shader] using ${tag}`);
  canvas.dataset.shaderRenderer = tag;

  // ── State ───────────────────────────────────────────────────────
  let rafId = 0;
  let paused = false;
  let destroyed = false;
  const pointer: [number, number] = [0.5, 0.5];
  const startTime = performance.now();

  // ── Ripple ring buffer ──────────────────────────────────────────
  const MAX_RIPPLES = 32;
  const rippleData = new Float32Array(MAX_RIPPLES * 4); // vec4(x, y, birthTime, intensity)
  let rippleWriteIndex = 0;
  let rippleCount = 0;
  let lastRippleX = -1;
  let lastRippleY = -1;

  function addRippleInternal(x: number, y: number, force = false) {
    // Throttle: skip if cursor hasn't moved enough (avoids stacking ripples on same spot).
    if (!force) {
      const dx = x - lastRippleX;
      const dy = y - lastRippleY;
      if (lastRippleX >= 0 && (dx * dx + dy * dy) < 0.0004) return;
    }

    const elapsed = (performance.now() - startTime) / 1000;
    const offset = rippleWriteIndex * 4;
    rippleData[offset] = x;
    rippleData[offset + 1] = y;
    rippleData[offset + 2] = elapsed;
    rippleData[offset + 3] = 1.0; // intensity

    rippleWriteIndex = (rippleWriteIndex + 1) % MAX_RIPPLES;
    rippleCount = Math.min(rippleCount + 1, MAX_RIPPLES);
    lastRippleX = x;
    lastRippleY = y;
  }

  // ── Render loop ─────────────────────────────────────────────────
  function frame() {
    if (paused || destroyed) return;
    const elapsed = (performance.now() - startTime) / 1000;
    renderer.updateRipples(rippleData, rippleCount);
    renderer.render(elapsed, pointer);
    rafId = requestAnimationFrame(frame);
  }

  // ── ResizeObserver ──────────────────────────────────────────────
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(width * dpr);
      const h = Math.round(height * dpr);
      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
        renderer.resize(w, h);
      }
    }
  });
  observer.observe(canvas);

  // Kick off the loop
  rafId = requestAnimationFrame(frame);

  // ── ShaderInstance ──────────────────────────────────────────────
  return {
    pause() {
      if (!paused && !destroyed) {
        paused = true;
        cancelAnimationFrame(rafId);
      }
    },
    resume() {
      if (paused && !destroyed) {
        paused = false;
        rafId = requestAnimationFrame(frame);
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      paused = true;
      cancelAnimationFrame(rafId);
      observer.disconnect();
      renderer.destroy();
    },
    setPointer(x: number, y: number) {
      pointer[0] = x;
      pointer[1] = y;
    },
    addRipple(x: number, y: number, force?: boolean) {
      addRippleInternal(x, y, force);
    },
  };
}
