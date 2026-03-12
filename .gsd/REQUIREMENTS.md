# Requirements

This file is the explicit capability and coverage contract for the project.

Use it to track what is actively in scope, what has been validated by completed work, what is intentionally deferred, and what is explicitly out of scope.

## Active

### R102 - Domain portfolio pages require a passcode before protected proof is shown
- Class: compliance/security
- Status: active
- Description: Visitors who open `/domains/*` see a gate state until they enter the correct passcode.
- Why it matters: The portfolio proof layer should be intentionally access-controlled without taking the whole site private.
- Source: user
- Primary owning slice: M002/S01
- Supporting slices: M002/S02, M002/S03, M002/S04
- Validation: mapped
- Notes: Because the site is static on GitHub Pages, this is a lightweight deterrent rather than strong security.

## Validated

### R103 — Protected routes explain how to request access
- Class: primary-user-loop
- Status: validated
- Description: The gate state on protected domain routes tells visitors to DM or email for the password and includes the relevant contact/outbound links.
- Why it matters: Access control without a clear request path creates dead ends for legitimate viewers.
- Source: user
- Primary owning slice: M002/S02
- Supporting slices: M002/S04
- Validation: validated
- Notes: Proven in S02 by static assertions for canonical email/LinkedIn links, browser cold-load tests for request-access panel, and the dist validator enforcing messaging in built HTML.

### R104 — Unlock persists for the current browser session across protected routes
- Class: continuity
- Status: validated
- Description: After entering the correct passcode once, visitors can navigate across protected domain routes during the current session without re-entering it on each page.
- Why it matters: The protected portfolio should still feel usable once access is granted.
- Source: user
- Primary owning slice: M002/S02
- Supporting slices: M002/S04
- Validation: validated
- Notes: Proven in S02 by real browser tests covering correct-passcode unlock, cross-route carryover in the same context (sessionStorage + localStorage bridge), and fresh-context relock.

### R105 — Protected visuals are obscured until unlock and clear after unlock
- Class: differentiator
- Status: validated
- Description: Portfolio images or proof visuals on protected domain pages stay blurred or otherwise obscured before unlock and render normally after unlock.
- Why it matters: The gate needs to protect the proof layer consistently, not just hide text behind a password field.
- Source: user
- Primary owning slice: M002/S03
- Supporting slices: M002/S04
- Validation: validated
- Notes: Proven in S03 by dist validator confirming no proof images/gallery markup in cold-load HTML, browser tests confirming `data-visual-state` transitions from absent (cold-load) through `revealing` to `revealed` after unlock, screenshot gallery rendering and JS initialization after dynamic mount, and public route isolation from visual-state markers.

### R101 - Public pages stay directly accessible
- Class: primary-user-loop
- Status: validated
- Description: Visitors can open `/`, `/about/`, and `/resume/` without entering a passcode.
- Why it matters: The site still needs a public top layer for discovery, recruiting, and first-contact flow.
- Source: user
- Primary owning slice: M002/S01
- Supporting slices: M002/S04
- Validation: validated
- Notes: Proven in S01 by built-artifact checks, real-browser cold-load verification, and the release-gated route-boundary validator.

### R001 - Public homepage explains Dom's scope and routes visitors into the site
- Class: primary-user-loop
- Status: validated
- Description: Visitors can understand Dom's work from the homepage and navigate into the main site surfaces.
- Why it matters: The homepage is the first-read layer for recruiting and collaborator discovery.
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: none
- Validation: validated
- Notes: Proven in shipped M001 homepage work and dist-first validation.

### R002 - Domain-first portfolio information architecture exists
- Class: core-capability
- Status: validated
- Description: The site organizes portfolio content by domains rather than a flat project gallery.
- Why it matters: This is the central positioning choice of the portfolio.
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: M001/S03, M001/S04
- Validation: validated
- Notes: Five domain routes are shipped and linked from the homepage.

### R003 - Domain pages provide substantive proof
- Class: core-capability
- Status: validated
- Description: Domain pages include supporting work plus flagship proof with role, decisions, outcomes, stack, and visuals where useful.
- Why it matters: The site needs real evidence, not just abstract positioning.
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: M001/S02
- Validation: validated
- Notes: Shipped in M001 with ten flagship stories across five domains.

### R004 - The site ships as a static, deployable, validated web property
- Class: launchability
- Status: validated
- Description: The site builds as a static Astro site on GitHub Pages with metadata, 404 handling, custom domain support, and release validation gates.
- Why it matters: The portfolio must be dependable and shareable in its deployed form.
- Source: user
- Primary owning slice: M001/S01
- Supporting slices: M001/S06
- Validation: validated
- Notes: Proven by build pipeline, GitHub Pages deployment path, and six phase validators.

