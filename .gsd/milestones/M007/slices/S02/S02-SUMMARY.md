---
id: S02
parent: M007
milestone: M007
provides:
  - Global engineering journal agent skill at ~/.agents/skills/engineering-journal/SKILL.md
  - GSD symlink at ~/.gsd/agent/skills/engineering-journal for pi auto-discovery
  - Proven integration between skill output format and S01 markdown pipeline
requires:
  - slice: S01
    provides: NoteFrontmatter schema (tags, type, readTime), src/content/notes/ target directory, public/notes/<slug>/ media convention, async unified pipeline with Shiki highlighting
affects:
  - none (terminal slice — no downstream consumers)
key_files:
  - ~/.agents/skills/engineering-journal/SKILL.md
  - ~/.gsd/agent/skills/engineering-journal (symlink)
key_decisions:
  - D054: Global skill at ~/.agents/skills/engineering-journal/ symlinked to GSD skills
  - D057: Media in public/notes/<slug>/ with evidence TODO markers
  - D058: Casual first-person engineering voice matching D031
patterns_established:
  - Multi-phase skill structure (scan → frontmatter → body → save) for authoring skills
  - Evidence TODO convention (<!-- TODO: screenshot of X -->) for deferred media
observability_surfaces:
  - none — static skill file, not a runtime component
drill_down_paths:
  - .gsd/milestones/M007/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M007/slices/S02/tasks/T02-SUMMARY.md
duration: 15m
verification_result: passed
completed_at: 2026-03-14
---

# S02: Engineering Journal Agent Skill

**Global agent skill that generates engineering journal entries from conversation context, with proven integration against the S01 markdown pipeline.**

## What Happened

Built a structured SKILL.md at `~/.agents/skills/engineering-journal/` with four-phase authoring instructions: context scan (extract topic/decisions/code/insights with minimum-context check), frontmatter generation (exact template matching `parseFrontmatter()` contract with silent-default warnings), body writing (tone rules from D031/D058, heading conventions, code block language tags, evidence TODO markers, 600–1200 word target), and save/report (slug generation, collision check, hardcoded output path to `src/content/notes/`).

Created the GSD symlink so pi discovers the skill automatically in `<available_skills>`. Validated integration end-to-end by writing a test journal entry following the skill's exact output format — quoted title with colon, inline YAML tag array, `type: journal`, fenced code block with language tag, evidence TODO marker. Confirmed frontmatter parsed correctly (tags as array not empty, type as `journal` not defaulted, readTime computed), production build generated the route, and all 18 Playwright tests passed. Removed the validation artifact cleanly.

## Verification

| Check | Result |
|-------|--------|
| `test -f ~/.agents/skills/engineering-journal/SKILL.md` | ✅ Skill file exists |
| `test -L ~/.gsd/agent/skills/engineering-journal` | ✅ GSD symlink exists |
| `head -5 SKILL.md \| grep -q "^name:"` | ✅ Valid YAML frontmatter |
| Validation entry `pnpm build` | ✅ Route generated |
| `pnpm test` — 18/18 Playwright tests | ✅ All pass (14.1s) |
| Validation entry removed | ✅ Clean repo state |
| Frontmatter tags parsed as array | ✅ `["engineering", "testing"]` |
| Frontmatter type parsed as `journal` | ✅ Not defaulted to `note` |
| Frontmatter readTime computed | ✅ 2 (250 words) |

## Requirements Advanced

- None — all relevant requirements moved to Validated in this slice.

## Requirements Validated

- R501 — Skill file exists with four-phase authoring instructions; GSD symlink verified; validation entry built and rendered through the S01 pipeline
- R506 — Skill includes media convention section specifying `public/notes/<slug>/` directory creation and evidence TODO markers
- R508 — Skill instructions specify hardcoded output path to `src/content/notes/` with slug collision check; validation entry written and built successfully
- R509 — Skill includes tone guardrails section referencing D031/D058 with concrete examples and anti-patterns

## New Requirements Surfaced

- None

## Requirements Invalidated or Re-scoped

- None

## Deviations

None.

## Known Limitations

- The skill is a static prompt file — it depends on the executing agent following the instructions faithfully. There's no runtime enforcement of frontmatter correctness beyond `parseFrontmatter()`'s silent defaults.
- The hardcoded output path (`/Users/jstepek/Personal Repos/website/src/content/notes/`) ties the skill to this specific machine/repo layout. If the repo moves, the path in SKILL.md must be updated manually.

## Follow-ups

- None

## Files Created/Modified

- `~/.agents/skills/engineering-journal/SKILL.md` — complete skill file with YAML frontmatter and four-phase authoring instructions
- `~/.gsd/agent/skills/engineering-journal` — symlink to `~/.agents/skills/engineering-journal`
- `src/content/notes/engineering-journal-validation-test.md` — temporary validation entry (created and removed)

## Forward Intelligence

### What the next slice should know
- S02 is fully independent of S03 (domain page markdown enrichment). No shared code was introduced — the skill is a static file outside the codebase.
- The S01 unified pipeline (`src/lib/notes.ts`) is the authoritative markdown processing path. S03 should reuse it via a shared `renderMarkdown()` helper, not duplicate the remark/rehype chain.

### What's fragile
- `parseFrontmatter()` silently defaults malformed fields — if tags is a string instead of array, it becomes `[]`; if type is missing, it becomes `'note'`. The skill warns about this but a careless agent could generate entries that build but display wrong metadata.

### Authoritative diagnostics
- Skill file presence: `ls -la ~/.agents/skills/engineering-journal/SKILL.md`
- Symlink target: `readlink ~/.gsd/agent/skills/engineering-journal`
- Pi discoverability: check `<available_skills>` list for `engineering-journal` entry
- Pipeline integration: write any markdown to `src/content/notes/` with the skill's frontmatter format and run `pnpm build`

### What assumptions changed
- No assumptions changed — the skill output format integrated with the S01 pipeline exactly as planned.
