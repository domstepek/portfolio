---
id: S01
parent: M007
milestone: M007
provides:
  - Async unified markdown pipeline with Shiki syntax highlighting (tokyo-night theme)
  - Expanded NoteFrontmatter type with tags, type, readTime fields
  - getAllTags() helper for tag aggregation
  - Rich markdown CSS for code blocks, images, tables, inline code, blockquotes, hr
  - Bracket-link decoration suppression inside .note-page__body
  - TagFilter 'use client' component with useState-driven tag filtering on notes index
  - Tag chips on note detail and index pages
  - ReadTime display on note detail pages
  - remark-gfm integration for GFM table support
  - Test note exercising all rich rendering paths
  - Migrated existing notes to expanded frontmatter schema
requires: []
affects:
  - S02
  - S03
key_files:
  - src/lib/notes.ts
  - src/app/notes/[slug]/page.tsx
  - src/app/globals.css
  - src/components/notes/NotePage.tsx
  - src/components/notes/NotesIndexPage.tsx
  - src/components/notes/TagFilter.tsx
  - src/content/notes/shiki-and-rich-markdown-test.md
  - src/content/notes/keep-the-path-explicit.md
  - src/content/notes/systems-over-abstractions.md
key_decisions:
  - D059 — S01 verification via build + 18 Playwright tests + Shiki class inspection + visual UAT
  - D060 — Tag filter as 'use client' island with serialized data (Date→ISO strings)
  - D061 — Shiki theme background via transparent CSS override
  - D062 — remark-gfm added for GFM table support
patterns_established:
  - Async getNoteBySlug returns Promise<NoteWithContent | null>
  - NoteFrontmatter tags default to [] and type defaults to 'note' for backward compatibility
  - Client island pattern — server component serializes data, 'use client' component manages state
  - Rich markdown styles scoped to .note-page__body to avoid leaking
  - data-tag-filter, data-note-tags, data-note-read-time DOM markers for observability
observability_surfaces:
  - Shiki adds class="shiki tokyo-night" and inline style on <pre> elements — absence indicates pipeline misconfiguration
  - data-tag-filter attribute on filter container for agent inspection
  - data-note-tags and data-note-read-time attributes on note detail pages
  - Build failure with clear async error if processSync accidentally used with Shiki
  - parseFrontmatter defaults preserve backward compatibility for malformed frontmatter
drill_down_paths:
  - .gsd/milestones/M007/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M007/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M007/slices/S01/tasks/T03-SUMMARY.md
duration: 37m
verification_result: passed
completed_at: 2026-03-14
---

# S01: Enhanced Markdown Rendering and Tag System

**Async Shiki-powered markdown pipeline with rich CSS, tag filtering on notes index, and expanded frontmatter schema — all 18 Playwright tests pass.**

## What Happened

