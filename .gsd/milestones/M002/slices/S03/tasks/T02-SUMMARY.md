---
id: T02
parent: S03
milestone: M002
provides:
  - Screenshot gallery rendering in client-side proof view via `renderScreenshotGallery()`
  - CSS blur-to-clear reveal transition scoped to `[data-visual-state]`
  - `data-visual-state` revealing→revealed lifecycle markers on mount
  - Gallery JS re-initialization after dynamic proof mount via `astro:page-load` dispatch
key_files:
  - src/components/domains/domain-proof-view.ts
  - src/components/domains/domain-gate-client.ts
  - src/styles/global.css
key_decisions:
  - none
patterns_established:
  - Dispatch `astro:page-load` custom event after dynamic DOM mount to re-initialize Astro inline scripts (used for gallery carousel/lightbox init)
  - Use `requestAnimationFrame` + `setTimeout(50)` to ensure browser paints the blurred state before transitioning to revealed
observability_surfaces:
  - "`data-visual-state` attribute on `[data-protected-gate]` transitions revealing→revealed; absent on cold-load"
  - "Run `node --test tests/visual-reveal.browser.test.mjs` for focused S03 regression"
  - "Run `node scripts/validate-m002-s03.mjs` for cold-load artifact checks"
duration: 5m
verification_result: passed
completed_at: 2026-03-12
blocker_discovered: false
---

# T02: Add screenshot gallery rendering and blur-to-clear reveal transition

**Implemented screenshot gallery rendering, CSS blur-to-clear reveal transition, and gallery JS initialization in the client-side proof mount flow.**

## What Happened

All three implementation files already contained the required changes from prior work on this branch:

1. **`domain-proof-view.ts`** — `renderScreenshotGallery()` function produces DOM matching `ScreenshotGallery.astro` structure (figure with viewport/track/slides/triggers, nav with prev/next/dots, lightbox dialog). Wired into `renderFlagship()` with `if (f.screenshots.length > 0)` guard.

2. **`src/styles/global.css`** — Reveal transition CSS scoped to `[data-visual-state]`: `revealing` applies `filter: blur(12px); opacity: 0` with 400ms transitions, `revealed` clears to `filter: none; opacity: 1`.

3. **`domain-gate-client.ts`** — `mountProof()` sets `data-visual-state="revealing"` after DOM replacement, then uses `requestAnimationFrame(() => setTimeout(() => ..., 50))` to flip to `"revealed"`. After the reveal is scheduled, dispatches `new Event("astro:page-load")` to trigger gallery JS re-initialization.

## Verification

- `pnpm check` — 0 errors, 0 warnings ✅
- `pnpm build` — 10 pages built successfully ✅
- `node --test tests/visual-reveal.browser.test.mjs` — 4/4 pass ✅
  - Cold-load has no visual-state marker and no proof images
  - After unlock, visual-state reaches revealed and screenshot galleries render
  - Gallery JS is initialized after unlock (nav/dots/lightbox present)
  - Public routes have no visual-state markers
- `node scripts/validate-m002-s03.mjs` — passes (3 protected routes clean) ✅
- `node --test tests/route-unlock.browser.test.mjs` — 4/4 pass (S02 unbroken) ✅
- `node --test tests/route-boundary.static.test.mjs` — 12/12 pass (S01 unbroken) ✅

### Slice-level verification status

- `node --test tests/visual-reveal.browser.test.mjs` — ✅ pass
- `node scripts/validate-m002-s03.mjs` — ✅ pass
- `pnpm validate:site` — not yet wired (T03 scope)

## Diagnostics

- Inspect `data-visual-state` attribute in browser devtools on any protected route after unlock — should read `"revealed"`
- If reveal fails: `data-visual-state` stays at `"revealing"` (never reaches `"revealed"`)
- If gallery init fails: `[data-gallery-nav]` will be missing or nav buttons stay disabled
- Fast artifact check: `node scripts/validate-m002-s03.mjs`

## Deviations

None — implementation was already in place; task verified correctness against all defined contracts.

## Known Issues

None.

## Files Created/Modified

- `src/components/domains/domain-proof-view.ts` — `renderScreenshotGallery()` and integration into `renderFlagship()`
- `src/components/domains/domain-gate-client.ts` — `data-visual-state` lifecycle markers and `astro:page-load` dispatch in `mountProof()`
- `src/styles/global.css` — reveal transition CSS under `[data-visual-state]` selectors
