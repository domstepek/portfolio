/**
 * Live grid demo: the worker streams ticks into the Legend State store, the
 * table is virtualized, and atomic (per-field) subscriptions re-render far
 * fewer cells than naive. Reads the widget's own measured data-* attributes.
 */

import { expect, test, type Locator } from "@playwright/test";

const num = async (grid: Locator, attr: string) => Number((await grid.getAttribute(attr)) ?? "0");

test("live grid: virtualized, worker streams updates, atomic renders fewer cells per tick than naive", async ({ page }) => {
  await page.goto("/work/");

  const grid = page.locator("[data-live-grid]");
  await grid.scrollIntoViewIfNeeded();
  await expect(grid).toHaveAttribute("data-running", "true");

  // 1,060 rows in the store, but only a screenful in the DOM.
  const rendered = await grid.locator('.live-grid__body [role="row"]').count();
  expect(rendered).toBeGreaterThan(5);
  expect(rendered).toBeLessThan(40);
  await expect(grid.locator('[role="table"]')).toHaveAttribute("aria-rowcount", "1061");

  // Scrolling mounts the rows that come into view.
  await grid.locator(".live-grid__scroll").evaluate((el) => { el.scrollTop = 34 * 500; });
  await expect(grid.locator('.live-grid__body [role="row"][aria-rowindex="502"]')).toBeAttached();
  await grid.locator(".live-grid__scroll").evaluate((el) => { el.scrollTop = 0; });

  // The worker is producing and the store is applying.
  await expect.poll(() => num(grid, "data-applied"), { timeout: 10_000 }).toBeGreaterThan(200);

  // Atomic: some on-screen cells render per tick, nowhere near all of them.
  await expect.poll(() => num(grid, "data-cells-per-tick"), { timeout: 10_000 }).toBeGreaterThan(0);
  const visibleCells = await num(grid, "data-visible-cells");
  expect(visibleCells).toBeGreaterThan(0);
  expect(await num(grid, "data-cells-per-tick")).toBeLessThan(visibleCells / 2);

  // Naive: every on-screen cell re-renders every tick.
  await grid.getByText("Naive", { exact: true }).click();
  await expect(grid).toHaveAttribute("data-mode", "naive");
  await expect.poll(() => num(grid, "data-cells-per-tick"), { timeout: 10_000 }).toBeGreaterThan(visibleCells * 0.9);
});

test("command palette: single-key shortcuts work outside text fields", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-home-palette] [data-mono]").first()).toBeVisible();
  await page.keyboard.press("w");
  await page.waitForURL("**/work/");
  await expect(page.locator("[data-work-page]")).toBeVisible();

  // ⌘K / Ctrl+K opens the bare palette (no dialog header) on other pages.
  await page.keyboard.press("ControlOrMeta+k");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[role="combobox"]')).toBeFocused();
  await expect(dialog.getByText("Jump to", { exact: true })).toHaveCount(0);
});
