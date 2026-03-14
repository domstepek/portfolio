# S04: First journal entries — UAT

**Milestone:** M007
**Written:** 2026-03-14

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: This slice produces static markdown files processed at build time — all verification is against built artifacts and rendered output, no runtime behavior to test

## Preconditions

- `pnpm build` has completed successfully
- A local server is running (`pnpm start`) or built HTML is available in `.next/server/app/`
- Both journal entry source files exist in `src/content/notes/`

## Smoke Test

1. Run `ls src/content/notes/building-this-site-with-gsd.md src/content/notes/building-an-automatic-training-material-writer.md`
2. **Expected:** Both files exist

## Test Cases

### 1. GSD journal entry renders with Shiki highlighting

1. Open `/notes/building-this-site-with-gsd` in a browser
2. Scroll to a code block
3. **Expected:** Code block has syntax coloring (not monochrome). Inspect element shows `<pre>` with `class="shiki tokyo-night"`
4. Verify at least two code blocks are present (RSC route snippet, unified pipeline snippet)

### 2. Training material writer journal entry renders with Shiki highlighting

1. Open `/notes/building-an-automatic-training-material-writer` in a browser
2. Scroll to a code block
3. **Expected:** Code block has syntax coloring. Inspect element shows `<pre>` with `class="shiki tokyo-night"`
4. Verify at least two code blocks are present (YAML config, TypeScript PR flow)

### 3. Both entries appear on notes index with correct metadata

1. Open `/notes`
2. Locate the "Building this site with GSD" entry
3. **Expected:** Shows `journal` type badge and tags including `nextjs`, `webdev`, `engineering`, `webgpu`
4. Locate the "Building an automatic training material writer" entry
5. **Expected:** Shows `journal` type badge and tags including `ai`, `agents`, `automation`

### 4. Tag filtering includes new journal tags

1. Open `/notes`
2. Click a tag from one of the new entries (e.g. `webgpu` or `agents`)
3. **Expected:** List filters to show only entries with that tag
4. Click the same tag again
5. **Expected:** Filter clears, all entries visible again

### 5. Frontmatter parses without silent defaults

1. Run `grep -c 'type: journal' src/content/notes/building-this-site-with-gsd.md`
2. **Expected:** Returns 1
3. Run `grep -c 'type: journal' src/content/notes/building-an-automatic-training-material-writer.md`
4. **Expected:** Returns 1
5. On `/notes` index, verify both entries do NOT show `note` type or empty tag list (which would indicate `parseFrontmatter()` silently defaulted malformed fields)

### 6. Build succeeds with new routes

1. Run `pnpm build`
2. **Expected:** Build succeeds. Route table includes `/notes/building-this-site-with-gsd` and `/notes/building-an-automatic-training-material-writer`

### 7. All existing tests pass

1. Run `pnpm test`
2. **Expected:** 18/18 Playwright tests pass

## Edge Cases

### Malformed frontmatter detection

1. Open one of the new journal markdown files
2. Intentionally change `tags:` to `tags: invalid-not-array`
3. Run `pnpm build`
4. Open `/notes` and check the entry's rendered metadata
5. **Expected:** Tags show as empty (parseFrontmatter silently defaults) — this confirms the failure mode described in the plan. Revert the change.

### Journal type count

1. Run `grep -l 'type: journal' src/content/notes/*.md | wc -l`
2. **Expected:** Returns 3 (test fixture + 2 new entries)

## Failure Signals

- Code blocks render as monochrome text without syntax coloring → Shiki pipeline not processing the entry
- Entry shows `note` type instead of `journal` on `/notes` index → frontmatter malformed or `parseFrontmatter()` silently defaulting
- Tags show as empty on `/notes` index → YAML tags array not parsed correctly
- Build fails → markdown syntax error or frontmatter parse failure
- Entry missing from `/notes` index → slug collision or file not in `src/content/notes/`
- Playwright tests fail → regression from new content

## Requirements Proved By This UAT

- R504 (Shiki syntax highlighting) — both entries exercise the Shiki pipeline with language-tagged fenced code blocks
- R502 (expanded frontmatter schema) — both entries use `type: journal`, `tags[]`, and `readTime`
- R503 (tag filtering) — new journal tags appear in the filter and work correctly
- R510 (existing Playwright tests pass) — 18/18 after adding new content

## Not Proven By This UAT

- R501 (skill generates entries from conversation context) — validated in S02; this UAT tests the output artifacts, not the skill invocation process
- R506 (local media storage) — neither entry includes images; media convention validated in S02
- Visual rendering quality (font, spacing, colors) — requires human visual review beyond Shiki class presence

## Notes for Tester

- The `parseFrontmatter()` silent-default behavior is the main subtle failure mode. Always check rendered metadata on `/notes`, not just the source files. A source file can have valid YAML but still render wrong if the parser doesn't match.
- Word counts should be 991 (GSD entry) and 924 (training material entry). These are within the 600–1200 target range.
- Code snippets in the GSD entry are from the actual codebase — they should match current source if the code hasn't changed since the entry was written.
