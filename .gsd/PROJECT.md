# Project

## What This Is

A personal website for Dom that gives recruiters, collaborators, and curious peers a fast read on the systems, products, infrastructure, and tooling he has built. The site is intentionally domain-first rather than a flat repo gallery, with a minimal homepage and deeper proof on portfolio pages.

## Core Value

Someone should be able to land on the site, quickly understand what kinds of complex systems Dom builds, and access the right level of proof for their context.

## Current State

M001 is shipped. The site runs as a static Astro site on GitHub Pages with a custom domain, a public homepage, public about and resume pages, a lightweight notes area, and five domain-based portfolio pages with flagship proof and supporting work.

M002 is in progress. S01, S02, and S03 are shipped: `/`, `/about/`, and `/resume/` remain explicitly public, while cold-load `/domains/*` routes render a locked retro gate shell with request-access messaging (canonical email and LinkedIn links), a passcode form with SHA-256 hash validation, session-scoped unlock that carries across protected routes via a sessionStorage + localStorage bridge, and a CSS-driven blur-to-clear visual reveal with screenshot gallery rendering after unlock. The route boundary, unlock flow, and visual protection are enforced by dist validators, browser tests, and the deploy release gate (`pnpm validate:site` covers S01 + S02 + S03). The remaining M002 work is final milestone regression coverage and UAT sign-off (S04).

## Architecture / Key Patterns

- Astro + TypeScript + plain CSS on GitHub Pages
- Domain-first information architecture with route helpers in `src/lib/paths.ts`
- Thin route files with shared data modules and shared presentational components
- Dist-first validation scripts that verify shipped output before deploy
- Public site surfaces remain lightweight, text-forward, and base-path aware

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [x] M001: Public portfolio foundation — Ship the domain-first personal site with homepage, domain hubs, flagship proof, about/resume, notes, and custom domain.
- [ ] M002: Portfolio access gate — In progress. S01–S03 shipped; remaining work is final regression coverage and UAT sign-off (S04).
