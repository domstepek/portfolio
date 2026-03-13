# Project

## What This Is

A personal website for Dom that gives recruiters, collaborators, and curious peers a fast read on the systems, products, infrastructure, and tooling he has built. The site is intentionally domain-first rather than a flat repo gallery, with a minimal homepage and deeper proof on portfolio pages. Protected domain pages are gated behind a passcode with a visual blur/reveal unlock flow.

## Core Value

Someone should be able to land on the site, quickly understand what kinds of complex systems Dom builds, and access the right level of proof for their context.

## Current State

M001–M004 complete on the Astro/GitHub Pages stack. M005 (Next.js migration) is underway — S01, S02, and S03 complete; S04 (deployment + CI) remains.

The project is a Next.js 16 App Router project (`src/app/`) with Tailwind v4 retro design tokens. The portfolio gate uses real server-side auth: Next.js proxy (`proxy.ts`) observes all `/domains/*` requests; the RSC domain route reads an HttpOnly `portfolio-gate` cookie and conditionally renders either the gate page (zero proof content) or the full proof page. All five public routes (`/`, `/about/`, `/resume/`, `/notes/`, `/notes/[slug]/`) are ported with full site shell, notes markdown pipeline, custom 404, and SEO metadata.

The WebGPU/WebGL2 shader background renders on all pages via a `'use client'` `ShaderBackground` component mounted in the root layout. Screenshot galleries and Mermaid diagrams render on authenticated domain proof pages as client islands. 18 Playwright tests pass (5 gate + 8 public + 3 shader + 2 gallery/mermaid).

Astro source files remain on disk until S04 cleanup. `typescript.ignoreBuildErrors: true` is set in `next.config.ts` during the coexistence phase.

All 20 requirements are validated; 0 active requirements remain.

## Architecture / Key Patterns

- **Active stack:** Next.js 16 App Router + Tailwind v4 + React 19 on Vercel (migration in progress — Astro files remain until S04)
- **Legacy stack (being replaced):** Astro + TypeScript + plain CSS on GitHub Pages
- Domain-first information architecture with route helpers in `src/lib/paths.ts`
- Thin route files with shared data modules and shared presentational components
- **Gate auth:** Server-side enforcement via RSC cookie check (`await cookies()`) — HttpOnly `portfolio-gate` cookie; server action (`submitPasscode`) with Node `crypto.createHash` hash compare; zero proof content in unauthenticated responses
- **Shader:** `ShaderBackground` `'use client'` component with dynamic import of `initDitherShader` inside `useEffect`; AbortController cleanup; `data-shader-renderer` observability attribute
- **Client islands:** ScreenshotGallery, MermaidDiagram, and ShaderBackground are `'use client'` wrappers imported into server components — all use dynamic import inside `useEffect` to avoid SSR crashes
- DOM marker contract: `data-route-visibility`, `data-gate-state`, `data-protected-gate`, `data-protected-proof-state`, `data-visual-state`, `data-flagship-highlights`, `data-supporting-work`, `data-shader-renderer`, `data-screenshot-gallery`, `data-gallery-init`, `data-mermaid-definition`
- Playwright tests in `tests/e2e/` replace former Puppeteer tests
- Public site surfaces remain lightweight and text-forward
- Sentence case convention for all visitor-facing copy (D031)

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [x] M001: Public portfolio foundation — Ship the domain-first personal site with homepage, domain hubs, flagship proof, about/resume, notes, and custom domain.
- [x] M002: Portfolio access gate — Lightweight passcode gate protecting domain portfolio proof with session-scoped unlock, visual blur/reveal, request-access messaging, and 20-test regression coverage.
- [x] M003: GPU shader background — Custom faded dither shader (WebGPU + WebGL2 fallback) as ambient cursor-reactive background across all pages with per-page opt-out.
- [x] M004: Sentence case audit — Convert all visitor-facing copy from all-lowercase to sentence case with standard "I" capitalization, preserving casual tone.
- [ ] M005: Next.js migration — Migrate from Astro/GitHub Pages to Next.js App Router on Vercel, with the portfolio gate upgraded from client-side SHA-256 to middleware + HttpOnly cookie server auth.
