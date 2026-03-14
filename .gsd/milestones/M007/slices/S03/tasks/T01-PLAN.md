---
estimated_steps: 5
estimated_files: 3
---

# T01: Extract shared renderInlineMarkdown helper and wire into DomainProofPage

**Slice:** S03 — Domain page markdown enrichment
**Milestone:** M007

## Description

Create a shared `renderInlineMarkdown` helper that synchronously converts markdown strings to HTML, stripping the outer `<p>` wrapper that unified adds to single-paragraph content. Wire it into `DomainProofPage.tsx` so flagship `problem`, `constraints[]`, `decisions[]`, and `outcomes[]` fields render as HTML via `dangerouslySetInnerHTML`. Add CSS scoped to `[data-flagship]` for inline code styling that doesn't leak to/from `.note-page__body`.

The helper uses unified's `processSync` with only `remarkParse` → `remarkRehype` → `rehypeStringify` — no Shiki (not needed for inline formatting), no `remark-gfm` (no tables in these fields). This keeps the component synchronous and avoids making `DomainProofPage` async.

## Steps

1. Create `src/lib/markdown.ts` with `renderInlineMarkdown(content: string): string`:
   - Build unified chain: `remarkParse` → `remarkRehype` → `rehypeStringify`
   - Use `processSync` (synchronous — no Shiki needed)
   - Strip outer `<p>` wrapper with regex `/^<p>(.*)<\/p>\n?$/s` for single-paragraph output
   - If multi-paragraph (regex doesn't match), return full HTML as-is
   - Export the function

2. Update `DomainProofPage.tsx`:
   - Import `renderInlineMarkdown` from `@/lib/markdown`
   - Replace `<p>` text content for `flagship.problem` with `<p dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(flagship.problem) }}>`
   - Replace `<li>` text content for `constraints`, `decisions`, `outcomes` arrays with `<li dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }}>`
   - Preserve all existing `className`, `key`, and `data-*` attributes exactly as they are

3. Add CSS in `src/app/globals.css` scoped to domain proof context:
   - `[data-flagship] code` — background, padding, border-radius, font-size matching retro theme (similar style to `.note-page__body code:not(pre code)` but scoped independently)
   - Keep specificity at `0,1,1` to avoid `!important`

4. Verify: `pnpm build`, `tsc --noEmit`, `pnpm test` — all 18 pass

5. Browser verification: authenticate to a domain page, confirm `<code>` elements render inside `[data-flagship]` sections (even with current plain-text content, the helper should pass through without issues; actual code elements appear in T02 when content is enriched)

## Must-Haves

- [ ] `renderInlineMarkdown` strips outer `<p>` for single-paragraph input
- [ ] `renderInlineMarkdown` returns full HTML for multi-paragraph input
- [ ] `DomainProofPage` renders problem/constraints/decisions/outcomes via `dangerouslySetInnerHTML`
- [ ] All existing DOM marker attributes preserved (`data-flagship`, `data-flagship-highlights`, etc.)
- [ ] CSS for `[data-flagship] code` added and scoped correctly
- [ ] No type errors, build succeeds, all 18 tests pass

## Verification

- `tsc --noEmit` — zero errors
- `pnpm build` — succeeds
- `pnpm test` — all 18 Playwright tests pass
- Browser: authenticate to `/domains/product`, confirm flagship sections still render correctly and `[data-flagship-highlights]` marker is present

## Observability Impact

- Signals added/changed: None (synchronous rendering, no runtime state)
- How a future agent inspects this: `[data-flagship] code` selector presence on authenticated domain pages; absence means the helper or wiring is broken
- Failure state exposed: Invalid HTML nesting would show as React hydration warnings in dev console; type errors surface in `tsc --noEmit`

## Inputs

- `src/lib/notes.ts` — pattern reference for unified pipeline setup (lines 1-10 show imports and chain)
- `src/components/domains/DomainProofPage.tsx` — current component rendering plain text in `<p>` and `<li>` elements
- `src/app/globals.css` — existing `.note-page__body code:not(pre code)` style to match (not modify)
- S03 Research — documents the `<p>` wrapper stripping strategy and CSS scoping approach

## Expected Output

- `src/lib/markdown.ts` — new shared helper with `renderInlineMarkdown` function
- `src/components/domains/DomainProofPage.tsx` — modified to use `dangerouslySetInnerHTML` for markdown-rendered fields
- `src/app/globals.css` — new `[data-flagship] code` CSS rules
