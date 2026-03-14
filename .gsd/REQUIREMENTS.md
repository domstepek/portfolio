# Requirements

This file is the explicit capability and coverage contract for the project.

Use it to track what is actively in scope, what has been validated by completed work, what is intentionally deferred, and what is explicitly out of scope.

## Active

### R501 — Global agent skill generates engineering journal entries from conversation context
- Class: core-capability
- Status: active
- Description: A SKILL.md file at `~/.agents/skills/engineering-journal/` (symlinked to GSD skills) reviews the current conversation context and generates a markdown journal entry in `src/content/notes/` with expanded frontmatter. The skill prompts the user for supporting evidence (screenshots, diagrams, video links).
- Why it matters: This is the primary deliverable — an agent skill that turns work sessions into publishable engineering journal articles without manual writing.
- Source: user
- Primary owning slice: M007/S02
- Supporting slices: none
- Validation: unmapped
- Notes: Skill must reference this repo's notes directory, frontmatter schema, and tone conventions.

### R502 — Expanded frontmatter schema for notes
- Class: core-capability
- Status: active
- Description: Notes frontmatter supports `title`, `summary`, `published`, `updated`, `tags[]`, `type` (note | journal), and `readTime` (auto-calculated). Existing notes migrated to the new schema with `type: 'note'`.
- Why it matters: Tags and type enable filtering and differentiation between short opinion notes and longer technical journal entries.
- Source: user
- Primary owning slice: M007/S01
- Supporting slices: M007/S02
- Validation: unmapped
- Notes: readTime calculated from word count at build time.

