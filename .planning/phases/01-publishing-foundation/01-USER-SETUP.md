# Phase 01: User Setup Required

**Generated:** 2026-03-09
**Phase:** 01-publishing-foundation
**Status:** Complete

This setup is complete for the current GitHub Pages project-site deployment at `https://domstepek.github.io/website/`.

## Environment Variables

These variables are optional. The workflow already defaults to the standard project-site shape of `https://{owner}.github.io/{repo}` with base path `/{repo}`.

| Status | Variable | Source | Add to |
|--------|----------|--------|--------|
| n/a | `PUBLIC_SITE_URL` (optional) | Not needed for the current `https://domstepek.github.io/website/` deployment | GitHub repository -> Settings -> Secrets and variables -> Actions -> Variables |
| n/a | `PUBLIC_BASE_PATH` (optional) | Not needed while the site stays on the default `/{repo}` GitHub Pages path | GitHub repository -> Settings -> Secrets and variables -> Actions -> Variables |

## Account Setup

- [x] **Reconnect this local repository to the final GitHub remote or create it first**
  - URL: https://github.com/new
  - Skip if: `git remote -v` already points at the repository you want to publish from

## Dashboard Configuration

- [x] **Confirm GitHub Pages publishes from GitHub Actions**
  - Location: GitHub repository -> Settings -> Pages
  - Set to: Source = `GitHub Actions`
  - Notes: The workflow deploys `dist` only after `pnpm astro check`, `pnpm astro build`, and `pnpm validate:phase1` pass.

- [x] **No Pages override variables are needed for the current project-site shape**
  - Location: GitHub repository -> Settings -> Secrets and variables -> Actions -> Variables
  - Set to: Leave `PUBLIC_SITE_URL` and `PUBLIC_BASE_PATH` unset unless the site moves to a custom origin or `/` base path later.
  - Notes: The current live deployment works at `https://domstepek.github.io/website/` without overrides.

- [x] **Trigger and confirm the first live deploy**
  - Location: Local git remote plus GitHub repository -> Actions
  - Set to: Push `main`, then confirm the `Deploy site` workflow succeeds
  - Notes: The published URL is `https://domstepek.github.io/website/`, which was used for the Phase 1 live checks in `01-VALIDATION.md`.

## Local Development Notes

- Local verification is already wired up through `pnpm astro check && pnpm astro build && pnpm validate:phase1`.
- If the final Pages target is a user site or custom domain, set the optional GitHub Actions variables above before rerunning the workflow so canonical URLs and asset paths match production.
- Future browser-accessible smoke checks for the live site should prefer `/agent-browser --native` before asking for human-only validation.

## Verification

After completing setup, verify with:

```bash
git remote -v
git push -u origin main
```

Expected results:
- `origin` points at the intended GitHub repository.
- Pushing `main` triggers the `Deploy site` workflow and GitHub Pages reports a published URL.
- The manual QA checklist in `01-VALIDATION.md` can be completed against that live URL.
- The current published URL is `https://domstepek.github.io/website/`.

---

**Current state:** Complete for the project-site deployment. Revisit this file only if the site moves to a custom domain or root-base Pages setup later.
