# Roadmap: Dom Personal Site

## Overview

This roadmap builds the site in the order that best supports a domain-first portfolio: first establish a strong static publishing foundation, then create the domain hubs that define the information architecture, then shape the homepage around those domains, then deepen the strongest work with flagship proof, and finally round out the personal context and notes sections. The goal is to ship a minimal site that still communicates real depth, without letting the work collapse into a repo dump or a vague personal brand page.

## Phases

**Phase Numbering:**
- Integer phases are the planned milestone work for v1.
- Decimal phases can be inserted later if urgent work needs to land between existing phases.

- [x] **Phase 1: Publishing Foundation** - Establish the static site, deploy path, typography baseline, metadata, and accessibility baseline.
- [x] **Phase 2: Domain Hubs & Supporting Work** - Create the five domain pages and lock the domain-first information architecture.
- [x] **Phase 3: Homepage Positioning** - Build the landing page that frames Dom's work and routes visitors into the domain pages.
- [ ] **Phase 4: Flagship Proof & Visuals** - Add deeper flagship highlights, stack details, and visuals where they materially improve understanding.
- [ ] **Phase 5: Personal Context & Notes** - Finish the site with `how i work`, resume and `open to` framing, and the lightweight notes area.
- [ ] **Phase 6: Set up custom domain via is-a-dev/register** - Configure a custom domain handoff and registration path for the published site.

## Phase Details

### Phase 1: Publishing Foundation
**Goal:** Establish a static, readable, shareable baseline on GitHub Pages.
**Depends on:** Nothing (first phase)
**Requirements:** QUAL-01, QUAL-02, QUAL-03, QUAL-04
**Success Criteria** (what must be TRUE):
  1. The site builds and deploys as a static GitHub Pages site without broken asset or route behavior.
  2. Shared layout and CSS provide comfortable reading on both mobile and desktop widths.
  3. Semantic structure, readable typography, obvious link states, and strong contrast are in place across the site shell.
  4. Core sharing and polish are wired up: page titles, descriptions, Open Graph metadata, favicon, and a working `404` page.
**Plans:** 3/3 plans executed

Plans:
- [x] `01-01` Bootstrap GitHub Pages-safe Astro foundation
- [x] `01-02` Accessible shell and metadata baseline
- [x] `01-03` Release gate and GitHub Pages automation

### Phase 2: Domain Hubs & Supporting Work
**Goal:** Create the five domain pages with clear theses, supporting-work curation, and proof-link paths.
**Depends on:** Phase 1
**Requirements:** DOMN-01, DOMN-02, DOMN-03, DOMN-04
**Success Criteria** (what must be TRUE):
  1. All five v1 domains exist as separate routes with a shared page pattern.
  2. Each domain page opens with a short thesis that makes the boundary of that domain clear.
  3. Each domain page includes a curated supporting-work list for non-flagship examples, with enough context to scan quickly.
  4. Each domain page provides obvious navigation back home and outward to relevant proof artifacts.
**Plans:** 3/3 plans executed

Plans:
- [x] `02-01` Bootstrap typed domain data and shared `/domains/[slug]/` routes
- [x] `02-02` Refine thesis clarity, supporting-work curation, and domain-page polish
- [x] `02-03` Add dist-first domain validation and CI release gates

### Phase 3: Homepage Positioning
**Goal:** Make the first screen explain Dom's scope, link into the domains, surface contact, and signal freshness.
**Depends on:** Phase 2
**Requirements:** HOME-01, HOME-02, HOME-03, HOME-04
**Success Criteria** (what must be TRUE):
  1. From the first screen, a visitor can immediately tell the kinds of systems Dom builds across the five v1 domains.
  2. The homepage exposes all five domain pages as the primary next step, not a generic project dump.
  3. GitHub, LinkedIn, and email are visible on the homepage and open correctly.
  4. The homepage includes a freshness signal such as `currently`, `now`, or `last updated`.
**Plans:** 3/3 plans executed

Plans:
- [x] `03-01` Replace the placeholder homepage with shared hero, route, and home data
- [x] `03-02` Sharpen first-screen copy and text-first domain routing
- [x] `03-03` Add dist-first homepage validation to the site release gate

### Phase 4: Flagship Proof & Visuals
**Goal:** Add one to two flagship stories per domain with role, decisions, outcomes, stack, and visuals where helpful.
**Depends on:** Phase 3
**Requirements:** HIGH-01, HIGH-02, HIGH-03, HIGH-04
**Success Criteria** (what must be TRUE):
  1. Every domain page contains one to two real flagship highlights rather than placeholders.
  2. Each flagship clearly explains the problem, Dom's role, constraints, decisions, and outcome in a scannable structure.
  3. Each flagship includes the relevant stack or tools used.
  4. Wherever a visual materially improves comprehension, a screenshot or diagram is included and presented clearly.
**Plans:** TBD

Plans:
- [ ] TBD (run `$gsd-plan-phase 4` to break down this phase)

### Phase 5: Personal Context & Notes
**Goal:** Complete v1 with `how i work`, resume and `open to` framing, and lightweight notes.
**Depends on:** Phase 4
**Requirements:** PROF-01, PROF-02, PROF-03, NOTE-01, NOTE-02
**Success Criteria** (what must be TRUE):
  1. A short `how i work` section explains Dom's approach to systems, product, and collaboration in plain language.
  2. A resume is accessible from the site in one click.
  3. The site explicitly states what roles, collaborations, or opportunities Dom is open to.
  4. The notes area provides a lightweight index with short summaries.
  5. Each note listed in the index opens to an individual note page.
**Plans:** TBD

Plans:
- [ ] TBD (run `$gsd-plan-phase 5` to break down this phase)

### Phase 6: Set up custom domain via is-a-dev/register

**Goal:** [To be planned]
**Requirements:** TBD
**Depends on:** Phase 5
**Plans:** 0 plans

Plans:
- [ ] TBD (run `$gsd-plan-phase 6` to break down this phase)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Publishing Foundation | 3/3 | Complete | 2026-03-09 |
| 2. Domain Hubs & Supporting Work | 3/3 | Complete | 2026-03-09 |
| 3. Homepage Positioning | 3/3 | Complete | 2026-03-09 |
| 4. Flagship Proof & Visuals | 0/TBD | Not started | - |
| 5. Personal Context & Notes | 0/TBD | Not started | - |
| 6. Set up custom domain via is-a-dev/register | 0/TBD | Not started | - |
