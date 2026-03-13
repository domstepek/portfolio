# S03: Shader and interactive client components — Research

**Date:** 2026-03-13

## Summary

S03 ports three `'use client'` components into the Next.js app: the `ShaderBackground` (wrapping the existing `src/lib/shader/` engine), `ScreenshotGallery` (carousel + lightbox for domain proof pages), and `MermaidDiagram` (client-rendered Mermaid charts in flagship visuals). It also upgrades `DomainProofPage.tsx` to render the visual/screenshot/mermaid sections that were stubbed out in S01.

The shader engine (`src/lib/shader/`) is 975 lines of framework-agnostic TypeScript — fully browser-only, no SSR-sensitive module-scope references. The existing Astro `ShaderBackground.astro` is a thin mount-point that calls `initDitherShader()` inside a `<script>` block. Porting to React means wrapping that same call in a `useEffect` inside a `'use client'` component with a `<canvas>` ref. The gallery is similar: `screenshot-gallery-init.ts` is pure DOM manipulation already exported as `initGalleries()` — wrap in `useEffect`. Mermaid requires installing the `mermaid` npm package (not currently in dependencies) and calling `mermaid.run()` after the component mounts.

The main risk is CSS completeness: the screenshot gallery (~140 lines), mermaid diagram (~23 lines), and flagship visual (~30 lines) styles from `src/styles/global.css` have NOT been ported to `src/app/globals.css`. These must be migrated alongside the components. A secondary risk is the shader import chain using `.js` extensions (`./types.js`, `./webgpu-renderer.js`) which works under `moduleResolution: "bundler"` but should be verified at build time.

**Primary recommendation:** Build all three client components, mount `ShaderBackground` in the root layout, integrate visuals/screenshots/mermaid into `DomainProofPage`, migrate the missing CSS, and prove with Playwright tests for shader presence + gallery interaction.

## Recommendation

Four-task breakdown:

1. **ShaderBackground client component + layout mount** — Create `src/components/shader/ShaderBackground.tsx` as `'use client'` with `useRef<HTMLCanvasElement>` + `useEffect` calling `initDitherShader()`. Mount in `src/app/layout.tsx` as the first child of `<body>`, before the skip-link. The canvas needs `position: fixed; inset: 0; z-index: -1; pointer-events: none` (inline styles or CSS class). Include pointer tracking, reduced-motion, and visibility-change handlers from the Astro version. Add `@webgpu/types` as devDependency for the triple-slash reference in `webgpu-renderer.ts`.

2. **ScreenshotGallery + MermaidDiagram client components** — Create `src/components/domains/ScreenshotGallery.tsx` as `'use client'` rendering the gallery markup (matching `ScreenshotGallery.astro`) with `useEffect(() => initGalleries())`. Create `src/components/diagrams/MermaidDiagram.tsx` as `'use client'` rendering a `<pre className="mermaid">` and calling `mermaid.initialize()` + `mermaid.run()` in `useEffect`. Install `mermaid` as a dependency.

3. **DomainProofPage upgrade** — Add visual (image or mermaid), screenshots, and gallery rendering to `DomainProofPage.tsx`. The mermaid and gallery portions must be rendered via their `'use client'` wrappers. The static image visual can remain server-rendered. Migrate the ~190 lines of CSS for `.screenshot-gallery*`, `.mermaid-diagram*`, `.flagship__figure*`, and `.flagship__caption*` from `src/styles/global.css` to `src/app/globals.css`.

4. **Playwright tests** — Write `tests/e2e/shader.spec.ts` testing: (a) shader canvas present on homepage with valid `data-shader-renderer`, (b) shader canvas present on about page, (c) shader canvas present on authenticated domain page. Write gallery interaction test in `tests/e2e/gallery.spec.ts` (or extend gate tests): authenticate, navigate to a domain with screenshots, verify gallery markup is present.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Shader engine | `src/lib/shader/dither-shader.ts` + renderers | Already built and proven in M003; wrap in React, don't rewrite |
| Gallery carousel/lightbox | `src/components/domains/screenshot-gallery-init.ts` | Pure DOM JS, framework-agnostic; call `initGalleries()` in useEffect |
| Mermaid rendering | `mermaid` npm package | Client-side SVG rendering; same approach as the Astro component |
| WebGPU type definitions | `@webgpu/types` | Dev dependency for `/// <reference types>` in webgpu-renderer.ts |

