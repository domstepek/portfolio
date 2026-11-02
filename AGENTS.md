# AGENTS.md

Personal portfolio website for Dom — domain-first information architecture with public pages, server-authenticated portfolio proof, and a custom WebGPU/WebGL2 shader background.

## Stack

- Next.js App Router + TypeScript + Tailwind v4
- Arc UI (uiarc.dev, free tier) for components: installed as source in `src/components/arc/` via the shadcn CLI (`components.json` registers `@uiarc`)
- pnpm
- Vercel (deployment)
- Playwright (integration tests — the release gate)

## Commands

- `pnpm dev` — local dev server (Turbopack)
- `pnpm build` — production build (`next build`)
- `pnpm test` — run Playwright integration tests (18 tests, the release gate)
- `tsc --noEmit` — type checking (strict across all `src/`)
- `CI=true pnpm build && CI=true pnpm test` — reproduce CI locally (production build + tests against `next start`)

## Key Concepts

- **Domain pages** (`/domains/[slug]`) — protected portfolio proof, gated by server-side auth (middleware + HttpOnly cookie). Unauthenticated requests see a gate form at the same URL; content is never shipped to unauthenticated clients.
- **Command palette** — the homepage is Arc's command palette (`HomePalette`); every other page opens the same commands with ⌘K (`CommandMenu`: dialog on desktop, bottom sheet on phones). Commands live in `src/data/commands.ts`
- **Public pages** (`/`, `/work`, `/about`, `/resume`, `/notes/*`) — always accessible, never gated
- **Shader** — custom WebGPU/WebGL2 faded dither background, site-wide with per-page opt-out via `ShaderBackground` client component
- **DOM marker contract** — `data-route-visibility`, `data-gate-state`, `data-visual-state` attributes are consumed by tests; don't change them without updating both

## Conventions

- `globals.css` for page composition; Arc components keep their own CSS modules in `src/components/arc/` — don't restyle Arc internals, and don't add other CSS files or CSS-in-JS
- Arc tokens are mapped to the site palette in `globals.css` (`:root[data-theme="dark"][data-accent="green"]`); the shader reads its own `--shader-*` tokens
- Links that look like buttons use `LinkButton` (Arc's button styles on an `<a>`)
- Data lives in `src/data/` as typed TypeScript modules, not in a CMS or database
- Notes are markdown files in `src/content/notes/` processed by a gray-matter + unified pipeline (`src/lib/notes.ts`)
- Page components are React Server Components in `src/components/{page}/`; route files in `src/app/` import and render them
- Client interactivity isolated to smallest possible `'use client'` components (e.g. `GateForm`, `ShaderBackground`, `CopyChip`)
- Casual, direct tone in all copy — sentence case with standard "I" capitalization (D031)
- Dark terminal aesthetic — Geist and Geist Mono, muted greens, dither shader, light CRT overlay, `~/Dom` wordmark

## Deployment

- Hosted on Vercel. Push to `main` triggers CI (GitHub Actions) then Vercel build + deploy.
- **Required Vercel env var:** `GATE_HASH` — SHA-256 hex digest of the portfolio passcode. Must be set in the Vercel project dashboard before first deploy.
- DNS for custom domain must point to Vercel (not GitHub Pages).

## Project Planning

This project uses GSD for structured planning and execution. See `.gsd/PROJECT.md` for current state and milestone sequence, `.gsd/DECISIONS.md` for the architectural decision register.
