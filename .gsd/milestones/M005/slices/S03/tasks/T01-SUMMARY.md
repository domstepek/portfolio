---
id: T01
parent: S03
milestone: M005
provides:
  - Playwright test skeletons for shader presence and gallery/mermaid initialization
key_files:
  - tests/e2e/shader.spec.ts
  - tests/e2e/gallery.spec.ts
key_decisions:
  - Reused requireTestPasscode helper and auth pattern from gate.spec.ts rather than creating shared test utils (consistent with existing test structure)
patterns_established:
  - Shader tests assert data-shader-renderer attribute with valid value from ["webgpu", "webgl2", "none"]
  - Gallery tests assert data-screenshot-gallery visibility plus data-gallery-init attribute
  - Mermaid tests assert SVG child inside data-mermaid-definition container
observability_surfaces:
  - npx playwright test tests/e2e/shader.spec.ts tests/e2e/gallery.spec.ts --reporter=list shows pass/fail with exact missing selectors
duration: 5m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T01: Create Playwright test skeletons for shader and gallery

**Created 5 Playwright test cases defining the objective stopping condition for S03 — all fail on missing DOM elements as expected.**

## What Happened

Created two test files following the established patterns from `gate.spec.ts` and `public.spec.ts`:

**`tests/e2e/shader.spec.ts`** — 3 tests:
1. Homepage has `[data-shader-renderer]` element with valid value (`webgpu`, `webgl2`, or `none`)
2. About page has same shader canvas with valid renderer attribute
3. Authenticated domain page (`/domains/product/`) has shader canvas after gate auth

**`tests/e2e/gallery.spec.ts`** — 2 tests:
1. Authenticated `/domains/product/` has `[data-screenshot-gallery]` element with `data-gallery-init` attribute (proves gallery JS ran)
2. Authenticated `/domains/analytics-ai/` has rendered Mermaid SVG inside `[data-mermaid-definition]` container

Both files reuse the `requireTestPasscode()` helper pattern and the fill → click → waitForURL auth flow from `gate.spec.ts`.

## Verification

- `npx playwright test tests/e2e/shader.spec.ts --reporter=list` → 3 tests ran, all 3 failed with `locator('[data-shader-renderer]')` element not found — correct failure mode
- `npx playwright test tests/e2e/gallery.spec.ts --reporter=list` → 2 tests ran, both failed with `locator('[data-screenshot-gallery]')` and `locator('[data-mermaid-definition]')` element not found — correct failure mode
- `npx playwright test tests/e2e/gate.spec.ts tests/e2e/public.spec.ts --reporter=list` → 13/13 pass — existing tests unaffected

### Slice-level verification status (T01 — intermediate task):
- ❌ `shader.spec.ts` → 0/3 pass (expected — T02 makes these pass)
- ❌ `gallery.spec.ts` → 0/2 pass (expected — T03 makes these pass)
- ✅ `gate.spec.ts` → 5/5 pass
- ✅ `public.spec.ts` → 8/8 pass

## Diagnostics

Run `npx playwright test tests/e2e/shader.spec.ts tests/e2e/gallery.spec.ts --reporter=list` — error messages point to exact missing `data-*` selectors that T02 and T03 must add.

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `tests/e2e/shader.spec.ts` — 3 test cases for shader canvas presence across page types
- `tests/e2e/gallery.spec.ts` — 2 test cases for gallery initialization and mermaid rendering
