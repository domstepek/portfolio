---
id: T03
parent: S03
milestone: M005
provides:
  - ScreenshotGallery 'use client' component with carousel/lightbox markup and initGalleries() call
  - MermaidDiagram 'use client' component with dynamic import and dark retro theme
  - DomainProofPage upgraded with flagship visuals, screenshots, problem/constraints/decisions sections
  - Gallery/mermaid/flagship CSS (~190 lines) migrated to globals.css
key_files:
  - src/components/domains/ScreenshotGallery.tsx
  - src/components/diagrams/MermaidDiagram.tsx
  - src/components/domains/DomainProofPage.tsx
  - src/app/globals.css
key_decisions:
  - Dynamic import of mermaid inside useEffect (not top-level) to prevent SSR crash — same pattern as ShaderBackground (D050)
  - Module-level guard flag for mermaid.initialize() to prevent duplicate init across multiple MermaidDiagram instances
  - ScreenshotGallery dynamically imports initGalleries via import() in useEffect for consistency with client component pattern
patterns_established:
  - Client island pattern for visual components — 'use client' wrappers imported into RSC DomainProofPage, rendering as client islands
  - Ref-scoped mermaid rendering — mermaid.run() targets containerRef.current.querySelectorAll('.mermaid') not global selector
observability_surfaces:
  - "data-screenshot-gallery on gallery figure — presence selector"
  - "data-gallery-init set by initGalleries() after JS initialization — confirms carousel is interactive"
  - "data-mermaid-definition on mermaid container — presence selector with raw definition value"
  - "SVG inside [data-mermaid-definition] — confirms mermaid rendered successfully"
  - "Failure: no data-gallery-init → arrows/dots non-functional but images visible; no SVG → raw definition text in <pre>"
duration: 15m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T03: Build ScreenshotGallery and MermaidDiagram client components, upgrade DomainProofPage, and migrate CSS

**Created ScreenshotGallery and MermaidDiagram as 'use client' components, upgraded DomainProofPage with full flagship visuals/screenshots/sections, and migrated ~190 lines of gallery/mermaid/flagship CSS to globals.css — all 18 Playwright tests pass, build clean.**

## What Happened

Built three deliverables:

1. **ScreenshotGallery.tsx** — `'use client'` component rendering carousel markup matching the Astro reference exactly (all `data-*` attributes for `initGalleries()` compatibility). Uses dynamic import of `screenshot-gallery-init` in `useEffect`. Renders viewport, track, slides with trigger buttons, nav arrows, dots container, and `<dialog>` lightbox.

2. **MermaidDiagram.tsx** — `'use client'` component that dynamically imports `mermaid` inside `useEffect` (avoids SSR crash). Uses a module-level `mermaidInitialized` guard to call `mermaid.initialize()` only once. Renders scoped to a `useRef` container via `mermaid.run({ nodes: ... })` rather than the global `.mermaid` selector. Dark retro theme variables match the Astro reference exactly.

3. **DomainProofPage.tsx** — Upgraded from text-only to full proof layout. Now renders flagship `visual` (MermaidDiagram if `visual.mermaid` exists, static `<figure>` image otherwise), `flagship.screenshots` via ScreenshotGallery, and flagship `problem`, `constraints`, `decisions` sections. Both client components are imported as client islands into this server component.

CSS migration added `.flagship__figure*`, `.mermaid-diagram*`, and `.screenshot-gallery*` rules (~190 lines) to the end of `src/app/globals.css`, preserving `z-index: 10000` on gallery and lightbox elements.

## Verification

- `npm run build` → exits 0 (clean)
- `npx playwright test tests/e2e/gallery.spec.ts --reporter=list` → 2/2 pass
  - Gallery test: authenticated `/domains/product/` has `[data-screenshot-gallery]` visible with `[data-gallery-init]`
  - Mermaid test: authenticated `/domains/analytics-ai/` has `[data-mermaid-definition]` with rendered `<svg>`
- `npx playwright test --reporter=list` → 18/18 pass (3 shader + 2 gallery + 5 gate + 8 public)

### Slice-level verification (all pass — this is the final task):
- ✅ `npx playwright test tests/e2e/shader.spec.ts` → 3/3 pass
- ✅ `npx playwright test tests/e2e/gallery.spec.ts` → 2/2 pass
- ✅ `npx playwright test tests/e2e/gate.spec.ts` → 5/5 pass
- ✅ `npx playwright test tests/e2e/public.spec.ts` → 8/8 pass
- ✅ `npm run build` → exits 0

## Diagnostics

- **Gallery init check:** `document.querySelectorAll('[data-gallery-init]').length` — returns count of initialized galleries
- **Mermaid render check:** `document.querySelector('[data-mermaid-definition] svg')` — non-null if mermaid rendered
- **Gallery failure state:** no `data-gallery-init` attribute → arrows/dots non-functional, images still visible
- **Mermaid failure state:** raw definition text visible in `<pre>` instead of SVG
- **Playwright locators:** `page.locator('[data-screenshot-gallery]')`, `page.locator('[data-mermaid-definition] svg')`

## Deviations

None — implemented exactly per plan.

## Known Issues

None.

## Files Created/Modified

- `src/components/domains/ScreenshotGallery.tsx` — new 'use client' gallery component with carousel/lightbox markup
- `src/components/diagrams/MermaidDiagram.tsx` — new 'use client' mermaid component with dynamic import
- `src/components/domains/DomainProofPage.tsx` — upgraded with visual, screenshot, and expanded flagship sections
- `src/app/globals.css` — extended with ~190 lines of gallery/mermaid/flagship CSS
- `package.json` — mermaid added as dependency
