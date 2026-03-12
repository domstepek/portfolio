---
estimated_steps: 3
estimated_files: 1
---

# T03: Wire S03 into release validation gate

**Slice:** S03 — Protected Visual Reveal
**Milestone:** M002

## Description

Chain the S03 dist validator and visual-reveal browser test into the `validate:site` release gate so the deploy workflow enforces the visual protection contract alongside S01 and S02 checks. This follows the same pattern as S02's integration — add npm scripts and update the validate:site chain.

## Steps

1. Add npm scripts to `package.json`:
   - `"test:visual-reveal:browser": "node --test tests/visual-reveal.browser.test.mjs"`
   - `"validate:m002:s03": "node scripts/validate-m002-s03.mjs && pnpm test:visual-reveal:browser"`

2. Update `validate:site` to chain S03:
   - Change from `"pnpm validate:m002:s01 && pnpm validate:m002:s02"` to `"pnpm validate:m002:s01 && pnpm validate:m002:s02 && pnpm validate:m002:s03"`

3. Run `pnpm validate:site` end-to-end to confirm the full S01 + S02 + S03 chain passes

## Must-Haves

- [ ] `test:visual-reveal:browser` script added
- [ ] `validate:m002:s03` script added and chains dist validator + browser test
- [ ] `validate:site` updated to include S03
- [ ] Full `pnpm validate:site` passes end-to-end

## Verification

- `pnpm validate:site` — all S01 + S02 + S03 checks pass in sequence
- `pnpm validate:m002:s03` — runs S03 dist validator and browser tests independently

## Observability Impact

- Signals added/changed: None (wiring only)
- How a future agent inspects this: `pnpm validate:site` is the single release gate; `pnpm validate:m002:s03` for focused S03-only checks
- Failure state exposed: S03-specific failures are isolated by the `validate:m002:s03` step in the chain

## Inputs

- `package.json` — existing scripts section with S01 and S02 validation commands
- `scripts/validate-m002-s03.mjs` — S03 dist validator (created in T01)
- `tests/visual-reveal.browser.test.mjs` — S03 browser test (created in T01, passing after T02)

## Expected Output

- `package.json` — updated with `test:visual-reveal:browser`, `validate:m002:s03`, and chained `validate:site`
