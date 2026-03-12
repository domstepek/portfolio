# S03: Protected Visual Reveal

**Goal:** Protected domain visuals stay obscured before unlock and render normally after unlock — including screenshot galleries that the client proof view currently skips — without changing public pages.
**Demo:** A cold-load of any protected domain route shows no proof images. After unlock, proof content (including screenshot galleries) fades in through a deliberate blur-to-clear reveal transition. Public pages are unaffected.

## Must-Haves

- Screenshot gallery rendering added to `domain-proof-view.ts` so all visual content types render after unlock
- CSS-driven blur-to-clear reveal transition on proof mount (`filter: blur(12px); opacity: 0` → clear over ~400ms)
- `data-visual-state` marker exposed on the proof region for S04 verification (`revealing` → `revealed`)
- Gallery JS initialization triggered after client-side proof mount so carousel/lightbox work
- Cold-load HTML confirmed free of rendered proof `<img>` tags via dist validator
- Browser test proving visual-state transitions (locked → revealing → revealed) after unlock
- No visual changes to public routes

## Proof Level

- This slice proves: integration (real browser unlock flow exercises the visual reveal end-to-end)
- Real runtime required: yes (browser tests exercise client-side mount, CSS transitions, and gallery JS init)
- Human/UAT required: no (visual tone is deferred to S04 UAT; this slice proves mechanical correctness)

## Verification

- `node --test tests/visual-reveal.browser.test.mjs` — browser test covering: (1) cold-load has no proof images and no visual-state marker, (2) after unlock, `data-visual-state` transitions to `revealed`, (3) screenshot gallery DOM is present and gallery JS initialized (nav/lightbox elements exist), (4) public routes have no visual-state markers
- `node scripts/validate-m002-s03.mjs` — dist validator confirming cold-load protected HTML has no `<img>` tags inside proof regions and no screenshot gallery markup
- `pnpm validate:site` — aggregate release gate passes with S03 chained in

## Observability / Diagnostics

- Runtime signals: `data-visual-state` attribute on `[data-protected-gate]` transitions through `revealing` → `revealed` during mount; stays absent on cold-load locked state
- Inspection surfaces: browser devtools — inspect `data-visual-state`, `data-gate-state`, `data-protected-proof-state` on any protected route; `node scripts/validate-m002-s03.mjs` for fast artifact checks
- Failure visibility: if reveal fails, `data-visual-state` stays at `revealing` (never reaches `revealed`); if gallery init fails, `[data-gallery-nav]` will be missing or nav buttons stay disabled
- Redaction constraints: none

## Integration Closure

- Upstream surfaces consumed: `domain-gate-client.ts` mount flow (S02), `domain-proof-view.ts` renderer (S02), `ScreenshotGallery.astro` markup reference (M001), shared test fixtures (S01/S02)
- New wiring introduced in this slice: screenshot gallery rendering in client proof view, reveal transition CSS + JS orchestration in mount flow, `data-visual-state` marker contract, gallery JS re-initialization after dynamic mount
- What remains before the milestone is truly usable end-to-end: S04 assembled regression coverage and UAT sign-off

## Tasks

- [x] **T01: Pin failing tests for visual reveal and screenshot gallery** `est:45m`
  - Why: Establish the objective stopping condition before writing implementation. Tests define the contract for `data-visual-state` transitions, screenshot gallery presence after unlock, and cold-load artifact safety.
  - Files: `tests/visual-reveal.browser.test.mjs`, `tests/helpers/site-boundary-fixtures.mjs`, `scripts/validate-m002-s03.mjs`
  - Do: Create browser test with 4 named cases: (1) cold-load has no visual-state marker and no proof images, (2) after unlock `data-visual-state` reaches `revealed` and screenshot galleries render, (3) gallery JS is initialized (nav elements present), (4) public routes unaffected. Create S03 dist validator checking cold-load HTML has no `<img>` inside proof mount regions. Add S03 visual-state selectors to shared fixtures. Tests should fail since implementation doesn't exist yet.
  - Verify: `node --test tests/visual-reveal.browser.test.mjs` runs (tests fail as expected), `node scripts/validate-m002-s03.mjs` runs
  - Done when: All test files execute without crashes but fail on missing implementation behavior

- [x] **T02: Add screenshot gallery rendering and blur-to-clear reveal transition** `est:1h`
  - Why: This is the core implementation — closes the screenshot rendering gap in `domain-proof-view.ts`, adds the CSS reveal transition, wires `data-visual-state` markers into the mount flow, and triggers gallery JS initialization after dynamic mount.
  - Files: `src/components/domains/domain-proof-view.ts`, `src/components/domains/domain-gate-client.ts`, `src/styles/global.css`
  - Do: (1) Add `renderScreenshotGallery()` to `domain-proof-view.ts` matching `ScreenshotGallery.astro` DOM structure. (2) Wire screenshot gallery rendering into `renderFlagship()` after the visual figure. (3) Add reveal CSS under `[data-visual-state]` scoping: `revealing` state applies `filter: blur(12px); opacity: 0`, `revealed` state clears to `filter: none; opacity: 1` with `transition: filter 400ms ease, opacity 400ms ease`. (4) In `domain-gate-client.ts`, after `mountProof()` completes, set `data-visual-state="revealing"` on the gate element, then use `requestAnimationFrame` + short delay to flip to `"revealed"`. (5) After proof mount, call `initGalleries()` pattern or dispatch gallery initialization for dynamically added galleries. (6) Build and verify all T01 tests pass.
  - Verify: `pnpm build` succeeds, `node --test tests/visual-reveal.browser.test.mjs` passes, `node scripts/validate-m002-s03.mjs` passes, existing S02 tests still pass
  - Done when: All T01 tests pass, `pnpm check` clean, existing `pnpm validate:site` still passes

- [x] **T03: Wire S03 into release validation gate** `est:20m`
  - Why: Chain the S03 dist validator and visual-reveal browser test into `validate:site` so the deploy workflow enforces the visual protection contract.
  - Files: `package.json`
  - Do: Add `validate:m002:s03` script that runs `node scripts/validate-m002-s03.mjs && pnpm test:visual-reveal:browser`. Add `test:visual-reveal:browser` script. Update `validate:site` to chain S03 after S02. Run full validation to confirm the chain.
  - Verify: `pnpm validate:site` passes with S01 + S02 + S03 checks all green
  - Done when: `pnpm validate:site` passes end-to-end including the new S03 checks

## Files Likely Touched

- `src/components/domains/domain-proof-view.ts`
- `src/components/domains/domain-gate-client.ts`
- `src/styles/global.css`
- `tests/visual-reveal.browser.test.mjs`
- `tests/helpers/site-boundary-fixtures.mjs`
- `scripts/validate-m002-s03.mjs`
- `package.json`
