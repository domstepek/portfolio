# S03: Domain Page Markdown Enrichment — Research

**Date:** 2026-03-14

## Summary

S03 is primarily a **content enrichment + CSS gap-fix** slice, not an infrastructure build. The core rendering infrastructure already exists: `src/lib/markdown.ts` exports `renderInlineMarkdown()` (synchronous, remark→rehype pipeline, strips single-paragraph `<p>` wrappers), and `DomainProofPage.tsx` already wires it into all five prose fields (`problem`, `constraints[]`, `decisions[]`, `outcomes[]`, `context`) via `dangerouslySetInnerHTML`. Data files already use backtick code for tech terms and bold for key metrics, but inconsistently — many tech terms are plain text, and the supporting work section's `<code>` elements receive no CSS styling at all.

The boundary map calls for a shared async `renderMarkdown(content: string): Promise<string>` helper in `markdown.ts`. This is unnecessary for the current domain page use case (all fields are single-paragraph prose that works perfectly with `renderInlineMarkdown`), but adding it creates a clean shared surface for any future block-level markdown needs and reduces code duplication with `notes.ts`. The practical work is: (1) fix the CSS styling gap for supporting work inline code, (2) add `strong` styling for emphasis in domain cards, (3) audit and enrich all three domain data files with markdown where it adds signal, (4) optionally extract a shared `renderMarkdown` for future use.

All 18 Playwright tests check DOM markers (`data-flagship-highlights`, `data-flagship`, `data-supporting-work`, `data-supporting-item`) but never check specific text content of domain fields — content changes carry zero test risk.

## Recommendation

Execute S03 as a tight three-task slice:

**T01 — CSS gap fixes:** Extend inline code styling from `[data-flagship] code` to also cover `[data-supporting-item] code`. Add `[data-flagship] strong` and `[data-supporting-item] strong` styling with `color: var(--accent-strong)` for visual emphasis on bold text. Optionally add a shared `renderMarkdown` async function to `markdown.ts` for future block-level use.

**T02 — Content audit and enrichment:** Walk through all three domain data files (`product.ts`, `analytics-ai.ts`, `developer-experience.ts`) and selectively add inline code, bold, and emphasis where it improves scannability:
- Backtick-wrap remaining tech terms that aren't yet marked (many supporting work items reference technologies without backticks)
- Add bold for quantitative outcomes that aren't yet emphasized
- Use emphasis sparingly for key concepts where it aids scanning
- Do NOT over-format — the goal is selective enrichment, not markdown maximalism

**T03 — Verification:** Build, run all 18 Playwright tests, type-check, and visually verify domain pages render enriched content with proper styling.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Inline markdown → HTML | `src/lib/markdown.ts` `renderInlineMarkdown()` | Already wired into DomainProofPage; handles backticks, bold, emphasis, strips `<p>` wrappers |
| Full markdown → HTML | `src/lib/notes.ts` unified pipeline | Async, Shiki-enabled — reference for `renderMarkdown` if added, but domain pages don't need Shiki |
| Flagship inline code CSS | `[data-flagship] code` in globals.css L1326 | Pattern to extend to supporting items |

## Existing Code and Patterns

