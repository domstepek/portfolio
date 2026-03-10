---
phase: 03-homepage-positioning
plan: "03"
subsystem: testing
tags: [astro, homepage, validation, release-gate, dist]
requires:
  - phase: 01-publishing-foundation
    provides: Base-aware metadata and the existing dist-first validation pattern
  - phase: 02-domain-hubs-supporting-work
    provides: Shared validate:site gating and domain-validator conventions
  - phase: 03-homepage-positioning
    provides: Shipped homepage markers and base-aware domain links from 03-01 and 03-02
provides:
  - Dist-first homepage artifact validation against emitted HTML
  - Base-aware homepage domain-link checks derived from the canonical path
  - Aggregate site validation widened through Phase 3
affects: [phase-04-planning, release-gate, homepage-validation]
tech-stack:
  added: []
  patterns:
    - dist-first homepage validation against emitted HTML instead of source templates
    - single aggregate site gate spanning phase-specific validators
key-files:
  created:
    - scripts/validate-phase3.mjs
    - .planning/phases/03-homepage-positioning/03-03-SUMMARY.md
  modified:
    - package.json
    - .planning/STATE.md
    - .planning/ROADMAP.md
    - .planning/REQUIREMENTS.md
key-decisions:
  - "Validate the homepage from built dist/index.html so the gate matches the artifact GitHub Pages will publish."
  - "Derive expected homepage domain hrefs from the emitted canonical URL so the validator stays base-path aware without importing source helpers."
  - "Extend the existing validate:site chain instead of creating a separate homepage CI path."
patterns-established:
  - "Homepage validation pattern: inspect stable data-home-* markers in emitted HTML and keep external-link checks structural only."
  - "Release-gate pattern: widen the shared validate:site command as new phase validators land."
requirements-completed: [HOME-01, HOME-02, HOME-03, HOME-04]
duration: 4 min
completed: 2026-03-09
---

# Phase 03 Plan 03: Add Dist-First Homepage Validation to the Site Release Gate Summary

**A dist-first homepage validator now audits the built landing page, and the shared `validate:site` release gate blocks deploys on regressions across Phases 1 through 3.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-10T00:06:00Z
- **Completed:** 2026-03-10T00:10:34Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Added a Node-based homepage validator that reads `dist/index.html` and checks the built artifact for metadata, hero, domain, contact, and freshness markers.
- Made the homepage domain-link audit base-aware by deriving expected `/domains/<slug>/` hrefs from the emitted canonical URL instead of from source files.
- Extended `validate:site` so the Phase 1, Phase 2, and new Phase 3 validators all run in one release gate.

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement a fast dist-first validator for the built homepage** - `3c78777` (feat)
2. **Task 2: Add Phase 3 validation to the aggregate site gate** - `6459aef` (chore)

**Plan metadata:** Pending final docs commit

## Files Created/Modified
- `scripts/validate-phase3.mjs` - Validates the built homepage artifact for required markers, metadata, and link shape.
- `package.json` - Adds `validate:phase3` and widens `validate:site` through Phase 3.
- `.planning/phases/03-homepage-positioning/03-03-SUMMARY.md` - Records the plan outcome, decisions, verification, and commit trace.
- `.planning/STATE.md` - Advances execution state from Phase 3 completion to Phase 4 planning readiness and records new decisions.
- `.planning/ROADMAP.md` - Marks `03-03` complete and closes Phase 3 in the roadmap progress tables.
- `.planning/REQUIREMENTS.md` - Records Phase 3 sign-off for the homepage release gate and refreshes the planning footer.

## Decisions Made
- Kept the validator dist-first so homepage release checks stay aligned with the exact artifact GitHub Pages will publish.
- Derived expected internal domain paths from the homepage canonical URL so the validator remains base-path aware without duplicating runtime helpers.
- Reused the shared `validate:site` command instead of branching CI, preserving one release gate for the site.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Manually synced planning docs after `gsd-tools state advance-plan` failed to parse `STATE.md`**
- **Found during:** Plan wrap-up (metadata/docs update)
- **Issue:** `state advance-plan` returned `{"error":"Cannot parse Current Plan or Total Plans in Phase from STATE.md"}`, and `requirements mark-complete` could not re-mark the already-complete `HOME-*` requirements.
- **Fix:** Used the working helpers (`state update-progress`, `state record-metric`, `roadmap update-plan-progress`, and `state record-session`), then manually patched `STATE.md`, `ROADMAP.md`, and `REQUIREMENTS.md` so Phase 3 closes cleanly and Phase 4 is the next planning target.
- **Files modified:** `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`
- **Verification:** Re-read the planning docs to confirm Phase 3 shows `3/3` plans complete, the next phase is `Phase 4`, and the requirements doc reflects the Phase 3 homepage release gate.
- **Committed in:** Pending final docs commit

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fallback only affected planning bookkeeping. The validator and release-gate work stayed within the planned scope and verified cleanly.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 3 is complete, and the site now has built-artifact validation coverage for the homepage alongside the existing Phase 1 and Phase 2 gates.
- Phase 4 can focus on flagship proof and visuals without reopening the homepage release path, but it still needs a plan breakdown before execution.

## Self-Check: PASSED

---
*Phase: 03-homepage-positioning*
*Completed: 2026-03-09*
