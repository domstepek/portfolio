# S04: First Journal Entries — Research

**Date:** 2026-03-14

## Summary

S04 is a pure content slice — no code changes. Two journal entries need to be written using the S02 engineering journal skill and rendered through the S01 markdown pipeline. The pipeline, schema, skill, and CSS are all proven and stable from S01–S03.

The critical constraint is that the skill's guardrails forbid fabricating content that wasn't in the conversation. The "building this site with GSD v2" topic has deep context available in the GSD milestone history (M001–M007 summaries, PROJECT.md, DECISIONS.md). The "training material writer for sample tracking" topic has zero context in this repository or GSD planning files — it's an external project. Writing that entry requires the user to provide substantive context about the project (what was built, what decisions were made, what was learned) or the entry must be written in a session where that context is naturally present.

Both entries will exercise the full pipeline: frontmatter with `type: journal`, tags, Shiki-highlighted code blocks, and proper rendering on the site.

## Recommendation

Execute as two tasks:

- **T01**: Write the "building this site with GSD v2" journal entry. This can proceed immediately — the seven milestones of project history provide rich, concrete context (Next.js migration, server-side auth, WebGPU shader, agent-driven development with GSD).
- **T02**: Write the "training material writer" journal entry. This requires user-provided context about the project. The agent should prompt for: what was built, what the agent workflow looked like, how multi-source context and MCP vision were used, what went wrong, and what was learned. Without that context, the skill's minimum-context check should halt entry generation.

Verification for both: `pnpm build` succeeds with new routes, `pnpm test` passes 18/18, rendered HTML contains `class="shiki tokyo-night"` on code blocks, frontmatter parses correctly (tags as array, type as `journal`).

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Journal frontmatter format | `~/.agents/skills/engineering-journal/SKILL.md` Phase 2 | Exact template matching `parseFrontmatter()` contract with quoting/array rules |
| Slug generation | SKILL.md Phase 4 slug rules | Consistent with collision-check convention |
| Markdown rendering | `src/lib/notes.ts` async pipeline | Shiki + remark-gfm already wired; no new dependencies needed |

## Existing Code and Patterns

- `src/lib/notes.ts` — `parseFrontmatter()` silently defaults malformed fields. Tags must be YAML array `[a, b]`, not comma-separated string. Type must be exactly `journal`. ReadTime is auto-calculated from word count (÷200, rounded up).
- `src/content/notes/shiki-and-rich-markdown-test.md` — Reference for how a `type: journal` entry looks with code blocks, blockquotes, tables. Existing proof the pipeline handles all rich elements.
- `src/content/notes/keep-the-path-explicit.md` — Reference for how a `type: note` short entry looks. The two new entries should be qualitatively different (longer, richer, with code blocks).
- `~/.agents/skills/engineering-journal/SKILL.md` — Four-phase authoring instructions. Key: Phase 1 minimum-context check, Phase 3 body 600–1200 words, Phase 4 collision check.
- `src/components/notes/NotePage.tsx` — Renders tags as chips, readTime inline, body via `dangerouslySetInnerHTML`. No changes needed.
- `src/components/notes/TagFilter.tsx` — Client island for tag filtering on index page. New tags from journal entries will appear automatically.

## Constraints

- **Skill minimum-context check**: The skill requires clear topic + at least one of (decisions, code, problems, insights) from conversation context. The training material writer topic has no context in this repo — the user must supply it.
- **No hallucinated code**: Only code actually discussed or written can appear in entries. For the "building this site" entry, code from the actual codebase is fair game. For the training material writer, only code the user provides.
- **Tag consistency**: Tags must be lowercase, hyphenated for multi-word, exact-match for filtering. Existing tags: `opinion`, `engineering`, `testing`, `webdev`. New tags should be chosen deliberately — they'll appear in the tag filter immediately.
- **Word count target**: 600–1200 words per entry body. Under 400 is too thin; over 1500 is sprawling.
- **Frontmatter quoting**: Titles containing colons must be wrapped in quotes (YAML rule).
- **Published date**: Bare `YYYY-MM-DD` format, today's date. No quotes needed.

## Common Pitfalls

- **Tags as string instead of array** — `tags: webgpu, nextjs` is invalid YAML and silently produces `[]`. Must be `tags: [webgpu, nextjs]`.
- **Missing `type: journal`** — Omitting type defaults to `note` silently. Entry will render but display wrong type.
- **Fabricating external project details** — The training material writer entry can't be invented. If the user doesn't provide context, the entry can't be written correctly per skill guardrails.
- **Slug collision** — Must check `src/content/notes/` before writing. Currently 3 files exist, collision unlikely for new topic slugs.
- **Thin entries** — "I built a thing, it was cool" doesn't meet the skill's quality bar. Entries need concrete decisions, code snippets, and specific outcomes.

## Open Risks

- **Training material writer context gap**: No project context exists in this repo. The user must provide substantive details (architecture, agent workflow, MCP vision usage, problems encountered) or this entry cannot be written without violating the skill's no-fabrication guardrail. This could reduce S04 from two entries to one if context isn't available.
- **Test note cleanup**: `shiki-and-rich-markdown-test.md` is a test fixture from S01 verification. It will coexist with real journal entries. If it should be removed, that's a separate decision (not blocking S04).

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Engineering journal authoring | `engineering-journal` | installed (custom, `~/.agents/skills/engineering-journal/`) |
| Journal writing (generic) | `eddiebe147/claude-settings@journal-prompter` (46 installs) | available — not relevant (generic, not portfolio-integrated) |

## Sources

- S01 forward intelligence: `parseFrontmatter()` contract, tag consistency requirement, silent default warnings (source: S01-SUMMARY.md)
- S02 forward intelligence: skill output format, hardcoded output path, no-fabrication guardrail (source: S02-SUMMARY.md)
- Engineering journal skill: four-phase authoring instructions, tone/structure rules (source: `~/.agents/skills/engineering-journal/SKILL.md`)
