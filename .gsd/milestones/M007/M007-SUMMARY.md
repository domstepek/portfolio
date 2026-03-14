---
id: M007
provides:
  - Async unified markdown pipeline with Shiki syntax highlighting (tokyo-night theme) and remark-gfm
  - Expanded NoteFrontmatter schema with tags, type (note|journal), readTime
  - Client-side tag filtering on /notes index via TagFilter 'use client' island
  - Rich markdown CSS for code blocks, images, tables, blockquotes, inline code, horizontal rules
  - Global engineering journal agent skill at ~/.agents/skills/engineering-journal/SKILL.md
  - GSD symlink for pi auto-discovery of engineering-journal skill
  - Shared renderInlineMarkdown helper for domain proof page markdown enrichment
  - Domain proof pages render inline code and bold metrics via dangerouslySetInnerHTML
  - Two published journal entries proving end-to-end pipeline from skill invocation to rendered output
key_decisions:
  - D054 — Global skill at ~/.agents/skills/engineering-journal/ symlinked to GSD skills
  - D055 — Notes coexistence model (note|journal type field, tag filtering)
  - D056 — Shiki via @shikijs/rehype in unified pipeline
  - D057 — Media in public/notes/<slug>/ with evidence TODO markers
  - D058 — Casual first-person engineering voice matching D031
  - D059 — S01 verification via build + 18 Playwright tests + Shiki class inspection
  - D060 — Tag filter as 'use client' island with serialized data
  - D061 — Shiki theme background via transparent CSS override
  - D062 — remark-gfm for GFM table support
  - D063 — Sync inline markdown helper for domain proof fields (no Shiki, strips <p> wrapper)
  - D064 — CSS scoping for domain proof inline code via [data-flagship] code
patterns_established:
  - Async getNoteBySlug with Shiki requires Promise return type
  - Client island pattern for interactive notes UI (server serializes, client manages state)
  - Rich markdown styles scoped to .note-page__body to avoid cross-component leakage
  - Multi-phase agent skill structure (scan → frontmatter → body → save)
  - renderInlineMarkdown with <p> stripping for inline HTML injection contexts
  - Journal entries pull real code snippets from codebase rather than fabricating examples
