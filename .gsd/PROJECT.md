# Project

## What This Is

A personal website for Dom that gives recruiters, collaborators, and curious peers a fast read on the systems, products, infrastructure, and tooling he has built. The site is intentionally domain-first rather than a flat repo gallery, with a minimal homepage and deeper proof on portfolio pages. Protected domain pages are gated behind a passcode with server-side auth (HttpOnly cookie) — proof content is never sent until authentication.

## Core Value

Someone should be able to land on the site, quickly understand what kinds of complex systems Dom builds, and access the right level of proof for their context.

## Current State

M001–M006 complete. M007 in progress — S01 (enhanced markdown rendering and tag system) complete; S02 (engineering journal skill) and S03 (domain page markdown enrichment) remain.

The project is a Next.js 16 App Router site (`src/app/`) with Tailwind v4 retro design tokens, deployed via Vercel.

The portfolio gate uses real server-side auth: the RSC domain route reads an HttpOnly `portfolio-gate` cookie and conditionally renders either the gate page (zero proof content) or the full proof page. `proxy.ts` adds an observability header on `/domains/*` requests. All five public routes (`/`, `/about/`, `/resume/`, `/notes/`, `/notes/[slug]/`) render as server components with full site shell, notes markdown pipeline, custom 404, and SEO metadata.

The notes markdown pipeline uses async unified processing with `@shikijs/rehype` (tokyo-night theme) for syntax-highlighted code blocks, `remark-gfm` for GFM tables, and rich CSS for images, tables, blockquotes, inline code, and horizontal rules. Notes have expanded frontmatter (`tags`, `type`, `readTime`) and the index page supports client-side tag filtering via a `TagFilter` client island.

The WebGPU/WebGL2 shader background renders on all pages via a `'use client'` `ShaderBackground` component mounted in the root layout. Screenshot galleries and Mermaid diagrams render on authenticated domain proof pages as client islands. Domain proof flagship cards use title-cased project names, stack tags surfaced directly under titles, accent-bordered section labels, ›-prefixed list items via `.flagship-list` CSS, and header/body separators for scannable layout. 18 Playwright tests pass against production build (5 gate + 8 public + 3 shader + 2 gallery/mermaid). GitHub Actions CI workflow gates push/PR to main with build + full Playwright suite.

All 27 requirements validated; 4 active requirements remain (all S02 scope). Vercel deployment requires manual env var setup (`GATE_HASH`) and DNS migration from GitHub Pages.

## Architecture / Key Patterns

- **Active stack:** Next.js 16 App Router + Tailwind v4 + React 19 on Vercel
- **Previous stack (replaced in M005):** Astro + TypeScript + plain CSS on GitHub Pages
- Domain-first information architecture with route helpers in `src/lib/paths.ts`
- Thin route files with shared data modules and shared presentational components
- **Gate auth:** Server-side enforcement via RSC cookie check (`await cookies()`) — HttpOnly `portfolio-gate` cookie; server action (`submitPasscode`) with Node `crypto.createHash` hash compare; zero proof content in unauthenticated responses
- **Shader:** `ShaderBackground` `'use client'` component with dynamic import of `initDitherShader` inside `useEffect`; AbortController cleanup; `data-shader-renderer` observability attribute
- **Client islands:** ScreenshotGallery, MermaidDiagram, and ShaderBackground are `'use client'` wrappers imported into server components — all use dynamic import inside `useEffect` to avoid SSR crashes
- DOM marker contract: `data-route-visibility`, `data-gate-state`, `data-protected-gate`, `data-protected-proof-state`, `data-visual-state`, `data-flagship-highlights`, `data-supporting-work`, `data-shader-renderer`, `data-screenshot-gallery`, `data-gallery-init`, `data-mermaid-definition`
- Playwright tests in `tests/e2e/` (18 tests: gate, public, shader, gallery/mermaid)
- GitHub Actions CI on push/PR to main: `next build` + full Playwright suite
- Public site surfaces remain lightweight and text-forward
- Sentence case convention for all visitor-facing copy (D031); title case for project names (D053)
- **Flagship card styling:** Title-case convention (D053), `.flagship-list` CSS class for ›-prefixed lists, accent-bordered section labels, header/body separator — all in `DomainProofPage.tsx` + `globals.css`

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [x] M001: Public portfolio foundation — Ship the domain-first personal site with homepage, domain hubs, flagship proof, about/resume, notes, and custom domain.
- [x] M002: Portfolio access gate — Lightweight passcode gate protecting domain portfolio proof with session-scoped unlock, visual blur/reveal, request-access messaging, and 20-test regression coverage.
- [x] M003: GPU shader background — Custom faded dither shader (WebGPU + WebGL2 fallback) as ambient cursor-reactive background across all pages with per-page opt-out.
- [x] M004: Sentence case audit — Convert all visitor-facing copy from all-lowercase to sentence case with standard "I" capitalization, preserving casual tone.
- [x] M005: Next.js migration — Migrated from Astro/GitHub Pages to Next.js App Router on Vercel, with the portfolio gate upgraded from client-side SHA-256 to server-side HttpOnly cookie auth. 18 Playwright tests, GitHub Actions CI, zero Astro remnants.
- [x] M006: UI polish — Domain pages & typography — Title-cased all project names, surfaced stack tags under titles, and restructured flagship cards with visual separators, accent-bordered section labels, and ›-prefixed list items.
- [ ] M007: Engineering journal — Global agent skill for writing engineering journal entries from conversation context, plus enhanced markdown rendering (Shiki syntax highlighting, tag filtering, images) in the notes section.
