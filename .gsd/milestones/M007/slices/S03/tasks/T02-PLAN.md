---
estimated_steps: 4
estimated_files: 4
---

# T02: Selectively enrich domain data content with markdown formatting

**Slice:** S03 — Domain page markdown enrichment
**Milestone:** M007

## Description

Audit all `problem`, `constraints[]`, `decisions[]`, `outcomes[]`, and supporting work `context` strings across the three domain data files (6 flagships, 8 supporting work items). Add backtick-wrapped inline code for tool and technology names, `**bold**` for key metrics and outcomes where emphasis adds signal. Also wire supporting work `context` fields through `renderInlineMarkdown` in `DomainProofPage.tsx`. Keep enrichment sparse — the retro aesthetic works best with selective emphasis.

## Steps

1. Enrich `src/data/domains/product.ts` (3 flagships, 2 supporting items):
   - Sample Tracking: backtick `WebdriverIO`, `Cucumber`, `BDD`; bold key outcomes
   - Supply Chain Forecasting: backtick `Snowflake`, `GraphQL`; bold `**$30M/year**`
   - Charla.cc: backtick `Go`, `AWS Lambda`, `DGraph`; bold for co-founder outcomes
   - Supporting work: backtick tool names in `context` fields where present (`Payload CMS`)

2. Enrich `src/data/domains/analytics-ai.ts` (1 flagship):
   - Collection Curator: backtick `GraphQL`, `Apollo`, `FastAPI`, `Express`, `Prisma`, `Redis`, `Legend State`, `Cognito`, `AWS Bedrock`, `RAG`; bold `**50%**` support ticket reduction
   - Supporting work: backtick tool names where present

3. Enrich `src/data/domains/developer-experience.ts` (2 flagships, 6 supporting items):
   - Monorepo Template: backtick `pnpm`, `tsconfig`, `eslint`, `prettier`
   - Global Design System: backtick `Storybook`, `React`, `TypeScript`
   - Supporting work: backtick tool names (`CLI`, `CDK`, `Helm`, `ArgoCD`, `SSO`, `ECS`, `EKS`, `CDN`)

4. Update `DomainProofPage.tsx` to also render supporting work `context` through `renderInlineMarkdown`:
   - Change `<p>` for `item.context` to use `dangerouslySetInnerHTML`

5. Verify: `pnpm build`, `tsc --noEmit`, `pnpm test` — all 18 pass. Browser verification across all three domain pages confirms enriched rendering.

## Must-Haves

- [ ] All tool/technology names in flagship fields wrapped in backticks where they appear in problem/constraints/decisions/outcomes
- [ ] Key metrics bold-wrapped where they add signal (e.g., `**$30M/year**`, `**50%**`)
- [ ] Supporting work `context` fields enriched and rendered through markdown helper
- [ ] Enrichment is selective — most prose stays plain text, only technical specifics formatted
- [ ] No broken markdown syntax in any data file
- [ ] All 18 Playwright tests pass
- [ ] Build and type checking pass

## Verification

- `tsc --noEmit` — zero errors
- `pnpm build` — succeeds
- `pnpm test` — all 18 Playwright tests pass
- Browser: authenticate to all three domain pages, confirm:
  - `/domains/product` — `WebdriverIO`, `$30M/year` rendered with formatting
  - `/domains/analytics-ai` — `GraphQL`, `FastAPI`, `50%` rendered with formatting
  - `/domains/developer-experience` — `pnpm`, `Storybook` rendered with formatting
- No raw markdown syntax visible (no literal backticks or `**` in rendered text)

## Observability Impact

- Signals added/changed: None
- How a future agent inspects this: `[data-flagship] code` count on authenticated domain pages — should match the number of enriched tool names; `[data-flagship] strong` for bold metrics
- Failure state exposed: Raw markdown syntax visible in browser means the helper isn't being applied to that field

## Inputs

- `src/lib/markdown.ts` — `renderInlineMarkdown` helper from T01
- `src/components/domains/DomainProofPage.tsx` — T01 output with `dangerouslySetInnerHTML` on flagship fields
- `src/data/domains/product.ts`, `analytics-ai.ts`, `developer-experience.ts` — current plain-text content
- S03 Research — enrichment guidelines: inline code for tool names, bold for key metrics, sparse emphasis

## Expected Output

- `src/data/domains/product.ts` — selectively enriched with markdown in problem/constraints/decisions/outcomes/supporting context
- `src/data/domains/analytics-ai.ts` — selectively enriched
- `src/data/domains/developer-experience.ts` — selectively enriched
- `src/components/domains/DomainProofPage.tsx` — supporting work context also rendered through markdown helper
