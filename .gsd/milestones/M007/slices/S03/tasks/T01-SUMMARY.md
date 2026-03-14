---
id: T01
parent: S03
milestone: M007
provides:
  - renderInlineMarkdown shared helper (sync unified pipeline)
  - DomainProofPage wired to render markdown via dangerouslySetInnerHTML
  - CSS scope for [data-flagship] code inline styling
key_files:
  - src/lib/markdown.ts
  - src/components/domains/DomainProofPage.tsx
  - src/app/globals.css
key_decisions:
  - Used [\s\S] instead of regex s flag to stay compatible with ES2017 tsconfig target
patterns_established:
  - renderInlineMarkdown strips outer <p> wrapper for single-paragraph input to prevent nesting issues with dangerouslySetInnerHTML inside <p>/<li>
observability_surfaces:
  - "[data-flagship] code" selector — presence confirms inline markdown rendering; absence means helper or wiring is broken
duration: 10m
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# T01: Extract shared renderInlineMarkdown helper and wire into DomainProofPage

**Created `renderInlineMarkdown` helper using unified processSync and wired it into DomainProofPage for problem/constraints/decisions/outcomes fields with scoped CSS for inline code.**

## What Happened

Created `src/lib/markdown.ts` with a synchronous `renderInlineMarkdown` function that uses unified's `remarkParse → remarkRehype → rehypeStringify` pipeline (no Shiki, no remark-gfm). The helper strips the outer `<p>` wrapper for single-paragraph input using a `[\s\S]` regex pattern (ES2017-compatible) so content can be placed inside existing `<p>` or `<li>` elements without invalid HTML nesting. Multi-paragraph input returns full HTML.

Updated `DomainProofPage.tsx` to import the helper and render `flagship.problem`, `constraints[]`, `decisions[]`, and `outcomes[]` via `dangerouslySetInnerHTML`. All existing DOM marker attributes preserved.

Added `[data-flagship] code` CSS rule in `globals.css` scoped independently from `.note-page__body code:not(pre code)` — matching the retro theme styling with `background`, `padding`, `border-radius`, `font-size`.

## Verification

- `tsc --noEmit` — zero errors
- `pnpm build` — production build succeeds
- `pnpm test` — all 18 Playwright tests pass
- Browser: authenticated to `/domains/product`, confirmed:
  - `[data-flagship-highlights]` marker present
  - `[data-flagship]`, `[data-supporting-work]`, `[data-route-visibility="protected"]` all present
  - Flagship sections render correctly with plain text passing through cleanly
  - Zero `<p>` nested inside `<li>` or `<p>` (validated via DOM query)

### Slice-level verification status

- ✅ `pnpm build` — succeeds
- ✅ `pnpm test` — all 18 pass
- ✅ `tsc --noEmit` — zero errors
- ✅ Browser: `[data-flagship-highlights]` and `[data-supporting-work]` markers present
- ⏳ Browser: `[data-flagship] code` elements visible — no `<code>` elements yet (T02 enriches content with markdown)
- ✅ No `<p>` nesting issues in rendered HTML

## Diagnostics

Inspect `[data-flagship] code` selector on authenticated domain pages. Absence means the helper or `dangerouslySetInnerHTML` wiring is broken. Invalid HTML nesting would surface as React hydration warnings in dev console.

## Deviations

Used `[\s\S]` instead of the `s` (dotAll) regex flag in the `<p>` stripping pattern because the tsconfig target is ES2017, which TypeScript rejects the `s` flag for. Functionally equivalent.

## Known Issues

None.

## Files Created/Modified

- `src/lib/markdown.ts` — new shared helper with `renderInlineMarkdown` function
- `src/components/domains/DomainProofPage.tsx` — import helper, render 4 field types via `dangerouslySetInnerHTML`
- `src/app/globals.css` — added `[data-flagship] code` inline code styling