## Existing Code and Patterns

- `src/lib/shader/dither-shader.ts` — Public API: `initDitherShader(canvas, options?) → Promise<ShaderInstance | null>`. Returns handle with `setPointer()`, `addRipple()`, `pause()`, `resume()`, `destroy()`. Sets `canvas.dataset.shaderRenderer` to `'webgpu'`, `'webgl2'`, or `'none'`. Uses browser APIs only inside function bodies (not module scope) — safe for `'use client'` import.
- `src/lib/shader/webgpu-renderer.ts` — Has `/// <reference types="@webgpu/types" />` at top; needs `@webgpu/types` as devDependency. Uses `.js` extension imports (`./types.js`).
- `src/lib/shader/webgl2-renderer.ts` — WebGL2 fallback; same `.js` import pattern.
- `src/components/shader/ShaderBackground.astro` — Reference implementation: canvas with `id="shader-bg"`, `aria-hidden="true"`, fixed positioning, z-index -1. Includes pointermove/pointerdown listeners, `prefers-reduced-motion` handler, `visibilitychange` pause/resume. **Port this exact behavior.**
- `src/components/domains/screenshot-gallery-init.ts` — `initGalleries()` function that queries `[data-screenshot-gallery]` elements and wires up carousel nav, dots, scroll snap, and `<dialog>` lightbox. Idempotent (skips already-initialized galleries via `data-gallery-init` attribute).
- `src/components/domains/ScreenshotGallery.astro` — Markup reference: `<figure>` with viewport, track, slides, nav arrows, dots container, and `<dialog>` lightbox. Data attributes: `data-screenshot-gallery`, `data-gallery-viewport`, `data-gallery-track`, `data-gallery-prev`, `data-gallery-next`, `data-gallery-dots`, `data-gallery-lightbox`, `data-gallery-lightbox-img`, `data-gallery-lightbox-caption`, `data-gallery-lightbox-close`, `data-gallery-trigger`.
- `src/components/diagrams/MermaidDiagram.astro` — Reference: `<figure>` with `data-flagship-visual`, inner `<div class="mermaid-diagram">` with `data-mermaid-definition`, `<pre class="mermaid">` containing the definition. Mermaid initialized with `startOnLoad: false`, dark theme, custom themeVariables matching retro palette.
- `src/data/domains/domain-view-model.ts` — `buildDomainProofViewModel()` already resolves `visual` (with optional `mermaid` string), `screenshots` array, and proof links. The view model is ready to use.
- `src/components/domains/DomainProofPage.tsx` — Currently renders text content only (title, summary, role, outcomes, stack, proofLinks). Missing: `flagship.visual` (image or mermaid) and `flagship.screenshots` (gallery). These gaps are the S03 upgrade.
- `src/app/layout.tsx` — Root server component. ShaderBackground mounts here, before skip-link, as first child of `<body>`. Per D029, canvas must be a direct child of body (or equivalent) at z-index -1.
- `src/app/globals.css` — 1120 lines. Has all site shell, page component CSS. Does NOT have: `.screenshot-gallery*` (~140 lines), `.mermaid-diagram*` (~23 lines), `.flagship__figure*` (~30 lines), `.flagship__caption`, `.flagship__image` styles. These must be migrated from `src/styles/global.css`.

## Constraints

