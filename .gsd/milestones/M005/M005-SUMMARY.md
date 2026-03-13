---
id: M005
provides:
  - Complete Next.js 16 App Router site replacing Astro, deployed via Vercel
  - Server-side portfolio gate with HttpOnly cookie auth — zero proof content in unauthenticated responses
  - proxy.ts observability layer and RSC-based gate enforcement (D040, D043)
  - Tailwind v4 retro design token system with :root CSS var backward compat
  - Notes markdown pipeline (gray-matter + unified) replacing Astro content collections
  - ShaderBackground, ScreenshotGallery, MermaidDiagram as 'use client' islands in RSC tree
  - 18 Playwright tests replacing 23 Puppeteer tests (5 gate + 8 public + 3 shader + 2 gallery/mermaid)
  - GitHub Actions CI workflow gating push/PR to main with build + Playwright
  - AGENTS.md fully updated for Next.js + Tailwind v4 + Vercel + Playwright stack
key_decisions:
  - "D032: Migrate from Astro to Next.js App Router on Vercel"
  - "D033: Portfolio gate upgraded to middleware + HttpOnly cookie (supersedes D009, D018, D019)"
  - "D035: Tailwind CSS + shadcn/ui replaces plain CSS"
  - "D040: Next.js 16.x with proxy.ts (Node runtime) over 15.x middleware.ts"
  - "D041: Node crypto.createHash in server action (not crypto.subtle)"
  - "D043: proxy.ts is observability-only — enforcement lives in RSC page component"
  - "D044: src/app/ under src/ not root (Astro coexistence constraint)"
  - "D048: Notes pipeline — gray-matter + unified replaces Astro content collections"
  - "D049: Shader engine imports changed from .js to bare specifiers for Turbopack"
  - "D051: Playwright webServer uses npm run start not build && start in CI"
patterns_established:
  - "RSC gate pattern: await cookies() in page component, conditional render of gate or proof — no middleware redirect needed"
  - "Client island pattern: 'use client' wrappers with dynamic import inside useEffect for browser-only code (shader, mermaid, gallery)"
  - "AbortController cleanup for React client components with multiple event listeners"
  - "Tailwind v4 @theme block with --color-* tokens + :root aliases for CSS var backward compat"
  - "Page component architecture: server components in src/components/{page}/, thin route files in src/app/"
  - "redirect() called outside try/catch in server actions — NEXT_REDIRECT must propagate"
  - "CI workflow separates npm run build from Playwright start to avoid NODE_ENV leak"
observability_surfaces:
  - "x-gate-status header on /domains/* (proxy.ts — currently not surfacing due to manifest issue)"
  - "data-shader-renderer attribute on shader canvas: webgpu, webgl2, or none"
  - "data-gate-state, data-protected-proof-state DOM attributes for gate status inspection"
  - "[shader] console.info/warn prefix for shader lifecycle diagnostics"
  - "GitHub Actions CI status on push/PR to main"
  - "Playwright HTML report artifact on CI test failure (14-day retention)"
  - "tsc --noEmit as full-tree type-safety gate"
requirement_outcomes:
  - id: R301
    from_status: active
    to_status: validated
    proof: "S01 Playwright tests: zero-leakage HTML assertion (test 2) confirms no proof content in unauthenticated responses; auth flow (test 4) confirms HttpOnly cookie + server-rendered proof; cross-route session (test 5) proves persistence without leakage"
duration: ~6h across 4 slices (15 tasks total)
verification_result: passed
completed_at: 2026-03-13
---

# M005: Next.js Migration

**The entire site migrated from Astro/GitHub Pages to Next.js 16 App Router on Vercel — portfolio gate upgraded from client-side SHA-256 to real server-side HttpOnly cookie auth with zero proof leakage, all pages ported with retro terminal aesthetic preserved, shader and interactive components running as client islands, and 18 Playwright tests gating CI.**

## What Happened

M005 executed as four slices in dependency order, each retiring a specific risk.

**S01 (Server-side portfolio gate)** retired the highest risk first: replaced the Astro scaffold with Next.js 16 + React 19 + Tailwind v4 and built the complete gate auth stack. The gate uses a four-piece architecture: `proxy.ts` (observability header), server action with `crypto.createHash` (passcode validation + HttpOnly cookie), `GateForm` (`'use client'` with `useActionState`), and `DomainGatePage`/`DomainProofPage` (pure server components). The RSC page component reads `await cookies()` and conditionally renders gate or proof — no middleware redirect needed, eliminating the redirect-loop risk entirely (D043). 5 Playwright gate tests confirmed zero leakage, auth flow, and session persistence.

