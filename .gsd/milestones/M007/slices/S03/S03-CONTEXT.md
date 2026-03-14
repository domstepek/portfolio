---
id: S03
milestone: M007
status: ready
---

# S03: Domain page markdown enrichment — Context

## Goal

Audit the three domain flagship entries, add full markdown rendering to the `problem`, `constraints[]`, `decisions[]`, and `outcomes[]` fields in `DomainProofPage`, then selectively rewrite domain content to use inline code, bold/emphasis, and block-level elements where they improve readability.

## Why this Slice

S01 builds the markdown pipeline and CSS for the notes section. S03 extends the benefit to the domain proof pages — the portfolio's most content-rich surface. With a unified pipeline already wired, adding markdown rendering to domain fields is low-risk; the audit-then-enrich approach ensures changes are targeted rather than busywork.

## Scope

### In Scope

- Add a lightweight markdown-to-HTML render step (reusing the unified pipeline from S01) for these fields in `DomainProofPage`:
  - `flagship.problem`
  - `flagship.constraints[]` (each item)
  - `flagship.decisions[]` (each item)
  - `flagship.outcomes[]` (each item)
- Audit all three domains (`analytics-ai`, `developer-experience`, `product`) and identify where inline code, bold/emphasis, code blocks, or other block-level markdown would improve clarity
- Rewrite flagging content in those fields to use markdown where the audit identifies real value — not blanket reformatting, only where it adds signal
- CSS: ensure rendered markdown in domain cards is styled consistently with the retro terminal aesthetic — code spans, `<strong>`, `<em>`, and any code blocks should look intentional inside the card layout
- All 18 existing Playwright tests continue to pass

### Out of Scope

- `supportingWork[].context` — short descriptions rarely warrant markdown; left as plain text
- `flagship.summary`, `flagship.role`, `thesis`, `scope` — narrative prose; inline code/formatting only if the audit finds a clear case, otherwise left alone
- `title`, `stack[]`, `belongsHere[]` — structural/metadata fields, never markdown
- Adding new content sections or new flagship entries — this is enrichment only, not an expansion of the data model
- Any changes to the notes pipeline or note content (S01 scope)
- Any changes to the engineering journal skill (S02 scope)

## Constraints

- `DomainProofPage` is a server component (`src/components/domains/DomainProofPage.tsx`) — markdown rendering must be server-side, not a client island
- The unified pipeline from S01 (gray-matter + unified + rehype) should be reused, not duplicated — extract a shared `renderMarkdown(content: string): Promise<string>` helper if one doesn't already exist
- DOM marker contract must be preserved: `data-route-visibility`, `data-protected-proof-state`, `data-visual-state`, `data-flagship`, `data-supporting-work`, `data-supporting-item` — Playwright tests depend on these (D015, D013)
- `dangerouslySetInnerHTML` is acceptable here for rendered markdown — the same pattern is used in `NotePage.tsx`; domain data is authored and committed, not user input
- Fields remain `string` / `string[]` in `types.ts` — no TypeScript type change needed; the strings just happen to contain markdown syntax

## Integration Points

### Consumes

- `src/lib/notes.ts` (or a shared extract) — the unified pipeline's async markdown→HTML render path built in S01; `renderMarkdown()` helper extracted or co-located
- `src/components/domains/DomainProofPage.tsx` — the server component where rendered fields are mounted
- `src/data/domains/*.ts` — the three domain data files whose content will be selectively updated
- `src/app/globals.css` — existing `.note-page__body` markdown styles from S01 may need a parallel `.domain-proof` variant, or a shared scope if the styles are safe to reuse

### Produces

- `src/lib/markdown.ts` (or inline in `notes.ts`) — shared `renderMarkdown(content: string): Promise<string>` helper
- `src/components/domains/DomainProofPage.tsx` — updated to render `problem`, `constraints[]`, `decisions[]`, `outcomes[]` as HTML
- `src/data/domains/analytics-ai.ts`, `developer-experience.ts`, `product.ts` — selectively enriched with markdown in audited fields
- `src/app/globals.css` — any new CSS scopes needed to style inline code, `<strong>`, or code blocks inside domain cards

## Open Questions

- **Shared render helper location**: Should `renderMarkdown()` live in `src/lib/notes.ts` as an additional export, or be extracted to a new `src/lib/markdown.ts`? Current thinking: extract to `src/lib/markdown.ts` — keeps notes.ts focused and makes the helper clearly reusable.
- **Code blocks in domain content**: Full markdown support is in scope, but does any current domain content actually warrant a fenced code block? Current thinking: unlikely from the audit — most decisions and constraints are prose sentences or reference tool names inline. If none of the content calls for it naturally, don't force it.
