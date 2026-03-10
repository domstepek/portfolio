# Requirements: Dom Personal Site

**Defined:** 2026-03-09  
**Core Value:** Someone should be able to land on the site and quickly understand what kinds of complex systems Dom builds, then explore the domains that matter to them without getting buried in noise.

## v1 Requirements

### Home

- [x] **HOME-01**: Visitor can understand from the first screen that Dom builds analytics platforms, infrastructure, AI/ML tooling, product systems, and developer experience tooling
- [x] **HOME-02**: Visitor can navigate from the homepage to the domain pages for analytics platforms, infrastructure / devops, AI / ML tooling, product engineering, and developer experience
- [x] **HOME-03**: Visitor can open Dom's GitHub, LinkedIn, and email links from the homepage
- [x] **HOME-04**: Visitor can see a freshness signal on the homepage such as `currently` or `last updated`

### Domains

- [x] **DOMN-01**: Visitor can open a separate page for each primary domain in v1: analytics platforms, infrastructure / devops, AI / ML tooling, product engineering, and developer experience
- [x] **DOMN-02**: Visitor can read a short thesis at the top of each domain page explaining the kinds of problems Dom solves in that area
- [x] **DOMN-03**: Visitor can scan a supporting-work list on each domain page for related projects that are not full flagship highlights
- [x] **DOMN-04**: Visitor can navigate from each domain page back to the homepage and out to relevant proof artifacts

### Highlights

- [ ] **HIGH-01**: Visitor can read one to two flagship highlights on each domain page
- [ ] **HIGH-02**: Visitor can understand for each flagship highlight the problem, Dom's role, constraints, decisions, and outcome
- [ ] **HIGH-03**: Visitor can see the relevant stack or tools used in each flagship highlight
- [ ] **HIGH-04**: Visitor can view screenshots or diagrams for flagship highlights where visuals improve understanding

### Quality

- [x] **QUAL-01**: Visitor can access the site as a statically deployed GitHub Pages site
- [x] **QUAL-02**: Visitor can read and navigate the site comfortably on mobile and desktop layouts
- [x] **QUAL-03**: Visitor can use the site with accessible structure, strong contrast, and readable typography
- [x] **QUAL-04**: Visitor can share and preview the site with correct core metadata, including page titles, descriptions, Open Graph metadata, favicon, and a working 404 page

### Profile

- [ ] **PROF-01**: Visitor can read a short `how i work` section that explains how Dom approaches systems, product, and collaboration
- [ ] **PROF-02**: Visitor can open a resume from the site
- [ ] **PROF-03**: Visitor can understand what kinds of roles, collaborations, or opportunities Dom is open to

### Notes

- [ ] **NOTE-01**: Visitor can browse a lightweight notes / thinking index with short summaries
- [ ] **NOTE-02**: Visitor can open an individual note page from the notes index

## v2 Requirements

### Case Studies

- **CASE-01**: Visitor can open a standalone deep-dive page for a flagship project when inline domain-page coverage is no longer enough
- **CASE-02**: Visitor can navigate between related flagship case studies across domains

### Content Expansion

- **CONT-01**: Visitor can browse a broader archive of supporting work beyond the curated v1 highlights
- **NOTE-03**: Visitor can browse notes by theme or tag as the writing library grows

## Out of Scope

| Feature | Reason |
|---------|--------|
| Flat repo-by-repo project gallery | The site is intentionally organized by domains/themes rather than by raw repository list |
| Standalone page for every project in v1 | Would add too much depth and maintenance cost before the domain pattern is proven |
| CMS, database, or backend-managed content | GitHub Pages static hosting is the intended deployment model for v1 |
| Search, client-side filtering, or dynamic comments | The initial content volume does not justify the added complexity |
| Heavy animation, novelty interaction, or portfolio gimmicks | Conflicts with the minimal text-forward style and casual tone |
| Auth walls, forms with server handling, or other runtime-dependent features | Outbound links and static pages are sufficient for the first release |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| QUAL-01 | Phase 1 - Publishing Foundation | Complete |
| QUAL-02 | Phase 1 - Publishing Foundation | Complete |
| QUAL-03 | Phase 1 - Publishing Foundation | Complete |
| QUAL-04 | Phase 1 - Publishing Foundation | Complete |
| DOMN-01 | Phase 2 - Domain Hubs & Supporting Work | Complete |
| DOMN-02 | Phase 2 - Domain Hubs & Supporting Work | Complete |
| DOMN-03 | Phase 2 - Domain Hubs & Supporting Work | Complete |
| DOMN-04 | Phase 2 - Domain Hubs & Supporting Work | Complete |
| HOME-01 | Phase 3 - Homepage Positioning | Complete |
| HOME-02 | Phase 3 - Homepage Positioning | Complete |
| HOME-03 | Phase 3 - Homepage Positioning | Complete |
| HOME-04 | Phase 3 - Homepage Positioning | Complete |
| HIGH-01 | Phase 4 - Flagship Proof & Visuals | Pending |
| HIGH-02 | Phase 4 - Flagship Proof & Visuals | Pending |
| HIGH-03 | Phase 4 - Flagship Proof & Visuals | Pending |
| HIGH-04 | Phase 4 - Flagship Proof & Visuals | Pending |
| PROF-01 | Phase 5 - Personal Context & Notes | Pending |
| PROF-02 | Phase 5 - Personal Context & Notes | Pending |
| PROF-03 | Phase 5 - Personal Context & Notes | Pending |
| NOTE-01 | Phase 5 - Personal Context & Notes | Pending |
| NOTE-02 | Phase 5 - Personal Context & Notes | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0

**Phase 1 sign-off:**
- Live GitHub Pages deployment and manual QA were completed for `https://domstepek.github.io/website/`.
- Future browser-accessible site smoke checks should prefer `/agent-browser --native` before asking for human-only validation.

**Phase 2 sign-off:**
- `pnpm validate:site` now runs both Phase 1 and Phase 2 structural release gates after build.
- The Phase 2 validator checks the emitted domain artifacts for canonical metadata, base-aware back-home wiring, supporting-work markers, rendered supporting entries, and outward proof-link presence.

**Phase 3 sign-off:**
- `pnpm validate:site` now runs Phase 1, Phase 2, and Phase 3 structural release gates after build.
- The Phase 3 validator checks emitted homepage HTML for the hero marker, the five base-aware domain links, the GitHub/LinkedIn/email contact links, and the freshness marker without relying on remote network availability.

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-10 after Phase 03 Plan 03 completion*
