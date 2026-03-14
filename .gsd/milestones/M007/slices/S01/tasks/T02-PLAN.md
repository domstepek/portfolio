---
estimated_steps: 5
estimated_files: 3
---

# T02: Rich Markdown CSS and Note Detail Enhancements

**Slice:** S01 — Enhanced Markdown Rendering and Tag System
**Milestone:** M007

## Description

Add CSS for all rich markdown elements within `.note-page__body` — Shiki code blocks, images, tables, inline code, horizontal rules — styled to match the dark retro terminal aesthetic. Suppress bracket-link decorations inside note body. Update `NotePage` to display tags and read time from the expanded frontmatter. Create a test note with code blocks in multiple languages, a table, blockquote, and inline code to exercise all rendering paths.

## Steps

1. Update `.note-page__body pre` CSS: set `background: transparent` so Shiki's inline theme controls the background color. Keep existing border, border-radius, padding, and overflow-x. Add `.note-page__body pre code` for font sizing consistency.
2. Add CSS for: `.note-page__body img` (max-width: 100%, border, border-radius matching existing image patterns), `.note-page__body table` (border-collapse, border on th/td, cell padding, retro green accent for headers), `.note-page__body code:not(pre code)` (inline code — bg-elevated background, small padding, border-radius, font-size), `.note-page__body hr` (border-color matching --border), `.note-page__body a::before, .note-page__body a::after` (content: none — suppress bracket-link decorations inside rendered markdown).
3. Update `NotePage.tsx`: import `NoteFrontmatter` type changes. Add tags display as styled chips below the date in `.note-page__meta`. Add read time display (e.g. "2 min read"). Preserve all existing `data-*` DOM markers.
4. Create `src/content/notes/shiki-and-rich-markdown-test.md` — a test note with frontmatter (`title`, `summary`, `published`, `type: journal`, `tags: [testing, webdev]`), containing: a TypeScript code block, a bash code block, a blockquote, inline code, a small table, and a horizontal rule. This exercises every rich rendering path.
5. Verify `pnpm build` succeeds and inspect the rendered test note HTML for `class="shiki"` on `<pre>` elements.

## Must-Haves

- [ ] Shiki code blocks render with theme-controlled background (transparent CSS override)
- [ ] Images styled with max-width, border, border-radius
- [ ] Tables styled with retro borders and cell padding
- [ ] Inline code has visible background highlight
- [ ] Bracket-link decorations suppressed inside `.note-page__body`
- [ ] `NotePage` displays tags and readTime
- [ ] Test note with code blocks, table, blockquote renders correctly
- [ ] `pnpm build` succeeds

## Verification

- `pnpm build` completes — test note generates static HTML
- Inspect rendered HTML: `<pre>` elements in the test note have Shiki attributes (class or inline style with background-color)
- Tags and read time display on note detail page (visual inspection or HTML inspection)

## Observability Impact

- Signals added/changed: None (CSS is passive; test note is a content fixture)
- How a future agent inspects this: Check CSS specificity by inspecting computed styles on `.note-page__body pre`, `.note-page__body img`, etc.; verify bracket suppression by checking `a::before` content
- Failure state exposed: If Shiki theme is not applied, `<pre>` elements will have transparent background with no inline style override — visually broken. Missing CSS for images/tables is visible via unstyled elements.

## Inputs

- `src/lib/notes.ts` — T01's async pipeline with Shiki integration and expanded frontmatter
- `src/app/globals.css` — existing `.note-page__body` styles (pre, blockquote)
- `src/components/notes/NotePage.tsx` — current component receiving `NoteWithContent`

## Expected Output

- `src/app/globals.css` — updated with rich markdown styles for code, images, tables, inline code, hr, link decoration suppression
- `src/components/notes/NotePage.tsx` — displays tags as chips and readTime
- `src/content/notes/shiki-and-rich-markdown-test.md` — test note exercising all rendering paths
