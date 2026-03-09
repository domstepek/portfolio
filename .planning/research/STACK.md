# Research: Stack

**Project:** Dom Personal Site  
**Focus:** Standard 2025 stack for a minimal multi-page personal site with domain-based navigation  
**Hosting Constraint:** GitHub Pages  
**Research Date:** 2026-03-09

## Recommended Stack

- Use `Astro` as the site framework with `TypeScript`, Astro Content Collections, Markdown content, plain CSS, and deployment through GitHub Actions to GitHub Pages.
- This is the strongest fit for a personal site that is mostly static, text-first, lightweight, and multi-page.
- Astro gives reusable layouts and components, clean file-based routing, and near-zero client JavaScript by default.
- The site structure maps naturally to Astro:
  - `src/pages/index.astro` for the landing page
  - `src/content/domains/*.md` for domain pages
  - `src/content/highlights/*.mdx` or `*.md` for flagship project highlights
- Start with no client framework at all. If a small interaction is needed later, add a tiny Astro island instead of making the whole site React-driven.
- Use plain CSS with a small handcrafted design layer: CSS variables, system font stack, clear spacing, simple link states, and minimal motion.
- Deploy with GitHub Actions to GitHub Pages rather than relying on an older branch-publish flow.

## Alternatives Considered

### Plain HTML/CSS

- Technically viable and the lightest possible option.
- Best only if the site were truly one page with a contact section.
- Once the site includes multiple domain pages and repeatable case-study structure, hand-maintained HTML becomes annoying quickly.

### Eleventy

- Strong runner-up.
- Excellent for static content sites and GitHub Pages compatibility.
- Simpler than app frameworks, but Astro has a better fit for component reuse and typed content collections in this project.

### Vite Static Build

- Fine if the goal is a tiny app-like frontend with vanilla JS, Preact, or React.
- Not the best default here because routing, content modeling, and static authoring would need to be assembled more manually.

### Next.js Static Export

- Possible, but not the right choice here.
- Adds React and Next complexity to a site that mostly needs prerendered HTML.
- Easy to accidentally lean on features that do not belong on GitHub Pages.

### Hugo

- Still a solid static-site option.
- Best for people who strongly prefer content-first workflows outside the JS/TS ecosystem.
- Less aligned with the modern frontend ergonomics likely to be comfortable in this repo.

### Jekyll

- Historically associated with GitHub Pages.
- No longer the best greenfield default for this kind of project.
- Brings in a more legacy Ruby-oriented toolchain than this site needs.

## Suggested Libraries And Tools

- `astro` for the framework
- `typescript` for configuration, schemas, and safer content typing
- Astro Content Collections with `zod` for structured frontmatter
- Markdown-first content authoring for domains and concise project summaries
- `@astrojs/mdx` only if richer embeds or custom formatting are needed later
- Plain CSS for styling
- `astro:assets` for optimized images if screenshots or portraits get added
- `prettier` plus `prettier-plugin-astro` for formatting
- `astro check` for validation
- `pnpm` as the package manager
- GitHub Actions plus Pages deployment for release automation
- Optional later: `@playwright/test` for a light smoke test

## What Not To Use And Why

- Do not use SSR-first or server-dependent features. GitHub Pages is static hosting.
- Do not build this as a SPA-first React or Vue app. The site wants fast static HTML and low client JS.
- Do not default to full `Next.js` app-router patterns unless the project later grows beyond static-site constraints.
- Do not start with Tailwind plus a component library for v1. A sparse personal site is faster and clearer with a small handcrafted CSS layer.
- Do not add a CMS, database, or search system in v1. The content volume is small and static files are simpler.
- Do not lean on heavy animation libraries or “portfolio template” kits. They fight the intended text-forward tone.

## GitHub Pages Notes

- If this is deployed as a project site such as `username.github.io/website`, the build will likely need a base path like `/website`.
- If it becomes a user site or gets a custom domain, the deployment config can be simplified.
- The stack should assume static export from the beginning so Pages constraints shape the implementation early.

## Confidence Notes

- **High confidence:** Astro is the best default for this project as described.
- **Medium confidence:** Eleventy is the strongest fallback if a more traditional static-site-generator workflow is preferred.
- **Low confidence:** Next.js is worth the added complexity here unless the site later expands into something much more interactive.

---
*Last updated: 2026-03-09 after research*
