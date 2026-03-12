# S03: Protected Visual Reveal — Research

**Date:** 2026-03-12

## Summary

S03 owns R105 (protected visuals obscured until unlock, clear after) and supports R102 (gate behavior for domain routes). The core challenge is that the current architecture already withholds all proof DOM from cold-load HTML — images only exist after the client-side `domain-proof-view.ts` mounts proof post-unlock. So "visual protection" in this slice is about (a) ensuring mounted proof images get a deliberate reveal transition rather than a sudden content swap, (b) adding screenshot gallery rendering to the client proof view (currently missing — the view-model serializes screenshots but the renderer skips them), and (c) exposing stable visual-state markers for S04 verification.

The recommended approach is CSS-driven: mount proof content with a blur/opacity treatment, then transition to clear after a short delay. This keeps the implementation lightweight, requires no new dependencies, works with the existing client rendering seam, and produces the visual "unveiling" effect that makes the gate feel intentional rather than broken. The main implementation work is extending `domain-proof-view.ts` to render screenshot galleries (matching `ScreenshotGallery.astro`'s markup) and wiring the reveal transition into the gate client's `mountProof` flow.

## Recommendation

**CSS-driven blur-to-clear reveal through the existing client mount path.** Specifically:

1. When `mountProof()` renders proof DOM, add a `data-visual-state="revealing"` attribute to the proof container. Apply `filter: blur(12px); opacity: 0` via CSS.
2. After a short delay (~50ms, enough for the browser to paint the blurred state), flip to `data-visual-state="revealed"`. CSS transitions handle the visual clear (blur → 0, opacity → 1 over ~400ms).
3. Add screenshot gallery rendering to `domain-proof-view.ts` so all visual content types are covered by the reveal.
4. Add a `data-visual-state` marker to the proof region for S04 browser-test verification.
5. Add a fast dist validator (`validate-m002-s03.mjs`) that checks cold-load HTML does NOT contain rendered proof images, confirming visual protection at the artifact level.

This approach avoids adding runtime dependencies, preserves the existing mount seam (D016, D018), and produces verifiable DOM hooks for S04 (per the S03→S04 boundary contract).

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Proof DOM rendering after unlock | `domain-proof-view.ts` + `renderDomainProof()` | Already the single client-side proof renderer — extend it rather than creating a parallel path |
| Screenshot gallery markup | `ScreenshotGallery.astro` | Use as the reference for the client-side gallery renderer — match its DOM structure and data attributes |
| Gate state transitions | `domain-gate-client.ts` `mountProof()` / `transitionToOpen()` | The reveal should be wired into the existing unlock flow, not a separate lifecycle |
| Retro terminal styling | `src/styles/global.css` | Existing pattern for gate styling — the reveal transition CSS belongs here |

## Existing Code and Patterns

- `src/components/domains/domain-proof-view.ts` — Client-side proof renderer. Currently renders flagship visuals (single `<img>`) and text but **skips screenshot galleries entirely** despite the view-model including `screenshots: ResolvedScreenshot[]` on each flagship. This is the primary gap S03 must close.
- `src/components/domains/domain-gate-client.ts` — Gate controller with `mountProof()` and `transitionToOpen()`. The reveal transition should be wired here — `transitionToOpen()` already flips `data-gate-state` and `data-protected-proof-state`, so adding `data-visual-state` follows the same pattern.
- `src/components/domains/ScreenshotGallery.astro` — Astro-only screenshot carousel with lightbox, used in the `gateState === "open"` cold-render path. The client proof view needs a matching renderer. Its interactive JS (`initGalleries()`) uses `[data-screenshot-gallery]` as the root selector and relies on DOM-queried child elements.
- `src/components/domains/DomainPage.astro` — The gate boundary seam (D016). Locked path serializes full proof payload including screenshots. Open path renders `ScreenshotGallery` server-side. The locked path is what S03 must enhance.
- `src/data/domains/domain-view-model.ts` — `ResolvedFlagship` already includes `screenshots: ResolvedScreenshot[]`. The data is already serialized into the JSON payload — `domain-proof-view.ts` just doesn't consume it.
- `tests/helpers/site-boundary-fixtures.mjs` — Shared test vocabulary. S03 needs to add visual-state selectors here.
- `scripts/validate-m002-s02.mjs` — Pattern for per-slice dist validators. S03 should follow the same structure.

## Constraints

- **Proof images are only in the client-rendered DOM, never in cold-load HTML.** The JSON payload contains image URLs but no `<img>` tags ship in initial HTML. This means "obscured before unlock" is already structurally true at the HTML level — S03's job is the reveal experience and verification markers.
- **Image URLs are visible in the JSON payload** (`data-proof-payload` script tag). Per D009, this is acceptable — the gate is a lightweight deterrent, not strong security. S03 should not attempt to encrypt or obfuscate payload URLs.
- **Mermaid diagrams are server-rendered only** — `domain-proof-view.ts` explicitly skips mermaid visuals (`if (f.visual && !f.visual.mermaid && f.visual.src)`). Mermaid diagrams are not in the client proof view and adding them is out of scope for S03 since they're structural diagrams, not portfolio "visuals" in the R105 sense.
- **`ScreenshotGallery.astro` has interactive JS** that initializes galleries via `initGalleries()`. The client proof view must either replicate this initialization or dispatch an event that triggers it. The gallery script already listens for `astro:page-load`, so dispatching that event after mount may work, but needs testing.
- **The reveal must not affect public pages.** CSS transitions scoped to `[data-protected-gate]` or `[data-visual-state]` ensure public routes are untouched.
- **No new runtime dependencies.** CSS `filter: blur()` and `opacity` transitions are universally supported and sufficient.

## Common Pitfalls

- **Rendering screenshots without initializing gallery JS** — The `ScreenshotGallery.astro` inline script initializes carousel navigation, dots, and lightbox. If `domain-proof-view.ts` renders the gallery DOM but doesn't trigger initialization, the gallery will be static. Solution: after mounting proof, call `initGalleries()` or dispatch a DOM event that the gallery script listens for.
- **Blur transition not visible because mount + reveal happen in the same frame** — If `data-visual-state` is set to `"revealing"` and immediately flipped to `"revealed"`, the browser may batch the style changes and skip the transition. Solution: use `requestAnimationFrame` or a short `setTimeout` between setting the initial blurred state and triggering the reveal.
- **Forgetting to scope reveal CSS to protected context only** — A generic `.blur-reveal` class could accidentally affect public page elements. Solution: scope all reveal CSS under `[data-visual-state]` or `[data-protected-gate]`.
- **Breaking the existing unlock test assertions** — S02's browser tests snapshot `data-gate-state` and `data-protected-proof-state`. Adding `data-visual-state` is additive, but changing the timing of `transitionToOpen()` could race with test assertions. Solution: keep the existing marker transitions synchronous and layer the visual reveal on top.

## Open Risks

- **Screenshot gallery JS re-initialization after client mount** — The `ScreenshotGallery.astro` script uses `document.querySelectorAll("[data-screenshot-gallery]")` and listens for `astro:page-load`. If galleries are mounted dynamically, the script may have already run and won't pick up new galleries. May need to re-invoke `initGalleries()` explicitly after proof mount.
- **Reveal timing UX** — The blur-to-clear transition duration needs to feel intentional (deliberate reveal) without feeling slow (frustrating). ~300-400ms is the target, but this needs visual review.
- **Client proof view parity drift** — `domain-proof-view.ts` already diverges from `DomainPage.astro` by skipping screenshots. Adding screenshot rendering closes this gap, but the two rendering paths need to stay in sync going forward. This is a maintenance concern for future slices, not a blocker for S03.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | frontend-design | installed (available in `<available_skills>`) |
| CSS transitions/animations | — | No specific skill needed; standard CSS |
| Puppeteer (browser tests) | — | Already in use; no skill needed |

No external skills are needed for this slice. The work is CSS transitions, TypeScript DOM rendering, and test wiring — all within existing project patterns.

## Sources

- `src/components/domains/domain-proof-view.ts` — confirmed screenshots are not rendered despite being in the view-model
- `src/components/domains/ScreenshotGallery.astro` — reference markup for client-side gallery renderer
- `src/components/domains/domain-gate-client.ts` — `mountProof()` and `transitionToOpen()` are the extension points
- S02 Forward Intelligence — "S03's visual blur/reveal needs to hook into this same mount region — proof images exist inside the mounted proof DOM, not in the cold-load HTML"
- `dist/domains/product/index.html` — confirmed proof payload JSON includes screenshot URLs but no rendered `<img>` tags in cold-load HTML