- `src/lib/markdown.ts` — Synchronous `renderInlineMarkdown()` using unified pipeline (remarkParse → remarkRehype → rehypeStringify). No Shiki, no remark-gfm — intentionally lightweight. Strips outer `<p>` tags for single-paragraph input. Already the sole markdown renderer for domain proof pages.
- `src/components/domains/DomainProofPage.tsx` — Pure RSC importing `renderInlineMarkdown`. All five prose fields already use `dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(field) }}`. DOM markers are stable contract (D015).
- `src/data/domains/types.ts` — `FlagshipHighlight` type: `problem: string`, `constraints: string[]`, `decisions: string[]`, `outcomes: string[]`. `SupportingWorkItem` type: `context: string`. All are plain strings; markdown lives inside the string content, not in the type system.
- `src/data/domains/product.ts` — 3 flagships, 2 supporting items. Already has 8 backtick usages and 1 bold (`**$30M/year**`).
- `src/data/domains/analytics-ai.ts` — 1 flagship, 4 supporting items. Already has 12 backtick usages and 1 bold (`**50%**`).
- `src/data/domains/developer-experience.ts` — 2 flagships, 6 supporting items. Already has 11 backtick usages and 0 bolds.
- `src/app/globals.css` L1326–1331 — `[data-flagship] code` with bg-elevated, padding, border-radius, font-size 0.9em. This is the pattern to replicate for supporting items.
- `src/lib/notes.ts` — Async unified pipeline with Shiki + remark-gfm. Reference for `renderMarkdown` if extracted, but domain pages don't need these features.

## Constraints

- **Supporting work `<code>` is unstyled** — `[data-flagship] code` CSS only matches elements inside `data-flagship` articles. Supporting work items have `data-supporting-item` attribute but no corresponding code styling. This is a visual bug that S03 must fix.
- **`renderInlineMarkdown` is synchronous** — uses `processSync()`, which means Shiki cannot be added to it (Shiki requires async). This is fine for domain pages (no code blocks needed), but if `renderMarkdown` is added it should be async.
- **D052 flagship-list specificity** — `.site-main .flagship-list` uses specificity 0,2,0 to override default list styles. Any new CSS must stay within or below this specificity hierarchy.
- **No tests check domain text content** — Playwright tests check DOM markers (`data-flagship-highlights`, `data-flagship`, `data-supporting-work`, `data-supporting-item`) and structural presence, never specific text. Content changes are zero-risk for tests.
- **Content tone must follow D031/D058** — casual first-person, sentence case, no marketing speak. Enrichment adds formatting to existing voice, doesn't change the voice.

## Common Pitfalls

- **Over-formatting** — wrapping every tech term in backticks makes the page look like a code editor, not a portfolio. Only mark terms that are genuinely technical identifiers (library names, tool names, protocols) — not common English words that happen to be tech-adjacent.
- **Bold overuse** — bold should highlight key quantitative outcomes or surprising results, not emphasize every other sentence. The current data files use it sparingly and correctly ($30M/year, 50%).
- **CSS selector scope leak** — adding code styling with a broad selector like `.site-main code` would leak into notes pages and other contexts. Keep selectors scoped to `[data-flagship]` and `[data-supporting-item]`.
- **Breaking `renderInlineMarkdown` by adding remark-gfm** — the sync processor is intentionally lightweight. Adding remark-gfm would need testing; the function doc explicitly says "no remark-gfm." If needed for tables in domain content (unlikely), add a separate function.

## Open Risks

- **Visual review dependency** — there's no automated visual regression test for domain proof pages. CSS changes and content enrichment need manual browser verification to confirm the retro terminal aesthetic is maintained. Low risk given the changes are purely additive.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Frontend/CSS | `frontend-design` | installed (available in skills) |
| Next.js | — | no skill needed; standard RSC patterns |
| unified/remark | — | no skill needed; pipeline already built |

No new skills needed — this slice is content and CSS work within established patterns.

## Sources

- `renderInlineMarkdown` already handles backticks→`<code>`, `**bold**`→`<strong>`, `*emphasis*`→`<em>` correctly (verified via `npx tsx` execution)
- Supporting work `<code>` elements confirmed unstyled via browser `getComputedStyle` — `background: rgba(0,0,0,0)`, `padding: 0px`
- Flagship `<code>` elements confirmed styled — `background: rgb(17,20,17)`, `padding: 1.89px 4.41px`
- 11 `<code>` elements found in flagship sections, 1 in supporting work (Product domain `Payload CMS`)
- 1 `<strong>` element found across all flagship sections (`$30M/year`)
- No Playwright tests reference specific domain page text content (grep confirmed)
