---
status: diagnosed
phase: 03-homepage-positioning
source: [03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md]
started: 2026-03-10T12:00:00Z
updated: 2026-03-10T12:15:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Homepage Hero & Intro Copy
expected: The homepage loads and shows a hero section with an eyebrow label, a clear heading, and a lead paragraph that frames Dom's work across five domains. The copy should read naturally — not like placeholder or lorem ipsum text.
result: pass

### 2. Five Domain Navigation Links
expected: Below the hero, five domain links are visible (Analytics, Infrastructure, AI/ML, Product, Developer Experience). Each shows a title and a short summary line. Clicking any link navigates to that domain's hub page.
result: pass

### 3. Domain Summary Copy Quality
expected: Each of the five domain preview lines reads as a distinct, meaningful description of that work area — not generic or placeholder text. They should feel like homepage routing copy, not filler.
result: pass

### 4. Contact Links Visible
expected: Contact links (email, LinkedIn, GitHub, or similar) are visible on the homepage with clear visual presence — not buried or hidden.
result: pass

### 5. Freshness Signal
expected: A freshness note or "last updated" signal is visible on the homepage, indicating the site is actively maintained.
result: pass

### 6. Homepage Layout & Visual Hierarchy
expected: The homepage has clear visual hierarchy — hero stands out, domain links are scannable as a list or grid, contact and freshness sections are visually distinct. Spacing and typography feel intentional, not cramped or scattered.
result: issue
reported: "Site is too basic visually. It needs a dark theme and interesting visual effects like snwy.me's old-school interlaced CRT/TV effect. The content and structure are fine but the visual presentation is flat and unremarkable compared to the snwy.me design reference. Want dark background, monospace or retro font treatment, and a CRT scanline/interlace effect to give the site personality."
severity: major

### 7. Build & Validation Gate
expected: Running `pnpm build && pnpm validate:site` passes with no errors, including the Phase 3 homepage validator.
result: pass

## Summary

total: 7
passed: 6
issues: 3
pending: 0
skipped: 0

## Gaps

- truth: "The homepage has clear visual hierarchy with intentional, distinctive visual presentation inspired by snwy.me"
  status: failed
  reason: "User reported: Site is too basic visually. Needs dark theme and CRT/interlaced TV effect like snwy.me. Content is fine but visual presentation is flat and unremarkable. Want dark background, retro aesthetic, scanline effect to give personality."
  severity: major
  test: 6
  root_cause: "Site uses default light theme with no visual personality. Missing: dark color scheme, monospace/retro typography, CRT scanline overlay effect. The global.css and BaseLayout have no dark theme or visual effects. snwy.me reference uses dark bg (#0a0a0a), monospace font, and CSS-based CRT interlace/scanline effect."
  artifacts:
    - path: "src/styles/global.css"
      issue: "Light theme with basic styling, no dark mode or visual effects"
    - path: "src/layouts/BaseLayout.astro"
      issue: "No dark theme wrapper or CRT effect overlay"
  missing:
    - "Dark color scheme (dark background, light text)"
    - "Monospace or retro-styled typography"
    - "CSS CRT scanline/interlace overlay effect"
    - "Visual personality matching snwy.me reference"
  debug_session: ""
- truth: "The site uses a custom retro pixel cursor that reinforces the old-school aesthetic"
  status: failed
  reason: "User reported: Want a retro pixelated cursor (classic Mac OS style pointer/hand) site-wide. Reference: https://www.figma.com/community/file/939098898751395313 — black-and-white pixel art cursor set. Fits the CRT/retro theme."
  severity: minor
  test: 6
  root_cause: "Site uses default browser cursor. No custom cursor CSS or cursor image assets exist. Need pixel art cursor PNGs (default pointer + link hand) and CSS cursor rules in global.css."
  artifacts:
    - path: "src/styles/global.css"
      issue: "No custom cursor rules"
  missing:
    - "Retro pixel cursor PNG assets (pointer + hand) in public/cursors/"
    - "CSS cursor rules: body { cursor: url(...) } and a:hover { cursor: url(...) }"
  debug_session: ""
- truth: "All site copy reads as visitor-facing content with no placeholder or internal categorization text"
  status: failed
  reason: "User reported: Domain hub pages have copy that reads like internal placeholder notes meant to be removed. The 'what belongs here' section heading, scope/boundary lines like 'if the job is helping people inspect, compare, or trust the data itself, it belongs here; if the hard part is shipping the platform or model behavior, it belongs somewhere else' and the bulleted belongsHere items read like an internal taxonomy guide, not something a visitor should see."
  severity: major
  test: 3
  root_cause: "Domain data files (src/data/domains/*.ts) have 'scope' and 'belongsHere' fields that were written as internal categorization notes. The DomainPage.astro component renders them under a 'what belongs here' heading. These need to be either rewritten as visitor-facing copy or removed entirely. Affects all 5 domain hub pages."
  artifacts:
    - path: "src/data/domains/analytics.ts"
      issue: "scope and belongsHere fields read as internal notes"
    - path: "src/data/domains/infrastructure.ts"
      issue: "scope and belongsHere fields read as internal notes"
    - path: "src/data/domains/ai-ml.ts"
      issue: "scope and belongsHere fields read as internal notes"
    - path: "src/data/domains/product.ts"
      issue: "scope and belongsHere fields read as internal notes"
    - path: "src/data/domains/developer-experience.ts"
      issue: "scope and belongsHere fields read as internal notes"
    - path: "src/components/domains/DomainPage.astro"
      issue: "Renders 'what belongs here' section with internal-sounding copy"
  missing:
    - "Rewrite scope/belongsHere as visitor-facing 'what I work on here' descriptions, or remove the section entirely"
  debug_session: ""
