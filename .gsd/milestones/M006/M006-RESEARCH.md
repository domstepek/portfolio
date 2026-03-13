# M006: UI Polish — Domain Pages & Typography — Research

**Date:** 2026-03-13

## Summary

This milestone is a contained presentational polish pass on the domain proof pages. There are no architectural changes, no new components, no routing changes, and no data model changes. The work touches three file groups: data files (title casing), one React server component (`DomainProofPage.tsx`), and one CSS file (`globals.css`). All 18 Playwright tests use `data-*` attribute selectors — none match on text content — so title case changes are risk-free for the test suite.

The current `DomainProofPage.tsx` is a ~160-line pure RSC that renders flagship cards with a flat `flex flex-col gap-4` layout. Stack tags sit at the bottom of each card, section labels (`Problem`, `Constraints`, `Decisions`, `Outcomes`) are plain `<p>` elements with no visual weight, and list items are raw `<li>` elements inside unstyled `<ul>` containers. All changes are additive class additions and reordering of existing JSX blocks — no logic changes.

The safest approach is a single slice with 2-3 small tasks: (1) title-case all project titles in data files, (2) restructure `DomainProofPage.tsx` card layout (reorder stack tags, increase spacing, add separators, style section labels), (3) add `.flagship-list` CSS to `globals.css`. This is low-risk enough that a single slice with no more than three tasks should complete cleanly. Prove it by running `next build` and the full Playwright suite — no new tests needed since the DOM marker contract is unchanged.

## Recommendation

Ship as a single slice with 2-3 tasks. Task ordering: data file title fixes first (no dependencies, smallest blast radius), then component restructuring + CSS together (they reference each other). No new Playwright tests are needed — the existing 18 tests cover the DOM marker contract, and the visual changes don't alter that contract. Visual verification via dev server is sufficient for the styling changes.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Title casing logic | Manual string edits in data files | There are only ~20 titles across 3 files — no library needed, just careful manual edits. Proper nouns (CLI, CMS, CDN, SSO, CDK-EKS, MCP, API, Charla.cc) need specific casing, not a generic `toTitleCase()` function. |
| Custom list markers (›) | CSS `::marker` or `::before` pseudo-element | Use `list-style: none` + `::before` content for the `›` prefix — cleaner than injecting markers in JSX and keeps the data clean. |
| Section label accent border | Tailwind `border-l-2` utility | Already available in Tailwind v4 — no custom CSS needed for the accent left-border on section labels. |

## Existing Code and Patterns

- `src/components/domains/DomainProofPage.tsx` — The primary target. Pure RSC, ~160 lines. Card layout uses Tailwind flex utilities. Stack tags are rendered after outcomes (bottom of card). Section labels are plain `<p>` tags. Lists use `<ul>` with `flex flex-col gap-1 pl-4` — no list markers. Reorder stack tags to after `<h3>`, add separator, style labels, add `.flagship-list` class to section `<ul>` elements.
- `src/data/domains/product.ts` — 3 flagships ("Sample tracking", "Supply chain forecasting", "Charla.cc") + 2 supporting ("Pricing app", "CMS"). Title case needed on flagships and supporting items.
- `src/data/domains/analytics-ai.ts` — 1 flagship ("Collection curator") + 4 supporting ("MCP tools & agent demo", "Bedrock utilities in Datalabs API", "Superset on Stargazer", "Umami"). Title case needed.
- `src/data/domains/developer-experience.ts` — 2 flagships ("Monorepo template", "Global design system") + 6 supporting ("Product team CLI", "Product migration scripts", "CDK-EKS contributions", "Stargazer applications", "Private CDN", "SSO reverse proxy"). Title case needed. Note: domain title "Developer experience" → "Developer Experience".
- `src/data/domains/types.ts` — Type definitions. No changes needed — `title: string` is already flexible.
- `src/data/domains/domain-view-model.ts` — View model builder. Passes titles through unchanged. No changes needed.
- `src/app/globals.css` — 1337 lines. Contains `.site-main ul` defaults (`padding-left: 1.25rem`, `li + li { margin-top: 0.55rem }`). The `.flagship-list` class needs to override these defaults. Also has `.flagship__figure` / `.flagship__image` / `.flagship__caption` as existing flagship-scoped CSS.
- `src/app/layout.tsx` — Proof page renders inside `<main className="site-main shell">`, so `.site-main` default `ul` styles apply to flagship lists.
- `tests/e2e/gate.spec.ts` — Tests use `data-flagship-highlights`, `data-supporting-work`, `data-flagship`, `data-supporting-item` selectors. Zero text content matching. Safe.
- `tests/e2e/gallery.spec.ts` — Tests use `data-screenshot-gallery`, `data-gallery-init`, `data-mermaid-definition` selectors. Safe.

## Constraints

