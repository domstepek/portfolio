---
phase: 2
slug: domain-hubs-supporting-work
status: planned
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-09
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | other - Astro compiler checks, production build validation, Node artifact assertions, and `/agent-browser --native` smoke checks against the built or deployed site |
| **Config file** | `package.json`, `astro.config.mjs`, `scripts/validate-phase1.mjs`, `scripts/validate-phase2.mjs` (to be introduced in this phase) |
| **Quick run command** | `pnpm astro check && pnpm astro build` |
| **Full suite command** | `pnpm astro check && pnpm astro build && pnpm validate:phase1 && pnpm validate:phase2` |
| **Estimated runtime** | ~30 seconds once `validate:phase2` exists |

---

## Sampling Rate

- **After every completed task until `validate:phase2` exists:** Run `pnpm astro check && pnpm astro build`
- **After the task that introduces `validate:phase2` and after each later task:** Run `pnpm astro check && pnpm astro build && pnpm validate:phase1 && pnpm validate:phase2`
- **After every plan wave:** Run the full suite command available at that point in the phase
- **Before `$gsd-verify-work`:** Full suite must be green, then use `/agent-browser --native` for browser-accessible route and proof-link smoke checks before reserving subjective checks to the manual checklist below
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

This map is the planning-time validation contract for Phase 2. The plan and wave columns now match the approved `02-01` through `02-03` breakdown.

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | DOMN-01 | static | `pnpm astro check` | `src/data/domains/index.ts` | ⬜ pending |
| 2-01-02 | 01 | 1 | DOMN-01 | build | `pnpm astro check && pnpm astro build` | `dist/domains/analytics/index.html` plus the other 4 domain artifacts | ⬜ pending |
| 2-01-03 | 01 | 1 | DOMN-04 | build | `pnpm astro check && pnpm astro build` | `src/components/domains/DomainPage.astro` | ⬜ pending |
| 2-02-01 | 02 | 2 | DOMN-02 | static | `pnpm astro check` | `src/data/domains/analytics.ts` plus the other 4 domain modules | ⬜ pending |
| 2-02-02 | 02 | 2 | DOMN-03 | build | `pnpm astro check && pnpm astro build` | `src/components/domains/DomainPage.astro` | ⬜ pending |
| 2-02-03 | 02 | 2 | DOMN-04 | build | `pnpm astro check && pnpm astro build` | `src/styles/global.css` | ⬜ pending |
| 2-03-01 | 03 | 3 | DOMN-01 | artifact | `pnpm astro check && pnpm astro build && pnpm validate:phase2` | `scripts/validate-phase2.mjs` | ⬜ pending |
| 2-03-02 | 03 | 3 | DOMN-03 | artifact | `pnpm astro check && pnpm astro build && pnpm validate:site` | `package.json` | ⬜ pending |
| 2-03-03 | 03 | 3 | DOMN-04 | config | `pnpm astro check && pnpm astro build && pnpm validate:site` | `.github/workflows/deploy.yml` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None expected. Phase 1 already provides the baseline validation tooling:

- `pnpm astro check`
- `pnpm astro build`
- `scripts/validate-phase1.mjs`

Phase 2 should add `scripts/validate-phase2.mjs` and the matching package script during normal execution rather than through a separate setup wave.

---

## Manual-Only Verifications

These are the subjective and browser-level checks that should happen after the automated artifact gates are green.

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Each domain thesis clearly feels distinct from adjacent domains | DOMN-02 | Boundary clarity is a content judgment, not just a structural assertion | Open all five routes, read the thesis and scope line on each page, and confirm the difference between `analytics`, `infrastructure`, `ai / ml`, `product`, and `developer experience` is obvious without reading deeply |
| Supporting-work sections scan quickly without turning into dense prose | DOMN-03 | Scannability and pacing depend on real copy rhythm and spacing | Review each page on mobile and desktop widths and confirm supporting entries are easy to skim in one glance |
| Back-home path and proof links feel obvious in the page flow | DOMN-04 | Presence can be automated, but prominence and clarity still need a browser check | Open each route, use the explicit top `back home` link, then open at least one proof link per page and confirm both actions feel natural |
| Keyboard focus remains obvious across the new routes | DOMN-04 | Focus visibility and flow are best confirmed in-browser | Tab through the page from the browser chrome, verify the skip link, back-home link, internal cross-links, and proof links all receive visible focus treatment |

Use `/agent-browser --native` first when browser-accessible smoke checks are available.

---

## Validation Sign-Off

- [x] All tasks have `<verify>` coverage or a clearly mapped manual-only check
- [x] Sampling continuity: no 3 consecutive tasks without automated verification
- [x] Wave 0 dependencies are not required
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter after the final plan/task mapping is filled in

**Approval:** planned 2026-03-09
