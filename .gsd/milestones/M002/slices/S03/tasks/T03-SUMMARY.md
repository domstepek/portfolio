---
id: T03
parent: S03
milestone: M002
provides:
  - S03 dist validator and browser tests wired into `validate:site` release gate
key_files:
  - package.json
key_decisions:
  - none
patterns_established:
  - none
observability_surfaces:
  - "`pnpm validate:site` — single release gate covering S01 + S02 + S03"
  - "`pnpm validate:m002:s03` — focused S03-only checks (dist validator + browser tests)"
duration: 5m
verification_result: passed
completed_at: 2026-03-12
blocker_discovered: false
---

# T03: Wire S03 into release validation gate

**Chained S03 dist validator and visual-reveal browser tests into the `validate:site` release gate.**

## What Happened

Added three npm scripts to `package.json`:
- `test:visual-reveal:browser` — runs the S03 browser test suite
- `validate:m002:s03` — chains the S03 dist validator then browser tests
- Updated `validate:site` to append `&& pnpm validate:m002:s03` after S02

Ran `pnpm validate:site` end-to-end: all 17 tests across S01 (9), S02 (4), and S03 (4) passed, plus all three dist validators.

## Verification

- `pnpm validate:m002:s03` — S03 dist validator passed for 3 protected routes, 4/4 browser tests passed
- `pnpm validate:site` — full S01 + S02 + S03 chain passed end-to-end (17/17 tests, 3/3 dist validators)
- Slice-level checks: all three verification items from S03-PLAN pass (browser tests ✓, dist validator ✓, validate:site ✓)

## Diagnostics

- `pnpm validate:site` is the single release gate
- `pnpm validate:m002:s03` for focused S03 checks
- S03 failures are isolated in the chain — if S03 breaks, S01 and S02 results are still visible

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `package.json` — added `test:visual-reveal:browser`, `validate:m002:s03` scripts; updated `validate:site` to chain S03