- **DOM marker contract must be preserved.** The following `data-*` attributes are consumed by tests: `data-route-visibility`, `data-protected-proof-state`, `data-visual-state`, `data-flagship-highlights`, `data-flagship`, `data-supporting-work`, `data-supporting-item`, `data-screenshot-gallery`, `data-gallery-init`, `data-mermaid-definition`. None of the M006 changes alter these attributes.
- **Tailwind v4 configuration.** The project uses `@import "tailwindcss"` + `@theme` in `globals.css` (no `tailwind.config.ts`). All Tailwind utilities are available by default. Custom CSS vars (`--accent`, `--border`, `--muted`, `--text`) are defined in `:root` and referenced via `var()` in both Tailwind arbitrary values and plain CSS.
- **`.site-main ul` inheritance.** Flagship lists sit inside `.site-main` which applies `padding-left: 1.25rem` and `li + li { margin-top: 0.55rem }`. The current code uses `pl-4` on `<ul>` and `gap-1` on flex container, which partially overrides defaults. The new `.flagship-list` class should explicitly set `list-style: none`, `padding-left: 0`, and use `::before` for the `›` marker to avoid style collisions.
- **No `tailwind.config.ts` file.** Tailwind v4 derives config from the CSS `@theme` block. Custom utilities like `.flagship-list` go in `globals.css` as plain CSS, not as Tailwind plugin extensions.

## Common Pitfalls

- **Title case edge cases with acronyms and proper nouns.** "CDK-EKS" stays "CDK-EKS", "CMS" stays "CMS", "SSO" stays "SSO", "CLI" stays "CLI", "CDN" stays "CDN", "MCP" stays "MCP", "API" stays "API", "Charla.cc" stays "Charla.cc", "Umami" stays "Umami". These are already correct in the data files — only the first letter of sentence-cased titles needs capitalizing. A blanket `toTitleCase()` function would break these.
- **`.site-main` specificity conflicts.** The `.flagship-list` CSS must have equal or higher specificity than `.site-main ul` and `.site-main li + li`. Using `.flagship-list` as a class selector is sufficient since the existing rules use element selectors or `:where()` (which has zero specificity). Test by inspecting in dev tools.
- **`::before` marker with flex layout.** The current lists use `flex flex-col` on the `<ul>`. Adding `::before` pseudo-elements on `<li>` items within a flex column will work naturally — each `<li>` is a flex item and the `::before` is inline content within it. However, if list items need the marker visually aligned left of the text, use `display: flex; gap: 0.5rem` on each `<li>` with `::before` as flex content, or use padding-left + negative text-indent.
- **Card padding increase (`p-6` → `p-8`).** Increasing padding on flagship cards could push content wider on small screens. Verify at mobile viewport (~375px) that cards don't overflow.

## Open Risks

- **Visual regression without visual tests.** No Playwright visual comparison tests exist. The styling changes could introduce unintended visual effects (e.g., the accent border clashing with the card border, the separator looking too heavy). Mitigate by visually inspecting all three domain pages in the dev server before finishing.
- **Supporting work titles.** The context mentions title-casing "all flagship and supporting work titles" but some supporting items are phrases, not proper nouns (e.g., "Product migration scripts", "Stargazer applications"). These should still get title case since they're card titles, not sentence-case descriptions.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Tailwind CSS | `josiahsiegel/claude-plugin-marketplace@tailwindcss-advanced-layouts` | available (2.3K installs) |
| Tailwind CSS | `giuseppe-trisciuoglio/developer-kit@tailwind-css-patterns` | available (1.8K installs) |
| Next.js App Router | `wshobson/agents@nextjs-app-router-patterns` | available (8.2K installs) |
| Playwright | `bobmatnyc/claude-mpm-skills@playwright-e2e-testing` | available (1.2K installs) |
| Frontend Design | `frontend-design` | installed |

No skill installation is recommended for M006. The work is straightforward Tailwind utility class changes and data file edits — the installed `frontend-design` skill covers the relevant patterns, and the changes are too targeted to benefit from general Next.js or Tailwind skills.

## Strategic Answers

**What should be proven first?** Title case data changes — zero risk, immediate visual improvement, and independent of the CSS/component work.

**What existing patterns should be reused?** The existing `DomainProofPage.tsx` layout structure. All changes are additive (new classes, reordered JSX blocks). The existing `.flagship__figure`/`.flagship__image`/`.flagship__caption` naming pattern should inform the `.flagship-list` naming.

**What boundary contracts matter?** Only the DOM marker contract (`data-*` attributes). All 18 Playwright tests use these selectors exclusively — no text matching. The contract is unchanged by M006.

**What constraints does the existing codebase impose?** `.site-main` default styles on `ul`/`li` elements, Tailwind v4 `@theme` configuration (no config file), and the server component constraint (no client-side logic in `DomainProofPage.tsx`).

**Are there known failure modes that should shape slice ordering?** No. This is purely presentational work with no runtime behavior changes. A single slice ordered data-first, then component+CSS is sufficient.

**Requirement analysis:** No active requirements exist (all 20 are validated). M006 is an incremental polish pass that improves the R003 (substantive proof) surface without changing any contracts. No new requirements are needed — the milestone's own acceptance criteria (title case, stack tag position, list markers, section labels, separators) are sufficient. No candidate requirements to surface.

## Sources

- Codebase exploration: `src/components/domains/DomainProofPage.tsx`, `src/data/domains/*.ts`, `src/app/globals.css`, `tests/e2e/*.spec.ts` (direct file reads)
- Tailwind v4 configuration pattern: `@import "tailwindcss"` + `@theme` block in `globals.css` (no external config file)
- DOM marker contract: M002/D015 decision register and test file selectors
