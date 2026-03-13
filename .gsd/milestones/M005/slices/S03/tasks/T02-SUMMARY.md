---
id: T02
parent: S03
milestone: M005
provides:
  - ShaderBackground 'use client' component wrapping dither-shader engine with full lifecycle management
  - Shader canvas mounted in root layout as first child of body on all pages
  - data-shader-renderer and data-shader-motion observability attributes
key_files:
  - src/components/shader/ShaderBackground.tsx
  - src/app/layout.tsx
  - src/lib/shader/dither-shader.ts
key_decisions:
  - D049: Shader engine imports changed from .js to bare specifiers for Turbopack compatibility
  - D050: Used AbortController for listener cleanup instead of manual removeEventListener
patterns_established:
  - Dynamic import of browser-only modules inside useEffect to prevent SSR crashes in Next.js App Router
  - AbortController-based event listener cleanup pattern for 'use client' components (StrictMode-safe)
  - Guard pattern for StrictMode double-mount — destroyed flag checked after each await
observability_surfaces:
  - data-shader-renderer attribute on canvas (webgpu, webgl2, or none)
  - data-shader-motion attribute on canvas (animating or frozen)
  - "[shader] using <renderer>" console.info on success
  - "[shader] <reason>" console.warn on failure
  - document.querySelector('[data-shader-renderer]') for agent inspection
duration: ~20m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T02: Build ShaderBackground client component and mount in root layout

**Created `ShaderBackground.tsx` as a `'use client'` component wrapping the dither-shader engine with full pointer tracking, reduced-motion, and visibility-change lifecycle — mounted in root layout, all 16 Playwright tests pass, `next build` clean.**

## What Happened

Created `src/components/shader/ShaderBackground.tsx` porting all behavior from the Astro `ShaderBackground.astro`:

1. **Installed `@webgpu/types`** as devDependency via pnpm.
2. **Built the component** with `'use client'` directive, `useRef<HTMLCanvasElement>`, and `useEffect` that dynamically imports `initDitherShader` to keep GPU code out of SSR bundles entirely. The component:
   - Initializes the shader engine on mount
   - Tracks pointer movement (`pointermove` → `setPointer` + `addRipple`) and clicks (`pointerdown` → `addRipple` with force flag)
   - Handles `prefers-reduced-motion` (pauses shader, sets `data-shader-motion="frozen"`)
   - Handles `visibilitychange` (pauses when tab hidden, resumes when visible unless reduced-motion)
   - Uses `AbortController` for clean one-shot teardown of all event listeners
   - Guards against React 18+ StrictMode double-mount with a `destroyed` flag checked after each await
3. **Mounted in root layout** as first child of `<body>`, before the skip-link (per D029).
4. **Fixed `.js` import extensions** in the shader engine files (`dither-shader.ts`, `webgl2-renderer.ts`, `webgpu-renderer.ts`) — Turbopack with `moduleResolution: "bundler"` requires bare specifiers, not `.js` suffixes. The Astro build handled these transparently but Next.js Turbopack does not.

## Verification

- `pnpm run build` → exits 0, no SSR crash, no shader-related errors ✓
- `npx playwright test tests/e2e/shader.spec.ts --reporter=list` → 3/3 pass ✓
  - Homepage: `data-shader-renderer` present with valid value
  - About page: `data-shader-renderer` present with valid value
  - Authenticated domain page: `data-shader-renderer` present with valid value
- `npx playwright test tests/e2e/gate.spec.ts tests/e2e/public.spec.ts --reporter=list` → 13/13 pass ✓
- Browser console verification: `document.querySelector('[data-shader-renderer]').dataset.shaderRenderer` → `"webgpu"` ✓
- Browser console verification: `document.querySelector('[data-shader-renderer]').dataset.shaderMotion` → `"animating"` ✓
- Visual verification: shader dither pattern visible in browser behind page content ✓

**Slice-level verification status (intermediate task — partial expected):**
- `shader.spec.ts` → 3/3 pass ✓
- `gallery.spec.ts` → not yet applicable (T03 scope)
- `gate.spec.ts` → 5/5 pass ✓
- `public.spec.ts` → 8/8 pass ✓
- `npm run build` → exits 0 ✓

## Diagnostics

- **Inspect renderer:** `document.querySelector('[data-shader-renderer]').dataset.shaderRenderer` → `'webgpu'`, `'webgl2'`, or `'none'`
- **Inspect motion state:** `document.querySelector('[data-shader-renderer]').dataset.shaderMotion` → `'animating'` or `'frozen'`
- **Console signals:** `[shader] using webgpu` (info) on success; `[shader] no gpu api available` (warn) on failure
- **Playwright locator:** `page.locator('[data-shader-renderer]')` for test assertions
- **Failure state:** `data-shader-renderer="none"` means both WebGPU and WebGL2 failed — plain dark background shows through, no crash

## Deviations

- **Shader engine `.js` → bare specifier imports:** The Astro-era files used `.js` extensions in TypeScript imports (valid for `"module": "NodeNext"` resolution). Turbopack with `moduleResolution: "bundler"` cannot resolve these. Changed all shader engine imports to bare specifiers (e.g. `'./types'` instead of `'./types.js'`). This is a necessary compatibility fix, not a behavior change.

## Known Issues

None.

## Files Created/Modified

- `src/components/shader/ShaderBackground.tsx` — new `'use client'` component wrapping shader engine with full lifecycle
- `src/app/layout.tsx` — added `<ShaderBackground />` as first child of `<body>`
- `src/lib/shader/dither-shader.ts` — changed `.js` imports to bare specifiers for Turbopack
- `src/lib/shader/webgl2-renderer.ts` — changed `.js` import to bare specifier
- `src/lib/shader/webgpu-renderer.ts` — changed `.js` import to bare specifier
- `package.json` — `@webgpu/types` added to devDependencies
- `pnpm-lock.yaml` — updated with `@webgpu/types`