**S02 (Public pages and notes)** ported all five public routes. The root layout expanded from a stub to the full site shell (skip-link, header, main, footer, CRT overlay). `TerminalPanel.tsx` replaced `TerminalPanel.astro` as a shared server component. `HomePage`, `PersonalPage`, and `ResumePage` are server components with `generateMetadata` SEO exports. The notes pipeline replaced Astro content collections with `gray-matter` + `unified/remark/rehype` in `src/lib/notes.ts`. A custom 404 page completed the public surface. 8 Playwright tests confirmed all public routes render correctly with no gate.

**S03 (Shader and interactive components)** ported the three browser-only features as `'use client'` islands. `ShaderBackground` wraps the existing `initDitherShader` engine with dynamic import inside `useEffect`, AbortController cleanup, pointer tracking, reduced-motion handling, and visibility-change pause/resume. `ScreenshotGallery` and `MermaidDiagram` follow the same dynamic-import pattern. All shader engine `.js` imports changed to bare specifiers for Turbopack compatibility (D049). 5 new Playwright tests (3 shader + 2 gallery/mermaid) brought the total to 18/18 passing.

**S04 (CI and cleanup)** deleted 38 Astro-era files, restored `typescript.ignoreBuildErrors` to false, created the GitHub Actions CI workflow (build + Playwright, artifact upload on failure), and fully rewrote AGENTS.md. Final verification: `tsc --noEmit` exit 0, `npm run build` exit 0 (8 routes), 18/18 Playwright tests pass against `next start`.

## Cross-Slice Verification

| Success Criterion | Evidence | Status |
|---|---|---|
| Unauthenticated `/domains/[slug]` returns zero proof content | S01 Playwright test 2 + curl grep returning 0 for `data-flagship-highlights` | ✅ |
| Correct passcode sets HttpOnly cookie and renders proof | S01 Playwright test 4 + curl with cookie header returning 1 for `data-flagship-highlights` | ✅ |
| Cross-route session persistence without re-auth | S01 Playwright test 5 navigates between domain routes on single cookie | ✅ |
| Public routes render correctly with no gate | S02 Playwright public.spec.ts 8/8 pass (/, /about/, /resume/, /notes/, /notes/[slug]/) | ✅ |
| Shader renders on all pages (with per-page opt-out) | S03 shader.spec.ts 3/3 pass (homepage, about, authenticated domain) | ✅ |
| `next build` succeeds cleanly | S04 verified: exit 0 with 8 routes, `tsc --noEmit` exit 0 | ✅ |
| Full Playwright suite passes in CI | S04 verified: 18/18 pass against `next start`; CI workflow created | ✅ |
| Vercel deployment is live and functional | Not yet live — requires manual `GATE_HASH` env var and DNS migration | ⚠️ Pending manual steps |
| AGENTS.md updated | S04 T03 rewrote AGENTS.md; zero Astro references; CLAUDE.md symlink intact | ✅ |
| R301 validated | S01 moved R301 active → validated with Playwright zero-leakage + auth + session evidence | ✅ |

**Note on Vercel deployment:** The codebase is fully production-ready. The live deployment requires two manual actions outside agent scope: setting `GATE_HASH` in Vercel environment variables and updating DNS from GitHub Pages to Vercel. CI workflow, build, and all tests are proven.

## Requirement Changes

- **R301**: Active → Validated — S01 Playwright tests prove zero proof content in unauthenticated responses (test 2), HttpOnly cookie auth flow with server-rendered proof (test 4), and cross-route session persistence (test 5). This was the only active requirement entering M005; all 20 requirements are now validated.

## Forward Intelligence

### What the next milestone should know
- The project has zero active requirements. The next milestone would introduce new capabilities or requirements.
- Vercel deployment is code-complete but needs manual env var (`GATE_HASH`) and DNS setup before going live.
- The codebase is a clean Next.js 16 App Router project under `src/app/` with Tailwind v4. No Astro remnants.
- All data lives in `src/data/` as typed TypeScript modules. Notes are markdown files in `src/content/notes/` read by `src/lib/notes.ts`.
- The gate cookie name is `portfolio-gate`, path is `/domains`, session-scoped (no maxAge).

