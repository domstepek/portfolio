---
id: M006
provides:
  - Title-cased project names across all domain data files
  - Restructured flagship card layout with stack tags under title, header/body separator, accent-bordered section labels, and ›-prefixed list items
  - `.flagship-list` CSS class for custom list styling within `.site-main` scope
key_decisions:
  - "D052: `.site-main .flagship-list` selector (specificity 0,2,0) overrides `.site-main ul` (0,1,1) — avoids !important"
  - "D053: Title-case convention for all domain project titles (acronyms preserved, prepositions lowercase)"
patterns_established:
  - Title-case convention for all project titles in domain data files
  - `.flagship-list` CSS class for custom list styling within `.site-main` scope
  - Accent left border on section labels via inline Tailwind classes
observability_surfaces:
  - none
requirement_outcomes: []
duration: ~20m
verification_result: passed
completed_at: 2026-03-13
---

# M006: UI Polish — Domain Pages & Typography

**Title-cased all project names, surfaced stack tags under titles, and restructured flagship cards with visual separators, accent-bordered section labels, and ›-prefixed list items for scannable domain proof pages.**

## What Happened

S01 (the only slice) executed in two tasks. T01 edited 13 title strings across `product.ts`, `analytics-ai.ts`, and `developer-experience.ts` from sentence case to title case — preserving acronyms (CLI, CMS, CDN, SSO, CDK-EKS, MCP, API), lowercase prepositions, and proper nouns. Eight titles were already correct and left unchanged.

T02 restructured the flagship `<article>` cards in `DomainProofPage.tsx`: moved stack tags from the card bottom into the header directly after `<h3>`, added a `border-t` separator between header and content body, applied `border-l-2 border-[var(--accent)] pl-2` to section label `<p>` elements (Problem, Constraints, Decisions, Outcomes), and added the `flagship-list` class to section `<ul>` elements. Three CSS rule blocks were added to `globals.css` for `.site-main .flagship-list` providing `list-style: none`, `padding-left: 0`, `gap: 0.5rem`, flex layout on `li` elements, and a `›` prefix via `::before` pseudo-element colored with `var(--accent)`.

The milestone was a single-slice, purely presentational pass — no data model changes, no new components, no routing changes, no DOM marker contract changes.

## Cross-Slice Verification

Each success criterion from the roadmap was verified:

1. **Title-cased project names** — Confirmed via grep across all three data files: "Sample Tracking", "Supply Chain Forecasting", "Charla.cc", "Collection Curator", "MCP Tools & Agent Demo", "Bedrock Utilities in Datalabs API", "Monorepo Template", "Global Design System", "Product Team CLI", "Product Migration Scripts", "CDK-EKS Contributions", "Stargazer Applications", "SSO Reverse Proxy", "Pricing App", "CMS", "Private CDN", "Superset on Stargazer", "Umami", "Developer Experience". No sentence-case titles remain.

2. **Stack tags under h3** — `DomainProofPage.tsx` renders `flagship.stack.map((tag) => ...)` immediately after the `<h3>` title, before the role line.

3. **› prefix markers on list items** — `.site-main .flagship-list li::before { content: '›'; color: var(--accent); }` in `globals.css`; `flagship-list` class applied to all constraints/decisions/outcomes `<ul>` elements.

4. **Accent-bordered section labels** — All four section label `<p>` elements have `border-l-2 border-[var(--accent)] pl-2` classes in `DomainProofPage.tsx`.

5. **Header/body separator** — `<div className="border-t border-[var(--border)]" />` renders between the card header and content body.

6. **18 Playwright tests pass** — `npx playwright test` → 18 passed (7.5s). All gate, public, shader, and gallery/mermaid tests green.

7. **`next build` succeeds** — All 8 routes generated, exit 0.

8. **Visual inspection** — S01 summary confirms visual inspection of `/domains/product`, `/domains/analytics-ai`, `/domains/developer-experience` at desktop and mobile viewports — all 6 card layout must-haves render correctly.

## Requirement Changes

No requirements changed status during M006. All 20 requirements were already validated before this milestone began. M006 was a visual polish pass improving the R003 proof surface without altering any capability contracts.

## Forward Intelligence

### What the next milestone should know
- The domain proof pages are now fully polished — titles, layout, and list styling are production-ready
- All 20 requirements are validated; the project has no active requirements remaining
- Pending manual steps from M005 remain: Vercel env var setup (`GATE_HASH`), GitHub secrets for CI, and DNS migration from GitHub Pages

### What's fragile
- `.flagship-list` CSS specificity depends on being nested under `.site-main` — if `.site-main` is removed or renamed, the override chain breaks
- Inline Tailwind classes on section labels reference `var(--accent)` — if the CSS custom property is renamed, section label borders lose their color

### Authoritative diagnostics
- Playwright tests (18) exercise the DOM marker contract and prove no structural regressions
- CSS specificity is verifiable via browser dev tools computed styles on `.flagship-list` elements

### What assumptions changed
- No assumptions changed — the milestone executed exactly as planned with no deviations

## Files Created/Modified

- `src/data/domains/product.ts` — title-cased 3 project titles
- `src/data/domains/analytics-ai.ts` — title-cased 3 project titles
- `src/data/domains/developer-experience.ts` — title-cased domain title + 7 project titles
- `src/components/domains/DomainProofPage.tsx` — moved stack tags into header, added separator div, accent-bordered section labels, `flagship-list` class on `<ul>` elements
- `src/app/globals.css` — added `.site-main .flagship-list`, `.site-main .flagship-list li`, `.site-main .flagship-list li::before` rule blocks
