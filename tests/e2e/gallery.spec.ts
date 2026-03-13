/**
 * Gallery and Mermaid acceptance tests — S03 slice verification
 *
 * Tests validate that screenshot galleries initialize on domain proof pages
 * with screenshots data, and that Mermaid diagrams render as SVGs inside
 * flagship sections that contain mermaid definitions.
 *
 * Two test cases:
 *   1. Screenshot gallery present and initialized on /domains/product/
 *   2. Mermaid diagram rendered as SVG on /domains/analytics-ai/
 */

import { expect, test } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
// Test 1 — Screenshot gallery initialized on domain with screenshots
// ---------------------------------------------------------------------------

test("gallery: authenticated /domains/product/ has initialized screenshot gallery", async ({
  page,
}) => {
  const passcode = requireTestPasscode();

  await page.goto("/domains/product/");

  // Authenticate
  await page.fill("[data-passcode-input]", passcode);
  await page.click("[data-passcode-submit]");
  await page.waitForURL("/domains/product/");

  // Gallery container must be present (product page has multiple flagships with galleries)
  const gallery = page.locator("[data-screenshot-gallery]").first();
  await expect(gallery).toBeVisible();

  // Gallery JS must have initialized (data-gallery-init attribute set)
  await expect(gallery).toHaveAttribute("data-gallery-init");
});

// ---------------------------------------------------------------------------
// Test 2 — Mermaid diagram rendered as SVG on domain with mermaid visual
// ---------------------------------------------------------------------------

test("gallery: authenticated /domains/analytics-ai/ has rendered Mermaid SVG", async ({
  page,
}) => {
  const passcode = requireTestPasscode();

  await page.goto("/domains/analytics-ai/");

  // Authenticate
  await page.fill("[data-passcode-input]", passcode);
  await page.click("[data-passcode-submit]");
  await page.waitForURL("/domains/analytics-ai/");

  // Mermaid definition container must be present
  const mermaidContainer = page.locator("[data-mermaid-definition]");
  await expect(mermaidContainer).toBeVisible();

  // Mermaid JS must have rendered — expect an SVG inside the container
  const svg = mermaidContainer.locator("svg");
  await expect(svg).toBeVisible();
});
