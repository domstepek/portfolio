# S03: Shader and interactive client components

**Goal:** The WebGPU/WebGL2 shader background renders on all pages, screenshot galleries work on domain proof pages, and Mermaid diagrams render inside flagships — all via `'use client'` components mounted inside the existing server-component tree.
**Demo:** Navigate to the homepage — shader canvas is present with a valid `data-shader-renderer` attribute. Authenticate on `/domains/product/` — see a working screenshot gallery and Mermaid diagram in flagship sections. All 13 existing Playwright tests still pass, plus new shader/gallery tests.

## Must-Haves

- `ShaderBackground` client component wrapping `src/lib/shader/dither-shader.ts` with `useEffect` init/cleanup, mounted in root layout as first child of `<body>`
- `ScreenshotGallery` client component rendering carousel + lightbox markup and calling `initGalleries()` in `useEffect`
- `MermaidDiagram` client component dynamically importing `mermaid` (no SSR) and rendering diagrams with dark retro theme
- `DomainProofPage` upgraded to render flagship visuals (images or mermaid), screenshot galleries, and all missing sections
- Missing CSS migrated from `src/styles/global.css` to `src/app/globals.css`: `.flagship__figure*`, `.mermaid-diagram*`, `.screenshot-gallery*`
- `data-shader-renderer` attribute on shader canvas (values: `webgpu`, `webgl2`, or `none`)
- Playwright tests proving shader presence on multiple pages and gallery markup on authenticated domain page
- `@webgpu/types` installed as devDependency; `mermaid` installed as dependency
- All 13 existing Playwright tests (5 gate + 8 public) continue to pass
- `next build` exits 0

## Proof Level

- This slice proves: integration
- Real runtime required: yes — shader init, gallery JS, and Mermaid rendering all require a real browser
- Human/UAT required: yes — visual spot-check of shader animation, gallery interaction, and Mermaid SVG rendering recommended after completion

## Verification

