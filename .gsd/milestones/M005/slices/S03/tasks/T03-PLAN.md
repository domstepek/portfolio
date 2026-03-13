---
estimated_steps: 6
estimated_files: 6
---

# T03: Build ScreenshotGallery and MermaidDiagram client components, upgrade DomainProofPage, and migrate CSS

**Slice:** S03 — Shader and interactive client components
**Milestone:** M005

## Description

Create the two remaining `'use client'` components (ScreenshotGallery, MermaidDiagram), upgrade DomainProofPage to render the visual/screenshot sections that were stubbed out in S01, and migrate the ~190 lines of missing CSS. This task completes S03 — after it, authenticated domain pages show full flagship visuals, working screenshot galleries, and rendered Mermaid diagrams.

## Steps

1. Install `mermaid` as a dependency (`npm install mermaid`)
2. Create `src/components/domains/ScreenshotGallery.tsx`:
   - `'use client'` directive
   - Accept `screenshots: ResolvedScreenshot[]` prop
   - Render markup matching `ScreenshotGallery.astro`: `<figure data-screenshot-gallery>` with viewport, track, slides (each with `<button data-gallery-trigger>` + `<img>`), nav arrows, dots container, and `<dialog>` lightbox — all with correct `data-*` attributes
   - `useEffect(() => { initGalleries(); }, [])` — import `initGalleries` from `screenshot-gallery-init.ts`
   - Gallery JS is idempotent (checks `data-gallery-init`) so safe on re-renders
3. Create `src/components/diagrams/MermaidDiagram.tsx`:
   - `'use client'` directive
   - Accept `definition: string`, `alt: string`, `caption?: string` props
   - `useRef<HTMLDivElement>(null)` for the container
   - `useEffect` with dynamic `import('mermaid')` inside (not top-level import — avoids SSR crash)
   - Initialize mermaid with `startOnLoad: false`, dark theme, and retro theme variables from `MermaidDiagram.astro`
   - Call `mermaid.run()` scoped to the ref container (not global `.mermaid` selector)
   - Use a `useRef` guard to prevent calling `mermaid.initialize()` multiple times
   - Render: `<figure data-flagship-visual>` → `<div class="mermaid-diagram" data-mermaid-definition={definition} ref={containerRef}>` → `<pre class="mermaid">{definition}</pre>` + optional `<figcaption>`
4. Upgrade `src/components/domains/DomainProofPage.tsx`:
   - Import `ScreenshotGallery` and `MermaidDiagram` (these are `'use client'` — can be imported into RSC and rendered as client islands)
   - For each flagship: render `flagship.visual` — if `visual.mermaid` exists, render `<MermaidDiagram>`; else if `visual.src` exists, render static `<figure><img></figure>` with `flagship__figure`/`flagship__image` classes
   - For each flagship: if `flagship.screenshots.length > 0`, render `<ScreenshotGallery screenshots={flagship.screenshots} />`
   - Add flagship `problem`, `constraints`, `decisions` sections to match the full proof layout
5. Migrate CSS from `src/styles/global.css` to end of `src/app/globals.css`:
   - `.flagship__figure`, `.flagship__image`, `.flagship__caption` (~30 lines)
   - `.mermaid-diagram`, `.mermaid-diagram svg`, `.mermaid-diagram .mermaid` (~23 lines)
   - `.screenshot-gallery*` — all gallery classes including viewport, track, slides, nav, dots, lightbox (~140 lines)
   - `@media (max-width: 40rem)` gallery responsive rule
   - Preserve `z-index: 10000` on gallery and lightbox (above CRT overlay at 9999)
6. Run full Playwright test suite to verify all tests pass: shader tests, gallery tests, gate tests, public tests. Run `npm run build` to confirm clean build.

## Must-Haves

- [ ] `ScreenshotGallery.tsx` renders gallery markup matching Astro reference with all `data-*` attributes and calls `initGalleries()` in `useEffect`
- [ ] `MermaidDiagram.tsx` dynamically imports `mermaid` inside `useEffect` (no top-level import), initializes with dark retro theme, renders scoped to ref
- [ ] `DomainProofPage.tsx` renders flagship visuals (image or mermaid) and screenshot galleries from view model data
- [ ] All gallery CSS (~140 lines), mermaid CSS (~23 lines), and flagship figure CSS (~30 lines) migrated to `globals.css`
- [ ] `z-index: 10000` preserved on gallery and lightbox elements
- [ ] `mermaid` npm package installed as dependency
- [ ] Gallery test passes: `[data-screenshot-gallery]` and `[data-gallery-init]` present on authenticated domain page
- [ ] Mermaid test passes: rendered SVG present inside `[data-mermaid-definition]` on authenticated domain page
- [ ] All 13 existing tests still pass
- [ ] `next build` exits 0

## Verification

- `npm run build` → exits 0
- `npx playwright test tests/e2e/gallery.spec.ts --reporter=list` → 2/2 pass
- `npx playwright test --reporter=list` → all tests pass (shader + gallery + gate + public)
- Manual check: authenticate on `/domains/product/`, see screenshot gallery carousel with working arrow navigation; authenticate on `/domains/analytics-ai/`, see rendered Mermaid SVG diagram

## Observability Impact

- Signals added/changed: `data-gallery-init` attribute set on initialized galleries by `initGalleries()`; `data-mermaid-definition` attribute on mermaid containers; Mermaid replaces `<pre>` content with rendered `<svg>`
- How a future agent inspects this: `document.querySelectorAll('[data-gallery-init]').length` to check gallery count; `document.querySelector('[data-mermaid-definition] svg')` to check Mermaid rendering; gallery lightbox state via `<dialog>` open/closed
- Failure state exposed: Missing gallery JS → no `data-gallery-init` attribute, arrows/dots non-functional but images still visible; Mermaid import failure → raw definition text visible in `<pre>` instead of SVG

## Inputs

- `src/components/domains/ScreenshotGallery.astro` — markup reference (all data attributes and class names)
- `src/components/domains/screenshot-gallery-init.ts` — `initGalleries()` function to call
- `src/components/diagrams/MermaidDiagram.astro` — markup + mermaid config reference
- `src/components/domains/DomainProofPage.tsx` — current state (text content only, no visuals)
- `src/data/domains/domain-view-model.ts` — `ResolvedFlagship` has `visual?: ResolvedVisual` and `screenshots: ResolvedScreenshot[]`
- `src/styles/global.css` lines 773–1020 — CSS to migrate
- `src/app/globals.css` — target CSS file (append to end)
- T01 test files — `gallery.spec.ts` defines the assertions to satisfy

## Expected Output

- `src/components/domains/ScreenshotGallery.tsx` — `'use client'` gallery component
- `src/components/diagrams/MermaidDiagram.tsx` — `'use client'` mermaid component with dynamic import
- `src/components/domains/DomainProofPage.tsx` — upgraded with visual, screenshot, and expanded flagship sections
- `src/app/globals.css` — extended with ~190 lines of gallery/mermaid/flagship CSS
- `package.json` — `mermaid` added to dependencies
