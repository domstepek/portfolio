# S04: First journal entries

**Goal:** Two journal entries written using the S02 engineering journal skill, rendered correctly on the website through the S01 markdown pipeline.
**Demo:** Both entries appear on `/notes`, render with Shiki-highlighted code blocks, display correct frontmatter metadata (type: journal, tags, readTime), and are filterable via the tag filter.

## Must-Haves

- Journal entry about building this site with GSD v2 — covers the seven-milestone arc, Next.js migration, agent-driven development
- Journal entry about building the automatic training material writer for sample tracking — covers agent workflow, multi-source context, MCP vision
- Both entries have valid frontmatter matching `parseFrontmatter()` contract (`type: journal`, tags as YAML array, `published` as bare date)
- Both entries contain at least one fenced code block with language tag (exercises Shiki pipeline)
- Both entries are 600–1200 words
- `pnpm build` succeeds with new routes
- `pnpm test` passes 18/18

## Verification

- `pnpm build` — succeeds, new note routes generated
- `pnpm test` — 18/18 Playwright tests pass
- `grep -l 'type: journal' src/content/notes/*.md | wc -l` — at least 3 (test fixture + 2 new entries)
- For each new entry: rendered HTML contains `class="shiki tokyo-night"` on `<pre>` elements
- **Frontmatter silent-default check**: for each new entry, verify rendered `/notes` index shows `journal` type badge and non-empty tag list — catches `parseFrontmatter()` silently defaulting malformed fields to empty/note

## Tasks

- [x] **T01: Write journal entry — building this site with GSD v2** `est:45m`
  - Why: First real journal entry proving the end-to-end pipeline with substantive content. Deep context available in GSD milestone history (M001–M007 summaries, PROJECT.md, DECISIONS.md).
  - Files: `src/content/notes/building-this-site-with-gsd.md`
  - Do: Follow the engineering journal skill's four phases. Phase 1: scan M001–M007 summaries, PROJECT.md, and DECISIONS.md for topic, decisions, code, problems, insights. Phase 2: generate frontmatter with `type: journal`, relevant tags (e.g. `[nextjs, webdev, engineering]`), today's date. Phase 3: write 600–1200 word body covering the milestone arc — Astro origins, server-side auth upgrade, WebGPU shader, Next.js migration, agent-driven development with GSD. Include code snippets from the actual codebase. Phase 4: generate slug, check for collisions, write the file.
  - Verify: `pnpm build` succeeds, `pnpm test` passes 18/18, rendered HTML has `class="shiki tokyo-night"` on code blocks, frontmatter parses correctly (tags as array, type as `journal`)
  - Done when: Entry renders on `/notes` with correct metadata and Shiki-highlighted code blocks
- [x] **T02: Write journal entry — training material writer for sample tracking** `est:45m`
  - Why: Second journal entry covering an external project. Proves the skill works for topics outside this repo's context. Requires user-provided project details since zero context exists in this repository.
  - Files: `src/content/notes/building-an-automatic-training-material-writer.md`
  - Do: Prompt the user for substantive context about the training material writer project: what was built, agent workflow design, how multi-source context and MCP vision were used, what problems were encountered, what was learned. If the user provides enough substance (skill Phase 1 minimum-context check), follow phases 2–4 to write the entry. If insufficient context is provided, report that the entry cannot be written per skill guardrails and close the task as blocked.
  - Verify: If written — `pnpm build` succeeds, `pnpm test` passes 18/18, rendered HTML has `class="shiki tokyo-night"` on code blocks, frontmatter parses correctly. If blocked — document the gap and close.
  - Done when: Entry renders on `/notes` with correct metadata and Shiki-highlighted code blocks, OR task is explicitly closed as blocked due to insufficient context.

## Observability / Diagnostics

- **Build route output**: `pnpm build` prints generated routes — new `/notes/<slug>` routes confirm entries are picked up by the pipeline
- **Shiki class presence**: `grep 'class="shiki tokyo-night"'` on built HTML confirms syntax highlighting rendered at build time
- **Frontmatter parse failures**: `parseFrontmatter()` silently defaults malformed fields — inspect rendered metadata (type badge, tags, readTime) on `/notes` to detect silent fallbacks
- **Tag filter coverage**: new journal tags appear in the `TagFilter` client island — verifiable by filtering on `/notes`
- **Failure path**: if a note has invalid frontmatter, it still builds but displays wrong metadata (empty tags, `note` type instead of `journal`). The `grep -l 'type: journal'` verification catches the source file; Playwright tests catch the rendered output.

## Verification (diagnostic/failure-path)

- `grep -l 'type: journal' src/content/notes/*.md | wc -l` — confirms source files have correct type (catches silent frontmatter defaults)
- For each new entry: verify rendered `/notes` index shows `journal` type and non-empty tag list (catches `parseFrontmatter()` silent fallback)

## Files Likely Touched

- `src/content/notes/building-this-site-with-gsd.md`
- `src/content/notes/building-an-automatic-training-material-writer.md`