- **`'use client'` boundary must be at the component level** — `ShaderBackground`, `ScreenshotGallery`, and `MermaidDiagram` each get their own `'use client'` directive. Parent components (layout, `DomainProofPage`) remain server components.
- **No browser API at module scope** — The shader engine uses `document`, `navigator`, `window`, `HTMLCanvasElement`, `ResizeObserver` only inside function bodies. This is safe. But the `'use client'` component itself must not call `initDitherShader()` at module scope — only inside `useEffect`.
- **`.js` extension imports in shader files** — `dither-shader.ts` imports from `./types.js`, `./webgpu-renderer.js`, `./webgl2-renderer.js`. With `moduleResolution: "bundler"` in tsconfig, these resolve to the `.ts` files. Next.js/Turbopack handles this. Verify at build time.
- **`@webgpu/types` devDependency** — `webgpu-renderer.ts` has `/// <reference types="@webgpu/types" />`. This must be installed or the triple-slash reference will fail at type-check time. Since `typescript.ignoreBuildErrors: true` is set, it won't block builds — but it should be installed for correctness.
- **`src/components` is excluded from tsconfig `include`** — New `.tsx` files in `src/components/` won't be type-checked by `tsc --noEmit`. They're still compiled by Turbopack at build time. This is the existing S01 migration accommodation (D045); fine for S03.
- **CSS migration must match exactly** — The `.screenshot-gallery*`, `.mermaid-diagram*`, `.flagship__figure*` styles in `src/styles/global.css` must be ported to `src/app/globals.css` verbatim (or with equivalent Tailwind). Any missing rule will be a visual regression only visible in a browser.
- **Mermaid is a large dependency** — The `mermaid` package is ~2MB bundled. Since it's only used on authenticated domain pages with mermaid visuals, it should be dynamically imported (`next/dynamic` with `ssr: false` or a dynamic `import()` inside `useEffect`) to avoid bloating the initial bundle for all pages.
- **Gallery `z-index: 10000`** — The screenshot gallery has `z-index: 10000` in its CSS, above the CRT overlay's `z-index: 9999`. This is intentional so lightbox works above the CRT. Preserve this.
- **`disableShader` opt-out** — Per D038, the `/shader-demo/` page is dropped. The only opt-out mechanism needed is for future pages. Implement as a prop on `ShaderBackground` or a conditional render in `layout.tsx`. Since no pages currently opt out, this can be a simple boolean prop defaulting to enabled.
- **Shader canvas `id="shader-bg"`** — The old Puppeteer tests used `#shader-bg` selector. New Playwright tests should use `[data-shader-renderer]` as the canonical selector (more semantic), but the `id` can be preserved for backward compatibility.

## Common Pitfalls

- **Forgetting `useEffect` cleanup for shader** — `initDitherShader()` returns a `ShaderInstance` with a `destroy()` method. The `useEffect` cleanup function MUST call `instance.destroy()` or the GPU context, ResizeObserver, and animation frame will leak on hot-module-reload or route change. Pattern: `useEffect(() => { let instance; initDitherShader(canvas).then(i => instance = i); return () => instance?.destroy(); }, [])`.
- **Async `initDitherShader` in useEffect** — `useEffect` callbacks cannot be async. Use an inner async IIFE or `.then()` chain. The cleanup function must handle the case where init hasn't completed yet (race between cleanup and async init).
- **Gallery `initGalleries()` running before DOM renders** — In the Astro version, the script runs after the HTML is in the DOM. In React, `useEffect` fires after paint, so the gallery DOM should be present. But if the gallery is inside a conditionally rendered section (authenticated only), ensure the `useEffect` fires after the gallery markup mounts. Use a `useEffect` with the screenshots array as a dependency, or call `initGalleries()` inside the gallery component's own `useEffect`.
- **Mermaid `mermaid.run()` targeting wrong selector** — The Astro version uses `querySelector: ".mermaid"` which targets all `.mermaid` elements on the page. In a React SPA context, this is fine on initial render. But if multiple MermaidDiagram components mount, `mermaid.run()` re-processes all of them. Use a ref-scoped selector or guard with the `data-mermaid-definition` attribute to avoid re-rendering.
- **Mermaid `initialize()` called multiple times** — `mermaid.initialize()` should be called once, not per-component-mount. Extract initialization to a module-level singleton or a `useRef` guard.
- **Missing `astro:page-load` event replacement** — The Astro gallery init listened for `astro:page-load` to re-initialize after client-side navigation. In Next.js, React handles component lifecycle via `useEffect`. The `astro:page-load` dispatch is no longer needed — but `initGalleries()` must be called in the gallery component's `useEffect`, not globally.
- **ShaderBackground double-mount in React 18+ StrictMode** — React 18+ StrictMode double-invokes effects in development. The shader's `useEffect` must be idempotent: clean up on the first unmount, re-init on remount. The `destroy()` cleanup pattern handles this.
- **Shader pointer events on mobile** — The Astro version uses `pointermove` and `pointerdown` on `document`. In the React component, these listeners should be added/removed in the `useEffect` to avoid leaks. Use `{ passive: true }` for pointermove.

