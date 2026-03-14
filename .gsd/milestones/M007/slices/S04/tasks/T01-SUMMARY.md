---
id: T01
parent: S04
milestone: M007
provides:
  - Journal entry about building this site across seven GSD milestones, rendered with Shiki-highlighted code blocks
key_files:
  - src/content/notes/building-this-site-with-gsd.md
key_decisions: []
patterns_established:
  - Journal entries pull real code snippets from the codebase rather than fabricating examples
observability_surfaces:
  - "Built HTML contains class=\"shiki tokyo-night\" on <pre> elements — grep to verify Shiki pipeline exercised"
  - "Route /notes/building-this-site-with-gsd appears in pnpm build output — confirms pipeline pickup"
duration: 15m
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# T01: Write journal entry — building this site with GSD v2

**Wrote a 991-word journal entry covering the seven-milestone arc from static Astro site to Next.js 16 with server-side auth, WebGPU shader, and agent-driven development — with two real code snippets from the codebase rendering through the Shiki pipeline.**

## What Happened

Followed the engineering journal skill's four phases. Phase 1 scanned M001–M006 summaries, PROJECT.md, and DECISIONS.md to extract the project arc: domain-first IA origin, Astro static build, client-side SHA-256 gate, WebGPU shader, Next.js 16 migration with server-side HttpOnly cookie auth, sentence case audit, UI polish, and GSD-driven development patterns.

Phase 2 generated frontmatter: `type: journal`, tags `[nextjs, webdev, engineering, webgpu]`, today's date (2026-03-14), estimated readTime 5.

Phase 3 wrote the body covering: the domain-first homepage concept, the portfolio gate evolution from client-side hash to server-side cookie, the handmade GPU shader, the Next.js migration as the pivotal milestone, the markdown pipeline with Shiki, and the meta-observation of agent-driven development. Two code snippets from the actual codebase: the RSC domain route with `await cookies()` gate check (`src/app/domains/[slug]/page.tsx`) and the unified pipeline with `rehypeShiki` (`src/lib/notes.ts`).

Phase 4 generated slug `building-this-site-with-gsd`, confirmed no collision in `src/content/notes/`, and wrote the file.

## Verification

- **Word count**: 991 words (target 600–1200) ✅
- **`pnpm build`**: succeeds, route `/notes/building-this-site-with-gsd` in output ✅
- **`pnpm test`**: 18/18 Playwright tests pass ✅
- **Shiki classes**: `grep -c 'class="shiki tokyo-night"'` on built HTML returns 2 ✅
- **Frontmatter**: `type: journal`, tags as YAML array, bare `2026-03-14` date ✅
- **No fabricated code**: both snippets are from actual source files ✅

### Slice-level verification (intermediate — T01 of 2)

- `pnpm build` succeeds with new route ✅
- `pnpm test` 18/18 pass ✅
- `grep -l 'type: journal' src/content/notes/*.md | wc -l` → 2 (test fixture + 1 new entry; T02 will bring this to ≥3) ⏳
- Shiki classes present in built HTML for new entry ✅

## Diagnostics

- `grep 'class="shiki tokyo-night"' .next/server/app/notes/building-this-site-with-gsd.html` — confirms Shiki rendered at build time
- Rendered `/notes` page shows the entry with `journal` type and `[nextjs, webdev, engineering, webgpu]` tags — confirms frontmatter parsed correctly
- If tags show empty or type shows `note`, `parseFrontmatter()` silently defaulted a malformed field — check the raw frontmatter YAML

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/content/notes/building-this-site-with-gsd.md` — 991-word journal entry with frontmatter and two Shiki-highlighted code blocks
- `.gsd/milestones/M007/slices/S04/S04-PLAN.md` — added Observability / Diagnostics section and failure-path verification (pre-flight fix)
- `.gsd/milestones/M007/slices/S04/tasks/T01-PLAN.md` — added Observability Impact section (pre-flight fix)