observability_surfaces:
  - class="shiki tokyo-night" on <pre> elements confirms Shiki pipeline working
  - data-tag-filter attribute on notes index confirms TagFilter component mounted
  - data-note-tags and data-note-read-time attributes on note detail pages
  - "[data-flagship] code" and "[data-supporting-item] code" selectors confirm domain enrichment
  - grep -l 'type: journal' src/content/notes/*.md counts journal entries
requirement_outcomes:
  - id: R501
    from_status: active
    to_status: validated
    proof: SKILL.md exists at ~/.agents/skills/engineering-journal/ with four-phase authoring instructions; GSD symlink verified; validation entry built and rendered through S01 pipeline
  - id: R502
    from_status: active
    to_status: validated
    proof: NoteFrontmatter type expanded with tags, type, readTime; both existing notes migrated; build + tsc --noEmit pass
  - id: R503
    from_status: active
    to_status: validated
    proof: TagFilter client island on /notes index; browser-verified click filtering
  - id: R504
    from_status: active
    to_status: validated
    proof: class="shiki tokyo-night" on <pre> elements in rendered HTML; visual code block coloring confirmed
  - id: R505
    from_status: active
    to_status: validated
    proof: Test note renders code blocks, images, tables, blockquotes, inline code, horizontal rules with retro styling
  - id: R506
    from_status: active
    to_status: validated
    proof: SKILL.md specifies public/notes/<slug>/ directory creation and evidence TODO markers; S01 CSS handles image rendering
  - id: R507
    from_status: active
    to_status: validated
    proof: Both existing notes (keep-the-path-explicit, systems-over-abstractions) migrated with type:note and tags; build succeeds, all 18 tests pass
  - id: R508
    from_status: active
    to_status: validated
    proof: Skill specifies hardcoded output path to src/content/notes/ with slug collision check; validation entry written and built successfully
  - id: R509
    from_status: active
    to_status: validated
    proof: SKILL.md tone guardrails reference D031/D058 with concrete examples and anti-patterns
  - id: R510
    from_status: active
    to_status: validated
    proof: All 18 Playwright tests pass against production build (gate ×5, public ×8, shader ×3, gallery/mermaid ×2)
  - id: R204
    from_status: deferred
    to_status: validated
    proof: Tag filtering on /notes index via TagFilter client island; browser-verified click-to-filter behavior
duration: 99m
verification_result: passed
completed_at: 2026-03-14
---

# M007: Engineering Journal

**Async Shiki-powered markdown pipeline, client-side tag filtering, global agent skill for journal authoring, domain page markdown enrichment, and two published journal entries — all 18 Playwright tests pass.**

## What Happened

Four slices built the engineering journal capability end-to-end.

**S01** upgraded the notes markdown pipeline from synchronous to async, integrating `@shikijs/rehype` with the `tokyo-night` theme for syntax-highlighted code blocks and `remark-gfm` for GFM table support (discovered mid-implementation — standard remark doesn't handle pipe tables). Expanded `NoteFrontmatter` with `tags[]`, `type` (note|journal), and `readTime` fields. Built comprehensive rich markdown CSS scoped to `.note-page__body` — code blocks, tables with green accent headers, inline code, bordered images, blockquotes, and horizontal rules. Created a `TagFilter` `'use client'` component following the established client island pattern: server component serializes data (Date→ISO strings), client component manages active tag state via `useState`. Both existing notes migrated to the expanded schema. A test note exercises every rich rendering path.

**S02** created the global engineering journal agent skill at `~/.agents/skills/engineering-journal/SKILL.md` with four-phase authoring instructions: context scan (minimum-context gate), frontmatter generation (exact template matching `parseFrontmatter()` contract), body writing (D031/D058 tone rules, code block language tags, evidence TODO markers, 600–1200 word target), and save/report. Symlinked to GSD for pi auto-discovery. Integration validated by writing a test entry through the skill's exact output format and confirming the S01 pipeline rendered it correctly.

**S03** created a shared `renderInlineMarkdown` helper in `src/lib/markdown.ts` — a synchronous unified pipeline (no Shiki, no remark-gfm) that strips the outer `<p>` wrapper for single-paragraph content to prevent nesting issues. Wired `DomainProofPage.tsx` to render flagship problem, constraints, decisions, outcomes, and supporting work context through the helper via `dangerouslySetInnerHTML`. Audited and selectively enriched all three domain data files with backtick-wrapped tool names (~30 terms) and bold key metrics. CSS scoped independently via `[data-flagship] code` and `[data-supporting-item] code`.

**S04** wrote two journal entries using the S02 skill. The first (991 words) covers building this site across seven GSD milestones, with code snippets pulled from the actual codebase. The second (924 words) covers building an automatic training material writer — the skill's Phase 1 minimum-context gate worked as designed, prompting the user for external project context since the training material writer has zero repo presence. Both render with Shiki-highlighted code blocks through the full pipeline.

## Cross-Slice Verification

**Success criterion: `/notes` displays tags and supports clickable tag filtering**
→ S01 built `TagFilter` client island with `data-tag-filter` DOM marker. Browser verification confirmed click filters list, second click restores all. ✅

**Success criterion: Code blocks render with Shiki syntax highlighting in dark theme**
→ S01 integrated `@shikijs/rehype` with `tokyo-night` theme. Rendered HTML contains `class="shiki tokyo-night"` on `<pre>` elements (confirmed for test note and both journal entries — 2 code blocks each). ✅

**Success criterion: Images, tables, blockquotes render with proper retro styling**
→ S01 test note (`shiki-and-rich-markdown-test.md`) exercises all paths. Browser assertions confirmed: `pre.shiki`, `table`, `blockquote`, `hr` all visible with styled rendering. ✅

**Success criterion: Global agent skill at `~/.agents/skills/engineering-journal/`**
→ S02 created SKILL.md with valid YAML frontmatter and four-phase instructions. File exists at expected path, symlink verified to GSD skills. ✅

**Success criterion: Skill prompts for evidence and writes directly to `src/content/notes/`**
→ S02 skill includes evidence TODO convention (`<!-- TODO: screenshot of X -->`) and hardcoded output path with slug collision check. ✅

**Success criterion: Existing notes migrated and continue to render correctly**
→ S01 migrated both notes (`keep-the-path-explicit`, `systems-over-abstractions`) with `type: note` and appropriate tags. Build succeeds, all 18 Playwright tests pass. ✅

**Success criterion: All 18 existing Playwright tests pass**
→ Verified: `CI=true pnpm build && CI=true pnpm test` — 18 passed (5.4s). Gate ×5, public ×8, shader ×3, gallery/mermaid ×2. ✅

**Definition of done — additional checks:**
- Enhanced markdown pipeline with Shiki → confirmed by `class="shiki tokyo-night"` ✅
- Tag filtering works → confirmed by browser verification ✅
- Existing notes migrated → both have expanded frontmatter ✅
- Global skill exists and is symlinked → file and symlink verified ✅
- Skill generates valid entry with correct frontmatter → S02 validation entry proved this ✅
- Sample journal entry renders end-to-end → S04 delivered two entries, both rendering with code, tags ✅

All success criteria met. All definition of done items satisfied.

## Requirement Changes

- R501: active → validated — Skill file at `~/.agents/skills/engineering-journal/SKILL.md` with four-phase authoring; GSD symlink; validation entry rendered through pipeline
- R502: active → validated — NoteFrontmatter expanded with tags/type/readTime; existing notes migrated; build + type checking pass
- R503: active → validated — TagFilter client island on /notes index; browser-verified click filtering
- R504: active → validated — `class="shiki tokyo-night"` in rendered HTML; visual code block coloring
- R505: active → validated — Test note renders all element types (code blocks, images, tables, blockquotes, inline code, hr) with retro styling
- R506: active → validated — Skill specifies `public/notes/<slug>/` media convention with evidence TODO markers
- R507: active → validated — Both existing notes migrated to expanded schema; build succeeds, all tests pass
- R508: active → validated — Skill writes to `src/content/notes/` with slug collision check; validation entry written and built
- R509: active → validated — Skill tone guardrails reference D031/D058 with examples and anti-patterns
- R510: active → validated — 18/18 Playwright tests pass against production build
- R204: deferred → validated — Tag filtering on /notes index via TagFilter client island; click-to-filter verified in browser

## Forward Intelligence

### What the next milestone should know
- The notes markdown pipeline in `src/lib/notes.ts` is now async (Shiki requires it). `getAllNotes()` and `getAllNoteSlugs()` remain synchronous — only `getNoteBySlug()` is async.
- The `NoteFrontmatter` type is the boundary contract: `title`, `summary`, `published`, `updated?`, `tags: string[]`, `type: 'note' | 'journal'`, `readTime: number`. Any new notes or skill changes must match this exactly.
- `renderInlineMarkdown` in `src/lib/markdown.ts` is available as a lightweight sync helper for any component that needs inline markdown→HTML conversion (no Shiki, no remark-gfm).
- The engineering journal skill at `~/.agents/skills/engineering-journal/SKILL.md` has a hardcoded output path (`/Users/jstepek/Personal Repos/website/src/content/notes/`). If the repo moves, update the skill manually.
- Media convention: `public/notes/<slug>/` directory, referenced as `/notes/<slug>/filename.ext` in markdown.

### What's fragile
- `parseFrontmatter()` silently defaults malformed fields (tags→`[]`, type→`'note'`, readTime→`1`) — bad frontmatter builds but displays wrong metadata rather than failing loudly
- Tag filter relies on exact string matching — tags must be consistent across notes (lowercase, no trailing spaces, no duplicates with different casing)
- The `<p>` stripping regex in `renderInlineMarkdown` assumes single-paragraph content — multi-paragraph content may cause `<p>` nesting issues in domain proof cards
- The skill is a static prompt file — no runtime enforcement of frontmatter correctness beyond `parseFrontmatter()`'s silent defaults

### Authoritative diagnostics
- `class="shiki tokyo-night"` on `<pre>` elements — definitive proof Shiki pipeline is working
- `data-tag-filter` on notes index — proves TagFilter component mounted
- `pnpm test` (18 tests) — the release gate, covers all DOM marker contracts
- `grep -l 'type: journal' src/content/notes/*.md | wc -l` — quick journal entry count
- `ls -la ~/.agents/skills/engineering-journal/SKILL.md` — skill file presence
- `readlink ~/.gsd/agent/skills/engineering-journal` — symlink target verification

### What assumptions changed
- Standard remark-parse does not support GFM pipe tables — `remark-gfm` was required (D062). Future markdown features depending on GFM extensions (strikethrough, task lists, autolinks) are now supported.
- The engineering journal skill's Phase 1 minimum-context gate works as designed — it correctly prompts for user-provided context when the conversation has no repo-relevant information (proven by the training material writer entry in S04).

## Files Created/Modified

- `package.json` / `pnpm-lock.yaml` — added `@shikijs/rehype` and `remark-gfm` dependencies
- `src/lib/notes.ts` — async pipeline with Shiki + remark-gfm, expanded types, `getAllTags()` helper
- `src/lib/markdown.ts` — shared sync `renderInlineMarkdown` helper
- `src/app/notes/[slug]/page.tsx` — awaits async `getNoteBySlug`
- `src/app/globals.css` — rich markdown CSS, tag filter chips, domain proof inline code styling
- `src/components/notes/NotePage.tsx` — tags as chips, readTime display
- `src/components/notes/NotesIndexPage.tsx` — delegates to TagFilter client island
- `src/components/notes/TagFilter.tsx` — new 'use client' tag filtering component
- `src/components/domains/DomainProofPage.tsx` — renders fields via `dangerouslySetInnerHTML` + markdown helper
- `src/data/domains/product.ts` — enriched with inline code and bold metrics
- `src/data/domains/analytics-ai.ts` — enriched with inline code and bold metrics
- `src/data/domains/developer-experience.ts` — enriched with inline code and bold metrics
- `src/content/notes/keep-the-path-explicit.md` — migrated frontmatter
- `src/content/notes/systems-over-abstractions.md` — migrated frontmatter
- `src/content/notes/shiki-and-rich-markdown-test.md` — test note for all rich rendering paths
- `src/content/notes/building-this-site-with-gsd.md` — journal entry (991 words)
- `src/content/notes/building-an-automatic-training-material-writer.md` — journal entry (924 words)
- `~/.agents/skills/engineering-journal/SKILL.md` — global agent skill
- `~/.gsd/agent/skills/engineering-journal` — GSD symlink
