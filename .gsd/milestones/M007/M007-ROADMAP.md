# M007: Engineering Journal

**Vision:** Enhance the notes section with rich markdown rendering (Shiki syntax highlighting, images, tag filtering) and create a global agent skill that turns coding session context into engineering journal entries — making the notes section a dual-purpose surface for short field notes and longer technical write-ups.

## Success Criteria

- The `/notes` page displays tags on each entry and supports clickable tag filtering
- Code blocks in notes render with Shiki syntax highlighting in a dark theme matching the site aesthetic
- Images, tables, and blockquotes render with proper styling in the retro terminal theme
- A global agent skill at `~/.agents/skills/engineering-journal/` generates well-structured journal markdown from conversation context
- The skill prompts for supporting evidence and writes the file directly to `src/content/notes/`
- Existing notes are migrated to the expanded frontmatter schema and continue to render correctly
- All 18 existing Playwright tests pass

## Key Risks / Unknowns

- Shiki async processing in the unified pipeline — the existing `processSync` call in `notes.ts` must become async to support `@shikijs/rehype`
- Tag filter client component in a server-component-heavy codebase — must follow the existing minimal `'use client'` island pattern

## Proof Strategy

- Shiki async migration → retire in S01 by building the enhanced pipeline and verifying code blocks render with highlighting
- Client component tag filter → retire in S01 by building the filter and verifying it works in the existing server component architecture

## Verification Classes

- Contract verification: Build succeeds, existing Playwright tests pass, new note with code block renders with Shiki classes
- Integration verification: Skill generates a valid markdown file that the website pipeline renders correctly
- Operational verification: None
- UAT / human verification: Visual review of rendered journal entry with code blocks, images, and tag filter

## Milestone Definition of Done

This milestone is complete only when all are true:

- Enhanced markdown pipeline renders code blocks with Shiki syntax highlighting
- Tag filtering works on the notes index page
- Existing notes migrated and rendering correctly
- Global skill file exists and is symlinked to GSD skills
- Skill generates a valid journal entry with correct frontmatter when invoked
- All 18 existing Playwright tests pass
- A sample journal entry renders end-to-end with code, images, and tags

## Requirement Coverage

- Covers: R501, R502, R503, R504, R505, R506, R507, R508, R509, R510, R204
- Partially covers: None
- Leaves for later: None
- Orphan risks: None

## Slices

- [ ] **S01: Enhanced markdown rendering and tag system** `risk:medium` `depends:[]`
  > After this: Notes render with Shiki syntax-highlighted code blocks, images with proper styling, and the index page supports clickable tag filtering. Existing notes are migrated and all 18 Playwright tests pass.

- [ ] **S02: Engineering journal agent skill** `risk:low` `depends:[S01]`
  > After this: User can invoke the global skill to generate a journal entry from conversation context, with evidence prompts, written directly to `src/content/notes/` with correct frontmatter. The generated entry renders correctly on the website.

## Boundary Map

### S01 → S02

Produces:
- `src/lib/notes.ts` → `NoteFrontmatter` type with `tags: string[]`, `type: 'note' | 'journal'`, `readTime: number`; async `getNoteBySlug()` with Shiki highlighting; `getAllTags(): string[]`
- `src/content/notes/*.md` → frontmatter schema contract: `title`, `summary`, `published`, `updated?`, `tags[]`, `type`
- `public/notes/<slug>/` → directory convention for media files referenced as `/notes/<slug>/filename.ext`
- `src/app/globals.css` → `.note-page__body pre`, `.note-page__body code`, `.note-page__body img` styles for rendered markdown
- Tag filter client component on notes index page

Consumes:
- nothing (first slice)

### S02

Produces:
- `~/.agents/skills/engineering-journal/SKILL.md` → agent skill file
- Symlink `~/.gsd/agent/skills/engineering-journal` → `~/.agents/skills/engineering-journal`

Consumes from S01:
- Frontmatter schema contract (field names, types, valid values)
- Media directory convention (`public/notes/<slug>/`)
- `src/content/notes/` as the target directory for generated files
