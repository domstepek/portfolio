---
estimated_steps: 5
estimated_files: 4
---

# T02: Build ShaderBackground client component and mount in root layout

**Slice:** S03 — Shader and interactive client components
**Milestone:** M005

## Description

Create the `ShaderBackground` React client component that wraps the existing `src/lib/shader/dither-shader.ts` engine and mount it in the root layout. This retires the "Shader SSR crash" risk — browser-only GPU code must work inside the Next.js App Router RSC tree without crashing `next build` or SSR. The component ports all behavior from the Astro `ShaderBackground.astro`: pointer tracking, reduced-motion handling, visibility-change pause/resume, and proper cleanup via `instance.destroy()`.

## Steps

1. Install `@webgpu/types` as a devDependency (`npm install -D @webgpu/types`)
2. Create `src/components/shader/ShaderBackground.tsx`:
   - Add `'use client'` directive at top
   - `useRef<HTMLCanvasElement>(null)` for canvas reference
   - `useEffect` with async init: call `initDitherShader(canvas)`, store instance in a ref
   - Inside same `useEffect`: add `pointermove` listener (passive, normalizes coords, calls `setPointer` + `addRipple`), `pointerdown` listener (calls `addRipple` with click flag), `prefers-reduced-motion` media query (pause/resume), `visibilitychange` listener (pause when hidden, resume when visible and motion allowed)
   - Cleanup function: remove all event listeners, call `instance?.destroy()`
   - Render: `<canvas ref={canvasRef} id="shader-bg" aria-hidden="true" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }} />`
   - Handle React 18+ StrictMode double-mount: cleanup must be idempotent, re-init on remount works
3. Mount `<ShaderBackground />` in `src/app/layout.tsx` as the first child of `<body>`, before the skip-link. Import at top of layout file.
4. Run `npm run build` to verify no SSR crash and build exits 0
5. Run `npx playwright test tests/e2e/shader.spec.ts` to verify shader canvas renders with `data-shader-renderer` attribute on homepage, about, and authenticated domain page. Also run full suite to confirm no regression.

## Must-Haves

- [ ] `ShaderBackground.tsx` is a `'use client'` component that imports and calls `initDitherShader` only inside `useEffect`
- [ ] Canvas has `id="shader-bg"`, `aria-hidden="true"`, fixed position at `z-index: -1` with `pointer-events: none`
- [ ] `useEffect` cleanup calls `instance.destroy()` and removes all event listeners
- [ ] Pointer tracking: `pointermove` → `setPointer(nx, ny)` + `addRipple(nx, ny)`, `pointerdown` → `addRipple(nx, ny, true)`
- [ ] Reduced-motion: pauses shader and sets `data-shader-motion="frozen"` when `prefers-reduced-motion: reduce` matches
- [ ] Visibility-change: pauses when `document.hidden`, resumes when visible (unless reduced motion)
- [ ] `@webgpu/types` installed as devDependency
- [ ] `next build` exits 0 (no SSR crash)
- [ ] Shader tests pass; existing 13 tests still pass

## Verification

- `npm run build` → exits 0 with no shader-related errors
- `npx playwright test tests/e2e/shader.spec.ts --reporter=list` → 3/3 pass
- `npx playwright test tests/e2e/gate.spec.ts tests/e2e/public.spec.ts --reporter=list` → 13/13 pass
- Manual check: `document.querySelector('[data-shader-renderer]').dataset.shaderRenderer` returns `'webgpu'` or `'webgl2'` in browser console

## Observability Impact

- Signals added/changed: `data-shader-renderer` attribute on canvas (set by shader engine); `data-shader-motion` attribute for reduced-motion state (set by component); `[shader] using <renderer>` console.info on init
- How a future agent inspects this: `document.querySelector('[data-shader-renderer]')` in browser console; Playwright `page.locator('[data-shader-renderer]')` in tests
- Failure state exposed: `data-shader-renderer="none"` means both WebGPU and WebGL2 failed — plain dark background shows through; `[shader] ...` console.warn on failure

## Inputs

- `src/components/shader/ShaderBackground.astro` — reference implementation for all behaviors to port
- `src/lib/shader/dither-shader.ts` — public API: `initDitherShader(canvas, options?) → Promise<ShaderInstance | null>`; `ShaderInstance` has `setPointer()`, `addRipple()`, `pause()`, `resume()`, `destroy()`
- `src/app/layout.tsx` — mount point (first child of `<body>`)
- S01 forward intelligence: root layout has full site shell; canvas goes before skip-link per D029

## Expected Output

- `src/components/shader/ShaderBackground.tsx` — `'use client'` component wrapping shader engine with full lifecycle management
- `src/app/layout.tsx` — modified to include `<ShaderBackground />` as first child of `<body>`
- `package.json` — `@webgpu/types` added to devDependencies
