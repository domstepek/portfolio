---
id: M002
provides:
  - Client-side passcode gate protecting /domains/* while keeping /, /about/, and /resume/ publicly accessible
  - Session-scoped unlock with cross-tab carryover via sessionStorage + localStorage bridge
  - CSS-driven blur-to-clear visual reveal for protected proof content including screenshot galleries
  - Request-access messaging with canonical email and LinkedIn contact links
  - 20 browser tests + 3 dist validators wired into pnpm validate:site release gate
  - Stable DOM marker contract (data-route-visibility, data-gate-state, data-gate-status, data-protected-proof-state, data-visual-state) shared across rendering, validation, and testing
key_decisions:
  - D009 — Simple static passcode gate instead of real auth because site stays on GitHub Pages
  - D010 — Protect /domains/* only; public discovery surfaces stay open
  - D013 — Stable DOM marker contract for public/protected route verification
  - D018 — SHA-256 hash validation with build-time public hash and shared client-renderable view-model
  - D019 — localStorage cross-tab bridge alongside sessionStorage (sessionStorage is per-tab)
  - D020 — CSS-driven blur-to-clear reveal with data-visual-state markers
  - D021 — Gallery JS re-initialization via astro:page-load dispatch after dynamic proof mount
  - D022 — Assembled flow test + notes isolation guard for final verification
patterns_established:
  - Public and protected routes expose explicit DOM markers so dist validators, browser tests, and unlock-state checks share one contract
  - Each slice gets its own validator script reusing shared fixture vocabulary; validate:site chains them all
  - Normalized DomainProofViewModel shared between Astro cold-render and browser unlock render paths
  - Proof payload serialized as hidden JSON script tags in cold-load HTML, consumed by client gate controller after unlock
  - requestAnimationFrame + setTimeout frame separation ensures browser paints blurred state before reveal transition
  - Single assembled flow browser test pattern covering the full visitor journey end-to-end
observability_surfaces:
  - "pnpm validate:site — single authoritative release gate covering S01→S02→S03→S04 (20 tests + 3 dist validators)"
  - "data-route-visibility, data-gate-state, data-gate-status, data-protected-proof-state, data-visual-state attributes on DOM for manual and automated inspection"
  - "sessionStorage/localStorage key 'portfolio-gate:v1' for unlock state inspection"
  - "GitHub Actions 'Validate site release gate' step blocks deploy on validation failure"
requirement_outcomes:
  - id: R101
    from_status: active
    to_status: validated
    proof: Dist checks, browser cold-load verification, and deploy-gated route-boundary validator prove /, /about/, and /resume/ remain directly accessible without the protected shell.
  - id: R102
    from_status: active
    to_status: validated
    proof: Assembled flow browser test proves full cold-lock → wrong-passcode → correct-unlock → visual-reveal → cross-route journey. 17 S01–S03 browser tests, 3 dist validators, and pnpm validate:site release gate provide comprehensive coverage.
  - id: R103
    from_status: active
    to_status: validated
    proof: Static assertions for canonical email/LinkedIn links, browser cold-load tests for request-access panel, and dist validator enforcing messaging in built HTML.
  - id: R104
    from_status: active
    to_status: validated
    proof: Real browser tests covering correct-passcode unlock, cross-route carryover via sessionStorage + localStorage bridge, and fresh-context relock.
  - id: R105
    from_status: active
    to_status: validated
    proof: Dist validator confirms no proof images/gallery markup in cold-load HTML; browser tests confirm data-visual-state transitions and screenshot gallery rendering after unlock; public route isolation verified.
duration: 6h18m
verification_result: passed
completed_at: 2026-03-12
---

# M002: Portfolio Access Gate

**Shipped a lightweight passcode gate that keeps the public site open for discovery while protecting the domain portfolio proof behind session-scoped access control with visual blur/reveal, request-access messaging, and 20-test regression coverage.**

## What Happened

M002 added an access-control layer to the domain portfolio pages without changing the site's static GitHub Pages hosting or its public discovery surfaces.

S01 established the foundational public/protected route boundary. Public routes (`/`, `/about/`, `/resume/`) were marked explicitly open, while `/domains/*` routes were switched to render a retro locked shell that withholds all portfolio proof from cold-load HTML. A shared fixture module and stable DOM marker contract (`data-route-visibility`, `data-gate-state`, `data-protected-gate`, `data-protected-proof-state`) were introduced so that dist validators, browser tests, and later slices all verify against the same expectations. The route boundary was wired into the deploy pipeline via `pnpm validate:site`.

S02 built the interactive gate experience on top of S01's locked shell. A normalized `DomainProofViewModel` was extracted so both Astro server renders and the browser unlock path consume the same shape. The gate shell gained canonical email and LinkedIn request-access links, a passcode form with SHA-256 hash validation against a build-time public hash, and session-scoped unlock via `sessionStorage` with a `localStorage` cross-tab bridge (necessary because `sessionStorage` is per-tab). Unlocked proof is rendered client-side from serialized JSON embedded in the locked cold-load HTML. Four browser tests cover the full unlock lifecycle: cold-load locked state, wrong-passcode error, correct-passcode unlock, and cross-tab carryover with fresh-context relock.

S03 added the visual protection layer. Protected proof regions render with a CSS blur (`filter: blur(12px); opacity: 0`) that transitions to clear over 400ms after unlock via `data-visual-state` markers. Screenshot galleries are rendered client-side by `renderScreenshotGallery()` and re-initialized via `astro:page-load` dispatch. A dist validator confirms no proof images or gallery markup leak into cold-load HTML, and four browser tests verify the full reveal lifecycle.

S04 closed the milestone with end-to-end assembled verification. One browser test exercises the complete visitor journey in a single continuous Puppeteer context: cold-lock → wrong-passcode error → correct unlock → visual reveal → cross-route carryover. A notes-isolation guard confirms `/notes/*` carries no gate markers. Both were wired into `validate:site`, bringing the total to 20 browser tests and 3 dist validators in the release gate.

## Cross-Slice Verification

Each milestone success criterion was verified with specific evidence:

1. **Public routes stay open** — S01 browser cold-load tests prove `/`, `/about/`, and `/resume/` render without the protected gate shell. S01 dist validator confirms public markers in built HTML. S04 assembled flow test does not regress this.

2. **Protected routes show gate state** — S01 browser tests prove cold-load `/domains/*` renders the locked shell with gate markers. S02 static assertions confirm request-access messaging (email + LinkedIn links) in cold-load HTML. S02 dist validator enforces gate-form markers.

3. **Passcode unlocks for the session** — S02 browser tests prove correct-passcode unlock, cross-route carryover in the same context, and fresh-context relock. S04 assembled flow test exercises wrong-passcode → correct-passcode → cross-route in one continuous journey.

4. **Protected visuals obscured before unlock, clear after** — S03 dist validator confirms no proof images in cold-load HTML. S03 browser tests prove `data-visual-state` absent on cold-load, transitions to `"revealed"` after unlock, and screenshot galleries render with initialized JS. S04 assembled flow test confirms `data-visual-state="revealed"` after unlock.

5. **Verification coverage prevents regressions** — `pnpm validate:site` chains S01→S02→S03→S04 (20 tests + 3 dist validators). GitHub Actions deploy workflow blocks artifact upload if validation fails.

## Requirement Changes

- R101: active → validated — Proven by dist checks, browser cold-load verification, and deploy-gated route-boundary validator confirming public routes stay directly accessible.
- R102: active → validated — Proven by assembled flow browser test covering the full gate lifecycle, 17 S01–S03 browser tests, 3 dist validators, and the full `pnpm validate:site` release gate.
- R103: active → validated — Proven by static assertions for canonical contact links, browser cold-load tests, and dist validator enforcing request-access messaging.
- R104: active → validated — Proven by real browser tests covering unlock, cross-route carryover via sessionStorage + localStorage bridge, and fresh-context relock.
- R105: active → validated — Proven by dist validator (no images in cold-load HTML), browser tests for `data-visual-state` transitions and gallery rendering, and public route isolation.

## Forward Intelligence

### What the next milestone should know
- The full `pnpm validate:site` gate (20 tests + 3 dist validators) covers the public/protected route split, unlock flow, visual reveal, session persistence, and scope isolation. Any future milestone touching domain routes or adding new protected surfaces should run it as a regression check.
- The `DomainPage` → `DomainGateShell` rendering seam is the single entry point for all protected domain routes. Extending protection to new surfaces should follow this pattern rather than creating parallel gate paths.
- The DOM marker contract (`data-route-visibility`, `data-gate-state`, `data-gate-status`, `data-protected-proof-state`, `data-visual-state`) is consumed by 20 tests, 3 validators, and CI. Changing marker names requires updating components, fixtures, and validators in lockstep.

### What's fragile
- The localStorage cross-tab bridge relies on same-origin storage. If the base path or domain changes, the unlock marker won't carry over. The storage key is versioned (`portfolio-gate:v1`) so a new version can force relock.
- Gallery JS re-initialization depends on `astro:page-load` event dispatch after dynamic mount. If Astro's inline script lifecycle convention changes or the gallery component's init script changes its event listener, dynamic gallery init breaks silently.
- The frame separation trick (`requestAnimationFrame` + `setTimeout(50)`) for blur-before-reveal is empirically reliable but timing-sensitive on very slow browsers.
- Client-side hash validation is a lightweight deterrent, not strong security. The hash and proof payload are in the shipped HTML — a determined reader can extract them. This is by design given the static hosting constraint.

### Authoritative diagnostics
- `pnpm validate:site` — the single release gate. If it passes, the full M002 contract holds. If it fails, the named test case identifies the exact route and missing behavior.
- `tests/helpers/site-boundary-fixtures.mjs` — the shared fixture module that all tests and validators import. This is the source of truth for route inventories, selector contracts, and unlock test inputs.
- DOM attributes in browser devtools (`data-gate-state`, `data-visual-state`, etc.) — the fastest manual check for gate and reveal behavior on any route.

### What assumptions changed
- sessionStorage alone was expected to handle cross-route unlock, but sessionStorage is per-tab (per top-level browsing context). localStorage was added as a cross-tab bridge (D019).
- The deploy workflow was expected to need per-slice changes, but `pnpm validate:site` chaining in `package.json` was sufficient — the workflow already ran that command.
- A static dist validator alone was expected to be enough for the route split, but both built-HTML assertions and real browser cold-load tests were needed to prove the boundary safely.

## Files Created/Modified

- `src/components/domains/DomainGateShell.astro` — full gate UI with locked shell, request-access links, passcode form, status markers, proof mount point
- `src/components/domains/DomainPage.astro` — gate-aware rendering seam with locked/unlocked paths, proof payload serialization
- `src/components/domains/domain-gate-client.ts` — session-scoped unlock controller with SHA-256 validation, localStorage bridge, visual reveal lifecycle
- `src/components/domains/domain-proof-view.ts` — browser-side proof renderer with screenshot gallery support
- `src/data/domains/domain-view-model.ts` — normalized proof view-model shared between server and client paths
- `src/pages/domains/[slug].astro` — protected route entrypoint rendering through gate-aware DomainPage
- `src/components/home/HomePage.astro` — marked as explicitly public/open
- `src/components/personal/PersonalPage.astro` — marked as explicitly public/open
- `src/components/resume/ResumePage.astro` — marked as explicitly public/open
- `src/env.d.ts` — added PUBLIC_GATE_HASH env type
- `src/styles/global.css` — gate styling, reveal transition CSS
- `tests/helpers/site-boundary-fixtures.mjs` — centralized route inventories, selectors, unlock inputs, visual-state fixtures
- `tests/route-boundary.static.test.mjs` — built-artifact assertions for public/protected boundary
- `tests/route-boundary.browser.test.mjs` — real-browser cold-load regression coverage
- `tests/route-unlock.browser.test.mjs` — warm-session unlock regression suite
- `tests/visual-reveal.browser.test.mjs` — visual reveal lifecycle browser tests
- `tests/assembled-flow.browser.test.mjs` — end-to-end assembled flow browser test
- `tests/notes-isolation.browser.test.mjs` — notes-route gate isolation guard
- `scripts/validate-m002-s01.mjs` — S01 dist validator for route boundary
- `scripts/validate-m002-s02.mjs` — S02 dist validator for gate messaging
- `scripts/validate-m002-s03.mjs` — S03 dist validator for visual protection
- `package.json` — test scripts, validator scripts, validate:site chain
- `.github/workflows/deploy.yml` — validate:site enforcement before Pages artifact upload
- `.gsd/REQUIREMENTS.md` — all M002 requirements moved to validated
