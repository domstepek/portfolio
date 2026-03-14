---
id: S01
milestone: M007
status: ready
---

# S01: Enhanced markdown rendering and tag system — Context

## Goal

Enhance the notes pipeline with Shiki syntax highlighting and an expanded frontmatter schema (tags, type, readTime), add tag display and single-tag client-side filtering on the index page, and migrate the two existing notes to the new schema.

## Why this Slice

S01 is the foundation — it expands the content schema and rendering pipeline that S02 (the agent skill) writes files for. The skill cannot produce well-structured journal entries without a locked frontmatter contract and a verified rendering pipeline. S01 also retires both key risks: the `processSync` → async Shiki migration and the minimal `'use client'` tag filter island.

## Scope

### In Scope

- Expand `NoteFrontmatter` to include `tags: string[]`, `type: 'note' | 'journal'`, `readTime: number`
- Migrate `getNoteBySlug` from synchronous `processSync` to async using `@shikijs/rehype`
- Add `getAllTags(): string[]` to `src/lib/notes.ts`
- Tag display on the `/notes` index — each note card shows its tags
- Single-active-tag client-side filter on the index — click a tag to filter, click again (or another) to change; state is in-memory only, not URL-encoded
- `readTime` rendered on each index card alongside the date (e.g. "3 min read")
- Visible `type` badge on each index card (e.g. "journal" or "note")
- Tags displayed (non-clickable) on individual note detail pages (`/notes/[slug]`)
- Rich markdown CSS in `globals.css`: code blocks with Shiki output, images, tables, blockquotes
- Shiki theme: a built-in dark theme (e.g. `github-dark` or `vitesse-dark`) with CSS overrides to fit the retro terminal aesthetic — keep `var(--bg-elevated)` background, border, and border-radius consistent with existing `pre` styles
- `public/notes/<slug>/` directory convention established for media
- Migrate the two existing notes (`keep-the-path-explicit.md`, `systems-over-abstractions.md`) to the expanded schema — add `tags`, `type`, `readTime`
- All 18 existing Playwright tests continue to pass

### Out of Scope

- URL-based tag filter state (`?tag=shiki`) — bookmarking/sharing deferred
- Multi-select tag filtering — single active tag only for now
- Tags shown on detail page are display-only, not clickable (no navigation back to filtered index)
- Full-text search across notes
- RSS feed
- MDX — staying with plain markdown + unified pipeline
- Video hosting — external embeds only
- Pagination on notes index
- Custom Shiki theme object mapped to CSS variables — built-in theme + CSS override is sufficient
- Any new note content beyond the two migration updates

## Constraints

- Must use `@shikijs/rehype` in the unified pipeline — not a standalone highlighter or custom transformer
- `getNoteBySlug` must become fully async; any call sites (`app/notes/[slug]/page.tsx`) must be updated accordingly
- Tag filter must be a minimal `'use client'` island — no framework-level state management, no Zustand, no context
- `NotesIndexPage` is currently a server component; the tag filter island wraps only the interactive portion, not the whole page
- Shiki adds async to the pipeline — `processSync` must be replaced with `process` (async)
- Skill file format (S02) depends on the frontmatter schema locked here — field names, types, and valid values are a contract

## Integration Points

### Consumes

- `src/lib/notes.ts` — existing synchronous pipeline; will be migrated to async with Shiki added
- `src/content/notes/*.md` — two existing notes; will be updated to the expanded frontmatter schema
- `src/components/notes/NotesIndexPage.tsx` — existing server component; tag filter island added as a client child
- `src/components/notes/NotePage.tsx` — existing server component; tag display added to the intro section
- `src/app/globals.css` — `.note-page__body pre` and related styles; extended with Shiki output styles, image, and table rules

### Produces

- `src/lib/notes.ts` → `NoteFrontmatter` with `tags: string[]`, `type`, `readTime`; async `getNoteBySlug()`; `getAllTags(): string[]`
- `src/content/notes/*.md` → expanded frontmatter schema (locked contract for S02)
- `public/notes/<slug>/` → directory convention for media (established, not necessarily populated)
- `src/app/globals.css` → `.note-page__body pre`, `.note-page__body img`, table styles for rendered markdown
- Tag filter client component on notes index page

## Open Questions

- **readTime calculation**: Should `readTime` be computed automatically by `notes.ts` (word count ÷ 200) rather than requiring the author to write it manually in frontmatter? Current thinking: auto-compute from content so notes don't need manual maintenance — but make it overridable via frontmatter if present.
- **Shiki theme choice**: `github-dark` vs `vitesse-dark` vs another built-in dark theme. Current thinking: agent's discretion — pick whichever reads cleanest on a dark `var(--bg-elevated)` background. Override background, border, and border-radius via CSS to match existing `pre` treatment.
