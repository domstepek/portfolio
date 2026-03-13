---
id: S03
parent: M005
milestone: M005
provides:
  - ShaderBackground 'use client' component wrapping dither-shader engine with full lifecycle (pointer, reduced-motion, visibility-change)
  - ScreenshotGallery 'use client' component with carousel/lightbox markup and initGalleries() call
  - MermaidDiagram 'use client' component with dynamic import and dark retro theme
  - DomainProofPage upgraded with flagship visuals, screenshots, problem/constraints/decisions sections
  - Gallery/mermaid/flagship CSS (~190 lines) migrated to globals.css
  - data-shader-renderer and data-shader-motion observability attributes on shader canvas
  - 5 new Playwright tests (3 shader + 2 gallery/mermaid)
requires:
  - slice: S01
    provides: Root layout (src/app/layout.tsx), DomainProofPage component, domain view model with visual/screenshots fields, globals.css
affects:
  - S04
key_files:
  - src/components/shader/ShaderBackground.tsx
  - src/components/domains/ScreenshotGallery.tsx
  - src/components/diagrams/MermaidDiagram.tsx
  - src/components/domains/DomainProofPage.tsx
  - src/app/layout.tsx
  - src/app/globals.css
  - tests/e2e/shader.spec.ts
  - tests/e2e/gallery.spec.ts
  - src/lib/shader/dither-shader.ts
  - src/lib/shader/webgl2-renderer.ts
  - src/lib/shader/webgpu-renderer.ts
key_decisions:
  - "D049: Shader engine imports changed from .js to bare specifiers for Turbopack compatibility"
  - "D050: AbortController for client component event listener cleanup — StrictMode-safe one-shot teardown"
  - "Dynamic import of browser-only modules inside useEffect prevents SSR crashes — pattern used by all three client components"
  - "Module-level guard flag for mermaid.initialize() prevents duplicate init across instances"
  - "Ref-scoped mermaid.run() targets container children, not global .mermaid selector"
patterns_established:
  - "Client island pattern: 'use client' wrappers imported into RSC components render as interactive islands"
  - "Dynamic import pattern: all browser-only code (shader, mermaid, gallery init) imported inside useEffect, not at module scope"
  - "AbortController cleanup: single controller with { signal } on all addEventListener calls; abort() in cleanup"
  - "StrictMode guard: destroyed flag checked after each await in async useEffect to handle double-mount"
observability_surfaces:
  - "data-shader-renderer on canvas: webgpu, webgl2, or none"
  - "data-shader-motion on canvas: animating or frozen"
  - "[shader] using <renderer> console.info on success; [shader] <reason> console.warn on failure"
  - "data-screenshot-gallery on gallery figure; data-gallery-init set after JS init confirms interactivity"
  - "data-mermaid-definition on container with raw definition; SVG child confirms render success"
  - "Failure: shader→data-shader-renderer=none (dark bg, no crash); gallery→no data-gallery-init (static images); mermaid→raw text in <pre>"
drill_down_paths:
  - .gsd/milestones/M005/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M005/slices/S03/tasks/T02-SUMMARY.md
  - .gsd/milestones/M005/slices/S03/tasks/T03-SUMMARY.md
duration: ~40m
verification_result: passed
completed_at: 2026-03-13
---

# S03: Shader and interactive client components

**WebGPU/WebGL2 shader background, screenshot gallery carousel, and Mermaid diagram rendering — all as `'use client'` components mounted inside the Next.js RSC tree — proven by 18/18 Playwright tests and clean build.**

## What Happened

Three tasks executed verification-first:

**T01 — Test skeletons.** Created `shader.spec.ts` (3 tests) and `gallery.spec.ts` (2 tests) defining the objective stopping condition. All 5 failed on missing DOM elements as expected; existing 13 tests unaffected.

**T02 — ShaderBackground component.** Built `ShaderBackground.tsx` as a `'use client'` component wrapping the existing `initDitherShader` engine. Key behaviors ported from Astro: pointer tracking (`pointermove` → `setPointer` + `addRipple`, `pointerdown` → `addRipple` with force), `prefers-reduced-motion` handling (freeze to static frame, `data-shader-motion="frozen"`), `visibilitychange` pause/resume. Used dynamic import inside `useEffect` to keep GPU code out of SSR bundles entirely. AbortController provides one-shot cleanup. Mounted in root layout as first child of `<body>`. Fixed `.js` → bare specifier imports in shader engine files for Turbopack compatibility (D049). Shader tests passed immediately.

