---
id: S03
parent: M002
milestone: M002
provides:
  - CSS-driven blur-to-clear reveal transition on protected proof regions
  - Screenshot gallery rendering in client-side proof view (`renderScreenshotGallery()`)
  - `data-visual-state` lifecycle markers (`revealing` → `revealed`) for verification
  - Gallery JS re-initialization after dynamic proof mount via `astro:page-load` dispatch
  - S03 dist validator and browser tests wired into `validate:site` release gate
requires:
  - slice: S02
    provides: Session-scoped unlock flow, `mountProof()` client mount path, `domain-proof-view.ts` renderer
  - slice: S01
    provides: Protected-route boundary, locked-shell rendering, cold-load proof withholding
affects:
  - S04
key_files:
  - src/components/domains/domain-proof-view.ts
  - src/components/domains/domain-gate-client.ts
  - src/styles/global.css
  - tests/visual-reveal.browser.test.mjs
  - tests/helpers/site-boundary-fixtures.mjs
  - scripts/validate-m002-s03.mjs
  - package.json
key_decisions:
  - D020 — CSS-driven blur-to-clear reveal with `data-visual-state` markers
  - D021 — Gallery JS re-initialization via `astro:page-load` dispatch after dynamic proof mount
patterns_established:
  - Use `requestAnimationFrame` + `setTimeout(50)` frame separation to ensure browser paints the blurred state before transitioning to revealed
  - Dispatch `astro:page-load` custom event after dynamic DOM mount to re-initialize Astro inline scripts
  - Visual-state selectors (`visualStateSelectors`) and screenshot gallery selectors (`screenshotGallerySelectors`) in shared fixtures for downstream verification
observability_surfaces:
  - "`data-visual-state` attribute on `[data-protected-gate]` — absent on cold-load, transitions `revealing` → `revealed` after unlock"
  - "`node scripts/validate-m002-s03.mjs` — fast cold-load artifact check for proof image and gallery markup leaks"
  - "`pnpm validate:m002:s03` — focused S03 checks (dist validator + 4 browser tests)"
  - "`pnpm validate:site` — full release gate covering S01 + S02 + S03"
drill_down_paths:
  - .gsd/milestones/M002/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S03/tasks/T02-SUMMARY.md
  - .gsd/milestones/M002/slices/S03/tasks/T03-SUMMARY.md
duration: 18m
verification_result: passed
completed_at: 2026-03-12
---

# S03: Protected Visual Reveal

**Protected domain visuals stay obscured before unlock and render normally after unlock — including screenshot galleries — via a CSS blur-to-clear reveal transition with verifiable DOM markers.**

## What Happened

T01 pinned the visual reveal contract before implementation: 4 browser test cases covering cold-load absence of visual-state markers, post-unlock `data-visual-state="revealed"` transition with screenshot gallery rendering, gallery JS initialization (nav/dots/lightbox), and public route isolation. A dist validator checks cold-load HTML for proof image and gallery markup leaks. Shared fixtures were extended with `visualStateSelectors` and `screenshotGallerySelectors`.

T02 confirmed the core implementation across three files: `domain-proof-view.ts` gained `renderScreenshotGallery()` producing DOM matching `ScreenshotGallery.astro` structure, wired into `renderFlagship()`. `global.css` gained reveal transition CSS scoped to `[data-visual-state]` — `revealing` applies `filter: blur(12px); opacity: 0`, `revealed` clears with 400ms transitions. `domain-gate-client.ts` sets `data-visual-state="revealing"` after proof DOM mount, uses frame separation (`requestAnimationFrame` + `setTimeout(50)`) to flip to `"revealed"`, then dispatches `astro:page-load` to trigger gallery JS re-initialization. All 4 browser tests passed.

T03 wired S03 into the release gate: `test:visual-reveal:browser`, `validate:m002:s03`, and updated `validate:site` to chain S03 after S02. Full `pnpm validate:site` passes end-to-end (17/17 tests, 3/3 dist validators).

## Verification

