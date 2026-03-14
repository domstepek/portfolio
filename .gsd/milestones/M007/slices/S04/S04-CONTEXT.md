---
id: S04
milestone: M007
status: ready
---

# S04: First journal entries — Context

## Goal

Use the engineering journal skill from S02 to write two publishable journal entries: one about building the automatic training material writer for sample tracking, one about building this site with GSD v2 — both written from context files as source material (not a live coding session), both meeting the skill's publishable-quality bar.

## Why this Slice

S04 proves the full M007 milestone hangs together: the skill writes real entries, the S01 pipeline renders them with Shiki highlighting and tags, and the notes section has substantive content worth reading. Two entries on different topics exercises the skill across topic types and gives the section immediate credibility.

## Scope

### In Scope

- Two journal entries, each written using the S02 engineering journal skill
- The skill's "conversation scan" phase uses context files and referenced source material as input (no live coding session)
- Both entries meet the skill's quality bar: publishable standalone, 600–1200 words, concrete and specific, no filler
- Both entries use the S01 markdown pipeline — Shiki code blocks, appropriate section structure
- Both entries tagged with `type: journal` and 2–5 lowercase hyphenated tags
- Both entries render correctly end-to-end (build + route generation + visual inspection)
- TODO markers left where screenshots or diagrams would add value
- Entry order: training material writer first, then building this site

### Out of Scope

- Additional journal entries beyond these two
- Adding actual screenshots or media to `public/notes/` (TODO markers only)
- Any changes to the skill (S02) or the markdown pipeline (S01)
- Editing or polishing entries after generation — the skill's output is the target quality
- Pagination, search, or RSS for the notes index

## Constraints

- Both entries must follow the S02 skill's four-phase structure: context scan → frontmatter → body → save
- Frontmatter must match `parseFrontmatter()` contract exactly: `title`, `summary`, `published`, `tags: [inline-array]`, `type: journal`, `readTime`
- Casual first-person voice, sentence case (D031, D058) — no "In this post I'll explore..." openings
- The skill's minimum-context check applies: if the gathered source material isn't substantive enough to write a real entry, stop and surface the gap rather than generating thin content
- Both entries must pass `pnpm build` and `pnpm test` (all 18 Playwright tests)

## Integration Points

### Consumes

- `~/.agents/skills/engineering-journal/SKILL.md` — the skill, invoked for each entry using source material below as context input
- **Entry 1 sources:**
  - `/Users/jstepek/Repos/full_sample_tracking/sample_tracking/.agents/skills/training-material-writer/SKILL.md` — the PR-triggered skill that was built
  - `/Users/jstepek/Repos/full_sample_tracking/sample_tracking/docs/FEATURES.md` — knowledge base document generated from full platform context
  - `/Users/jstepek/Repos/full_sample_tracking/sample_tracking/docs/content/docs/training-materials/` — the generated training guides (evidence of what the system produced)
- **Entry 2 sources:**
  - `.gsd/PROJECT.md` — current state and architecture overview
  - `.gsd/milestones/M001/M001-ROADMAP.md` through `M007/M007-ROADMAP.md` — the full seven-milestone sequence
  - `.gsd/milestones/M005/M005-SUMMARY.md` — the most complex milestone (Next.js migration), detailed decisions and patterns
  - `.gsd/DECISIONS.md` — the append-only register of 64 architectural decisions
- S01 markdown pipeline — renders both entries on the website

### Produces

- `src/content/notes/<slug>.md` — training material writer journal entry
- `src/content/notes/<slug>.md` — building this site with GSD v2 journal entry
- Both entries render at `/notes/<slug>` with Shiki-highlighted code blocks and tag display

## Open Questions

- **Entry 1 slug**: Agent's discretion — pick the slug that reads most naturally as a blog post URL. Likely `automatic-training-material-writer` or `ai-training-docs-from-context`.
- **Entry 2 slug**: Agent's discretion. Likely `building-this-site-with-gsd` or `building-a-portfolio-with-gsd-v2`.
- **Entry 2 focus depth**: Seven milestones is too much to cover equally — focus on M005 (the Next.js migration) as the most technically rich slice, and use the GSD workflow meta-story (slice decomposition, risk ordering, state persistence across sessions) as the through-line. Other milestones can be referenced briefly as the arc.
- **Cross-references**: The two entries don't need to explicitly link to each other. They're independent pieces. If the site-building entry naturally mentions the training material writer as work done using this site as proof, that's fine, but not required.
- **Tags**: Agent picks 2–5. Candidates for entry 1: `ai`, `developer-experience`, `documentation`, `automation`. Candidates for entry 2: `gsd`, `engineering`, `nextjs`, `developer-experience`. Use existing tags from the notes collection where they fit.
