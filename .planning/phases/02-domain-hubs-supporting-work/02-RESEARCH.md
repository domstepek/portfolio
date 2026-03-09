# Phase 2 Research: Domain Hubs & Supporting Work

## Phase Intent

Phase 2 should turn the domain-first information architecture into real, repeatable pages. The goal is not to finish the whole portfolio. The goal is to make the five domains real destinations with clear boundaries, a shared text-forward pattern, and enough curated proof to satisfy `DOMN-01` through `DOMN-04`.

This phase should stay deliberately narrow:

- in scope: separate domain routes, thesis openings, supporting-work curation, proof-link paths, back-home navigation
- out of scope: homepage positioning work from Phase 3 and flagship case-study depth from Phase 4

## Repo-Specific Instruction Files

No `CLAUDE.md`, `.claude/skills/**/SKILL.md`, or `.agents/skills/**/SKILL.md` files were found in the repo.

## Current-State Implications

- Phase 1 already solved the highest-risk infrastructure pieces: static Astro output, GitHub Pages base-path handling, shared layout, readable typography baseline, and deploy validation.
- `src/lib/paths.ts` already exposes `homePath` and `domainPath(slug)`. Phase 2 should use those helpers directly instead of inventing new route logic.
- `astro.config.mjs` uses `output: "static"`, `trailingSlash: "always"`, and directory-style build output, so each domain page should emit to `dist/domains/<slug>/index.html`. That output shape is ideal for a Phase 2 artifact validator.
- `src/pages` currently contains only `index.astro` and `404.astro`. There is no domain route, no domain content model, and no domain-specific component yet.
- `src/components/layout/BaseLayout.astro` already owns metadata and the site shell. Domain pages should pass page-level values into it rather than creating a second layout.
- `src/styles/global.css` already supports prose, lists, links, focus states, and reading width well enough for text-first domain pages. The likely CSS work is incremental, not architectural.
- There is currently no `src/content` directory. That means Phase 2 is the first time the repo has to choose a reusable domain-content pattern.
- `src/pages/index.astro` is intentionally temporary and Phase 3 owns homepage navigation requirements. Phase 2 should prepare reusable domain data for the homepage to consume later, but should avoid turning this phase into a homepage rewrite.
- One concrete CSS watch item already exists: the current `h1` width is tuned for the short Phase 1 heading. Longer titles like `developer experience` may need a small override or spacing adjustment once the real domain pages exist.

## Recommended Route Shape

Keep the domain routes under `/domains/[slug]/`. This matches the existing helper API, stays GitHub Pages-safe, and aligns with the earlier architecture research.

| UI title | Slug | Route |
|---------|------|-------|
| analytics | `analytics` | `/domains/analytics/` |
| infrastructure | `infrastructure` | `/domains/infrastructure/` |
| ai / ml | `ai-ml` | `/domains/ai-ml/` |
| product | `product` | `/domains/product/` |
| developer experience | `developer-experience` | `/domains/developer-experience/` |

Planning implications:

- Use one dynamic route file: `src/pages/domains/[slug].astro`.
- Generate static paths from a typed domain data source.
- Pass `canonicalPath={domainPath(slug)}` into `BaseLayout`.
- Use `homePath` for the explicit top-of-page `back home` link.
- Use `domainPath(otherSlug)` for any brief cross-domain mentions so overlap stays base-aware.
- Do not add a `/domains/` overview route in this phase. The requirement is five separate pages, not a new hub index.

The UI should use the short visitor-facing titles from the Phase 2 context. The fuller requirement phrasing such as `analytics platforms` or `product engineering` can still appear in `seoDescription` fields where that helps clarity.

## Recommended Data And Content Organization

The most practical Phase 2 option is a small typed data layer, not a larger content-platform setup.

Recommended structure:

- `src/data/domains/types.ts`
- `src/data/domains/index.ts`
- `src/data/domains/analytics.ts`
- `src/data/domains/infrastructure.ts`
- `src/data/domains/ai-ml.ts`
- `src/data/domains/product.ts`
- `src/data/domains/developer-experience.ts`

Why this fits the phase well:

- There are only five fixed routes.
- The content shape is structured and short-form: title, thesis, bullets, scope line, supporting items, proof links.
- Nested data such as supporting items and proof links is easier to edit in TypeScript objects than in long frontmatter blocks.
- This mirrors the repo's existing `src/data/site.ts` pattern.
- It avoids introducing a full content-collection system before Phase 4 proves whether longer flagship narratives actually need one.

Recommended per-domain shape:

- `slug`
- `title`
- `order`
- `summary`
- `seoDescription`
- `thesis`
- `scope`
- `belongsHere: string[]`
- `supportingWork: Array<{ title; context; proofLinks?: Array<{ label; href }> }>`
- optional `relatedDomains: DomainSlug[]` only if overlap genuinely helps orientation

Recommended proof-link rule:

- default to one primary proof link per supporting item
- allow a second link only when it materially adds value
- allow zero proof links on some supporting items when the context line is still useful
- require at least one outward proof link somewhere on each page so `DOMN-04` stays true

Recommended content density targets:

