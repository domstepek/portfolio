# S01: Enhanced Markdown Rendering and Tag System

**Goal:** Notes render with Shiki syntax-highlighted code blocks, rich markdown styling (images, tables, blockquotes), and the notes index supports clickable tag filtering. Existing notes are migrated to the expanded frontmatter schema and all 18 Playwright tests pass.
**Demo:** A test note containing code blocks in multiple languages, an image, a table, and blockquote renders with proper Shiki highlighting and retro-themed styling. Tags are clickable on the index page and filter the list. Existing notes display correctly.

## Must-Haves

- `@shikijs/rehype` integrated into the unified pipeline with `tokyo-night` theme (D056)
- `getNoteBySlug` is async (`processSync` → `process`) and route file awaits it
- `NoteFrontmatter` expanded with `tags: string[]`, `type: 'note' | 'journal'`, `readTime: number`
- `getAllTags()` helper function exported from `notes.ts`
- Two existing notes migrated with `type: 'note'` and appropriate tags
- CSS for: Shiki code blocks, images, tables, inline code, blockquotes, horizontal rules (dark retro theme)
- Bracket-link `[`/`]` decorations suppressed inside `.note-page__body`
- `NotePage` displays tags and read time
- `TagFilter` `'use client'` component on notes index with active filter state
- All `data-*` DOM markers preserved (`data-notes-index`, `data-note-item`, `data-note-link`, `data-note-title`, `data-note-date`, `data-note-summary`, `data-note-page`, `data-note-body`)
- All 18 existing Playwright tests pass
- `pnpm build` succeeds

## Proof Level

- This slice proves: contract (expanded pipeline renders Shiki-highlighted code; tag filter works; boundary contracts hold)
- Real runtime required: yes (build + Playwright tests against `next start`)
- Human/UAT required: yes (visual review of rendered code blocks, images, and tag filter styling)

## Verification

- `pnpm build` — production build succeeds with async pipeline and Shiki
- `pnpm test` — all 18 existing Playwright tests pass (R510)
- Rendered HTML of test note contains Shiki `class="shiki"` or `style` attributes on `<pre>` element (proves Shiki integration)
- Tag filter component renders on notes index and filters list when a tag is clicked

## Observability / Diagnostics

- Runtime signals: Shiki adds `class="shiki"` and inline `style` to `<pre>` elements — absence indicates pipeline misconfiguration
- Inspection surfaces: `pnpm build` output shows static page generation for all note slugs; rendered HTML inspectable via view-source or Playwright `innerHTML()`
- Failure visibility: Build failure with stack trace if `processSync` is still called (Shiki requires async); type errors if frontmatter contract is broken
- Redaction constraints: None

## Integration Closure

- Upstream surfaces consumed: none (first slice)
- New wiring introduced in this slice:
  - `@shikijs/rehype` plugin in unified pipeline (`notes.ts`)
  - Async `getNoteBySlug` → route file `await` chain
  - `TagFilter` client island in `NotesIndexPage`
  - Expanded `NoteFrontmatter` type (S01→S02 boundary contract)
  - CSS for rich markdown rendering in `.note-page__body`
- What remains before the milestone is truly usable end-to-end: S02 (engineering journal agent skill that generates entries using this pipeline)

## Tasks

- [x] **T01: Upgrade markdown pipeline — Shiki, async conversion, expanded frontmatter** `est:45m`
  - Why: Foundation for all rendering enhancements — converts sync pipeline to async with Shiki, expands the frontmatter type that is the S01→S02 boundary contract, and migrates existing notes
  - Files: `package.json`, `src/lib/notes.ts`, `src/content/notes/keep-the-path-explicit.md`, `src/content/notes/systems-over-abstractions.md`, `src/app/notes/[slug]/page.tsx`
  - Do: Install `@shikijs/rehype`. Add `rehypeShiki` with `theme: 'tokyo-night'` between `remarkRehype` and `rehypeStringify`. Convert `processSync` → `process` (async). Expand `NoteFrontmatter` with `tags`, `type`, `readTime`. Update `parseFrontmatter` to handle new fields + calculate readTime from word count. Add `getAllTags()`. Migrate existing notes frontmatter. Update route file to `await getNoteBySlug()` in both `NoteRoute` and `generateMetadata`.
  - Verify: `pnpm build` succeeds; existing notes still have rendered HTML content
  - Done when: Build passes with async Shiki pipeline and both existing notes render without errors

- [x] **T02: Rich markdown CSS and note detail enhancements** `est:35m`
  - Why: Shiki outputs HTML with inline styles but needs container-level CSS; images, tables, inline code, and other rich markdown elements need retro-themed styling; NotePage needs to display tags and readTime
  - Files: `src/app/globals.css`, `src/components/notes/NotePage.tsx`, `src/content/notes/shiki-and-rich-markdown-test.md`
  - Do: Add/update CSS for Shiki `pre` (transparent bg override so Shiki's inline theme wins, preserve border/radius/padding), images (max-width, border, border-radius), tables (border-collapse, retro borders, cell padding), inline code (bg highlight, padding, font), horizontal rules, link bracket suppression in `.note-page__body`. Update `NotePage` to accept and display tags as styled chips and readTime. Create a test note with code blocks (TypeScript, bash), a blockquote, inline code, and a table to exercise all rendering paths.
  - Verify: `pnpm build` succeeds; test note renders with Shiki classes on `<pre>` elements (inspect build output or `curl` the page)
  - Done when: Test note with code blocks renders with syntax highlighting, images/tables/blockquotes have retro styling, tags and readTime display on note detail

- [x] **T03: Tag filter component and notes index integration** `est:35m`
  - Why: Completes the user-facing feature — tag filtering on the notes index with clickable tags and a client-side filtered list, all while preserving DOM marker contracts consumed by Playwright tests
  - Files: `src/components/notes/TagFilter.tsx`, `src/components/notes/NotesIndexPage.tsx`, `src/lib/notes.ts`
  - Do: Create `TagFilter` `'use client'` component that receives serialized notes (Date→ISO string) and tag list as props, manages active tag state via `useState`, renders clickable tag chips (active state styled), and renders the filtered note list preserving all `data-*` DOM markers. Update `NotesIndexPage` to serialize note dates, compute tags via `getAllTags()`, render `TagFilter` as client island. Add `getAllTags()` usage. Display tag chips on each note item in the index. Preserve `data-notes-index` on container, `data-note-item`/`data-note-link`/`data-note-title`/`data-note-date`/`data-note-summary` on each item.
  - Verify: `pnpm build` succeeds; `pnpm test` — all 18 Playwright tests pass; tag filter renders and clicking a tag filters the list
  - Done when: Tag filter works on notes index, all 18 Playwright tests pass, build succeeds

## Files Likely Touched

- `package.json` / `pnpm-lock.yaml`
- `src/lib/notes.ts`
- `src/app/notes/[slug]/page.tsx`
- `src/app/globals.css`
- `src/components/notes/NotePage.tsx`
- `src/components/notes/NotesIndexPage.tsx`
- `src/components/notes/TagFilter.tsx` (new)
- `src/content/notes/keep-the-path-explicit.md`
- `src/content/notes/systems-over-abstractions.md`
- `src/content/notes/shiki-and-rich-markdown-test.md` (new)