Upgraded the notes markdown pipeline from synchronous to async, integrated `@shikijs/rehype` with `tokyo-night` theme for syntax-highlighted code blocks, and expanded `NoteFrontmatter` with `tags`, `type`, and `readTime` fields. Added `remark-gfm` for GFM table support (discovered during implementation — standard remark doesn't handle pipe tables). Both existing notes were migrated to the expanded schema with `type: 'note'` and appropriate tags.

Built comprehensive rich markdown CSS scoped to `.note-page__body` — Shiki code blocks with transparent background override (theme controls color), retro-styled tables with green accent headers, inline code with background highlight, bordered images, blockquotes with left accent border, and horizontal rules. Suppressed bracket-link decorations inside markdown body. Updated `NotePage` to display tags as styled chips and readTime inline with the date.

Created a test note (`shiki-and-rich-markdown-test.md`) exercising every rich rendering path: TypeScript and bash code blocks, blockquote, inline code, table, and horizontal rule.

Built `TagFilter` as a `'use client'` component following the established client island pattern. Server component (`NotesIndexPage`) serializes note data (Date→ISO strings) and passes to `TagFilter` as props. The component manages active tag state via `useState`, renders clickable pill-shaped tag chips with active/inactive styling, and renders the filtered note list preserving all existing `data-*` DOM markers consumed by Playwright tests.

## Verification

- `pnpm build` — production build succeeds, all 9 routes generated including 3 note slugs
- `pnpm test` — all 18 Playwright tests pass (gate ×5, public ×8, shader ×3, gallery/mermaid ×2)
- `tsc --noEmit` — zero type errors
- Rendered HTML of test note contains `class="shiki tokyo-night"` on both `<pre>` elements (2 code blocks)
- `data-tag-filter` attribute present on notes index page
- Browser verification: tag filter click reduces visible note count, second click restores all
- Browser assertions (8/8): data-note-tags, readTime text, tag text, pre.shiki, table, blockquote, hr all visible
- All existing `data-*` DOM markers preserved: `data-notes-index`, `data-note-item`, `data-note-link`, `data-note-title`, `data-note-date`, `data-note-summary`, `data-note-page`, `data-note-body`

## Requirements Advanced

- R502 — Frontmatter schema expanded with tags, type, readTime; existing notes migrated
- R503 — Tag filtering implemented on notes index with clickable client-side filter
- R504 — Shiki syntax highlighting integrated with tokyo-night theme
- R505 — Rich markdown rendering for images, tables, blockquotes, inline code, horizontal rules
- R507 — Both existing notes migrated to expanded schema and rendering correctly
- R510 — All 18 existing Playwright tests pass
- R204 — Notes browsable by tag via tag filter on index page

## Requirements Validated

- R502 — Expanded frontmatter with tags/type/readTime proven by build + type checking + rendered output
- R503 — Tag filtering proven by browser verification (click filters list, click again restores)
- R504 — Shiki proven by `class="shiki tokyo-night"` in rendered HTML + visual code block coloring
- R505 — Rich markdown proven by test note rendering all element types with retro styling
- R507 — Migration proven by both existing notes building and rendering correctly with new schema
- R510 — All 18 Playwright tests pass against production build
- R204 — Tag browsing proven by functional tag filter on notes index

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

- Added `remark-gfm` dependency (not in original plan) — GFM tables don't render without it. Necessary addition discovered during T02 implementation.

## Known Limitations

- Tag filter is client-side only — no URL query parameter persistence (clicking a tag then refreshing loses the filter state). Acceptable for current scale; URL-based filtering could be added if content volume grows.
- No automated visual regression testing — Shiki theme and CSS styling verified by manual browser inspection. D059 notes this gap.

## Follow-ups

- S02 consumes the frontmatter schema contract, media directory convention, and `src/content/notes/` target directory
- S03 consumes the unified markdown pipeline and `globals.css` markdown styles for domain card context

## Files Created/Modified

- `package.json` / `pnpm-lock.yaml` — added `@shikijs/rehype` and `remark-gfm` dependencies
- `src/lib/notes.ts` — async pipeline with Shiki + remark-gfm, expanded types, `getAllTags()` helper
- `src/app/notes/[slug]/page.tsx` — awaits async `getNoteBySlug` in component and metadata
- `src/app/globals.css` — rich markdown CSS, tag filter chips, note item tags, bracket suppression
- `src/components/notes/NotePage.tsx` — displays tags as chips and readTime inline with date
- `src/components/notes/NotesIndexPage.tsx` — serializes notes, delegates rendering to TagFilter client island
- `src/components/notes/TagFilter.tsx` — new 'use client' component with tag filtering and note list rendering
- `src/content/notes/keep-the-path-explicit.md` — migrated frontmatter (added type, tags)
- `src/content/notes/systems-over-abstractions.md` — migrated frontmatter (added type, tags)
- `src/content/notes/shiki-and-rich-markdown-test.md` — new test note exercising all rich rendering paths

## Forward Intelligence

### What the next slice should know
- The `NoteFrontmatter` type in `src/lib/notes.ts` is the boundary contract: `title`, `summary`, `published`, `updated?`, `tags: string[]`, `type: 'note' | 'journal'`, `readTime: number`. S02's skill must generate frontmatter matching this exactly.
- Media convention: `public/notes/<slug>/` directory, referenced as `/notes/<slug>/filename.ext` in markdown. The skill should create this directory when evidence files are needed.
- `getAllNotes()` and `getAllNoteSlugs()` remain synchronous — only `getNoteBySlug()` is async (Shiki requires it).

### What's fragile
- The `parseFrontmatter` defaults (`tags: []`, `type: 'note'`, `readTime: 1`) silently recover from malformed frontmatter — if the skill generates bad frontmatter it will build but display wrong metadata rather than failing loudly.
- Tag filter relies on exact string matching — tags must be consistent across notes (lowercase, no trailing spaces).

### Authoritative diagnostics
- `class="shiki tokyo-night"` on `<pre>` elements in rendered HTML — definitive proof Shiki is working
- `data-tag-filter` on notes index — proves TagFilter component mounted
- `pnpm test` (18 tests) — the release gate, covers all DOM marker contracts

### What assumptions changed
- Standard remark-parse does not support pipe tables — remark-gfm was required (D062). Any future markdown features that depend on GFM extensions (strikethrough, task lists, autolinks) are now supported.
