# S03: Protected Visual Reveal — UAT

**Milestone:** M002
**Written:** 2026-03-12

## UAT Type

- UAT mode: live-runtime
- Why this mode is sufficient: The visual reveal depends on client-side JS mount, CSS transitions, and gallery initialization — all require a real browser. Dist validation alone cannot prove the reveal transition fires or that gallery JS initializes after dynamic mount.

## Preconditions

- `pnpm build` has completed successfully (dist output exists)
- A local preview server is running (`pnpm preview` or equivalent)
- Browser devtools available for DOM inspection

## Smoke Test

Open any protected domain route (e.g. `/domains/product/`) in a fresh browser context. Confirm no proof images are visible and no `data-visual-state` attribute exists on the gate element. Enter the correct passcode — proof content should fade in from blurred to clear over ~400ms, and screenshot galleries should be interactive.

## Test Cases

### 1. Cold-load visual protection

1. Open `/domains/product/` in a fresh browser context (incognito or cleared storage)
2. Inspect the `[data-protected-gate]` element in devtools
3. **Expected:** No `data-visual-state` attribute present. No `<img>` tags inside the proof region. No screenshot gallery markup visible.

### 2. Blur-to-clear reveal after unlock

1. On a locked protected route, enter the correct passcode
2. Watch the proof region during unlock
3. Inspect `[data-protected-gate]` for `data-visual-state`
4. **Expected:** Proof content appears with a brief blur-to-clear transition (~400ms). `data-visual-state` reads `"revealed"`. Flagship images and screenshot galleries are visible.

### 3. Screenshot gallery functionality after unlock

1. After unlocking, scroll to a screenshot gallery on the proof page
2. Click gallery navigation arrows or dots
3. Click a gallery image to open the lightbox
4. **Expected:** Gallery carousel responds to navigation. Lightbox opens and displays the selected image. Nav dots reflect the current slide position.

### 4. Public routes unaffected

1. Open `/` in the same browser session
2. Open `/about/` and `/resume/`
3. Inspect each page for `data-visual-state`
4. **Expected:** No `data-visual-state` attribute on any public page. No visual changes from pre-S03 behavior.

## Edge Cases

### Refresh after unlock

1. Unlock a protected route, then refresh the page
2. **Expected:** The page re-enters locked state (sessionStorage may persist — behavior depends on S02's unlock persistence). If still unlocked, the reveal transition replays.

### Multiple protected routes after single unlock

1. Unlock on `/domains/product/`, then navigate to `/domains/analytics-ai/`
2. **Expected:** The second route renders proof immediately (or with reveal transition) without requiring re-entry of the passcode.

## Failure Signals

- `data-visual-state` stays at `"revealing"` and never reaches `"revealed"` — reveal transition JS failed
- Proof images appear instantly with no blur transition — CSS not applied or `revealing` state skipped
- Screenshot gallery renders but nav buttons do nothing — gallery JS did not re-initialize after dynamic mount
- `[data-gallery-nav]` missing after unlock — `renderScreenshotGallery()` failed or gallery data is empty
- Proof images visible on cold-load before unlock — cold-load HTML contains leaked proof content

## Requirements Proved By This UAT

- R105 — Protected visuals are obscured until unlock and clear after unlock: proven by cold-load image absence, blur-to-clear transition, and `data-visual-state` lifecycle markers
- R102 (supporting) — Domain portfolio pages require passcode before proof is shown: the visual protection layer completes the gate's coverage beyond text content

## Not Proven By This UAT

- Visual tone and aesthetic quality of the reveal transition — whether the blur/clear feels right is a subjective judgment deferred to S04 UAT
- End-to-end regression coverage across all three slices in a single assembled flow — that's S04's scope
- Performance of the reveal transition on slow devices or networks

## Notes for Tester

- The reveal transition is ~400ms and subtle — watch carefully on first unlock or use devtools "slow 3G" throttling to make it more visible
- Gallery functionality depends on domains having screenshot data — check a domain with screenshots (the data model determines which domains have them)
- The `data-visual-state` attribute is the most reliable inspection point — check it in devtools Elements panel on `[data-protected-gate]`