### R503 — Tag filtering on notes index page
- Class: core-capability
- Status: active
- Description: The `/notes` index page displays tags on each entry and supports client-side filtering by tag. Tags are clickable to filter the list.
- Why it matters: As journal entries accumulate, filtering by topic (e.g. #webgpu, #debugging, #nextjs) keeps the page navigable.
- Source: user
- Primary owning slice: M007/S01
- Supporting slices: none
- Validation: unmapped
- Notes: Client-side filtering via a small `'use client'` component; no server round-trip needed.

### R504 — Shiki syntax highlighting for code blocks in notes
- Class: quality-attribute
- Status: active
- Description: Code blocks in markdown notes render with Shiki syntax highlighting using a dark theme that matches the site's retro terminal aesthetic.
- Why it matters: Journal entries will contain code snippets; unformatted code blocks are unreadable on a dark background.
- Source: user
- Primary owning slice: M007/S01
- Supporting slices: none
- Validation: unmapped
- Notes: Use `@shikijs/rehype` plugin in the existing unified pipeline. Theme should complement the green-on-dark palette.

### R505 — Rich markdown rendering for journal content
- Class: quality-attribute
- Status: active
- Description: Notes/journal markdown renders images (with alt text and captions), blockquotes, inline code, tables, and horizontal rules with styling consistent with the site's retro terminal theme.
- Why it matters: Journal entries need richer content than the current short opinion notes — code, screenshots, diagrams.
- Source: user
- Primary owning slice: M007/S01
- Supporting slices: none
- Validation: unmapped
- Notes: Images stored in `public/notes/<slug>/` and referenced via relative markdown paths.

### R506 — Local media storage for journal supporting evidence
- Class: core-capability
- Status: active
- Description: Supporting evidence (screenshots, diagrams, photos) is stored in `public/notes/<slug>/` and referenced from markdown via standard image syntax. The skill creates the directory and instructs the user where to place files.
- Why it matters: Evidence makes journal entries credible and useful as reference material.
- Source: user
- Primary owning slice: M007/S02
- Supporting slices: M007/S01
- Validation: unmapped
- Notes: Video can be embedded via external links (YouTube, etc.) — not stored locally.

### R507 — Existing notes migrated to expanded schema
- Class: continuity
- Status: active
- Description: The two existing notes (`keep-the-path-explicit`, `systems-over-abstractions`) are updated with `type: 'note'` and appropriate tags, and continue to render correctly.
- Why it matters: Schema migration must not break existing content.
- Source: inferred
- Primary owning slice: M007/S01
- Supporting slices: none
- Validation: unmapped
- Notes: Existing Playwright tests for notes must continue to pass.

### R508 — Skill writes markdown file directly into repo
- Class: core-capability
- Status: active
- Description: The skill writes the generated journal entry as a `.md` file in `src/content/notes/` and tells the user to review it before committing.
- Why it matters: Reduces friction — the user reviews and edits, not creates from scratch.
- Source: user
- Primary owning slice: M007/S02
- Supporting slices: none
- Validation: unmapped
- Notes: Skill also creates `public/notes/<slug>/` directory for media if evidence is provided.

### R509 — Casual first-person engineering journal tone
- Class: quality-attribute
- Status: active
- Description: Journal entries use a casual first-person voice ("I ran into X, tried Y, here's what worked") consistent with the site's established tone (D031).
- Why it matters: The journal should feel authentic and match the existing site personality.
- Source: user
- Primary owning slice: M007/S02
- Supporting slices: none
- Validation: unmapped
- Notes: Inspired by engineering journal best practices from Stack Overflow Blog, reconfigured.io, and The Pragmatic Programmer.

### R510 — Existing Playwright tests continue to pass
- Class: continuity
- Status: active
- Description: All 18 existing Playwright tests pass after M007 changes.
- Why it matters: Enhanced rendering and schema changes must not break existing site functionality.
- Source: inferred
- Primary owning slice: M007/S01
- Supporting slices: none
- Validation: unmapped
- Notes: Tests cover gate, public pages, shader, and gallery/mermaid.

## Validated

### R401 — Custom faded dither GPU shader renders as ambient page background
- Class: differentiator
- Status: validated
- Description: A custom-written GPU shader (WebGPU primary, WebGL2 fallback) renders an animated faded dither pattern as a full-bleed background canvas behind page content on all pages.
- Why it matters: This adds a distinctive, technically impressive visual identity layer that reinforces the retro terminal aesthetic without relying on third-party shader libraries.
- Source: user
- Primary owning slice: M003/S01
- Supporting slices: M003/S02
- Validation: validated
- Notes: Proven by shader engine rendering on WebGPU with detection chain fallback, standalone demo page, and 3 browser contract tests in validate:site.

### R402 — Shader uses site accent color palette
- Class: quality-attribute
- Status: validated
- Description: The shader's color palette derives from the site's existing CSS custom properties (greens, muted dark tones from `--accent`, `--accent-strong`, `--bg`, `--bg-elevated`).
- Why it matters: The effect should feel cohesive with the site's retro terminal identity, not clash with it.
- Source: user
- Primary owning slice: M003/S01
- Supporting slices: none
- Validation: validated
- Notes: Colors read from CSS vars at init time via getComputedStyle, converted sRGB→linear.

### R403 — Shader reacts to cursor movement
- Class: differentiator
- Status: validated
- Description: The dither pattern responds subtly to mouse/pointer position — blobs shift, intensity changes, or patterns ripple near the cursor.
- Why it matters: Cursor reactivity adds an interactive dimension that rewards engagement.
- Source: user
- Primary owning slice: M003/S02
- Supporting slices: none
- Validation: validated
- Notes: pointermove listener normalizes coordinates and feeds setPointer(x, y) to shader uniform.

### R404 — Shader is present on all pages with per-page opt-out
- Class: core-capability
- Status: validated
- Description: The shader canvas renders site-wide via the shared layout, but individual pages can disable it via a prop or data attribute.
- Why it matters: Some pages may not benefit from the effect — the system must support easy selective disabling without code changes to the shader itself.
- Source: user
- Primary owning slice: M003/S02
- Supporting slices: none
- Validation: validated
- Notes: Proven by browser tests: shader present on homepage and about, absent on shader-demo (disableShader=true).

### R405 — WebGPU primary with WebGL2 fallback and graceful degradation
- Class: quality-attribute
- Status: validated
- Description: The shader runs on WebGPU where available, falls back to WebGL2 for older browsers, and degrades gracefully to the plain dark background when neither is available.
- Why it matters: ~75% of browsers support WebGPU; WebGL2 covers the rest. No visitor should see a broken page.
- Source: user
- Primary owning slice: M003/S01
- Supporting slices: M003/S03
- Validation: validated
- Notes: Detection chain WebGPU→WebGL2→null with data-shader-renderer attribute and console logging.

### R406 — Shader does not degrade page performance or accessibility
- Class: quality-attribute
- Status: validated
- Description: The shader respects `prefers-reduced-motion`, pauses when the tab is not visible, uses `requestAnimationFrame` properly, and does not cause layout shifts or block interaction.
- Why it matters: A background effect must not hurt usability, battery life, or accessibility.
- Source: inferred
- Primary owning slice: M003/S03
- Supporting slices: none
- Validation: validated
- Notes: prefers-reduced-motion freezes to static frame, visibilitychange pauses when hidden, canvas has pointer-events:none and aria-hidden.

### R407 — Existing test suite and validation gates continue to pass
- Class: continuity
- Status: validated
- Description: The full `pnpm validate:site` release gate must pass after shader integration.
- Why it matters: The shader is additive — it must not break existing site functionality.
- Source: inferred
- Primary owning slice: M003/S03
- Supporting slices: none
- Validation: validated
- Notes: pnpm validate:site passes with 23 total tests (20 existing + 3 new shader tests).

### R102 - Domain portfolio pages require a passcode before protected proof is shown
- Class: compliance/security
- Status: validated
- Description: Visitors who open `/domains/*` see a gate state until they enter the correct passcode.
- Why it matters: The portfolio proof layer should be intentionally access-controlled without taking the whole site private.
- Source: user
- Primary owning slice: M002/S01
- Supporting slices: M002/S02, M002/S03, M002/S04
- Validation: validated
- Notes: Proven by the assembled flow browser test (cold-lock → wrong-passcode error → correct unlock → visual reveal → cross-route carryover), 17 S01–S03 browser tests covering route boundaries, unlock mechanics, session persistence, visual reveal, and gate messaging, 3 dist validators enforcing static HTML contracts, and the full `pnpm validate:site` release gate chaining S01→S02→S03→S04 (20 tests total).

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
- Why it matters: The visual system helps the site feel memorable without becoming heavy.
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: M001/S04, M001/S05
- Validation: validated
- Notes: M003 shader should reinforce this aesthetic, not fight it.

### R301 - Server-side access control for portfolio gate
- Class: compliance/security
- Status: validated
- Description: The `/domains/*` gate uses server-side enforcement (Next.js middleware + HttpOnly cookie) so protected proof content is never sent to the client before authentication.
- Why it matters: The previous client-side SHA-256 model shipped proof content in the HTML — a determined reader could extract it. Server-side enforcement means the content is simply never in the response until auth.
- Source: user
- Primary owning slice: M005/S01
- Supporting slices: none
- Validation: validated
- Notes: Proven by M005/S01 Playwright tests: zero-leakage HTML assertion (test 2) confirms no proof content in unauthenticated responses; auth flow (test 4) confirms HttpOnly cookie + server-rendered proof; cross-route session (test 5) proves session persists without proof leakage. Was out-of-scope in M002 (static GitHub Pages); Vercel deployment via M005 removed that constraint.

## Deferred

### R201 - Standalone flagship case-study pages
- Class: differentiator
- Status: deferred
- Description: Visitors can open standalone deep-dive pages for flagship projects when inline domain coverage is no longer enough.
- Why it matters: This may become necessary as the proof layer grows beyond the current domain-page structure.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: validated
- Notes: Migrated from legacy deferred scope.

### R202 - Cross-domain case-study navigation
- Class: differentiator
- Status: deferred
- Description: Visitors can navigate between related flagship case studies across domains.
- Why it matters: This would improve depth and discoverability in a larger portfolio surface.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: validated
- Notes: Migrated from legacy deferred scope.

### R203 - Broader supporting-work archive
- Class: core-capability
- Status: deferred
- Description: Visitors can browse a broader archive of supporting work beyond the current curated highlights.
- Why it matters: This supports future expansion without forcing it into M002.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: validated
- Notes: Migrated from legacy deferred scope.

### R204 - Notes taxonomy and browsing by tag or theme
- Class: differentiator
- Status: validated
- Description: Visitors can browse notes by theme or tag as the writing library grows.
- Why it matters: Useful later if the notes surface expands materially.
- Source: user
- Primary owning slice: M007/S01
- Supporting slices: none
- Validation: validated
- Notes: Originally deferred; now delivered by M007/S01 tag filtering.

## Out of Scope

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

### R304 — Using a third-party shader library
- Class: anti-feature
- Status: out-of-scope
- Description: M003 does not use the `shaders` npm package or any other third-party GPU shader library.
- Why it matters: The user explicitly wants a custom-written shader — no library dependency for this effect.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: The effect is inspired by shaders.com presets but built from scratch.

## Traceability

| ID | Class | Status | Primary owner | Supporting | Proof |
|---|---|---|---|---|---|
| R401 | differentiator | validated | M003/S01 | M003/S02 | validated |
| R402 | quality-attribute | validated | M003/S01 | none | validated |
| R403 | differentiator | validated | M003/S02 | none | validated |
| R404 | core-capability | validated | M003/S02 | none | validated |
| R405 | quality-attribute | validated | M003/S01 | M003/S03 | validated |
| R406 | quality-attribute | validated | M003/S03 | none | validated |
| R407 | continuity | validated | M003/S03 | none | validated |
| R101 | primary-user-loop | validated | M002/S01 | M002/S04 | validated |
| R102 | compliance/security | validated | M002/S01 | M002/S02, M002/S03, M002/S04 | validated |
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
| R204 | differentiator | validated | M007/S01 | none | validated |
| R301 | compliance/security | validated | M005/S01 | none | validated |
| R302 | anti-feature | out-of-scope | none | none | n/a |
| R303 | anti-feature | out-of-scope | none | none | n/a |
| R304 | anti-feature | out-of-scope | none | none | n/a |
| R501 | core-capability | active | M007/S02 | none | unmapped |
| R502 | core-capability | active | M007/S01 | M007/S02 | unmapped |
| R503 | core-capability | active | M007/S01 | none | unmapped |
| R504 | quality-attribute | active | M007/S01 | none | unmapped |
| R505 | quality-attribute | active | M007/S01 | none | unmapped |
| R506 | core-capability | active | M007/S02 | M007/S01 | unmapped |
| R507 | continuity | active | M007/S01 | none | unmapped |
| R508 | core-capability | active | M007/S02 | none | unmapped |
| R509 | quality-attribute | active | M007/S02 | none | unmapped |
| R510 | continuity | active | M007/S01 | none | unmapped |

## Coverage Summary

- Active requirements: 10
- Mapped to slices: 10
- Validated: 21
- Unmapped active requirements: 0
