# S03: Domain Page Markdown Enrichment

**Goal:** The three domain proof pages render markdown in flagship problem, constraints, decisions, and outcomes fields — inline code, bold/emphasis, and occasional code blocks where they add signal. Content is selectively enriched to take advantage of the formatting. All 18 Playwright tests pass.
**Demo:** Authenticate to a domain page → flagship sections show `inline code` for tool names, **bold** for key metrics, and properly styled rendering — not raw markdown syntax or broken HTML nesting.

## Must-Haves

- A shared `renderInlineMarkdown(content: string): string` helper in `src/lib/markdown.ts` that synchronously converts markdown to HTML and strips the outer `<p>` wrapper for single-paragraph content
- `DomainProofPage.tsx` renders `problem`, `constraints[]`, `decisions[]`, and `outcomes[]` via `dangerouslySetInnerHTML` using the markdown helper
- CSS scoped to `[data-flagship] code` for inline code styling in domain proof context (no leakage from/to `.note-page__body`)
- All three domain data files selectively enriched with inline code for tool/technology names and bold for key metrics where it adds signal
- No invalid HTML nesting (`<p>` inside `<p>` or `<p>` inside `<li>`)
- All existing DOM marker attributes preserved (`data-flagship`, `data-flagship-highlights`, `data-supporting-work`, `data-supporting-item`)
- All 18 existing Playwright tests pass
- `tsc --noEmit` passes with zero type errors
- `pnpm build` succeeds

## Proof Level

- This slice proves: contract
- Real runtime required: yes (build + Playwright tests against `next start`)
- Human/UAT required: yes (visual review of rendered domain pages with enriched formatting)

## Verification

- `pnpm build` — production build succeeds
- `pnpm test` — all 18 Playwright tests pass (gate ×5, public ×8, shader ×3, gallery/mermaid ×2)
- `tsc --noEmit` — zero type errors
- Browser verification: authenticate to `/domains/product` → inline `<code>` elements visible inside flagship sections for tool names
- Browser assertion: `[data-flagship] code` elements exist on authenticated domain proof page
- Browser assertion: `[data-flagship-highlights]` and `[data-supporting-work]` markers still present
- No `<p>` tags nested inside `<p>` or `<li>` in rendered HTML (validated by helper design)

## Observability / Diagnostics

- Runtime signals: None (synchronous markdown rendering at component render time — no async, no background process)
- Inspection surfaces: `[data-flagship] code` selector — presence confirms inline markdown is rendering; absence means the helper or `dangerouslySetInnerHTML` wiring is broken
- Failure visibility: Invalid HTML nesting would surface as React hydration warnings in dev console; build failures from type errors would surface in `tsc --noEmit`
- Redaction constraints: None (all content is authored TypeScript data, not user input)

## Integration Closure

- Upstream surfaces consumed: `src/lib/notes.ts` unified pipeline pattern (reused as a lighter sync variant, not duplicated); `src/app/globals.css` markdown styles (extended with domain-scoped CSS, not modified); `src/data/domains/*.ts` data files (content enriched)
- New wiring introduced in this slice: `src/lib/markdown.ts` shared helper → consumed by `DomainProofPage.tsx` via `dangerouslySetInnerHTML`; CSS scope `[data-flagship] code` for domain proof inline code
- What remains before the milestone is truly usable end-to-end: S04 (first journal entry) — independent of this slice

## Tasks

- [x] **T01: Extract shared renderInlineMarkdown helper and wire into DomainProofPage** `est:25m`
  - Why: Creates the markdown→HTML pipeline for domain proof fields and connects it to the component rendering, which is the core technical delivery of this slice
  - Files: `src/lib/markdown.ts`, `src/components/domains/DomainProofPage.tsx`, `src/app/globals.css`
  - Do: Create `renderInlineMarkdown` using unified `processSync` (no Shiki, no remark-gfm — only remarkParse + remarkRehype + rehypeStringify). Strip outer `<p>` wrapper with regex for single-paragraph output. Guard multi-paragraph output (return full HTML). Wire into DomainProofPage for `problem`, `constraints[]`, `decisions[]`, `outcomes[]` via `dangerouslySetInnerHTML`. Add `[data-flagship] code` CSS scope for inline code styling. Preserve all DOM marker attributes.
  - Verify: `pnpm build` succeeds, `tsc --noEmit` passes, `pnpm test` — all 18 tests pass, browser check confirms `[data-flagship] code` renders on an authenticated domain page
  - Done when: Domain proof fields render HTML from markdown strings, inline code shows styled `<code>` elements, no `<p>` nesting issues, all tests green

- [x] **T02: Selectively enrich domain data content with markdown formatting** `est:25m`
  - Why: The rendering pipeline from T01 only adds value if the content actually uses markdown formatting — this task adds inline code for tool names and bold for key metrics where it improves scannability
  - Files: `src/data/domains/product.ts`, `src/data/domains/analytics-ai.ts`, `src/data/domains/developer-experience.ts`
  - Do: Audit all `problem`, `constraints[]`, `decisions[]`, `outcomes[]` strings across 6 flagships and 8 supporting work items. Add backtick-wrapped inline code for tool/technology names (e.g., `GraphQL`, `Prisma`, `WebdriverIO`). Add `**bold**` for key metrics (e.g., `**$30M/year**`). Keep enrichment sparse — leave most prose as plain text. Also enrich supporting work `context` fields where tool names appear, updating `DomainProofPage.tsx` to render supporting item context through the markdown helper.
  - Verify: `pnpm build` succeeds, `tsc --noEmit` passes, `pnpm test` — all 18 tests pass, browser verification shows enriched content rendering correctly across all three domain pages
  - Done when: All three domain data files enriched with selective markdown, rendered output shows styled inline code and bold text, visual review confirms enrichment adds signal without over-formatting

## Files Likely Touched

- `src/lib/markdown.ts` (new)
- `src/components/domains/DomainProofPage.tsx`
- `src/app/globals.css`
- `src/data/domains/product.ts`
- `src/data/domains/analytics-ai.ts`
- `src/data/domains/developer-experience.ts`