- `pnpm build` — 10 pages built, 0 errors
- `pnpm check` — 0 errors, 0 warnings
- `node scripts/validate-m002-s03.mjs` — 3 protected routes clean (no proof images or gallery markup in cold-load HTML)
- `node --test tests/visual-reveal.browser.test.mjs` — 4/4 pass
- `node --test tests/route-unlock.browser.test.mjs` — 4/4 pass (S02 unbroken)
- `node --test tests/route-boundary.browser.test.mjs` — 9/9 pass (S01 unbroken)
- `pnpm validate:site` — full S01 + S02 + S03 chain passes (17/17 tests, 3/3 dist validators)

## Requirements Advanced

- R105 — Protected visuals are now obscured (blur + opacity 0) before unlock and clear after unlock via a CSS-driven reveal transition with verifiable `data-visual-state` markers
- R102 — The visual protection layer completes the gate's coverage: proof images and screenshot galleries are withheld from cold-load HTML and only rendered client-side after unlock

## Requirements Validated

- R105 — Proven by: (1) dist validator confirms no `<img>` tags or gallery markup in cold-load protected HTML, (2) browser test confirms `data-visual-state` absent on cold-load and reaches `"revealed"` after unlock, (3) browser test confirms screenshot galleries render with initialized JS after unlock, (4) browser test confirms public routes have no visual-state markers

## New Requirements Surfaced

- None

## Requirements Invalidated or Re-scoped

- None

## Deviations

None.

## Known Limitations

- The reveal transition is mechanical only — visual tone and UX polish are deferred to S04 UAT sign-off
- Gallery carousel/lightbox relies on `astro:page-load` re-dispatch; if Astro changes that event contract, gallery init after unlock would break

## Follow-ups

- S04 must exercise the full assembled locked→unlocked flow in browser verification and provide UAT sign-off on visual tone
- S04 should verify the `data-visual-state` marker contract as part of regression coverage

## Files Created/Modified

- `src/components/domains/domain-proof-view.ts` — `renderScreenshotGallery()` and integration into `renderFlagship()`
- `src/components/domains/domain-gate-client.ts` — `data-visual-state` lifecycle markers and `astro:page-load` dispatch in `mountProof()`
- `src/styles/global.css` — reveal transition CSS under `[data-visual-state]` selectors
- `tests/visual-reveal.browser.test.mjs` — 4 named browser test cases for S03 visual reveal contract
- `tests/helpers/site-boundary-fixtures.mjs` — extended with `visualStateSelectors` and `screenshotGallerySelectors`
- `scripts/validate-m002-s03.mjs` — S03 dist validator for cold-load visual protection
- `package.json` — added `test:visual-reveal:browser`, `validate:m002:s03`; updated `validate:site`

## Forward Intelligence

### What the next slice should know
- The full S01→S02→S03 chain is green and wired into `validate:site`. S04 can build regression coverage on top of the existing 17 browser tests and 3 dist validators without reimplementing any of them.
- `data-visual-state` is the key DOM hook for visual-reveal verification — absent on cold-load, `"revealed"` after unlock. Combined with `data-gate-state` (S01) and `data-protected-proof-state` (S01), these three markers cover the full locked/unlocked/visual lifecycle.

### What's fragile
- Gallery JS re-initialization depends on `astro:page-load` event dispatch after dynamic mount — this couples to Astro's inline script lifecycle convention. If the gallery component's init script changes its event listener, the dynamic init path breaks silently.
- The frame separation trick (`requestAnimationFrame` + `setTimeout(50)`) is empirically reliable but timing-sensitive — very slow browsers might flash unstyled proof briefly before the blur is painted.

### Authoritative diagnostics
- `pnpm validate:site` is the single release gate — if it passes, all three slices are verified
- `data-visual-state` on `[data-protected-gate]` in browser devtools is the fastest manual check for reveal behavior
- `node scripts/validate-m002-s03.mjs` is the fastest artifact check (no browser needed)

### What assumptions changed
- No assumptions changed — the implementation was already in place from prior branch work; S03 tasks verified and wired it into the release gate
