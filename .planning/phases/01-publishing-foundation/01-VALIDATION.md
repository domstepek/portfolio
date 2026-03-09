---
phase: 1
slug: publishing-foundation
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-09
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | other - Astro compiler checks, production build validation, Node artifact assertions, and `/agent-browser --native` smoke checks against the deployed site |
| **Config file** | `package.json`, `astro.config.mjs`, `scripts/validate-phase1.mjs` (introduced by `01-03`), optional `playwright.config.ts` |
| **Quick run command** | `pnpm astro check && pnpm astro build` |
| **Full suite command** | `pnpm astro check && pnpm astro build && pnpm validate:phase1` (available after `01-03`) |
| **Estimated runtime** | ~30 seconds once `01-03` lands; quicker in earlier waves |

---

## Sampling Rate

- **After each completed task in `01-01` and `01-02`:** Run `pnpm astro check && pnpm astro build`
- **After wave 1 (`01-01`) and wave 2 (`01-02`):** Run `pnpm astro check && pnpm astro build`
- **After `01-03` Task 1 and after remaining wave 3 tasks:** Run `pnpm astro check && pnpm astro build && pnpm validate:phase1`
- **Before `$gsd-verify-work`:** Full suite must be green, then use `/agent-browser --native` for browser-accessible live checks before reserving any remaining human-only validation to the checklist below
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

The map below is the planning-time contract for Phase 1. Wave numbers match the approved plans directly: `01-01` -> wave 1, `01-02` -> wave 2, `01-03` -> wave 3. Each requirement keeps at least one automated verification path, with live Pages behavior handled separately as a phase-gate manual check.

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | QUAL-01 | build | `pnpm astro check && pnpm astro build` | `dist/index.html` | ✅ green |
| 1-01-02 | 01 | 1 | QUAL-01 | config | `pnpm astro build` | `astro.config.mjs` | ✅ green |
| 1-01-03 | 01 | 1 | QUAL-04 | static | `pnpm astro check` | `src/lib/paths.ts` | ✅ green |
| 1-02-01 | 02 | 2 | QUAL-03 | static | `pnpm astro check && pnpm astro build` | `src/components/layout/BaseLayout.astro` | ✅ green |
| 1-02-02 | 02 | 2 | QUAL-02 | static | `pnpm astro check && pnpm astro build` | `src/styles/global.css` | ✅ green |
| 1-02-03 | 02 | 2 | QUAL-04 | build | `pnpm astro build` | `dist/404.html` | ✅ green |
| 1-03-01 | 03 | 3 | QUAL-04 | artifact | `pnpm astro check && pnpm astro build && pnpm validate:phase1` | `scripts/validate-phase1.mjs` | ✅ green |
| 1-03-02 | 03 | 3 | QUAL-01 | config | `test -f .github/workflows/deploy.yml` | `.github/workflows/deploy.yml` | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None. Phase 1 introduces its validation tooling during normal execution:

- `01-01` creates the Astro workspace and the baseline `astro check` / `astro build` commands
- `01-02` creates the layout, pages, and shared assets that later validation inspects
- `01-03` creates `scripts/validate-phase1.mjs`, adds the `validate:phase1` script, and writes `.github/workflows/deploy.yml`
- `playwright.config.ts` and `tests/smoke.spec.ts` remain optional only if browser-level smoke coverage is added

---

## Manual-Only Verifications

These are phase-gate checks after wave 3 and after the repository has a working GitHub Pages deployment target. Use `/agent-browser --native` first for browser-addressable checks like loading the live page, inspecting source, and confirming the hosted `404`. Reserve human-only validation for subjective checks like reading comfort and keyboard-flow feel.

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| GitHub Pages workflow publishes a live site | QUAL-01 | Requires a real GitHub repository, Pages settings, and a completed hosted workflow run | After pushing the Phase 1 changes to the configured GitHub repository, confirm the latest Pages workflow succeeds and exposes the expected Pages URL |
| Deployed homepage resolves correctly from the real GitHub Pages base path | QUAL-01 | Local preview can miss project-site base-path regressions | Open the deployed homepage at the final Pages URL and confirm styles, icons, and internal links load without broken paths |
| Custom 404 page renders under the deployed base path | QUAL-04 | GitHub Pages 404 behavior must be confirmed on the hosted site | Visit a nonexistent route under the deployed base path and confirm the custom `404` page appears with a working home link |
| Mobile and desktop reading quality feels comfortable | QUAL-02 | Readability and spacing quality are visual and contextual | Check narrow mobile and wide desktop widths for readable line length, spacing, and link tap targets |
| Keyboard navigation, skip link, and focus states are usable | QUAL-03 | Accessibility smoke checks still need human confirmation | Tab from the browser chrome into the page, activate the skip link, and verify visible focus treatment across links |
| Metadata is correct in the built and deployed output | QUAL-04 | Social preview and canonical correctness need source inspection | Inspect the homepage source and confirm non-empty title, description, canonical URL, `og:title`, `og:description`, `og:image`, and favicon references; inspect the 404 page source and confirm `noindex` is present |

Phase 1 sign-off completed against `https://domstepek.github.io/website/`.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or an explicitly mapped phase-gate manual check
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] No separate Wave 0 dependencies remain; validation producers are mapped to plans `01-01` through `01-03`
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved
