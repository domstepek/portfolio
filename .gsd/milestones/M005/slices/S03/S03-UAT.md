# S03: Shader and interactive client components — UAT

**Milestone:** M005
**Written:** 2026-03-13

## UAT Type

- UAT mode: mixed (artifact-driven + live-runtime)
- Why this mode is sufficient: Shader rendering, gallery interactivity, and Mermaid SVG output are all browser-runtime behaviors that cannot be verified from build artifacts alone. Playwright tests prove DOM contracts; visual spot-check confirms aesthetic quality.

## Preconditions

- `pnpm install` completed
- `GATE_HASH` environment variable set (required for authenticated domain pages)
- Dev server running via `npm run dev` or production build via `npm run build && npm start`

## Smoke Test

Open `http://localhost:3000` — animated dither shader pattern is visible behind page content. Inspect the canvas: `document.querySelector('[data-shader-renderer]').dataset.shaderRenderer` returns `"webgpu"` or `"webgl2"`.

## Test Cases

### 1. Shader renders on homepage

1. Navigate to `http://localhost:3000`
2. Look for animated dither pattern behind content
3. **Expected:** Shader canvas visible with `data-shader-renderer` attribute set to `webgpu` or `webgl2`

### 2. Shader renders on about page

1. Navigate to `http://localhost:3000/about/`
2. Look for animated dither pattern behind content
3. **Expected:** Same shader canvas with valid `data-shader-renderer` value

### 3. Shader renders on authenticated domain page

1. Navigate to `http://localhost:3000/domains/product/`
2. Enter the correct passcode and submit
3. Look for animated dither pattern behind proof content
4. **Expected:** Shader canvas present with valid `data-shader-renderer` value on the proof page

### 4. Shader responds to cursor movement

1. On any page with the shader visible, move the mouse slowly across the page
2. **Expected:** Dither pattern subtly reacts to cursor position — blobs shift near the pointer

### 5. Screenshot gallery on domain proof page

1. Navigate to `http://localhost:3000/domains/product/`
2. Authenticate with the correct passcode
3. Scroll to a flagship section with screenshots
4. **Expected:** Screenshot gallery carousel is visible with navigation arrows and dot indicators. Clicking arrows cycles through screenshots. Clicking a screenshot opens a lightbox overlay.

### 6. Mermaid diagram on domain proof page

1. Navigate to `http://localhost:3000/domains/analytics-ai/`
2. Authenticate with the correct passcode
3. Scroll to a flagship section with a Mermaid diagram
4. **Expected:** Mermaid definition is rendered as an SVG diagram (not raw text). Diagram uses dark retro theme colors.

### 7. Shader respects reduced motion

1. Enable `prefers-reduced-motion: reduce` in browser dev tools (or OS settings)
2. Navigate to any page
3. **Expected:** Shader freezes to a static frame. `data-shader-motion` attribute on canvas reads `"frozen"`.

## Edge Cases

### Shader fallback when GPU unavailable

1. In browser dev tools, disable WebGPU and WebGL2 (or use a browser that supports neither)
2. Navigate to any page
3. **Expected:** `data-shader-renderer="none"` on canvas. Plain dark background visible. No errors in console. Page fully functional.

### Gallery without JS

1. Disable JavaScript in browser
2. Navigate to an authenticated domain page with screenshots
3. **Expected:** Static screenshot images are visible (no carousel functionality, but content is not lost)

## Failure Signals

- No `[data-shader-renderer]` attribute on any page → shader component not mounting
- `data-shader-renderer="none"` on a capable browser → shader init failing (check console for `[shader]` messages)
- No `[data-gallery-init]` on gallery elements → `initGalleries()` not running (carousel non-functional but images visible)
- No `<svg>` inside `[data-mermaid-definition]` → mermaid dynamic import or rendering failed (raw text visible instead)
- Console errors containing `window is not defined` or `document is not defined` → SSR crash from browser-only code at module scope

## Requirements Proved By This UAT

- R401 (shader renders as ambient background) — re-proven through Next.js stack with shader canvas on all pages
- R402 (shader uses site accent palette) — visual spot-check confirms cohesive colors from CSS vars
- R403 (shader reacts to cursor) — cursor interaction test case confirms pointer tracking
- R404 (shader on all pages with opt-out) — shader present on homepage, about, and domain pages; opt-out mechanism preserved via `disableShader` prop
- R405 (WebGPU primary with WebGL2 fallback) — `data-shader-renderer` attribute proves renderer selection; fallback edge case tests degradation
- R406 (shader perf/accessibility) — reduced motion test case confirms `prefers-reduced-motion` handling; `aria-hidden` and `pointer-events: none` on canvas
- R407 (existing test suite passes) — 18/18 Playwright tests pass (13 existing + 5 new)
- R105 (protected visuals obscured until unlock) — gallery and visual content only render after authentication on domain proof pages

## Not Proven By This UAT

- Vercel deployment behavior — S04 scope (S03 tests run against local dev/build only)
- GitHub Actions CI pipeline — S04 scope
- Cross-browser shader rendering — tests run in Chromium only; Safari/Firefox WebGPU support varies
- Performance profiling under load — not measured; shader uses requestAnimationFrame and visibility-change pause but no formal perf benchmarking

## Notes for Tester

- The shader renderer (`webgpu` vs `webgl2`) depends on your browser and GPU. Both are correct outcomes. `none` is only expected when neither API is available.
- Gallery lightbox uses `z-index: 10000` — it should overlay everything including the CRT filter.
- Mermaid diagrams may take a moment to render after page load due to dynamic import — a brief flash of raw text is acceptable.
- The shader animation is intentionally subtle — look for slowly shifting dither patterns, not dramatic visual effects.