## Open Risks

- **Mermaid SSR crash** — Mermaid accesses DOM APIs at import time in some versions. It MUST be dynamically imported inside `useEffect` (not a top-level `import`), or loaded via `next/dynamic` with `ssr: false`. Test with `next build` to confirm no SSR breakage.
- **Shader `.js` extension imports under Turbopack** — The shader files use `.js` extensions in their import paths (e.g., `from './types.js'`). This is standard under `moduleResolution: "bundler"` but needs verification with the Next.js 16 Turbopack bundler specifically. If it fails, change imports to extensionless (`'./types'`).
- **`@webgpu/types` compatibility** — The `/// <reference types="@webgpu/types" />` directive may conflict with types already in newer TypeScript lib versions. TypeScript 5.x includes partial WebGPU types in `lib.dom.d.ts`. If there's a conflict, the triple-slash reference can be removed if the built-in types are sufficient.
- **Gallery CSS `z-index: 10000` stacking** — The gallery lightbox uses `z-index: 10000` (above CRT overlay at 9999). The shader canvas uses `z-index: -1`. These stacking contexts should compose correctly, but verify visually that the lightbox overlay renders above the CRT scanlines.
- **Visual regression in screenshot gallery** — The gallery CSS is being migrated as-is from `src/styles/global.css`. If any rules depend on parent selectors or cascade ordering that differs in the new CSS file structure, galleries may visually break. Visual spot-check required.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| WebGPU/WGSL shaders | `webgpu-design` | installed (in available_skills) — covers WebGPU pipeline setup and WGSL |
| Mermaid diagrams | `softaworks/agent-toolkit@mermaid-diagrams` | available (3.5K installs) — covers Mermaid config and rendering |
| Next.js App Router | `wshobson/agents@nextjs-app-router-patterns` | available (8.1K installs) — covers client/server component patterns |
| Playwright testing | `currents-dev/playwright-best-practices-skill@playwright-best-practices` | available (9K installs) |
| Frontend design | `frontend-design` | installed — for visual quality verification if needed |

## Sources

- `src/components/shader/ShaderBackground.astro` — reference implementation for shader mount, pointer tracking, reduced-motion, visibility-change handlers
- `src/components/domains/ScreenshotGallery.astro` + `screenshot-gallery-init.ts` — reference implementation for gallery markup and JS initialization
- `src/components/diagrams/MermaidDiagram.astro` — reference implementation for Mermaid rendering with dark theme config
- `src/data/domains/domain-view-model.ts` — `ResolvedFlagship` type has `visual?: ResolvedVisual` (with optional `mermaid` string) and `screenshots: ResolvedScreenshot[]`
- `src/styles/global.css` lines 773–1000 — CSS rules for `.flagship__figure*`, `.mermaid-diagram*`, `.screenshot-gallery*` that need migration
- `src/app/globals.css` — current Next.js CSS (1120 lines) — missing the above styles
- S01 forward intelligence — root layout mounts shader; `src/app/` under `src/`; `typescript.ignoreBuildErrors: true` active
- S02 forward intelligence — CRT overlay already in layout; page components are server components; client interactivity isolated to smallest `'use client'` wrappers
- D029 — shader canvas is direct child of body, z-index -1, pointer-events none
- D038 — `/shader-demo/` page dropped; no per-page opt-out needed currently
- Old Puppeteer tests (`tests/shader-presence.browser.test.mjs`) — reference for shader test assertions: `data-shader-renderer` attribute values `webgpu`, `webgl2`, or `none`
