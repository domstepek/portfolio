# S01: Enhanced Markdown Rendering and Tag System — UAT

**Milestone:** M007
**Written:** 2026-03-14

## UAT Type

- UAT mode: mixed
- Why this mode is sufficient: Contract verification (build + 18 Playwright tests + Shiki class inspection) proves DOM markers, pipeline correctness, and backward compatibility. Live-runtime browser verification proves tag filter interaction. Human-experience review needed for visual theme coherence of syntax-highlighted code blocks, retro-styled tables, and tag chip aesthetics.

## Preconditions

- `pnpm build` succeeds (production build with static generation)
- `pnpm test` passes all 18 Playwright tests (run against `next start`)
- Dev server running (`pnpm dev`) or production server (`pnpm start` after build)

## Smoke Test

Navigate to `/notes/shiki-and-rich-markdown-test` — the page should display syntax-highlighted TypeScript and bash code blocks with colored tokens on a dark background, a table with green-accented headers, a blockquote with a left border, inline code with a background highlight, and tag chips below the title.

## Test Cases

### 1. Shiki syntax highlighting renders on code blocks

1. Navigate to `/notes/shiki-and-rich-markdown-test`
2. Inspect the TypeScript code block
3. **Expected:** Code block has colored syntax tokens (keywords, strings, types in distinct colors), dark background from tokyo-night theme, and `class="shiki tokyo-night"` on the `<pre>` element

### 2. Rich markdown elements render with retro theme styling

1. On the same test note page, scroll through all content
2. **Expected:**
   - Table has border-collapse styling with green-accented header row
   - Blockquote has a left accent border
   - Inline code (`like this`) has a background highlight with padding
   - Horizontal rule is visible with border color matching site theme
   - No bracket decorations (`[` / `]`) appear around links in the note body

### 3. Tags and read time display on note detail

1. Navigate to `/notes/shiki-and-rich-markdown-test`
2. **Expected:** Tags ("testing", "webdev") display as styled chips below the meta line; "1 min read" appears inline with the date

### 4. Tags display on note detail for migrated notes

1. Navigate to `/notes/keep-the-path-explicit`
2. **Expected:** Tags ("opinion", "engineering") display as styled chips; read time shows

### 5. Tag filter renders and filters on notes index

1. Navigate to `/notes`
2. **Expected:** Tag filter chips appear at the top (opinion, engineering, testing, webdev). All 3 notes are visible.
3. Click the "testing" tag chip
4. **Expected:** Only the test note remains visible; "testing" chip shows active styling (filled background)
5. Click "testing" again
6. **Expected:** All 3 notes are restored; "testing" chip returns to inactive styling

### 6. Tag chips display on each note item in the index

1. Navigate to `/notes`
2. **Expected:** Each note item shows its tags as small chips next to or below the date

### 7. Existing notes render correctly after migration

1. Navigate to `/notes/keep-the-path-explicit`
2. **Expected:** Full note content renders — title, date, summary, body text. No broken rendering, no `[object Promise]`, no missing content.
3. Navigate to `/notes/systems-over-abstractions`
4. **Expected:** Same — full content renders correctly

### 8. DOM marker contracts preserved

1. Navigate to `/notes`
2. Inspect the page source or use dev tools
3. **Expected:** `data-notes-index` on container, `data-note-item` on each note, `data-note-link`, `data-note-title`, `data-note-date`, `data-note-summary` on each item's elements
4. Navigate to `/notes/keep-the-path-explicit`
5. **Expected:** `data-note-page` on container, `data-note-body` on content area

## Edge Cases

### Empty tag filter state

1. Navigate to `/notes`
2. Click a tag, then click it again to deselect
3. **Expected:** Full note list restored, no stale filter state

### Note with no code blocks

1. Navigate to `/notes/keep-the-path-explicit` (no code blocks)
2. **Expected:** Page renders normally — no Shiki-related errors, no empty `<pre>` elements

## Failure Signals

- Code blocks render as unstyled monospace text without colored tokens → Shiki not integrated
- `class="shiki"` absent from `<pre>` elements → rehypeShiki plugin not in pipeline
- Tables render as raw pipe-delimited text → remark-gfm missing
- `[object Promise]` appears in rendered content → async conversion incomplete
- Bracket decorations (`[` / `]`) appear around links in note body → CSS suppression missing
- Tag filter clicks do nothing → TagFilter hydration failed or useState not wired
- Playwright tests fail on note DOM markers → `data-*` attributes removed or moved
- Build fails → type errors in expanded frontmatter or async pipeline

## Requirements Proved By This UAT

- R502 — Expanded frontmatter proven by tags/type/readTime rendering on note detail pages and correct build with new schema
- R503 — Tag filtering proven by test cases 5–6 (clickable filter, client-side list reduction)
- R504 — Shiki syntax highlighting proven by test case 1 (colored tokens, class="shiki tokyo-night")
- R505 — Rich markdown rendering proven by test case 2 (images, tables, blockquotes, inline code, hr)
- R507 — Existing notes migration proven by test cases 4, 7 (both notes render correctly with new schema)
- R510 — Existing Playwright tests proven by automated `pnpm test` (18/18 pass)
- R204 — Tag browsing proven by test cases 5–6 (filter by tag on index)

## Not Proven By This UAT

- R501 — Agent skill generation of journal entries (S02 scope)
- R506 — Media storage convention for journal evidence (S02 scope — directory convention established but no real media files tested)
- R508 — Skill writing markdown file into repo (S02 scope)
- R509 — Casual first-person engineering journal tone (S02 scope)
- Visual regression testing is not automated — theme coherence relies on human visual review

## Notes for Tester

- The test note (`shiki-and-rich-markdown-test`) is intentionally dense — it exercises every rendering path in one page. Real journal entries will be more naturally structured.
- The tokyo-night Shiki theme has its own dark background that should blend with the site's retro aesthetic. If the code block background feels too bright or too blue compared to the site background, flag it.
- Tag filter has no URL persistence — refreshing the page while a tag is active will show all notes again. This is by design for now.
- The bracket-link suppression (`[` / `]` around links) should only be suppressed inside `.note-page__body` — check that bracket decorations still appear on links elsewhere on the site (e.g., homepage, about page).
