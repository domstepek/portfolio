---
estimated_steps: 5
estimated_files: 1
---

# T01: Write journal entry — building this site with GSD v2

**Slice:** S04 — First journal entries
**Milestone:** M007

## Description

Write the first real journal entry about building this portfolio site across seven GSD milestones. The entry covers the arc from static Astro site on GitHub Pages through server-side auth, WebGPU shader, Next.js migration, and agent-driven development. All source material exists in GSD milestone summaries, PROJECT.md, and DECISIONS.md.

Follow the engineering journal skill's four phases exactly. The entry must exercise the Shiki pipeline (at least one fenced code block with language tag) and demonstrate the quality bar the skill targets — concrete decisions, actual code, specific outcomes.

## Steps

1. Read M001–M007 summaries and DECISIONS.md to extract topic, key decisions, problems, code snippets, and insights across the project arc.
2. Generate frontmatter: `type: journal`, tags from existing set plus any new ones that fit, today's date, estimated readTime.
3. Write 600–1200 word body covering: the domain-first IA origin, Astro static build, portfolio gate evolution (client-side → server-side auth), WebGPU shader, Next.js 16 migration, GSD-driven development. Include 1–2 code snippets from the actual codebase.
4. Generate slug, check `src/content/notes/` for collisions, write the file.
5. Verify: `pnpm build` succeeds, `pnpm test` passes 18/18, rendered HTML has Shiki classes.

## Must-Haves

- [ ] Valid frontmatter matching `parseFrontmatter()` contract — `type: journal`, tags as YAML array, bare `YYYY-MM-DD` published date
- [ ] Body is 600–1200 words with casual first-person engineering voice (D031, D058)
- [ ] At least one fenced code block with language tag exercising Shiki
- [ ] No fabricated code — only snippets from the actual codebase or GSD history
- [ ] `pnpm build` succeeds with new route
- [ ] `pnpm test` passes 18/18

## Verification

- `pnpm build` — succeeds, new route in output
- `pnpm test` — 18/18 pass
- `grep 'class="shiki tokyo-night"' <built-html>` — at least one match
- Word count check: `wc -w` on body (excluding frontmatter) is 600–1200

## Inputs

- `~/.agents/skills/engineering-journal/SKILL.md` — four-phase authoring instructions
- `.gsd/milestones/M001/M001-SUMMARY.md` through `.gsd/milestones/M006/M006-SUMMARY.md` — milestone history
- `.gsd/PROJECT.md` — current project state
- `.gsd/DECISIONS.md` — architectural decision register
- `src/content/notes/*.md` — existing notes for collision check and format reference

## Observability Impact

- **New route in build output**: `pnpm build` will list `/notes/building-this-site-with-gsd` as a generated route — confirms the pipeline picks up the new file
- **Shiki classes in HTML**: built HTML for the new note will contain `class="shiki tokyo-night"` on `<pre>` elements — confirms code blocks exercise the syntax highlighting pipeline
- **Frontmatter signals**: rendered `/notes` index will show the entry with `journal` type badge and tags — a future agent can verify the pipeline parsed frontmatter correctly by checking these visible signals
- **Failure visibility**: if frontmatter is malformed, `parseFrontmatter()` silently defaults (`type` → `note`, `tags` → `[]`). The verification grep catches source-level correctness; the Playwright tests catch rendered-output correctness.

## Expected Output

- `src/content/notes/building-this-site-with-gsd.md` — journal entry about the seven-milestone site build arc, rendering correctly on the website with Shiki-highlighted code blocks
