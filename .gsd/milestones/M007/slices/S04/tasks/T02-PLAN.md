---
estimated_steps: 4
estimated_files: 1
---

# T02: Write journal entry — training material writer for sample tracking

**Slice:** S04 — First journal entries
**Milestone:** M007

## Description

Write the second journal entry about building an automatic training material writer for sample tracking. This is an external project with zero context in this repository — the user must provide substantive details about the agent workflow, multi-source context, MCP vision usage, problems encountered, and insights gained.

The skill's Phase 1 minimum-context check is the gate. If the user provides enough substance, follow phases 2–4. If not, the task closes as blocked per skill guardrails — no thin or fabricated entries.

## Steps

1. Prompt the user for project context: what was built, agent workflow architecture, how multi-source context and MCP vision were used, key problems encountered, what was learned. Ask focused questions to extract concrete details.
2. Apply Phase 1 context scan — verify minimum substance threshold (clear topic + at least one of decisions/code/problems/insights). If insufficient, report and close as blocked.
3. If sufficient: generate frontmatter, write 600–1200 word body following skill phases 2–4, check slug collisions, write the file.
4. Verify: `pnpm build` succeeds, `pnpm test` passes 18/18, rendered HTML has Shiki classes.

## Must-Haves

- [ ] User prompted for project context before writing
- [ ] Phase 1 minimum-context check applied — no fabrication
- [ ] If written: valid frontmatter, 600–1200 words, at least one code block, `pnpm build` + `pnpm test` pass
- [ ] If blocked: documented reason and task closed explicitly

## Verification

- If written: `pnpm build` succeeds, `pnpm test` 18/18, Shiki classes in rendered HTML, word count 600–1200
- If blocked: task summary documents the context gap

## Inputs

- `~/.agents/skills/engineering-journal/SKILL.md` — four-phase authoring instructions
- User-provided context about the training material writer project
- `src/content/notes/*.md` — existing notes for collision check

## Expected Output

- `src/content/notes/building-an-automatic-training-material-writer.md` — journal entry about the training material writer system, OR task summary documenting insufficient context

## Observability Impact

- **New route**: `pnpm build` output includes `/notes/building-an-automatic-training-material-writer` route — confirms the pipeline picks up the new file
- **Shiki rendering**: `grep 'class="shiki tokyo-night"' .next/server/app/notes/building-an-automatic-training-material-writer.html` — confirms code blocks rendered at build time
- **Frontmatter integrity**: rendered `/notes` index shows `journal` type badge and tag list for the new entry — catches `parseFrontmatter()` silent defaults (empty tags → malformed YAML, `note` type → missing/wrong `type` field)
- **Failure signal if blocked**: task summary frontmatter includes `status: blocked` and narrative documents the specific context gap — future agents can decide whether to retry with more user input