- thesis: 1 short first-person sentence
- belonging bullets: 2 to 4 bullets
- scope line: 1 explicit boundary sentence
- supporting work: roughly 3 to 6 curated entries per page

Important planning rule:

- keep each project in one canonical home domain only
- assign that home by the primary problem solved, not by the tech stack
- if overlap matters, add a brief cross-link or note instead of duplicating the full entry

If the planner wants the absolute smallest implementation, a single `src/data/domains.ts` file would still work. The one-file-per-domain version is the better planning recommendation because it keeps copy editing, review, and later diffs cleaner.

## Shared Page Pattern Recommendation

All five routes should render through one shared domain template. The route file should resolve the domain entry and hand it to a single presentational component such as `src/components/domains/DomainPage.astro`.

Recommended page shape:

1. explicit `back home` link near the top
2. `h1` with the domain title
3. thesis paragraph in the site's lowercase, direct voice
4. short bullets for the kinds of work that belong in the domain
5. scope line that makes the boundary explicit
6. `supporting work` section with stacked entries
7. inline proof links inside each supporting entry
8. optional brief cross-links to related domains where overlap helps orientation

Why one template is enough right now:

- the pattern is intentionally repetitive
- Phase 2 does not need multiple visual variants
- more section components would mostly add ceremony before the content shape is proven
- Phase 4 can extend the same template later with flagship sections if needed

Rendering guidance:

- prefer semantic text structure over cards, tabs, or grids
- keep supporting entries as stacked list items or simple article-like blocks
- keep proof links inline with the supporting item, not in a separate proof section
- do not rely on the shared header title as the only route back home; the explicit top link is part of the Phase 2 decision set
- do not add client-side interactivity for this phase

A good supporting-work item should scan in one glance. Each entry should answer "what was this?" in one compact line before the visitor decides whether to click the proof link.

## Integration With Existing Layout And Helpers

Phase 2 should extend the current repo conventions directly.

Recommended integrations:

- `BaseLayout.astro` should remain the only page shell and metadata owner.
- `domainPath(slug)` should be the canonical-path source for every domain page and any internal cross-links.
- `homePath` should power the explicit return link near the top of each domain page.
- `seoDescription` from each domain entry should be passed into `BaseLayout` so the domain pages do not inherit the generic Phase 1 site description.
- `src/styles/global.css` should stay the main typography baseline, with only modest additions for domain-page spacing, heading width, and supporting-item grouping.
- `.github/workflows/deploy.yml` should keep the current check/build/validate pattern and extend it rather than branching into a second deployment flow.

What should probably not change in Phase 2:

- `src/pages/index.astro`, except possibly for prep work that helps Phase 3 reuse the domain data later
- `src/lib/paths.ts`, unless the planner wants a small typed slug helper; the existing route helper is already sufficient
- `src/data/site.ts`, aside from normal consumption by page metadata

## Likely Files To Touch

Very likely:

- `src/pages/domains/[slug].astro`
- `src/components/domains/DomainPage.astro`
- `src/data/domains/types.ts`
- `src/data/domains/index.ts`
- `src/data/domains/analytics.ts`
- `src/data/domains/infrastructure.ts`
- `src/data/domains/ai-ml.ts`
- `src/data/domains/product.ts`
- `src/data/domains/developer-experience.ts`
- `src/styles/global.css`
- `package.json`
- `scripts/validate-phase2.mjs`
- `.github/workflows/deploy.yml`

Possibly helpful but not required:

- `src/lib/paths.ts` if typed slug helpers are added
- `src/pages/index.astro` only if the planner intentionally does a tiny Phase 3 preparation step, not to satisfy the Phase 2 requirements themselves

## Likely Sequencing Implications

The safest implementation order is:

1. Lock the five slugs, titles, and one-line inclusion rules before writing the page template.
2. Define the typed domain data shape.
3. Build one domain end to end first, preferably `analytics` or `infrastructure`, to harden the shared page pattern and proof-link treatment.
4. Implement the dynamic domain route and shared template around that first domain.
5. Fill in the remaining four domain entries using the same structure.
6. Do a short CSS pass only after the real longest labels and real supporting lists exist.
7. Add the Phase 2 validator and wire it into the existing build/deploy flow.
8. Run browser-level smoke checks against the built or deployed site before moving to Phase 3.

Why this order matters:

- the biggest risk is not Astro routing
- the biggest risk is discovering too late that the domain boundaries, page pattern, or proof-link density are weak
- one end-to-end domain first gives the planner a reliable template before the copy multiplies

## Risks And Pitfalls To Plan Around

### 1. Weak Domain Boundaries

The biggest content risk is overlap between `product`, `developer experience`, `analytics`, and `infrastructure`.

Mitigation:

- write one inclusion rule per domain before drafting
- assign each project a single home domain based on the primary value delivered
- allow only brief cross-links for overlap

### 2. Over-Modeling Too Early

It is easy to introduce content collections, multiple section components, and highlight schemas before the shared pattern is proven.

Mitigation:

- start with typed domain data and one shared template
- keep supporting work inline
- defer flagship modeling to Phase 4 unless real copy pressure proves it is needed sooner

