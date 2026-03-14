# S03: Domain Page Markdown Enrichment — UAT

**Milestone:** M007
**Written:** 2026-03-14

## UAT Type

- UAT mode: mixed (artifact-driven build/test checks + live-runtime browser verification)
- Why this mode is sufficient: The slice adds rendering infrastructure (markdown helper) and content enrichment (data files) — both verified by build pipeline and visible in rendered pages

## Preconditions

- Production build completed (`pnpm build`)
- Server running (`pnpm start` or Playwright webServer)
- Gate passcode known (set via `GATE_HASH` env var)

## Smoke Test

Authenticate to `/domains/product/` → confirm `<code>` elements are visible inside flagship sections (tool names like WebdriverIO, Cucumber styled as inline code).

## Test Cases

### 1. Inline code renders on product domain page

1. Navigate to `/domains/product/`
2. Enter the gate passcode to authenticate
3. Scroll to the Sample Tracking flagship section
4. **Expected:** `WebdriverIO`, `Cucumber`, `BDD` appear as styled `<code>` elements (green text on muted background), not as raw backtick-wrapped text

### 2. Bold metrics render on product domain page

1. Navigate to `/domains/product/` (authenticated)
2. Scroll to the Supply Chain flagship outcomes section
3. **Expected:** `$30M/year` renders as bold (`<strong>`) text, not as `**$30M/year**` raw markdown

### 3. Inline code renders on analytics-ai domain page

1. Navigate to `/domains/analytics-ai/` (authenticated)
2. Scroll to the Collection Curator flagship section
3. **Expected:** `GraphQL`, `FastAPI`, `Legend State`, `Apollo`, `Prisma`, `Redis` appear as styled `<code>` elements in constraints/decisions/outcomes
4. **Expected:** `50%` renders as bold (`<strong>`) text in outcomes

### 4. Inline code renders on developer-experience domain page

1. Navigate to `/domains/developer-experience/` (authenticated)
2. Scroll to the Monorepo flagship section
3. **Expected:** `TypeScript` in problem field, `pnpm`, `tsconfig`, `eslint`, `prettier` in decisions appear as styled `<code>` elements

### 5. Supporting work context enrichment

1. Navigate to `/domains/analytics-ai/` (authenticated)
2. Scroll to the supporting work section
3. **Expected:** Tool names in supporting work context (e.g. `MCP`, `Bedrock`, `EKS`, `Apache Superset`) render as `<code>` elements, not raw backticks

### 6. DOM marker attributes preserved

1. Navigate to any authenticated domain page
2. Open browser DevTools and inspect the page
3. **Expected:** `[data-flagship-highlights]` attribute present on flagship section
4. **Expected:** `[data-supporting-work]` attribute present on supporting work section
5. **Expected:** `[data-route-visibility="protected"]` attribute present on body/root
6. **Expected:** Individual `[data-flagship]` and `[data-supporting-item]` attributes present

### 7. No invalid HTML nesting

1. Navigate to any authenticated domain page
2. Open browser DevTools console
3. **Expected:** No React hydration warnings about incorrect DOM nesting
4. Run `document.querySelectorAll('p p, li p').length` in console
5. **Expected:** Returns 0 (no `<p>` nested inside `<p>` or `<li>`)

### 8. All Playwright tests pass

1. Run `pnpm test`
2. **Expected:** All 18 tests pass (5 gate + 8 public + 3 shader + 2 gallery/mermaid)

### 9. Type checking and build

1. Run `tsc --noEmit`
2. **Expected:** Zero type errors
3. Run `pnpm build`
4. **Expected:** Build succeeds with no errors

## Edge Cases

### Plain text fields unaffected

1. Navigate to any authenticated domain page
2. Check flagship `summary` and `role` fields
3. **Expected:** These render as plain text without any markdown artifacts — no `<code>` tags, no raw backticks, no `<strong>` tags

### Multi-paragraph content handling

1. If any enriched field contains multiple paragraphs (separated by blank lines)
2. **Expected:** The full HTML is returned with `<p>` wrappers intact (not stripped), preventing nesting issues

### No CSS leakage between note and domain contexts

1. Navigate to a note page (e.g. `/notes/keep-the-path-explicit/`)
2. **Expected:** Inline code styled by `.note-page__body code:not(pre code)` rules
3. Navigate to an authenticated domain page
4. **Expected:** Inline code styled by `[data-flagship] code` rules — visually consistent but independently scoped

## Failure Signals

- Raw backticks (`` ` ``) or asterisks (`**`) visible in rendered domain page content — markdown not being processed
- Missing `<code>` elements inside `[data-flagship]` sections — helper not wired or content not enriched
- React hydration warnings in dev console — invalid HTML nesting from `<p>` wrapper not being stripped
- `[data-flagship-highlights]` or `[data-supporting-work]` attributes missing — DOM markers were accidentally removed
- Playwright test failures — regression in existing functionality

## Requirements Proved By This UAT

- None directly — S03 is a visual enrichment of existing domain proof pages, not a new tracked capability

## Not Proven By This UAT

- Syntax highlighting for code blocks in domain proof fields (intentionally excluded — D063)
- GFM table rendering in domain proof fields (intentionally excluded — D063)
- Any changes to the notes markdown pipeline (S01 scope, not S03)

## Notes for Tester

- The enrichment is intentionally sparse — not every string has markdown. If a field looks like plain text, it probably is. Focus on fields that mention specific tools or quantified metrics.
- The three domain pages are: `/domains/product/`, `/domains/analytics-ai/`, `/domains/developer-experience/`
- Inline code should match the retro terminal styling: green-tinted text on a slightly elevated background with subtle border radius.
