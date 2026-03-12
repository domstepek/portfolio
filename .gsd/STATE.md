# GSD State

**Active Milestone:** M002 — Portfolio Access Gate
**Active Slice:** None — S03 complete, S04 next
**Active Task:** None
**Phase:** S03 complete; ready for S04 (Verification and Regression Gate)

## Recent Decisions
- Use a simple static passcode gate instead of real auth because the site stays on GitHub Pages.
- Protect `/domains/*` only.
- Keep `/`, `/about/`, and `/resume/` public.
- Persist unlock state for the current browser session.
- Use stable public/protected boundary markers for route-split verification.
- Gate S01 with both built-artifact checks and a real browser cold-load test before deploy.
- Keep `/domains/[slug]` on a shared `DomainPage` seam with explicit gate states so locked cold loads and later unlocked renders reuse one route path.
- Extend `validate:site` with a fast locked-shell validator plus a warm-session browser unlock test before deploy.
- Implement the S02 unlock path with a build-time public hash, a versioned `sessionStorage` marker, and a shared client-renderable domain proof view.
- Use localStorage as a cross-tab bridge alongside sessionStorage for unlock carryover because sessionStorage is per-tab (per top-level browsing context).
- CSS-driven blur-to-clear reveal with `data-visual-state` markers (`revealing` → `revealed`) for proof mount transition.
- Gallery JS re-initialization via `astro:page-load` dispatch after dynamic proof mount.

## Blockers
- None

## Next Action
Start S04: Verification and Regression Gate — the final slice for M002.