### What's fragile
- **proxy.ts manifest issue** — `x-gate-status` observability header compiles but doesn't surface in responses. The manifest shows `"middleware": {}`. Gate enforcement is unaffected (lives in RSC), but if observability or proxy-level enforcement is ever needed, this must be fixed first.
- **Gallery init script coupling** — `ScreenshotGallery.tsx` calls `initGalleries()` which was written for Astro DOM structure. Changes to gallery markup require updating the init script too.
- **Mermaid version pinning** — Mermaid major version bumps historically break theme config shapes. The current version is pinned by `pnpm-lock.yaml`.
- **React "key" prop warnings** — Cosmetic server render warnings from Next.js internals. Don't affect tests or production behavior but may be noisy in logs.

### Authoritative diagnostics
- `npx playwright test --reporter=list` against `next start` — the definitive integration health check (18 tests covering gate, public, shader, gallery)
- `tsc --noEmit` — the type-safety gate covering the full `src/` tree
- `npm run build` — route table confirms all 8 routes generate correctly
- `data-*` DOM attributes — curl any route and grep for page-specific markers to confirm rendering
- GitHub Actions CI tab — the release gate for any push/PR to main

### What assumptions changed
- **Edge Runtime not required** — M005 context assumed `crypto.subtle` for Edge Runtime middleware. Next.js 16's `proxy.ts` runs on Node.js runtime, making `crypto.createHash` the simpler and correct choice (D040, D041).
- **Gate enforcement in RSC, not proxy** — The plan described proxy/middleware as the enforcement point. Execution proved enforcement belongs in the RSC page component via `await cookies()` (D043), with proxy serving only observability.
- **`app/` placement under `src/`** — Plans assumed project root `app/`. Astro coexistence during S01–S03 required `src/app/` (D044). This is now permanent and idiomatic.
- **Playwright NODE_ENV leak** — Playwright's subprocess environment breaks `next build` during prerender. CI separates build from serve as distinct steps (D051).
- **Turbopack bare specifiers** — Shader engine `.js` extension imports don't work under Turbopack's `moduleResolution: "bundler"`. All changed to bare specifiers (D049).

## Files Created/Modified

Key files by category (38 Astro files deleted; full inventory in S04 T01-SUMMARY):

**Framework & Config:**
- `package.json` — Next.js 16 + React 19 + Tailwind v4 + Playwright deps
- `next.config.ts` — trailingSlash, TypeScript strict (ignoreBuildErrors removed in S04)
- `tsconfig.json` — Next.js App Router config with `@/*` → `./src/*`
- `postcss.config.mjs` — `@tailwindcss/postcss` plugin
- `playwright.config.ts` — CI-conditional webServer (dev vs start)

**App Shell & Styling:**
- `src/app/layout.tsx` — root RSC layout with full site shell + ShaderBackground
- `src/app/globals.css` — Tailwind v4 @theme tokens + all component CSS

**Gate Auth:**
- `proxy.ts` — observability header on `/domains/*`
- `src/app/domains/actions.ts` — submitPasscode server action
- `src/app/domains/[slug]/page.tsx` — RSC domain route with cookie-based gate/proof switch
- `src/components/domains/GateForm.tsx` — 'use client' form
- `src/components/domains/DomainGatePage.tsx` — server component (zero proof)
- `src/components/domains/DomainProofPage.tsx` — server component (full proof)

**Public Pages:**
- `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/resume/page.tsx` — public route files
- `src/app/notes/page.tsx`, `src/app/notes/[slug]/page.tsx` — notes routes
- `src/app/not-found.tsx` — custom 404
- `src/components/home/HomePage.tsx`, `src/components/personal/PersonalPage.tsx`, `src/components/resume/ResumePage.tsx` — page server components
- `src/components/notes/NotesIndexPage.tsx`, `src/components/notes/NotePage.tsx` — notes components
- `src/components/layout/TerminalPanel.tsx` — shared layout component
- `src/components/resume/CopyChip.tsx` — 'use client' clipboard component
- `src/lib/notes.ts` — notes markdown pipeline

**Client Islands:**
- `src/components/shader/ShaderBackground.tsx` — shader 'use client' wrapper
- `src/components/domains/ScreenshotGallery.tsx` — gallery 'use client' wrapper
- `src/components/diagrams/MermaidDiagram.tsx` — mermaid 'use client' wrapper

**Shader Engine (import fixes):**
- `src/lib/shader/dither-shader.ts`, `webgl2-renderer.ts`, `webgpu-renderer.ts` — .js → bare specifiers

**CI & Docs:**
- `.github/workflows/ci.yml` — build + Playwright CI workflow
- `AGENTS.md` — fully rewritten for Next.js stack
- `.gsd/DECISIONS.md` — D040–D051 appended
