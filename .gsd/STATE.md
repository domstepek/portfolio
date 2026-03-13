# GSD State

**Active Milestone:** M005 — Next.js Migration
**Last Completed Slice:** S03 — Shader and interactive client components
**Phase:** Awaiting S04 — Vercel deployment, CI, and final integration

## Slice Progress
- [x] S01 — Server-side portfolio gate on Next.js (COMPLETE)
- [x] S02 — Public pages and notes pipeline (COMPLETE)
- [x] S03 — Shader and interactive client components (COMPLETE — 18/18 tests pass: 3 shader + 2 gallery + 5 gate + 8 public)
- [ ] S04 — Vercel deployment, CI, and final integration (depends on S01+S02+S03 — all prerequisites met)

## Verification Status
- ✅ `npx playwright test tests/e2e/public.spec.ts` → 8/8 pass
- ✅ `npx playwright test tests/e2e/gate.spec.ts` → 5/5 pass
- ✅ `npx playwright test tests/e2e/shader.spec.ts` → 3/3 pass
- ✅ `npx playwright test tests/e2e/gallery.spec.ts` → 2/2 pass
- ✅ `npm run build` → exits 0

## Key Notes for S04
- App directory is `src/app/` (not `app/`) — all plan references to `app/X` mean `src/app/X`
- `typescript.ignoreBuildErrors: true` is set in next.config.ts; revert in S04 after Astro files removed
- Root layout has full site shell: ShaderBackground (first child), skip-link, header, `<main class="site-main shell">`, footer, CRT overlay
- Shader engine imports use bare specifiers (D049) — changed from `.js` for Turbopack compatibility
- ShaderBackground uses dynamic import + AbortController cleanup pattern (D050) — reference for future 'use client' components
- ScreenshotGallery + MermaidDiagram use same dynamic import pattern as client islands in RSC DomainProofPage
- TerminalPanel is in `src/components/layout/TerminalPanel.tsx` — used by pages and 404
- Notes pipeline uses `src/lib/notes.ts` — gray-matter + unified/remark/rehype
- All page components are server components — client interactivity must be 'use client' wrappers
- Gallery init depends on `src/components/domains/screenshot-gallery-init.ts` — written for Astro DOM structure; update if gallery markup changes
- Mermaid version pinned by pnpm-lock.yaml — major bumps may break theme config
- S04 must: remove Astro files, revert ignoreBuildErrors, deploy to Vercel, wire GitHub Actions CI, run full Playwright suite against `next start` build
