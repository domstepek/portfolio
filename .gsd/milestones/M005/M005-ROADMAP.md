# M005: Next.js Migration

**Vision:** The entire site runs on Next.js App Router on Vercel with the same design, content, and retro terminal aesthetic — but the portfolio gate is now real server-side auth (middleware + HttpOnly cookie), so protected proof content is never in the response until a valid session exists.

## Success Criteria

- A visitor can open `/domains/[slug]` with no cookie and receive a server-rendered gate page with zero proof content in the response HTML
- A visitor can submit the correct passcode, get a cookie set, and land on the domain proof page with all content server-rendered
- A visitor can navigate between protected domain routes without re-authenticating for the cookie session duration
- Public routes (`/`, `/about`, `/resume`, `/notes/*`) render correctly with no gate
- The WebGPU/WebGL2 shader background renders on all pages (with per-page opt-out preserved)
- `next build` succeeds cleanly
- The full Playwright test suite passes in CI
- The Vercel deployment is live and functional

## Key Risks / Unknowns

- **Edge Runtime middleware constraints** — Middleware runs on Vercel's Edge Runtime with only Web APIs. Hash comparison must use `crypto.subtle`, not Node `crypto`. Cookie attributes (`HttpOnly`, `Secure`, `SameSite`, `path`) must be exactly right or auth breaks silently.
- **Middleware redirect loop on gate route** — If the gate view lives under `/domains/*`, middleware will catch it again. Route convention must prevent infinite redirects.
- **Shader SSR crash** — Any browser API reference (`window`, `navigator`, `document`) at module scope in the shader tree will crash SSR. The `'use client'` boundary and `useEffect` wrapping must be correct.
- **Tailwind + shadcn theming against retro aesthetic** — Default shadcn styles will visually clash with the bracket-link, Space Mono, muted-green identity. CSS var bridge (`--bg`, `--accent`, `--accent-strong`) must survive for both theming and shader color reads.
- **1664-line CSS → Tailwind migration** — Mechanical but error-prone. Missing a rule breaks visual parity for that component.

## Proof Strategy

- Edge Runtime + cookie auth → retire in S01 by building the real middleware + server action + gate page and proving zero-leakage with Playwright assertions on response HTML
- Middleware redirect loop → retire in S01 by choosing a gate route convention and testing cold-load → auth → redirect → proof render
- Shader SSR crash → retire in S03 by mounting the real shader in the Next.js layout and verifying `data-shader-renderer` is set after hydration
- Tailwind theming → retire in S01 by configuring the full design token set and rendering domain pages with the retro palette intact
- CSS migration completeness → retire incrementally across S01–S03 with visual verification of each ported component

## Verification Classes

- Contract verification: Playwright test suite covering route access, gate enforcement, auth flow, session persistence, shader presence, notes rendering, and DOM marker contracts
- Integration verification: Middleware ↔ cookie ↔ server action ↔ redirect flow exercised in Playwright against `next dev` / `next start`; shader init via `useEffect` in client component within server-rendered layout
- Operational verification: `next build` succeeds; Vercel deployment is live; GitHub Actions CI runs Playwright and blocks on failure
- UAT / human verification: Visual spot-check of retro terminal aesthetic, shader rendering, and gate UX after S01 and S03

## Milestone Definition of Done

This milestone is complete only when all are true:

- All four slices are complete with their Playwright tests passing
- The gate enforces server-side auth: zero proof content in unauthenticated responses, full proof after cookie auth
- All public and protected routes render correctly on the live Vercel deployment
- The shader renders on all pages (except opt-out) without SSR errors
- `next build` succeeds and the full Playwright suite passes in GitHub Actions CI
- `AGENTS.md` is updated to reflect the new stack, commands, and conventions
- R301 is validated and moved from active to validated in REQUIREMENTS.md

## Requirement Coverage

