# Research: Architecture

**Project:** Dom Personal Site  
**Focus:** Site structure, routing, content model, and build order for a domain-first static site  
**Research Date:** 2026-03-09

## Recommended Architecture

Use `Astro` as the site framework and treat the site as a pure static build. This fits GitHub Pages, keeps runtime JavaScript near zero, gives clean file-based routing, and makes future edits happen mostly in content files instead of page code.

Recommended route shape:

```text
/
/domains/analytics/
/domains/infrastructure/
/domains/ai-ml/
/domains/product/
/domains/developer-experience/
/404.html
```

Key decisions:

- Keep `/` as the only overview page.
- Make domain pages the primary deep pages.
- Do not create a flat `/projects/` index in v1.
- Render flagship projects inside their parent domain page rather than giving every project its own route.
- Leave room for future nested detail pages if a flagship story becomes too long.
- Keep v1 intentionally static:
  - no CMS
  - no blog
  - no client-side filtering
  - no site search
  - no SPA router

## Page And Component Boundaries

Pages should own content loading and route-level decisions. Components should stay presentational and receive typed data.

### Pages

- `src/pages/index.astro`
  - loads site config
  - loads ordered domain summaries
  - renders the landing page
- `src/pages/domains/[slug].astro`
  - resolves one domain
  - pulls related highlights
  - renders one shared domain template
- `src/pages/404.astro`
  - renders a minimal fallback page

### Layout And Shared Components

- `src/components/layout/BaseLayout.astro`
  - page shell
  - metadata
  - typography baseline
- `src/components/sections/HomeIntro.astro`
  - landing page intro copy
- `src/components/sections/DomainIndex.astro`
  - list of domain links or cards on the homepage
- `src/components/sections/DomainHero.astro`
  - domain title, summary, capabilities, tools
- `src/components/sections/FlagshipHighlights.astro`
  - 1-2 deeper examples with outcomes and links
- `src/components/sections/SupportingWorkList.astro`
  - concise list of additional related work
- `src/components/shared/ContactLinks.astro`
  - GitHub, LinkedIn, email
- `src/lib/content.ts`
  - sorting
  - joins
  - helper lookups

### Directory Shape

```text
src/
  pages/
    index.astro
    domains/[slug].astro
    404.astro
  components/
    layout/
      BaseLayout.astro
    sections/
      HomeIntro.astro
      DomainIndex.astro
      DomainHero.astro
      FlagshipHighlights.astro
      SupportingWorkList.astro
    shared/
      ContactLinks.astro
  content/
    domains/
    highlights/
  data/
    site.ts
  lib/
    content.ts
  styles/
    global.css
  assets/
public/
  favicon.svg
  og-default.png
```

## Content Model

Keep narrative content in `src/content`, site-wide configuration in `src/data`, and static files in `public` or `src/assets`.

### Site Config

Location: `src/data/site.ts`

Suggested fields:

- `name`
- `title`
- `description`
- `intro`
- `contactLinks`
- `defaultSeoImage`
- `navLabels`

### Domains Collection

Location: `src/content/domains/*.md`

Suggested fields:

- `slug`
- `title`
- `summary`
- `order`
- `capabilities[]`
- `tools[]`
- `featuredHighlightSlugs[]`
- `otherWork[]`
- `seoDescription`

Purpose:

- powers the homepage domain index
- drives the domain routes
- defines domain ordering

### Highlights Collection

Location: `src/content/highlights/*.mdx` or `*.md`

Suggested fields:

- `slug`
- `domain`
- `title`
- `oneLiner`
- `role`
- `period`
- `stack[]`
- `outcomes[]`
- `links[]`
- `sortOrder`
- `coverImage`

Purpose:

- stores flagship project highlights
- renders deeper examples inline on domain pages

### Modeling Rules

- Use Markdown for domain entries.
- Use MDX only if a highlight needs richer formatting.
- Let the domain entry decide which highlights are featured.
- Keep short supporting mentions directly in the domain entry rather than creating separate files for everything.
- Keep slug stability separate from display copy.

## Suggested Build Order

1. Bootstrap Astro and the GitHub Pages deployment path.
2. Define the site, domain, and highlight schemas.
3. Build the base layout, metadata helpers, and typography system.
4. Implement the landing page using real content data.
5. Implement one domain page end to end, preferably `analytics` or `infrastructure`.
6. Populate the remaining domain pages and highlight entries.
7. Add deploy polish:
   - 404 page
   - canonical URLs
   - sitemap
   - OG image
   - favicon
   - GitHub Actions workflow
8. Do a final content pass to ensure the lowercase, direct tone stays consistent.

## Why This Structure Fits

- It keeps the site domain-first instead of repo-first.
- It makes content editing cheap and maintainable.
- It gives enough structure for depth without turning the site into a content platform.
- It preserves the minimal feel of the landing page while allowing deeper pages to carry the detail.

## Confidence Notes

- **High confidence:** A domain-first static architecture is the right fit for the brief.
- **High confidence:** One shared domain template and no standalone project routes in v1 keeps the site clean.
- **Medium confidence:** The exact content volume may push one or two flagship stories into their own route later, but that should be a later decision.

---
*Last updated: 2026-03-09 after research*
