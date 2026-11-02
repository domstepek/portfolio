/**
 * Live grid demo — the worker streams ticks into the Legend State store, and
 * atomic (per-field) subscriptions re-render far fewer cells than naive.
 * Reads the widget's own measured data-* attributes.
 */

import { expect, test, type Locator } from "@playwright/test";

const num = async (grid: Locator, attr: string) => Number((await grid.getAttribute(attr)) ?? "0");

test("live grid: worker streams updates; atomic renders fewer cells per tick than naive", async ({ page }) => {
  await page.goto("/work/");

  const grid = page.locator("[data-live-grid]");
  await grid.scrollIntoViewIfNeeded();
  await expect(grid).toHaveAttribute("data-running", "true");

  // The worker is producing and the store is applying.
  await expect.poll(() => num(grid, "data-applied"), { timeout: 10_000 }).toBeGreaterThan(200);

  // Atomic: some cells render per tick, but nowhere near all of them.
  await expect.poll(() => num(grid, "data-cells-per-tick"), { timeout: 10_000 }).toBeGreaterThan(0);
  const atomic = await num(grid, "data-cells-per-tick");
  const totalCells = await num(grid, "data-total-cells");
  expect(totalCells).toBeGreaterThan(0);
  expect(atomic).toBeLessThan(totalCells / 2);

  // Naive: the whole table re-renders every tick.
  await grid.getByText("Naive", { exact: true }).click();
  await expect(grid).toHaveAttribute("data-mode", "naive");
  await expect.poll(() => num(grid, "data-cells-per-tick"), { timeout: 10_000 }).toBeGreaterThan(totalCells * 0.9);
});
