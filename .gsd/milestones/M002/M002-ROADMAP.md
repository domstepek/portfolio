# M002: Portfolio Access Gate

**Vision:** Keep the site’s public top layer open for discovery while putting the deeper domain portfolio proof behind a lightweight passcode gate that works within the existing static GitHub Pages architecture.

## Success Criteria

- Visitors can open `/`, `/about/`, and `/resume/` directly with no passcode prompt.
- Visitors who open `/domains/*` without access see a clear gate state telling them how to request the password.
- Entering the correct passcode once unlocks protected domain pages for the rest of the current browser session.
- Protected visuals on domain pages stay obscured before unlock and render normally after unlock.
- Verification proves both the public-route behavior and the protected-route unlock flow without regressing the shipped site.

## Key Risks / Unknowns

- Static passcode protection is not strong security — the milestone must implement the right deterrent level without pretending otherwise.
- Route-splitting mistakes could accidentally gate public pages or leak protected proof pages.
- Client-side unlock state and protected-visual reveal need runtime verification, not just static artifact checks.

## Proof Strategy

- Static-site protection scope and public/protected route split → retire in S01 by proving public routes stay open while protected domain routes render a gate state.
- Usable protected access flow → retire in S02 by proving a single correct unlock enables session-scoped navigation across protected routes.
- Visual protection correctness → retire in S03 by proving protected images stay obscured before unlock and clear after unlock.
- End-to-end confidence and regression coverage → retire in S04 by proving the assembled flow in browser verification plus shipped validation coverage.

## Verification Classes

- Contract verification: route/component checks, storage-state checks, and artifact inspection for protected/public rendering rules.
- Integration verification: browser exercise of public pages, cold-load protected pages, unlock flow, and cross-route protected navigation.
- Operational verification: refresh/session behavior for the chosen session-scoped unlock model.
- UAT / human verification: visual tone and whether the gate copy feels clear and appropriately lightweight.

## Milestone Definition of Done

This milestone is complete only when all are true:

- Public routes and protected routes are split correctly and exercised explicitly.
- The gate experience, unlock flow, and protected visual behavior are all wired into the real domain pages.
- The real browser entrypoints are exercised for both locked and unlocked states.
- Success criteria are re-checked against live behavior, not just code artifacts.
- Verification coverage exists so future edits do not silently remove the gate or over-gate the public site.

## Requirement Coverage

- Covers: R101, R102, R103, R104, R105
- Partially covers: none
- Leaves for later: R201, R202, R203, R204
- Orphan risks: none

## Slices

- [x] **S01: Public vs Protected Route Boundary** `risk:high` `depends:[]`
  > After this: the site distinguishes public routes from protected domain routes, and a cold visit to `/domains/*` shows a real gate state instead of full portfolio proof.
- [x] **S02: Session Unlock Flow and Gate Messaging** `risk:medium` `depends:[S01]`
  > After this: a visitor can enter the passcode once, see clear contact-for-password messaging when locked, and browse protected domain pages for the current session.
- [x] **S03: Protected Visual Reveal** `risk:medium` `depends:[S02]`
  > After this: protected domain visuals stay obscured before unlock and render normally after unlock without changing the public pages.
- [ ] **S04: Verification and Regression Gate** `risk:low` `depends:[S01,S02,S03]`
  > After this: browser and validation coverage prove the full locked/unlocked flow and protect the public-route boundary from regressions.

## Boundary Map

### S01 → S02

Produces:
- protected-route boundary for `/domains/*`
- public-route allowlist for `/`, `/about/`, and `/resume/`
- shared locked-state rendering path for domain pages
- stable selectors or markers for locked-vs-unlocked verification

Consumes:
- existing `src/pages/domains/[slug].astro` route family
- existing public routes and path helpers

### S02 → S03

Produces:
- passcode entry flow
- session-scoped unlock state contract
- gate landing content with DM/email/outbound links
- unlocked rendering path shared across protected domain routes

Consumes:
- protected-route boundary and locked-state rendering from S01

### S03 → S04

Produces:
- protected-visual blur/obscure behavior while locked
- clear visual reveal behavior after unlock
- stable visual-state markers or DOM hooks for verification

Consumes:
- session unlock contract from S02
- protected domain rendering path from S01

### S01 → S04

Produces:
- public/protected route split invariants used by final verification

Consumes:
- nothing beyond the shipped M001 site structure

### S02 → S04

Produces:
- unlock/session continuity behavior used by final verification

Consumes:
- S01 boundary outputs

### S03 → S04

Produces:
- protected-visual behavior used by final verification

Consumes:
- S02 unlock state and S01 protected route rendering