- `npx playwright test tests/e2e/shader.spec.ts --reporter=list` → all tests pass (shader presence on homepage, about, and authenticated domain page)
- `npx playwright test tests/e2e/gallery.spec.ts --reporter=list` → all tests pass (gallery markup present on authenticated domain page with screenshots)
- `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → 5/5 pass (existing gate tests unbroken)
- `npx playwright test tests/e2e/public.spec.ts --reporter=list` → 8/8 pass (existing public tests unbroken)
- `npm run build` → exits 0
- Diagnostic check: after shader init, `document.querySelector('[data-shader-renderer]').dataset.shaderRenderer` returns `'webgpu'`, `'webgl2'`, or `'none'`

## Observability / Diagnostics

- Runtime signals: `[shader] using <renderer>` console.info on successful init; `[shader] <reason>` console.warn on failure; `data-shader-renderer` attribute set on canvas (values: `webgpu`, `webgl2`, `none`)
- Inspection surfaces: `document.querySelector('[data-shader-renderer]')` in browser console; `data-gallery-init` attribute on initialized galleries; Mermaid replaces `<pre class="mermaid">` with rendered SVG
- Failure visibility: shader falls back to `data-shader-renderer="none"` — plain dark background, no crash; gallery without JS shows static images (no carousel); Mermaid without JS shows raw definition text in `<pre>`
- Redaction constraints: none

## Integration Closure

- Upstream surfaces consumed: `src/app/layout.tsx` (root layout from S01), `src/components/domains/DomainProofPage.tsx` (proof page from S01), `src/lib/shader/dither-shader.ts` (shader engine from M003), `src/components/domains/screenshot-gallery-init.ts` (gallery JS from M002), `src/data/domains/domain-view-model.ts` (view model with visual/screenshots fields from S01), `src/app/globals.css` (CSS from S01/S02)
- New wiring introduced in this slice: `ShaderBackground` mounted in root layout (body-level), `ScreenshotGallery` + `MermaidDiagram` composed into `DomainProofPage`, CSS for visual/gallery/mermaid sections added to globals
- What remains before the milestone is truly usable end-to-end: S04 — Vercel deployment, GitHub Actions CI, Astro cleanup, final integration test against `next start` build

## Tasks

- [x] **T01: Create Playwright test skeletons for shader and gallery** `est:20m`
  - Why: Verification-first — define the objective stopping condition before building components. Tests fail initially; subsequent tasks make them pass.
  - Files: `tests/e2e/shader.spec.ts`, `tests/e2e/gallery.spec.ts`
  - Do: Write shader tests asserting `[data-shader-renderer]` is present and has valid value on homepage, about page, and authenticated domain page. Write gallery test that authenticates on a domain with screenshots and asserts `[data-screenshot-gallery]` and `[data-gallery-init]` are present. Follow existing test patterns from `gate.spec.ts`.
  - Verify: `npx playwright test tests/e2e/shader.spec.ts tests/e2e/gallery.spec.ts --reporter=list` runs (tests fail on missing selectors — that's expected)
  - Done when: Both test files exist, are syntactically valid, and fail for the right reason (missing DOM elements, not config errors)

- [x] **T02: Build ShaderBackground client component and mount in root layout** `est:45m`
  - Why: Retires the "Shader SSR crash" risk from the roadmap. This is the highest-risk S03 deliverable — browser-only shader code must work inside Next.js RSC tree.
  - Files: `src/components/shader/ShaderBackground.tsx`, `src/app/layout.tsx`, `package.json`
  - Do: Install `@webgpu/types` as devDependency. Create `ShaderBackground.tsx` as `'use client'` with `useRef<HTMLCanvasElement>` + `useEffect` calling `initDitherShader()`. Port all behaviors from `ShaderBackground.astro`: pointer tracking (`pointermove`/`pointerdown` on document), reduced-motion handling, visibility-change pause/resume. Cleanup function must call `instance.destroy()`. Mount in `layout.tsx` as first child of `<body>`, before skip-link. Canvas gets `position: fixed; inset: 0; z-index: -1; pointer-events: none; width: 100%; height: 100%` plus `aria-hidden="true"` and `id="shader-bg"`. Verify `next build` exits 0 and shader tests pass.
  - Verify: `npm run build` exits 0; `npx playwright test tests/e2e/shader.spec.ts --reporter=list` passes; existing tests still pass
  - Done when: Shader canvas has `data-shader-renderer` attribute on homepage, about, and authenticated domain pages; `next build` clean; all 13 existing tests pass

- [x] **T03: Build ScreenshotGallery and MermaidDiagram client components, upgrade DomainProofPage, and migrate CSS** `est:60m`
  - Why: Completes the visual layer on domain proof pages. Adds gallery carousel/lightbox and Mermaid diagram rendering to flagships. Migrates the ~190 lines of missing CSS.
  - Files: `src/components/domains/ScreenshotGallery.tsx`, `src/components/diagrams/MermaidDiagram.tsx`, `src/components/domains/DomainProofPage.tsx`, `src/app/globals.css`, `package.json`
  - Do: Install `mermaid` as dependency. Create `ScreenshotGallery.tsx` as `'use client'` — render markup matching `ScreenshotGallery.astro` (data attributes for gallery init), call `initGalleries()` in `useEffect`. Create `MermaidDiagram.tsx` as `'use client'` — dynamically import mermaid inside `useEffect` (not top-level to avoid SSR crash), initialize with dark theme config from Astro reference, use ref-scoped rendering. Upgrade `DomainProofPage.tsx` to render `flagship.visual` (static image or MermaidDiagram), `flagship.screenshots` (ScreenshotGallery), and flagship `problem`/`constraints`/`decisions` sections. Migrate `.flagship__figure*`, `.mermaid-diagram*`, `.screenshot-gallery*` CSS (~190 lines) from `src/styles/global.css` to end of `src/app/globals.css`. Verify all tests pass including gallery test.
  - Verify: `npm run build` exits 0; `npx playwright test tests/e2e/gallery.spec.ts --reporter=list` passes; `npx playwright test --reporter=list` all pass
  - Done when: Authenticated domain page shows screenshot gallery with `[data-gallery-init]`; Mermaid diagrams render as SVG; all Playwright tests pass; `next build` clean

## Files Likely Touched

- `tests/e2e/shader.spec.ts` (new)
- `tests/e2e/gallery.spec.ts` (new)
- `src/components/shader/ShaderBackground.tsx` (new)
- `src/components/domains/ScreenshotGallery.tsx` (new)
- `src/components/diagrams/MermaidDiagram.tsx` (new)
- `src/components/domains/DomainProofPage.tsx` (modify)
- `src/app/layout.tsx` (modify)
- `src/app/globals.css` (modify)
- `package.json` (modify — add `@webgpu/types`, `mermaid`)