- Covers: R301 (primary — server-side access control, the one Active requirement)
- Re-validates through new stack: R101, R102, R103, R104, R105, R001–R007, R401–R407
- Leaves for later: R201–R204 (deferred, unchanged)
- Orphan risks: None

## Slices

- [x] **S01: Server-side portfolio gate on Next.js** `risk:high` `depends:[]`
  > After this: a visitor can open `/domains/product` unauthenticated and see a server-rendered gate page (zero proof in HTML), enter the passcode, get a cookie, and see the full proof page — proven by Playwright tests against `next dev`
- [x] **S02: Public pages and notes pipeline** `risk:medium` `depends:[S01]`
  > After this: a visitor can browse `/`, `/about`, `/resume`, `/notes`, and `/notes/[slug]` with correct content, retro styling, and no gate — all running on Next.js alongside the working gate from S01
- [x] **S03: Shader and interactive client components** `risk:medium` `depends:[S01]`
  > After this: the WebGPU/WebGL2 shader background renders on all pages, screenshot galleries work on domain proof pages, and Mermaid diagrams render — proven by `data-shader-renderer` attribute and Playwright assertions
- [ ] **S04: Vercel deployment, CI, and final integration** `risk:low` `depends:[S01,S02,S03]`
  > After this: the complete site is live on Vercel, GitHub Actions CI runs the full Playwright suite and blocks deploys on failure, and the live deployment is verified end-to-end

## Boundary Map

### S01 → S02, S03, S04

Produces:
- Next.js App Router project with `app/layout.tsx` root layout, Tailwind config with full retro design tokens (`--bg`, `--accent`, `--accent-strong`, Space Mono, bracket-link styles), and shadcn/ui themed to dark retro palette
- `middleware.ts` checking HttpOnly auth cookie on `/domains/*` requests, redirecting unauthenticated visitors to a gate view
- Server action (`app/domains/actions.ts` or similar) validating passcode against `GATE_HASH` env var via `crypto.subtle` and setting HttpOnly cookie
- Gate page component (server-rendered, zero proof content) and domain proof page component (server-rendered when authenticated)
- Ported `src/data/` modules with `import.meta.env` → `process.env` conversion
- `next.config.ts` with `trailingSlash: true` and any required config
- Playwright test infrastructure with gate enforcement, auth flow, and session persistence tests
- DOM marker contract preserved: `data-route-visibility`, `data-gate-state`, `data-protected-gate`, `data-protected-proof-state`, `data-visual-state`

Consumes:
- Nothing (first slice)

### S02 → S04

Produces:
- `/`, `/about`, `/resume` as React Server Components using existing data modules
- Notes pipeline: `gray-matter` + `remark` reading `src/content/notes/*.md`, with `/notes` index and `/notes/[slug]` detail pages
- Custom 404 page
- Playwright tests for public route access and notes rendering

Consumes:
- Root layout, Tailwind theme, routing conventions from S01

### S03 → S04

Produces:
- `ShaderBackground` `'use client'` component wrapping `src/lib/shader/` with `useEffect` init/cleanup, mounted in root layout with `disableShader` prop support
- `ScreenshotGallery` `'use client'` component for domain proof pages (carousel/lightbox)
- `MermaidDiagram` `'use client'` component for flagship Mermaid charts
- `data-shader-renderer` attribute on canvas for test assertions
- Playwright tests for shader presence/absence and gallery interaction

Consumes:
- Root layout and domain proof pages from S01

### S04

Produces:
- GitHub Actions workflow: `next build` + Playwright test suite, blocking on failure
- Vercel project configuration and deployment
- Updated `AGENTS.md` (and `CLAUDE.md` symlink) reflecting Next.js stack, commands, conventions
- Cleanup: remove Astro config, old Puppeteer tests, old GitHub Pages workflow, `public/CNAME`
- Full integrated Playwright suite run against production-like `next start` build

Consumes:
- All slices: complete Next.js app with gate, public pages, notes, shader, and gallery