### R005 - Public personal context is available on the site
- Class: core-capability
- Status: validated
- Description: Visitors can read the about surface, understand how Dom works, and access the resume from the site.
- Why it matters: Public identity and contact framing should not depend on deep portfolio access.
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: none
- Validation: validated
- Notes: `/about/` and `/resume/` are already public and will stay public in M002.

### R006 - Lightweight notes are available as a public secondary surface
- Class: differentiator
- Status: validated
- Description: Visitors can browse a notes index and open individual note pages.
- Why it matters: This adds depth beyond the main portfolio surfaces.
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: none
- Validation: validated
- Notes: Notes remain outside the current M002 protection scope.

### R007 - The site has a distinctive retro terminal visual identity
- Class: differentiator
- Status: validated
- Description: The shipped site uses a dark retro terminal aesthetic with typography and styling consistent across surfaces.
- Why it matters: The visual system helps the site feel memorable without becoming gimmicky.
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: M001/S04, M001/S05
- Validation: validated
- Notes: M002 should preserve this aesthetic in the gate experience.

## Deferred

### R201 - Standalone flagship case-study pages
- Class: differentiator
- Status: deferred
- Description: Visitors can open standalone deep-dive pages for flagship projects when inline domain coverage is no longer enough.
- Why it matters: This may become necessary as the proof layer grows beyond the current domain-page structure.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Migrated from legacy deferred scope.

### R202 - Cross-domain case-study navigation
- Class: differentiator
- Status: deferred
- Description: Visitors can navigate between related flagship case studies across domains.
- Why it matters: This would improve depth and discoverability in a larger portfolio surface.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Migrated from legacy deferred scope.

### R203 - Broader supporting-work archive
- Class: core-capability
- Status: deferred
- Description: Visitors can browse a broader archive of supporting work beyond the current curated highlights.
- Why it matters: This supports future expansion without forcing it into M002.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Migrated from legacy deferred scope.

### R204 - Notes taxonomy and browsing by tag or theme
- Class: differentiator
- Status: deferred
- Description: Visitors can browse notes by theme or tag as the writing library grows.
- Why it matters: Useful later if the notes surface expands materially.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Migrated from legacy deferred scope.

## Out of Scope

### R301 - Strong backend or edge authentication for portfolio access
- Class: anti-feature
- Status: out-of-scope
- Description: M002 does not introduce server-backed auth, edge auth, or a hosted identity layer in front of the site.
- Why it matters: The site is deployed as a static GitHub Pages property, and the chosen milestone is a lightweight deterrent gate rather than a full auth system.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Revisit only if the hosting model changes.

### R302 - Making the whole site private
- Class: anti-feature
- Status: out-of-scope
- Description: Home, about, and resume do not move behind the passcode gate.
- Why it matters: This prevents scope drift away from the public-first recruiting and discovery layer.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Explicitly confirmed during M002 discussion.

### R303 - Protecting notes in M002
- Class: anti-feature
- Status: out-of-scope
- Description: `/notes/*` remains outside the protected-route scope for this milestone.
- Why it matters: Keeps M002 focused on the portfolio proof layer instead of broadening to all deeper content.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Notes can be revisited later if desired.

## Traceability

| ID | Class | Status | Primary owner | Supporting | Proof |
|---|---|---|---|---|---|
| R101 | primary-user-loop | validated | M002/S01 | M002/S04 | validated |
| R102 | compliance/security | active | M002/S01 | M002/S02, M002/S03, M002/S04 | mapped |
| R103 | primary-user-loop | validated | M002/S02 | M002/S04 | validated |
| R104 | continuity | validated | M002/S02 | M002/S04 | validated |
| R105 | differentiator | validated | M002/S03 | M002/S04 | validated |
| R001 | primary-user-loop | validated | M001/S03 | none | validated |
| R002 | core-capability | validated | M001/S02 | M001/S03, M001/S04 | validated |
| R003 | core-capability | validated | M001/S04 | M001/S02 | validated |
| R004 | launchability | validated | M001/S01 | M001/S06 | validated |
| R005 | core-capability | validated | M001/S05 | none | validated |
| R006 | differentiator | validated | M001/S05 | none | validated |
| R007 | differentiator | validated | M001/S03 | M001/S04, M001/S05 | validated |
| R201 | differentiator | deferred | none | none | unmapped |
| R202 | differentiator | deferred | none | none | unmapped |
| R203 | core-capability | deferred | none | none | unmapped |
| R204 | differentiator | deferred | none | none | unmapped |
| R301 | anti-feature | out-of-scope | none | none | n/a |
| R302 | anti-feature | out-of-scope | none | none | n/a |
| R303 | anti-feature | out-of-scope | none | none | n/a |

## Coverage Summary

- Active requirements: 1
- Mapped to slices: 2
- Validated: 11
- Unmapped active requirements: 0
