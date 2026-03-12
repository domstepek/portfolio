---
estimated_steps: 5
estimated_files: 3
---

# T01: Pin failing tests for visual reveal and screenshot gallery

**Slice:** S03 — Protected Visual Reveal
**Milestone:** M002

## Description

Establish the objective stopping condition for S03 before writing any implementation. Create a browser test suite that exercises the full visual reveal contract — cold-load proof image absence, `data-visual-state` marker transitions after unlock, screenshot gallery DOM presence and JS initialization, and public route isolation. Create the S03 dist validator that checks cold-load HTML is free of rendered proof images. Extend the shared fixture vocabulary with S03 visual-state selectors.

All tests should fail at this point since the implementation doesn't exist yet — that's correct.

## Steps

1. Add S03 visual-state selectors and screenshot gallery selectors to `tests/helpers/site-boundary-fixtures.mjs`:
   - `visualStateAttr: "[data-visual-state]"` and its expected values (`revealing`, `revealed`)
   - `screenshotGallery: "[data-screenshot-gallery]"` and gallery sub-selectors (`[data-gallery-nav]`, `[data-gallery-viewport]`)
   - Keep all existing S01/S02 fixture exports unchanged

2. Create `tests/visual-reveal.browser.test.mjs` with 4 named test cases:
   - **Cold-load has no visual-state marker and no proof images**: Load a protected route, assert `data-visual-state` is absent, assert no `<img>` tags exist inside `[data-proof-mount]` or proof regions
   - **After unlock, visual-state reaches `revealed` and screenshot galleries render**: Enter valid passcode, wait for `data-visual-state="revealed"`, assert screenshot gallery DOM (`[data-screenshot-gallery]`) is present for flagships that have screenshots, assert proof images exist
   - **Gallery JS is initialized after unlock**: After unlock, assert gallery navigation elements exist (`[data-gallery-nav]`, `[data-gallery-dots]`), lightbox elements exist (`[data-gallery-lightbox]`)
   - **Public routes have no visual-state markers**: Load a public route, assert no `data-visual-state` attribute anywhere in the DOM
   - Use the same Puppeteer + built-site-server pattern as `route-unlock.browser.test.mjs`

3. Create `scripts/validate-m002-s03.mjs` following the S02 validator pattern:
   - For each protected route, read built HTML
   - Assert no `<img>` tags appear inside proof mount regions (no `screenshot-gallery__image` class, no `flagship__image` class in cold-load — but note flagship images are already absent due to S01/S02 architecture; this confirms it)
   - Assert no `data-screenshot-gallery` marker in cold-load HTML
   - Print pass/fail with `[validate:m002:s03]` prefix

4. Run both test files to confirm they execute without crashes but fail on missing implementation

5. Run existing S01/S02 tests to confirm nothing regressed from fixture changes

## Must-Haves

- [ ] Shared fixtures extended with visual-state and screenshot gallery selectors
- [ ] Browser test file with 4 named cases covering the full S03 contract
- [ ] Dist validator checking cold-load HTML is free of proof images and gallery markup
- [ ] Existing S01/S02 tests unaffected

## Verification

- `node --test tests/visual-reveal.browser.test.mjs` — executes without crashes; tests fail on missing `data-visual-state` and screenshot gallery behavior (expected)
- `node scripts/validate-m002-s03.mjs` — runs and passes (cold-load HTML already lacks proof images due to S01/S02 architecture)
- `node --test tests/route-unlock.browser.test.mjs` — still passes (existing S02 tests unaffected)
- `node --test tests/route-boundary.static.test.mjs` — still passes

## Observability Impact

- Signals added/changed: S03 visual-state selectors added to shared fixture vocabulary for downstream use
- How a future agent inspects this: read `tests/helpers/site-boundary-fixtures.mjs` for the canonical selector names; run `node --test tests/visual-reveal.browser.test.mjs` for focused S03 regression
- Failure state exposed: test names identify the exact missing behavior (e.g. "visual-state reaches revealed" vs "gallery JS initialized")

## Inputs

- `tests/helpers/site-boundary-fixtures.mjs` — existing shared fixture vocabulary to extend
- `tests/route-unlock.browser.test.mjs` — reference pattern for browser test structure
- `scripts/validate-m002-s02.mjs` — reference pattern for dist validator structure
- S02 Summary Forward Intelligence — proof mount path is `[data-proof-mount]`, images only exist after client unlock

## Expected Output

- `tests/visual-reveal.browser.test.mjs` — 4 named browser test cases covering S03 visual reveal contract
- `tests/helpers/site-boundary-fixtures.mjs` — extended with S03 visual-state and screenshot gallery selectors
- `scripts/validate-m002-s03.mjs` — fast dist validator for S03 cold-load visual protection