**T03 — Gallery, Mermaid, DomainProofPage upgrade.** Built `ScreenshotGallery.tsx` rendering carousel/lightbox markup matching the Astro reference (all `data-*` attributes for `initGalleries()` compatibility). Built `MermaidDiagram.tsx` with dynamic mermaid import, module-level init guard, and ref-scoped rendering with dark retro theme. Upgraded `DomainProofPage.tsx` to render flagship visuals (mermaid or static image), screenshot galleries, and problem/constraints/decisions sections. Migrated ~190 lines of `.flagship__figure*`, `.mermaid-diagram*`, `.screenshot-gallery*` CSS to `globals.css`.

## Verification

- `npm run build` → exits 0, no SSR errors
- `npx playwright test --reporter=list` → 18/18 pass
  - `shader.spec.ts` → 3/3 (homepage, about, authenticated domain)
  - `gallery.spec.ts` → 2/2 (screenshot gallery init, mermaid SVG render)
  - `gate.spec.ts` → 5/5 (existing gate tests unbroken)
  - `public.spec.ts` → 8/8 (existing public tests unbroken)
- Browser console: `document.querySelector('[data-shader-renderer]').dataset.shaderRenderer` → `"webgpu"`
- Visual verification: shader dither pattern visible behind content, gallery carousel functional, mermaid diagrams rendered as SVG

## Requirements Advanced

- None — all relevant requirements were already validated in prior milestones.

## Requirements Validated

- None newly validated — R401–R407 (shader requirements) were already validated in M003; this slice re-proves them through the new Next.js stack with 3 dedicated Playwright tests confirming shader presence across page types.

## New Requirements Surfaced

- None.

## Requirements Invalidated or Re-scoped

- None.

## Deviations

- **Shader engine `.js` → bare specifier imports (D049):** Turbopack with `moduleResolution: "bundler"` cannot resolve `.js` extensions for `.ts` files. All shader engine imports changed to bare specifiers. Necessary compatibility fix, not a behavior change.

## Known Limitations

- Gallery carousel/lightbox interactivity depends on the `initGalleries()` script running — static images are the fallback if JS fails
- Mermaid rendering requires a real browser — SSR shows raw definition text in `<pre>` until client hydration
- `typescript.ignoreBuildErrors: true` remains in `next.config.ts` (revert in S04 after Astro file cleanup)

## Follow-ups

- S04: Remove Astro files, revert `typescript.ignoreBuildErrors`, deploy to Vercel, wire CI

## Files Created/Modified

- `tests/e2e/shader.spec.ts` — 3 Playwright tests for shader canvas presence across page types
- `tests/e2e/gallery.spec.ts` — 2 Playwright tests for gallery init and mermaid rendering
- `src/components/shader/ShaderBackground.tsx` — 'use client' component wrapping shader engine with full lifecycle
- `src/components/domains/ScreenshotGallery.tsx` — 'use client' gallery component with carousel/lightbox markup
- `src/components/diagrams/MermaidDiagram.tsx` — 'use client' mermaid component with dynamic import
- `src/components/domains/DomainProofPage.tsx` — upgraded with flagship visuals, screenshots, and expanded sections
- `src/app/layout.tsx` — ShaderBackground mounted as first child of body
- `src/app/globals.css` — ~190 lines of gallery/mermaid/flagship CSS added
- `src/lib/shader/dither-shader.ts` — .js imports → bare specifiers
- `src/lib/shader/webgl2-renderer.ts` — .js import → bare specifier
- `src/lib/shader/webgpu-renderer.ts` — .js import → bare specifier
- `package.json` — @webgpu/types (devDep), mermaid (dep) added
- `pnpm-lock.yaml` — updated

## Forward Intelligence

### What the next slice should know
- All 18 Playwright tests pass against `next dev`. S04 should run them against `next start` (production build) for final integration proof.
- `typescript.ignoreBuildErrors: true` in `next.config.ts` must be reverted after Astro files are deleted in S04.
- The shader, gallery, and mermaid components all use the same dynamic-import-inside-useEffect pattern — if any SSR issue surfaces, check that imports are inside `useEffect`, not at module scope.

### What's fragile
- Gallery init depends on `initGalleries()` from `src/components/domains/screenshot-gallery-init.ts` — this script was written for the Astro DOM structure. If gallery markup changes, the init script needs updating too.
- Mermaid version is pinned by `pnpm-lock.yaml` — mermaid major version bumps have historically broken theme config shapes.

### Authoritative diagnostics
- `document.querySelector('[data-shader-renderer]').dataset.shaderRenderer` → trustworthy renderer detection (`webgpu`, `webgl2`, `none`)
- `document.querySelectorAll('[data-gallery-init]').length` → count of initialized galleries
- `document.querySelector('[data-mermaid-definition] svg')` → non-null confirms mermaid rendered
- Console `[shader]` prefix messages are the authoritative shader lifecycle log

### What assumptions changed
- Assumed shader engine `.js` imports would work in Next.js — they don't under Turbopack's `moduleResolution: "bundler"`. Bare specifiers required (D049).
- No other assumptions changed — the client component patterns worked as planned.