### 3. Generic Copy That Does Not Prove Anything

A page can satisfy the route requirement and still fail the visitor if the thesis and supporting items sound broad but unconvincing.

Mitigation:

- require every supporting item to answer "what was it?" in one compact line
- prefer concrete nouns, users, constraints, and outcomes over adjectives
- review whether each page sounds distinct from the other four

### 4. DOMN-04 Fails Because Proof Is Uneven

Some supporting items will not have public proof, which the phase context explicitly allows. A page with no outward evidence at all will still feel weak.

Mitigation:

- plan at least one public proof link per domain page early
- treat proof links as a phase requirement, not a last-step polish item
- validate proof-link presence without making the build depend on remote availability

### 5. CSS That Worked for Phase 1 but Feels Tight on Real Domain Pages

The current shell was tuned against a sparse homepage, not against five content-heavy domain pages.

Mitigation:

- expect a small style pass for title wrapping, section rhythm, and supporting-entry spacing
- keep the solution text-first and minimal instead of introducing heavy card layouts

### 6. Scope Bleed Into Later Phases

Homepage domain navigation, freshness signals, contact framing, and flagship storytelling all have their own roadmap slots.

Mitigation:

- do not turn Phase 2 into the homepage rewrite
- do not add flagship sections unless that work is explicitly pulled forward
- treat the success bar as "five clear domain hubs with evidence," not "the whole portfolio is complete"

## Validation Architecture

Phase 2 should reuse the existing dist-first validation style from Phase 1. The validator should inspect emitted HTML in `dist`, not just source files, so the checks match what GitHub Pages will actually publish.

### Automated Verification

Recommended base commands:

- `pnpm astro check`
- `pnpm astro build`

Recommended new validation entry:

- add `scripts/validate-phase2.mjs`
- add `validate:phase2` in `package.json`
- run it after build locally and in CI

If the planner wants to reduce future workflow churn, this is also the right phase to introduce an aggregate script such as `validate:site` that runs `validate:phase1` and `validate:phase2` together before deploy.

Recommended Phase 2 artifact assertions:

- `dist/domains/analytics/index.html` exists
- `dist/domains/infrastructure/index.html` exists
- `dist/domains/ai-ml/index.html` exists
- `dist/domains/product/index.html` exists
- `dist/domains/developer-experience/index.html` exists
- each built page has a non-empty `<title>`
- each built page has a canonical URL
- each built page contains an explicit back-home link that resolves to the base-aware home path
- each built page contains a thesis block near the top
- each built page contains a `supporting work` section
- each built page contains at least one supporting-work entry
- each built page contains at least one outward proof link somewhere on the page

Implementation detail that will make the validator much simpler:

- add stable markers such as `data-domain-page`, `data-domain-thesis`, `data-supporting-work`, `data-proof-link`, and `data-back-home` in the shared template
- parse built HTML in the validator the same way Phase 1 already parses `dist/index.html` and `dist/404.html`

Important validation nuance:

- the validator should assert that proof links are present and look like absolute `http(s)` URLs
- the validator should not fail because a third-party site is temporarily down
- the validator should assert at least one proof link per page, not one proof link per supporting item, because the phase context explicitly allows some curated items to have no public artifact

Recommended fast local gate after Phase 2 lands:

- `pnpm astro check && pnpm astro build && pnpm validate:phase1 && pnpm validate:phase2`
- or `pnpm astro check && pnpm astro build && pnpm validate:site` if an aggregate script is introduced

### Manual Verification

Required browser-level or manual QA:

- open each of the five domain routes at the real base path
- confirm the explicit top `back home` link returns to the homepage correctly
- confirm the shared header title still links home
- scan each thesis opening and verify the domain boundary feels distinct from the neighboring domains
- confirm each page has a visibly scannable supporting-work section, not a dense wall of prose
- open at least one proof link from each domain page
- check mobile and desktop widths for heading wraps, list spacing, and overall reading comfort
- tab through the page and confirm focus styles remain obvious on the new routes

Preferred execution path:

- use `/agent-browser --native` first for browser-addressable smoke checks before escalating any remaining subjective checks to manual review

### Requirement Coverage Map

- `DOMN-01`: all five built route artifacts exist and open correctly
- `DOMN-02`: every domain page has a thesis opening and an explicit boundary line
- `DOMN-03`: every domain page has a supporting-work section with curated entries
- `DOMN-04`: every domain page has an explicit back-home path and outward proof links

## Planning Takeaway

Phase 2 is best planned as "prove the repeatable domain hub pattern," not "finish the entire site." The repo already has the hard infrastructure pieces in place. The main planning decisions now are about clarity and reuse:

- keep the route shape under `/domains/[slug]/`
- use one shared domain template
- keep domain content in typed data modules that match the existing `src/data` pattern
- keep supporting work inline and curated
- extend the existing dist-first validator so the phase is proven in built output, not only in source

If those choices stay disciplined, Phase 3 can reuse the same domain data for homepage navigation and Phase 4 can deepen the strongest stories without rewriting the domain architecture.

---

*Last updated: 2026-03-09 after Phase 2 repo research*
