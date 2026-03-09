# Research Summary

**Project:** Dom Personal Site  
**Research Date:** 2026-03-09

## Recommended Direction

- Build a domain-first static personal site: a very short homepage plus deeper capability pages that show proof instead of acting like a repo gallery.
- Use `snwy.me` as inspiration for restraint, tone, and pacing, but add enough structure for depth:
  - thesis
  - examples
  - outcomes
  - outbound links
- Keep the voice casual, direct, and lowercase.
- Treat curation as a core product decision. Five domains is good only if each one has clear boundaries and enough evidence.

## Stack Decision

- Use `Astro` with `TypeScript`, Astro Content Collections, Markdown-first content, plain CSS, and deployment via GitHub Actions to GitHub Pages.
- Start with no client framework and no SPA behavior.
- Use content schemas so domains and highlights stay typed and maintainable.
- Assume static export and GitHub Pages base-path constraints from day one.

## Table Stakes For V1

- A homepage that quickly explains who Dom is, what kinds of systems he builds, and where to click next.
- Visible navigation to the domain pages:
  - analytics
  - infrastructure / devops
  - ai / ml tooling
  - product engineering
  - developer experience
- A shared domain-page structure:
  - short thesis
  - selected examples
  - 1-2 flagship highlights
  - supporting work
  - proof links
- Concrete proof on every page:
  - what it was
  - Dom's role
  - why it mattered
  - what changed after it shipped
- Low-friction contact links on the first screen:
  - GitHub
  - LinkedIn
  - email
- Strong reading quality:
  - mobile friendly
  - fast
  - accessible
  - semantic
  - obvious links
  - strong contrast
- A small freshness signal such as `currently`, `now`, or `last updated`

## Deliberate Exclusions For V1

- No CMS, database, auth, comments, or backend-dependent features
- No blog, search, client-side filtering, or flat `/projects/` index
- No standalone route for every project in the first version
- No React or Next-style app complexity, SSR features, or heavy animation libraries
- No giant skills list, repo dump, novelty portfolio gimmicks, or copy that simply mirrors LinkedIn

## Architecture Decisions

- Keep the route shape simple:
  - `/`
  - `/domains/[slug]`
  - `/404.html`
- The homepage is the only overview page.
- Domain pages are the primary deep pages.
- Keep content in `src/content`, site-wide config in `src/data`, helper logic in `src/lib`, and styling in a small global CSS layer.
- Use structured collections for domains and highlights with stable slugs and typed frontmatter.
- Let route files own content loading and route decisions while components stay presentational.
- Let each domain define which highlights are featured.
- Include deployment polish as part of the core architecture:
  - base path
  - canonical URLs
  - sitemap
  - OG image
  - favicon
  - 404 behavior

## Biggest Risks To Watch

- Scope sprawl from trying to represent every repo equally
- Weak domain boundaries that create overlap and duplicated stories
- Low-information copy that sounds broad but proves little
- GitHub Pages pathing mistakes after deployment
- Content maintenance cost if bios and summaries are duplicated across files

## Planning Implications

- Define the inclusion rule for each domain before writing copy.
- Do a content inventory early and choose 1-2 flagship stories per domain before building too many components.
- Build in this order:
  1. Astro scaffold and Pages setup
  2. content schemas
  3. base layout and typography
  4. homepage
  5. one strongest domain page end to end
  6. remaining domain pages
  7. deployment polish
- Start with the strongest proof areas first, especially analytics, infrastructure / devops, and AI / ML tooling.
- Centralize repeated metadata so later edits stay cheap.

## Key Findings

**Stack:** Astro + TypeScript + Markdown + plain CSS + GitHub Actions on GitHub Pages  
**Table Stakes:** short homepage, clear domain navigation, proof-oriented domain pages, contact links, strong readability  
**Watch Out For:** scope sprawl, muddy domain boundaries, generic copy, and GitHub Pages pathing issues

---
*Last updated: 2026-03-09 after research synthesis*
