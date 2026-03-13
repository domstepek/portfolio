/**
 * Shader background acceptance tests — S03 slice verification
 *
 * Tests validate that the WebGPU/WebGL2 shader canvas is present on all
 * page types (public and authenticated) with a valid data-shader-renderer
 * attribute indicating which renderer was used.
 *
 * Three test cases:
 *   1. Shader canvas on homepage with valid renderer attribute
 *   2. Shader canvas on about page with valid renderer attribute
 *   3. Shader canvas on authenticated domain page with valid renderer attribute
 */

import { expect, test } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_RENDERERS = ["webgpu", "webgl2", "none"];

function requireTestPasscode(): string {
  const passcode = process.env.GATE_TEST_PASSCODE;
  if (!passcode) {
    throw new Error(
      "GATE_TEST_PASSCODE is not set. " +
        "Ensure .env.local contains GATE_TEST_PASSCODE and playwright.config.ts loads it."
    );
  }
  return passcode;
}

// ---------------------------------------------------------------------------
// Test 1 — Shader canvas present on homepage
// ---------------------------------------------------------------------------

test("shader: homepage has shader canvas with valid data-shader-renderer", async ({
  page,
}) => {
  await page.goto("/");

  const canvas = page.locator("[data-shader-renderer]");
  await expect(canvas).toBeVisible();

  const renderer = await canvas.getAttribute("data-shader-renderer");
  expect(VALID_RENDERERS).toContain(renderer);
});

// ---------------------------------------------------------------------------
// Test 2 — Shader canvas present on about page
// ---------------------------------------------------------------------------

test("shader: about page has shader canvas with valid data-shader-renderer", async ({
  page,
}) => {
  await page.goto("/about/");

  const canvas = page.locator("[data-shader-renderer]");
  await expect(canvas).toBeVisible();

  const renderer = await canvas.getAttribute("data-shader-renderer");
  expect(VALID_RENDERERS).toContain(renderer);
});

// ---------------------------------------------------------------------------
// Test 3 — Shader canvas present on authenticated domain page
// ---------------------------------------------------------------------------

test("shader: authenticated domain page has shader canvas with valid data-shader-renderer", async ({
  page,
}) => {
  const passcode = requireTestPasscode();

  await page.goto("/domains/product/");

  // Authenticate using the gate passcode pattern
  await page.fill("[data-passcode-input]", passcode);
  await page.click("[data-passcode-submit]");
  await page.waitForURL("/domains/product/");

  const canvas = page.locator("[data-shader-renderer]");
  await expect(canvas).toBeVisible();

  const renderer = await canvas.getAttribute("data-shader-renderer");
  expect(VALID_RENDERERS).toContain(renderer);
});
