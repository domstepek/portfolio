---
id: S02
milestone: M007
status: ready
---

# S02: Engineering journal agent skill — Context

## Goal

Write a global agent skill (`~/.agents/skills/engineering-journal/SKILL.md`) that reviews conversation context and generates a casual first-person journal entry markdown file written directly to the hardcoded website repo at `/Users/jstepek/Personal Repos/website/src/content/notes/`, with TODO placeholders for supporting evidence.

## Why this Slice

S01 locked the frontmatter schema and rendering pipeline. S02 is the payoff — it makes producing journal entries frictionless by reviewing the active conversation and generating a well-structured markdown file without leaving the agent workflow. Nothing depends on S02 downstream; it is the final deliverable of M007.

## Scope

### In Scope

- `~/.agents/skills/engineering-journal/SKILL.md` — the skill file, written from scratch
- Symlink `~/.gsd/agent/skills/engineering-journal` → `~/.agents/skills/engineering-journal` so the skill is discoverable in GSD workflows
- Skill reviews conversation context to extract: topic, key decisions, code snippets, and implementation steps
- Skill generates a complete markdown file with correct frontmatter (`title`, `summary`, `published`, `tags[]`, `type: journal`, `readTime`)
- Evidence TODOs embedded as HTML comments in the body (e.g. `<!-- TODO: add screenshot of X -->`) where screenshots, diagrams, or external evidence would strengthen the entry
- Skill hardcodes the output path: `/Users/jstepek/Personal Repos/website/src/content/notes/`
- Skill auto-generates a slug from the title (kebab-case) and uses it as the filename
- Skill writes the file directly, then reports: the filename written and a brief summary of the frontmatter
- Casual first-person engineering voice (D058), sentence case (D031)
- Skill works in any agent tool — pi, Cursor, etc. — SKILL.md format, no tool-specific APIs

### Out of Scope

- Interactive evidence prompting before writing — no question rounds; TODOs go in the file instead
- Showing the full draft in chat for approval before writing — write first, report after
- Opening the dev server or browser after writing
- Auto-detecting the repo root from cwd
- Any modification to the website codebase (all website changes were S01)
- Handling media uploads or creating `public/notes/<slug>/` directories — the user does that manually after the TODO prompts

## Constraints

- Output directory is hardcoded to `/Users/jstepek/Personal Repos/website/src/content/notes/` — no path detection, no config
- Frontmatter schema must match exactly what S01 established: `title`, `summary`, `published` (YYYY-MM-DD), `updated?`, `tags[]`, `type` (`note` | `journal`), `readTime` (integer, minutes)
- Must be a SKILL.md file — not a script, not a tool-specific config
- Skill must work across pi and Cursor without modification — no pi-specific or Cursor-specific syntax in the skill body
- Media convention: images go in `public/notes/<slug>/` and are referenced as `/notes/<slug>/filename.ext` in markdown — the skill should include this convention in its TODO comments so the user knows where to put files

## Integration Points

### Consumes

- S01 frontmatter schema contract: `title`, `summary`, `published`, `updated?`, `tags[]`, `type`, `readTime`
- S01 media directory convention: `public/notes/<slug>/` for images, referenced as `/notes/<slug>/filename.ext`
- `src/content/notes/` as the hardcoded target directory
- `~/.agents/skills/electron/SKILL.md` — reference for global skill file format and YAML frontmatter structure

### Produces

- `~/.agents/skills/engineering-journal/SKILL.md` — the skill file
- Symlink `~/.gsd/agent/skills/engineering-journal` → `~/.agents/skills/engineering-journal`

## Open Questions

- **readTime auto-calculation**: Should the skill estimate readTime from the generated word count (~200 wpm), or write a fixed placeholder (e.g. `5`) for the user to adjust? Current thinking: estimate from generated content — close enough and avoids a manual step.
- **tags inference**: Should the skill infer tags from the conversation content, or include a single placeholder tag (e.g. `[engineering-journal]`) for the user to edit? Current thinking: infer from context — the skill can extract the tech stack and topic area from the conversation well enough.
