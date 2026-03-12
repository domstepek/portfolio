import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import puppeteer from "puppeteer";
import {
  protectedBoundarySelectors,
  protectedRoutes,
  publicRoutes,
  screenshotGallerySelectors,
  sessionUnlockStorageKey,
  startBuiltSiteServer,
  toAbsoluteUrl,
  unlockTestInputs,
  visualStateSelectors,
} from "./helpers/site-boundary-fixtures.mjs";

let browser;
let server;

const launchArgs = ["--no-sandbox", "--disable-setuid-sandbox"];
const primaryProtectedRoute = protectedRoutes[0];
const primaryPublicRoute = publicRoutes[0];

before(async () => {
  server = await startBuiltSiteServer();
  browser = await puppeteer.launch({
    headless: true,
    args: launchArgs,
  });
});

after(async () => {
  await Promise.allSettled([browser?.close(), server?.close()]);
});

const openRoute = async (context, route) => {
  const page = await context.newPage();
  await page.goto(toAbsoluteUrl(server.baseUrl, route.route), {
    waitUntil: "networkidle0",
  });
  return page;
};

const snapshotVisualState = async (page) =>
  page.evaluate(
    ({ vsSelectors, gsSelectors }) => ({
      visualState:
        document.querySelector(vsSelectors.visualStateAttr)?.getAttribute("data-visual-state") ?? null,
      hasVisualStateMarker: Boolean(document.querySelector(vsSelectors.visualStateAttr)),
      proofMountImages: document.querySelectorAll("[data-proof-mount] img").length,
      hasScreenshotGallery: Boolean(document.querySelector(gsSelectors.screenshotGallery)),
      hasGalleryNav: Boolean(document.querySelector(gsSelectors.galleryNav)),
      hasGalleryDots: Boolean(document.querySelector(gsSelectors.galleryDots)),
      hasGalleryLightbox: Boolean(document.querySelector(gsSelectors.galleryLightbox)),
      hasGalleryViewport: Boolean(document.querySelector(gsSelectors.galleryViewport)),
      proofImageCount: document.querySelectorAll(
        "[data-proof-mount] img, [data-flagship] img, [data-supporting-item] img",
      ).length,
    }),
    { vsSelectors: visualStateSelectors, gsSelectors: screenshotGallerySelectors },
  );

const unlockRoute = async (page) => {
  await page.locator(protectedBoundarySelectors.gatePasscodeInput).fill(unlockTestInputs.validPasscode);
  await page.locator(protectedBoundarySelectors.gateSubmitButton).click();
  await page.waitForNetworkIdle();
};

test("Cold-load has no visual-state marker and no proof images", async () => {
  const context = await browser.createBrowserContext();
  try {
    const page = await openRoute(context, primaryProtectedRoute);
    const snapshot = await snapshotVisualState(page);

    assert.equal(
      snapshot.hasVisualStateMarker,
      false,
      `Protected route ${primaryProtectedRoute.route} should not have data-visual-state on cold load`,
    );
    assert.equal(
      snapshot.proofMountImages,
      0,
      `Protected route ${primaryProtectedRoute.route} should have no images inside [data-proof-mount] on cold load`,
    );
    assert.equal(
      snapshot.proofImageCount,
      0,
      `Protected route ${primaryProtectedRoute.route} should have no proof images on cold load`,
    );

    await page.close();
  } finally {
    await context.close();
  }
});

test("After unlock, visual-state reaches revealed and screenshot galleries render", async () => {
  const context = await browser.createBrowserContext();
  try {
    const page = await openRoute(context, primaryProtectedRoute);
    await unlockRoute(page);

    // Wait for data-visual-state="revealed" to appear (with timeout)
    await page.waitForSelector(visualStateSelectors.visualStateRevealed, { timeout: 5000 });

    const snapshot = await snapshotVisualState(page);

    assert.equal(
      snapshot.visualState,
      "revealed",
      `Protected route ${primaryProtectedRoute.route} should have data-visual-state="revealed" after unlock`,
    );
    assert.equal(
      snapshot.hasScreenshotGallery,
      true,
      `Protected route ${primaryProtectedRoute.route} should render screenshot gallery DOM after unlock`,
    );
    assert.ok(
      snapshot.proofImageCount > 0,
      `Protected route ${primaryProtectedRoute.route} should have proof images after unlock`,
    );

    await page.close();
  } finally {
    await context.close();
  }
});

test("Gallery JS is initialized after unlock", async () => {
  const context = await browser.createBrowserContext();
  try {
    const page = await openRoute(context, primaryProtectedRoute);
    await unlockRoute(page);

    // Wait for revealed state first
    await page.waitForSelector(visualStateSelectors.visualStateRevealed, { timeout: 5000 });

    const snapshot = await snapshotVisualState(page);

    assert.equal(
      snapshot.hasGalleryNav,
      true,
      `Protected route ${primaryProtectedRoute.route} should have gallery navigation elements after unlock`,
    );
    assert.equal(
      snapshot.hasGalleryDots,
      true,
      `Protected route ${primaryProtectedRoute.route} should have gallery dots after unlock`,
    );
    assert.equal(
      snapshot.hasGalleryLightbox,
      true,
      `Protected route ${primaryProtectedRoute.route} should have gallery lightbox elements after unlock`,
    );

    await page.close();
  } finally {
    await context.close();
  }
});

test("Public routes have no visual-state markers", async () => {
  const context = await browser.createBrowserContext();
  try {
    const page = await openRoute(context, primaryPublicRoute);
    const snapshot = await snapshotVisualState(page);

    assert.equal(
      snapshot.hasVisualStateMarker,
      false,
      `Public route ${primaryPublicRoute.route} should have no data-visual-state attribute`,
    );
    assert.equal(
      snapshot.hasScreenshotGallery,
      false,
      `Public route ${primaryPublicRoute.route} should have no screenshot gallery`,
    );

    await page.close();
  } finally {
    await context.close();
  }
});
