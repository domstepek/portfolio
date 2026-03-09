# Phase 2: Domain Hubs & Supporting Work - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Create the five v1 domain pages as separate routes with a shared, text-forward pattern. Each page should define one domain clearly, open with a short personal thesis, include a curated supporting-work list that is easy to scan, and provide obvious paths back home and out to proof artifacts. Deeper flagship storytelling stays in Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Domain boundaries and labels
- Use the shorter visitor-facing domain titles: `analytics`, `infrastructure`, `ai / ml`, `product`, and `developer experience`.
- Give each project one canonical home domain instead of duplicating full entries across pages.
- Assign a project's home domain by the primary problem solved or value delivered, not by the tech stack alone.
- Allow brief cross-links or mentions from other domain pages when overlap helps orientation.

### Thesis opening pattern
- Open each domain page with a first-person thesis sentence in the site's direct, lowercase voice.
- Follow the thesis with a short set of bullets describing the kinds of work or problems that belong in that domain.
- Include a brief scope line that makes the boundary of the domain explicit.
- Keep the same overall opening structure across all five pages, while allowing small per-page variation in length.

### Supporting-work scan pattern
- Present supporting work as short stacked entries rather than a bare name-only list or subtheme clusters.
- Each supporting item should include the project name plus one compact line of context about what it was.
- Keep the supporting-work section moderately curated on each page rather than exhaustive.
- Supporting items may later graduate into flagship highlights in Phase 4 without being marked specially now.

### Proof links and page navigation
- Put proof links inline with supporting-work items instead of moving them into a separate proof section.
- Default to one primary proof link per item, with an optional second link only when it genuinely adds value.
- Add an explicit `back home` link near the top of each domain page even though the shared header already links home.
- Keep useful supporting items even when they do not have a public proof artifact, as long as the one-line context still helps the visitor scan the work.

### Claude's Discretion
- Exact copy phrasing for each thesis sentence, scope line, and supporting-work one-liner.
- Exact bullet count and per-page density within the chosen shared pattern.
- Visual treatment of inline proof links and the top `back home` link within the existing minimal CSS baseline.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/layout/BaseLayout.astro`: shared metadata, semantic shell, header, and footer for every future domain route.
- `src/lib/paths.ts`: base-aware `homePath`, `routePath()`, and `domainPath(slug)` helpers for GitHub Pages-safe internal routing.
- `src/styles/global.css`: established reading-focused typography, list spacing, link styling, and focus states that already fit thesis copy plus stacked supporting-work entries.
- `src/data/site.ts`: centralized site metadata and deploy-path-aware defaults for canonicals and shared assets.

### Established Patterns
- New pages should pass only page-level metadata into `BaseLayout` instead of duplicating head tags or shell structure.
- Internal routes and canonical URLs need to stay base-path-aware for GitHub Pages deployments.
- The site direction is intentionally minimal, text-forward, and lightweight, so Phase 2 should favor thesis copy, lists, and links over card-heavy or JS-driven layouts.
- The repo does not yet have domain-specific components or content collections, so Phase 2 will establish the first reusable domain-page content pattern.

### Integration Points
- `src/lib/paths.ts` already exposes the natural Phase 2 route shape through `domainPath(slug)` for `/domains/[slug]/`.
- `src/pages/index.astro` is intentionally temporary; Phase 3 can later link into whatever shared domain-page pattern Phase 2 establishes.
- Domain routes should plug into the existing `BaseLayout` shell rather than introducing a separate page framework.

</code_context>

<specifics>
## Specific Ideas

- Domain pages should read like concise thesis pages with curated evidence, not mini case-study hubs yet.
- Cross-links are acceptable where work overlaps, but the main write-up for each project should live in only one domain.
- Public proof is helpful but not required for every supporting item if the context line still communicates why the work matters.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-domain-hubs-supporting-work*
*Context gathered: 2026-03-09*
