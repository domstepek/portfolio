---
estimated_steps: 6
estimated_files: 3
---

# T02: Add screenshot gallery rendering and blur-to-clear reveal transition

**Slice:** S03 — Protected Visual Reveal
**Milestone:** M002

## Description

This is the core implementation task. It closes three gaps: (1) `domain-proof-view.ts` skips screenshot galleries despite the view-model including them — add a `renderScreenshotGallery()` function matching `ScreenshotGallery.astro`'s DOM structure, (2) the proof mount has no visual reveal transition — add CSS-driven blur-to-clear with `data-visual-state` markers, and (3) dynamically mounted galleries need JS initialization — trigger `initGalleries()` after proof mount. After this task, all T01 tests should pass.

## Steps

1. Add `renderScreenshotGallery()` to `domain-proof-view.ts`:
   - Accept `ResolvedScreenshot[]` and return an `HTMLElement`
   - Generate DOM matching `ScreenshotGallery.astro`: `<figure data-screenshot-gallery>` containing viewport with track, slides with trigger buttons (including `data-gallery-trigger`, `data-full-src`, `data-full-alt`, `data-caption` attributes), nav with prev/next arrows and dots container, and lightbox dialog
   - Wire into `renderFlagship()`: after the existing visual figure block, add `if (f.screenshots.length > 0)` rendering the gallery

2. Add reveal transition CSS to `src/styles/global.css`:
   - `[data-visual-state="revealing"]` — `filter: blur(12px); opacity: 0; transition: filter 400ms ease, opacity 400ms ease;`
   - `[data-visual-state="revealed"]` — `filter: none; opacity: 1;`
   - Scope entirely under `[data-visual-state]` so public routes are untouched
   - Place near existing gate styles for co-location

3. Update `mountProof()` in `domain-gate-client.ts`:
   - After the existing DOM replacement logic, set `data-visual-state="revealing"` on the gate element
   - Use `requestAnimationFrame(() => { setTimeout(() => { ... }, 50); })` to flip `data-visual-state` to `"revealed"` — this ensures the browser paints the blurred state before transitioning

4. After proof mount in the unlock flow, trigger gallery JS initialization:
   - After `mountProof()` completes and the reveal is scheduled, dispatch a custom re-init or directly call into the gallery init pattern
   - The `ScreenshotGallery.astro` inline script exposes `initGalleries()` at module scope and listens for `astro:page-load` — dispatching `new Event("astro:page-load")` on `document` after mount should trigger re-initialization of dynamically added galleries
   - Alternatively, if the inline script already ran and won't re-fire, extract the init call into the mount flow

5. Run `pnpm build` to confirm compilation succeeds and `pnpm check` is clean

6. Run all tests to confirm T01 tests now pass and existing S01/S02 tests still pass:
   - `node --test tests/visual-reveal.browser.test.mjs` — all 4 cases pass
   - `node scripts/validate-m002-s03.mjs` — passes
   - `node --test tests/route-unlock.browser.test.mjs` — S02 tests still pass
   - `node --test tests/route-boundary.static.test.mjs` — S01 static tests still pass

## Must-Haves

- [ ] `renderScreenshotGallery()` in `domain-proof-view.ts` producing DOM matching `ScreenshotGallery.astro` structure
- [ ] Screenshot galleries rendered inside `renderFlagship()` for flagships with screenshots
- [ ] CSS reveal transition scoped to `[data-visual-state]` — blur/opacity animate over ~400ms
- [ ] `data-visual-state` marker set to `"revealing"` then `"revealed"` during mount flow with frame separation
- [ ] Gallery JS initialization triggered after dynamic proof mount (carousel navigation and lightbox functional)
- [ ] Existing S02 unlock tests unbroken
- [ ] `pnpm check` clean, `pnpm build` succeeds

## Verification

- `pnpm check` — 0 errors, 0 warnings
- `pnpm build` — succeeds
- `node --test tests/visual-reveal.browser.test.mjs` — all 4 cases pass
- `node scripts/validate-m002-s03.mjs` — passes
- `node --test tests/route-unlock.browser.test.mjs` — 4/4 pass (S02 unbroken)
- `node --test tests/route-boundary.static.test.mjs` — all pass

## Observability Impact

- Signals added/changed: `data-visual-state` attribute on `[data-protected-gate]` element transitions through `revealing` → `revealed`; absent on cold-load and public routes
- How a future agent inspects this: inspect `data-visual-state` in browser devtools on any protected route after unlock; run `node --test tests/visual-reveal.browser.test.mjs` for focused verification
- Failure state exposed: if reveal fails, `data-visual-state` stays at `"revealing"` (never reaches `"revealed"`); if gallery init fails, gallery nav/dots will be absent or non-functional

## Inputs

- `src/components/domains/domain-proof-view.ts` — current proof renderer to extend with screenshot gallery
- `src/components/domains/ScreenshotGallery.astro` — reference DOM structure and data attributes for gallery renderer
- `src/components/domains/domain-gate-client.ts` — mount flow to wire reveal transition and gallery init into
- `src/styles/global.css` — add reveal transition CSS near existing gate styles
- `tests/visual-reveal.browser.test.mjs` — T01 tests that should pass after this task

## Expected Output

- `src/components/domains/domain-proof-view.ts` — extended with `renderScreenshotGallery()` and screenshot rendering in `renderFlagship()`
- `src/components/domains/domain-gate-client.ts` — `mountProof()` sets `data-visual-state` markers and triggers gallery init after mount
- `src/styles/global.css` — reveal transition CSS under `[data-visual-state]` selectors
