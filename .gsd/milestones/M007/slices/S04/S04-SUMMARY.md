---
id: S04
parent: M007
milestone: M007
provides:
  - Two journal entries (991 and 924 words) proving the end-to-end pipeline from skill invocation to Shiki-highlighted rendered output
requires:
  - slice: S01
    provides: Notes markdown pipeline with Shiki highlighting, expanded frontmatter schema
  - slice: S02
    provides: Engineering journal agent skill (four-phase authoring process)
affects: []
key_files:
  - src/content/notes/building-this-site-with-gsd.md
  - src/content/notes/building-an-automatic-training-material-writer.md
key_decisions: []
patterns_established:
  - Journal entries pull real code snippets from the codebase rather than fabricating examples
  - Journal entries about external projects require user-provided context — the skill's Phase 1 minimum-context gate works as designed for topics with zero repo context
observability_surfaces:
  - "grep 'class=\"shiki tokyo-night\"' .next/server/app/notes/<slug>.html — confirms Shiki rendered at build time"
  - "grep -l 'type: journal' src/content/notes/*.md | wc -l — should return 3 (fixture + 2 entries)"
drill_down_paths:
  - .gsd/milestones/M007/slices/S04/tasks/T01-SUMMARY.md
  - .gsd/milestones/M007/slices/S04/tasks/T02-SUMMARY.md
duration: 25m
verification_result: passed
completed_at: 2026-03-14
---

# S04: First journal entries

**Two journal entries — one on building this site across seven GSD milestones (991 words), one on an automatic training material writer (924 words) — both rendering with Shiki-highlighted code blocks through the S01 pipeline.**

## What Happened

T01 followed the engineering journal skill's four phases using in-repo context (M001–M007 summaries, PROJECT.md, DECISIONS.md) to write a journal entry covering the seven-milestone arc: Astro origins, client-side gate, WebGPU shader, Next.js migration with server-side auth, and the meta-layer of agent-driven development. Two code snippets pulled from the actual codebase — the RSC domain route with `await cookies()` and the unified pipeline with `rehypeShiki`.

T02 prompted the user for external project context (the training material writer has zero repo presence). User provided substantive details about a Fumadocs docs site, a Cursor agent skill reading multi-source context (Jira, Confluence, Slack, E2E tests, PR history), and PR-triggered documentation updates. The skill's Phase 1 minimum-context gate passed, and a 924-word entry was written with two code blocks (YAML config, TypeScript PR flow).

## Verification

- `pnpm build` — succeeds, both `/notes/building-this-site-with-gsd` and `/notes/building-an-automatic-training-material-writer` routes generated
- `pnpm test` — 18/18 Playwright tests pass
- `grep -l 'type: journal' src/content/notes/*.md | wc -l` → 3 (test fixture + 2 new entries)
- Shiki `class="shiki tokyo-night"` present in both entries' rendered HTML (2 matches each)
- Word counts: 991 and 924 (both within 600–1200 target)
- Frontmatter: both entries have `type: journal`, tags as YAML arrays, bare date format

## Deviations

None.

## Known Limitations

None. Both entries render correctly through the full pipeline.

## Follow-ups

None.

## Files Created/Modified

- `src/content/notes/building-this-site-with-gsd.md` — 991-word journal entry on the seven-milestone site build
- `src/content/notes/building-an-automatic-training-material-writer.md` — 924-word journal entry on the training material writer system

## Forward Intelligence

### What the next slice should know
- This is the final slice in M007. No downstream slices.

### What's fragile
- `parseFrontmatter()` silently defaults malformed fields — always verify rendered metadata (type badge, tags) on `/notes` index, not just source file content

### Authoritative diagnostics
- `grep 'class="shiki tokyo-night"' .next/server/app/notes/<slug>.html` — confirms Shiki rendered at build time for any entry
- `grep -l 'type: journal' src/content/notes/*.md | wc -l` — quick count of journal-type source files

### What assumptions changed
- None — both tasks executed as planned
