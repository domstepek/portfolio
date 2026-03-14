---
id: T02
parent: S03
milestone: M007
provides:
  - Selectively enriched markdown content across all three domain data files (product, analytics-ai, developer-experience)
  - Supporting work context fields rendered through renderInlineMarkdown helper
key_files:
  - src/data/domains/product.ts
  - src/data/domains/analytics-ai.ts
  - src/data/domains/developer-experience.ts
  - src/components/domains/DomainProofPage.tsx
key_decisions:
  - Only enrich fields that pass through renderInlineMarkdown (problem, constraints, decisions, outcomes, supporting context) — not summary/role which render as plain text
  - Keep enrichment sparse: backticks for tool/technology names, bold only for standout metrics ($30M/year, 50%)
patterns_established:
  - Backtick tool names in data files as the enrichment convention; bold reserved for quantified outcomes only
observability_surfaces:
  - "[data-flagship] code" count on authenticated domain pages — should match enriched tool names
  - "[data-flagship] strong" for bold metrics
  - "[data-supporting-item] code" for supporting work enrichment
duration: 12m
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# T02: Selectively enrich domain data content with markdown formatting

**Added backtick-wrapped inline code for tool/technology names and bold for key metrics across all three domain data files, and wired supporting work context through the markdown helper.**

## What Happened

Audited all `problem`, `constraints[]`, `decisions[]`, `outcomes[]` fields across 6 flagships and supporting work `context` fields across 8 supporting items. Added selective markdown enrichment:

- **product.ts**: `WebdriverIO`, `Cucumber`, `BDD` in Sample Tracking decisions; `Snowflake`, `GraphQL` in Supply Chain constraints/decisions; **$30M/year** bolded in outcomes; `Go`, `AWS Lambda`, `DGraph`, `AWS CodePipeline` in Charla decisions; `Payload CMS` in CMS supporting context
- **analytics-ai.ts**: `GraphQL`, `FastAPI`, `Legend State`, `Express`, `Apollo`, `Prisma`, `Redis`, `Cognito`, `AWS Bedrock`, `RAG`, `AppSync` in Collection Curator constraints/decisions/outcomes; **50%** bolded in outcomes; `MCP`, `Bedrock`, `EKS`, `Apache Superset` in supporting work context
- **developer-experience.ts**: `TypeScript` in Monorepo problem; `pnpm`, `tsconfig`, `eslint`, `prettier` in decisions; `React`, `TypeScript` in Global Design System decisions; `CLI`, `CDK`, `EKS`, `Helm`, `ArgoCD`, `CDN`, `SSO`, `ECS` in supporting work context

Updated `DomainProofPage.tsx` to render supporting work `item.context` through `renderInlineMarkdown` via `dangerouslySetInnerHTML`.

## Verification

- `tsc --noEmit` — zero errors ✓
- `pnpm build` — production build succeeds ✓
- `pnpm test` — all 18 Playwright tests pass ✓
- Browser `/domains/product/`: 11 `[data-flagship] code` elements (WebdriverIO, Cucumber, BDD, Snowflake, GraphQL, Go, AWS Lambda, DGraph, AWS CodePipeline + more), 1 `[data-flagship] strong` ($30M/year), 1 `[data-supporting-item] code` (Payload CMS) ✓
- Browser `/domains/analytics-ai/`: 12 `[data-flagship] code` elements, 1 `[data-flagship] strong` (50%), 4 `[data-supporting-item] code` elements ✓
- Browser `/domains/developer-experience/`: 7 `[data-flagship] code` elements, 10 `[data-supporting-item] code` elements ✓
- No raw markdown syntax (backticks or `**`) in visible rendered content ✓
- `[data-flagship-highlights]` and `[data-supporting-work]` markers present ✓

### Slice-Level Verification (all pass — final task)

- `pnpm build` — ✓
- `pnpm test` — 18/18 ✓
- `tsc --noEmit` — ✓
- Browser: `[data-flagship] code` elements visible on authenticated domain pages — ✓
- Browser: `[data-flagship-highlights]` and `[data-supporting-work]` markers present — ✓
- No `<p>` nesting issues (helper strips outer wrapper) — ✓

## Diagnostics

- Inspect `[data-flagship] code` selector on authenticated domain pages — count should match number of backtick-wrapped terms in data files
- Inspect `[data-flagship] strong` for bold metrics
- Inspect `[data-supporting-item] code` for supporting work enrichment
- Raw markdown visible in browser means the field isn't passing through `renderInlineMarkdown`

## Deviations

- Reverted backticks added to Global Design System `summary` field — summary is rendered as plain text via `{flagship.summary}`, not through the markdown helper, so backticks would show as raw characters. Enrichment confined to fields that pass through `dangerouslySetInnerHTML`.

## Known Issues

None.

## Files Created/Modified

- `src/data/domains/product.ts` — Enriched 3 flagships + 1 supporting item with inline code and bold markdown
- `src/data/domains/analytics-ai.ts` — Enriched 1 flagship + 3 supporting items with inline code and bold markdown
- `src/data/domains/developer-experience.ts` — Enriched 2 flagships + 6 supporting items with inline code markdown
- `src/components/domains/DomainProofPage.tsx` — Wired supporting work `context` through `renderInlineMarkdown` via `dangerouslySetInnerHTML`
