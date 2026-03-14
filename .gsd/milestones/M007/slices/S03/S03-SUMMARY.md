---
id: S03
parent: M007
milestone: M007
provides:
  - renderInlineMarkdown shared helper (sync unified pipeline in src/lib/markdown.ts)
  - DomainProofPage renders problem/constraints/decisions/outcomes/context via dangerouslySetInnerHTML
  - CSS scope [data-flagship] code for inline code styling in domain proof context
  - All three domain data files selectively enriched with backtick inline code and bold metrics
requires:
  - slice: S01
    provides: Unified markdown pipeline pattern (gray-matter + unified + rehype); globals.css markdown styles
affects:
  - none (S04 is independent)
key_files:
  - src/lib/markdown.ts
  - src/components/domains/DomainProofPage.tsx
  - src/app/globals.css
  - src/data/domains/product.ts
  - src/data/domains/analytics-ai.ts
  - src/data/domains/developer-experience.ts
key_decisions:
  - D063: Sync inline markdown helper using processSync (no Shiki, no remark-gfm) with outer <p> stripping
  - D064: CSS scoping via [data-flagship] code selector to avoid leakage from/to .note-page__body
  - Used [\s\S] regex instead of s flag for ES2017 tsconfig target compatibility
  - Only enrich fields that pass through renderInlineMarkdown — not summary/role which render as plain text
  - Backtick tool names as enrichment convention; bold reserved for quantified outcomes only
patterns_established:
  - renderInlineMarkdown strips outer <p> wrapper for single-paragraph input to prevent nesting issues
  - Supporting work context fields wired through same markdown helper as flagship fields
observability_surfaces:
  - "[data-flagship] code" selector — presence confirms inline markdown rendering
  - "[data-flagship] strong" selector — confirms bold metric rendering
  - "[data-supporting-item] code" selector — confirms supporting work enrichment
drill_down_paths:
  - .gsd/milestones/M007/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M007/slices/S03/tasks/T02-SUMMARY.md
duration: 22m
verification_result: passed
completed_at: 2026-03-14
---

# S03: Domain Page Markdown Enrichment

**Shared sync markdown helper renders inline code and bold metrics across all three domain proof pages, with selectively enriched content in 6 flagships and 8 supporting work items.**

## What Happened

Created `src/lib/markdown.ts` with a synchronous `renderInlineMarkdown` function using unified's `remarkParse → remarkRehype → rehypeStringify` pipeline (no Shiki, no remark-gfm — domain proof strings are short prose, not code blocks). The helper strips the outer `<p>` wrapper for single-paragraph content using a `[\s\S]` regex (ES2017-compatible) to prevent invalid `<p>` nesting when output is placed inside existing `<p>` or `<li>` elements.

Wired `DomainProofPage.tsx` to render `flagship.problem`, `constraints[]`, `decisions[]`, `outcomes[]`, and supporting work `item.context` through the helper via `dangerouslySetInnerHTML`. All existing DOM marker attributes preserved.

Added `[data-flagship] code` and `[data-supporting-item] code` CSS rules scoped independently from `.note-page__body` styles.

Audited all content across all three domain data files and selectively enriched with:
- Backtick-wrapped inline code for tool/technology names (~30 terms: `WebdriverIO`, `GraphQL`, `Prisma`, `FastAPI`, `pnpm`, `CDK`, etc.)
- `**bold**` for key metrics (`**$30M/year**`, `**50%**`) — used sparingly, only for quantified outcomes
- Supporting work context fields also enriched where tool names appear

## Verification

- `tsc --noEmit` — zero errors ✅
- `pnpm build` — production build succeeds ✅
- `pnpm test` — all 18 Playwright tests pass ✅
- Browser: `[data-flagship] code` elements visible on all three authenticated domain pages ✅
- Browser: `[data-flagship] strong` elements for bold metrics ✅
- Browser: `[data-supporting-item] code` elements for supporting work ✅
- Browser: `[data-flagship-highlights]` and `[data-supporting-work]` markers present ✅
- No `<p>` nesting issues in rendered HTML (helper design prevents this) ✅
- No raw markdown syntax (backticks or `**`) visible in rendered content ✅

## Requirements Validated

- No new requirements validated (S03 is enrichment of existing domain proof pages, not a new capability)

## Requirements Advanced

- None — this slice enhances visual quality of existing domain pages without advancing tracked requirements

## New Requirements Surfaced

- None

## Requirements Invalidated or Re-scoped

- None

## Deviations

- Used `[\s\S]` instead of regex `s` (dotAll) flag for `<p>` stripping — ES2017 tsconfig target doesn't support `s` flag. Functionally equivalent.
- Reverted backticks added to a `summary` field during T02 — summary renders as plain text, not through the markdown helper. Enrichment confined to fields wired through `dangerouslySetInnerHTML`.

## Known Limitations

- Domain proof fields don't support syntax-highlighted code blocks or GFM tables (D063: sync helper uses no Shiki, no remark-gfm). This is intentional — the content is short prose, not technical documentation.

## Follow-ups

- None

## Files Created/Modified

- `src/lib/markdown.ts` — new shared helper with `renderInlineMarkdown` function
- `src/components/domains/DomainProofPage.tsx` — import helper, render 5 field types via `dangerouslySetInnerHTML`
- `src/app/globals.css` — added `[data-flagship] code` and `[data-supporting-item] code` inline code styling
- `src/data/domains/product.ts` — enriched 3 flagships + 1 supporting item
- `src/data/domains/analytics-ai.ts` — enriched 1 flagship + 3 supporting items
- `src/data/domains/developer-experience.ts` — enriched 2 flagships + 6 supporting items

## Forward Intelligence

### What the next slice should know
- S04 (journal entries) is independent of this slice — no dependencies to worry about
- The `renderInlineMarkdown` helper in `src/lib/markdown.ts` is available for future use if any other component needs lightweight markdown→HTML conversion

### What's fragile
- The `<p>` stripping regex assumes single-paragraph content produces `<p>...</p>` wrapping — multi-paragraph content returns full HTML which may cause nesting issues if placed inside a `<p>` parent element

### Authoritative diagnostics
- `[data-flagship] code` selector on authenticated domain pages — count should match backtick-wrapped terms in data files
- `[data-flagship] strong` for bold metrics
- Raw markdown visible in browser means the field isn't passing through `renderInlineMarkdown`

### What assumptions changed
- None — slice executed as planned
