# M007: Engineering Journal — Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

## Project Description

Add a global agent skill that distills coding session context into engineering journal entries, and enhance the website's notes section to render richer markdown content (syntax-highlighted code blocks, images, tag filtering) suitable for technical journal articles.

## Why This Milestone

The existing notes section supports short opinion pieces with minimal formatting. Engineering journal entries need richer content — code blocks, screenshots, diagrams — and a skill that makes writing them frictionless by reviewing conversation context and prompting for supporting evidence. This turns the notes section into a dual-purpose surface: short field notes plus longer technical journal entries.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Invoke an agent skill that reviews conversation context and generates a markdown journal entry with frontmatter, code snippets, and evidence prompts — written directly to `src/content/notes/`
- View journal entries with syntax-highlighted code blocks, images, and rich markdown rendering on the website
- Filter notes by tag on the `/notes` index page
- See both short notes (type: note) and longer journal entries (type: journal) coexisting in one list

### Entry point / environment

- Entry point: Agent skill invocation in any coding agent (pi, Cursor, etc.) + `/notes` and `/notes/[slug]` on the website
- Environment: Local dev / browser / production
- Live dependencies involved: None (static site, file-based content)

## Completion Class

- Contract complete means: Skill file exists at `~/.agents/skills/engineering-journal/SKILL.md`, symlinked to GSD skills; frontmatter schema expanded; Shiki highlighting renders; tag filtering works; existing tests pass
- Integration complete means: Skill generates a valid markdown file that the website renders correctly end-to-end
- Operational complete means: None — no services or lifecycle concerns

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- The skill generates a well-structured journal entry markdown file in `src/content/notes/` with correct frontmatter
- The generated entry renders on the website with syntax highlighting, images, and proper styling
- Tag filtering works on the index page
- All 18 existing Playwright tests pass

## Risks and Unknowns

- Shiki + unified pipeline integration — LOW RISK: `@shikijs/rehype` is designed for exactly this pipeline and has clean docs
- Skill file format — LOW RISK: well-established pattern from existing skills in `~/.agents/skills/`
- Tag filtering as client component — LOW RISK: small interactive island, well-understood pattern in this codebase

## Existing Codebase / Prior Art

- `src/lib/notes.ts` — Markdown pipeline (gray-matter + unified/remark/rehype); needs Shiki plugin and expanded frontmatter types
- `src/content/notes/*.md` — Existing notes with minimal frontmatter (title, summary, published, updated)
- `src/components/notes/NotePage.tsx` — Note detail page; renders HTML via `dangerouslySetInnerHTML`
- `src/components/notes/NotesIndexPage.tsx` — Notes list page; needs tag display and filter UI
- `src/app/globals.css` — `.note-page__body` styles for rendered markdown; needs code block and image styles
- `~/.agents/skills/electron/SKILL.md` — Reference for global skill file format
- `~/.gsd/agent/skills/` — GSD skill directory where symlink will point

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions — it is an append-only register; read it during planning, append to it during execution.

## Relevant Requirements

- R501 — Global agent skill generates journal entries from conversation context
- R502 — Expanded frontmatter schema (tags, type, readTime)
- R503 — Tag filtering on notes index
- R504 — Shiki syntax highlighting
- R505 — Rich markdown rendering (images, tables, blockquotes, code)
- R506 — Local media storage in `public/notes/<slug>/`
- R507 — Existing notes migrated to expanded schema
- R508 — Skill writes files directly to repo
- R509 — Casual first-person journal tone
- R510 — Existing Playwright tests continue to pass
- R204 — Notes taxonomy and browsing by tag (previously deferred, now delivered)

## Scope

### In Scope

- SKILL.md file at `~/.agents/skills/engineering-journal/`
- Symlink from `~/.gsd/agent/skills/engineering-journal` → `~/.agents/skills/engineering-journal`
- Expanded frontmatter schema: `tags[]`, `type` (note | journal), `readTime`
- Shiki syntax highlighting via `@shikijs/rehype`
- Tag display and client-side filtering on `/notes` index
- Rich markdown CSS for code blocks, images, tables, blockquotes
- Migrate 2 existing notes to new schema
- `public/notes/<slug>/` directory convention for media

### Out of Scope / Non-Goals

- Full-text search across notes
- RSS feed for notes
- MDX (staying with plain markdown + unified pipeline)
- Video hosting (external embeds only)
- Pagination on notes index (not enough content yet)
- CMS or database — content stays as markdown files

## Technical Constraints

- Must use `@shikijs/rehype` in the existing unified pipeline (not a separate highlighter)
- Tag filtering must be a minimal `'use client'` component — no framework-level state management
- Skill must work across agent tools (pi, Cursor, etc.) — SKILL.md format, not tool-specific
- Images referenced in markdown as `/notes/<slug>/filename.ext` (served from `public/`)

## Integration Points

- Unified markdown pipeline (`src/lib/notes.ts`) — Shiki plugin added here
- Notes components (`NotePage.tsx`, `NotesIndexPage.tsx`) — Tag display and filter UI
- Global CSS (`globals.css`) — Code block, image, and table styles
- Agent skill system (`~/.agents/skills/`) — Skill file placement and GSD symlink

## Open Questions

- None — all decisions captured during discussion.
