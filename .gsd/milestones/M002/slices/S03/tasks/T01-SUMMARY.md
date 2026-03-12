---
id: T01
parent: S03
milestone: M002
provides:
  - Browser test suite defining the full S03 visual reveal contract (4 named cases)
  - S03 dist validator confirming cold-load HTML has no proof images or gallery markup
  - Shared fixture vocabulary extended with visual-state and screenshot gallery selectors
key_files:
  - tests/visual-reveal.browser.test.mjs
  - tests/helpers/site-boundary-fixtures.mjs
  - scripts/validate-m002-s03.mjs
key_decisions:
  - none
patterns_established:
  - Visual-state selectors (`visualStateSelectors`) and screenshot gallery selectors (`screenshotGallerySelectors`) exported from shared fixtures for downstream use
observability_surfaces:
  - Test names identify exact missing behavior (e.g. "visual-state reaches revealed" vs "Gallery JS initialized")
  - Dist validator prints `[validate:m002:s03]` prefixed pass/fail for cold-load visual protection
duration: 8m
verification_result: passed
completed_at: 2026-03-12
blocker_discovered: false
---

# T01: Pin failing tests for visual reveal and screenshot gallery

**Created browser test suite and dist validator defining the S03 visual reveal contract before implementation.**

## What Happened

Extended the shared fixture vocabulary with `visualStateSelectors` and `screenshotGallerySelectors` exports. Created `tests/visual-reveal.browser.test.mjs` with 4 named browser test cases covering: (1) cold-load absence of visual-state markers and proof images, (2) post-unlock `data-visual-state="revealed"` transition and screenshot gallery rendering, (3) gallery JS initialization (nav/dots/lightbox elements), (4) public route isolation from visual-state markers. Created `scripts/validate-m002-s03.mjs` checking cold-load HTML for proof image patterns, `data-screenshot-gallery`, and `data-visual-state` leaks.

## Verification

- `node --test tests/visual-reveal.browser.test.mjs` — executes without crashes; 2 pass (cold-load clean, public routes clean), 2 fail on missing implementation (expected)
- `node scripts/validate-m002-s03.mjs` — passes for all 3 protected routes (cold-load HTML already lacks proof images due to S01/S02 architecture)
- `node --test tests/route-unlock.browser.test.mjs` — 4/4 pass (existing S02 tests unaffected)
- `node --test tests/route-boundary.static.test.mjs` — 12/12 pass (existing S01 tests unaffected)

### Slice-level verification status (intermediate task — partial passes expected):
- `node --test tests/visual-reveal.browser.test.mjs` — 2/4 pass (2 fail awaiting T02 implementation) ✅ expected
- `node scripts/validate-m002-s03.mjs` — passes ✅
- `pnpm validate:site` — not yet wired (T03 scope)

## Diagnostics

- Run `node --test tests/visual-reveal.browser.test.mjs` for focused S03 regression
- Run `node scripts/validate-m002-s03.mjs` for fast cold-load artifact checks
- Read `tests/helpers/site-boundary-fixtures.mjs` for canonical S03 selector names (`visualStateSelectors`, `screenshotGallerySelectors`)

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `tests/helpers/site-boundary-fixtures.mjs` — extended with `visualStateSelectors` and `screenshotGallerySelectors` exports
- `tests/visual-reveal.browser.test.mjs` — 4 named browser test cases for S03 visual reveal contract
- `scripts/validate-m002-s03.mjs` — S03 dist validator checking cold-load HTML for proof/gallery leaks
