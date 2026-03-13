---
estimated_steps: 4
estimated_files: 2
---

# T01: Create Playwright test skeletons for shader and gallery

**Slice:** S03 — Shader and interactive client components
**Milestone:** M005

## Description

Write the Playwright test files that define the objective stopping condition for S03. These tests will initially fail (no shader or gallery components exist yet) — T02 and T03 make them pass. Tests follow the patterns established in `gate.spec.ts` and `public.spec.ts`: explicit `data-*` selectors, helpers for authentication, and clear test names.

## Steps

1. Create `tests/e2e/shader.spec.ts` with three tests:
   - Shader canvas present on homepage with valid `data-shader-renderer` value (`webgpu`, `webgl2`, or `none`)
   - Shader canvas present on about page with valid `data-shader-renderer` value
   - Shader canvas present on an authenticated domain page (authenticate first using the passcode pattern from `gate.spec.ts`)
2. Create `tests/e2e/gallery.spec.ts` with two tests:
   - Authenticate on `/domains/product/` (which has screenshots in its data), then assert `[data-screenshot-gallery]` element is present and `[data-gallery-init]` attribute is set (gallery JS ran)
   - Authenticate on `/domains/analytics-ai/` (which has mermaid visual), then assert a rendered Mermaid SVG is present inside `[data-mermaid-definition]`
3. Run both test files to confirm they execute and fail for the right reason (missing DOM elements, not syntax or config errors)
4. Verify the existing 13 tests are not affected by running the full suite

## Must-Haves

- [ ] `shader.spec.ts` has 3 test cases covering shader presence on homepage, about, and authenticated domain page
- [ ] `gallery.spec.ts` has 2 test cases covering screenshot gallery initialization and mermaid rendering
- [ ] Tests use `data-*` attribute selectors consistent with the existing contract
- [ ] Tests fail on missing DOM elements (correct failure mode), not on config or syntax errors
- [ ] Existing 13 tests in `gate.spec.ts` and `public.spec.ts` are unaffected

## Verification

- `npx playwright test tests/e2e/shader.spec.ts --reporter=list` — runs, all 3 tests fail with timeout/locator errors (expected)
- `npx playwright test tests/e2e/gallery.spec.ts --reporter=list` — runs, both tests fail with timeout/locator errors (expected)
- `npx playwright test tests/e2e/gate.spec.ts tests/e2e/public.spec.ts --reporter=list` — 13/13 pass (unchanged)

## Observability Impact

- Signals added/changed: None — test files only
- How a future agent inspects this: `npx playwright test tests/e2e/shader.spec.ts tests/e2e/gallery.spec.ts --reporter=list` shows pass/fail status
- Failure state exposed: Playwright error messages point to exact missing selectors

## Inputs

- `tests/e2e/gate.spec.ts` — authentication helper pattern (`requireTestPasscode`, `page.fill`, `page.click`, `page.waitForURL`)
- `tests/e2e/public.spec.ts` — public page test pattern
- S03 research: `data-shader-renderer`, `data-screenshot-gallery`, `data-gallery-init`, `data-mermaid-definition` are the target selectors

## Expected Output

- `tests/e2e/shader.spec.ts` — 3 test cases for shader canvas presence across page types
- `tests/e2e/gallery.spec.ts` — 2 test cases for gallery initialization and mermaid rendering on authenticated domain pages
