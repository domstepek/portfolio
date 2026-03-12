import { createServer } from "node:http";
import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";

export const distDir = path.resolve(process.cwd(), "dist");

export const publicRoutes = [
  {
    route: "/",
    distPath: "index.html",
    smokeSelector: "[data-home-page]",
    smokeHtmlSnippet: "data-home-page",
  },
  {
    route: "/about/",
    distPath: "about/index.html",
    smokeSelector: "[data-personal-page]",
    smokeHtmlSnippet: "data-personal-page",
  },
  {
    route: "/resume/",
    distPath: "resume/index.html",
    smokeSelector: "[data-resume-page]",
    smokeHtmlSnippet: "data-resume-page",
  },
];

export const protectedRoutes = [
  {
    route: "/domains/product/",
    distPath: "domains/product/index.html",
  },
  {
    route: "/domains/analytics-ai/",
    distPath: "domains/analytics-ai/index.html",
  },
  {
    route: "/domains/developer-experience/",
    distPath: "domains/developer-experience/index.html",
  },
];

export const publicBoundarySelectors = {
  routeVisibility: '[data-route-visibility="public"]',
  openGateState: '[data-gate-state="open"]',
};

export const publicBoundaryHtmlSnippets = {
  routeVisibility: 'data-route-visibility="public"',
  openGateState: 'data-gate-state="open"',
};

export const protectedBoundarySelectors = {
  routeVisibility: '[data-route-visibility="protected"]',
  lockedGateState: '[data-gate-state="locked"]',
  protectedGate: "[data-protected-gate]",
  protectedProofWithheld: '[data-protected-proof-state="withheld"]',
  requestAccessPanel: "[data-request-access-panel]",
  requestAccessEmailLink: '[data-request-access-link="email"]',
  requestAccessLinkedInLink: '[data-request-access-link="linkedin"]',
  gateForm: "[data-gate-form]",
  gatePasscodeInput: "[data-gate-passcode-input]",
  gateSubmitButton: "[data-gate-submit]",
  gateStatus: "[data-gate-status]",
  gateError: '[data-gate-status="error"]',
  gateUnlocked: '[data-gate-state="open"]',
};

export const protectedBoundaryHtmlSnippets = {
  routeVisibility: 'data-route-visibility="protected"',
  lockedGateState: 'data-gate-state="locked"',
  protectedGate: "data-protected-gate",
  protectedProofWithheld: 'data-protected-proof-state="withheld"',
};

export const protectedGateUiHtmlSnippets = {
  requestAccessPanel: "data-request-access-panel",
  requestAccessEmailLink: 'data-request-access-link="email"',
  requestAccessLinkedInLink: 'data-request-access-link="linkedin"',
  gateForm: "data-gate-form",
  gatePasscodeInput: "data-gate-passcode-input",
  gateSubmitButton: "data-gate-submit",
  gateStatus: "data-gate-status",
};

export const visualStateSelectors = {
  visualStateAttr: "[data-visual-state]",
  visualStateRevealing: '[data-visual-state="revealing"]',
  visualStateRevealed: '[data-visual-state="revealed"]',
};

export const screenshotGallerySelectors = {
  screenshotGallery: "[data-screenshot-gallery]",
  galleryNav: "[data-gallery-nav]",
  galleryViewport: "[data-gallery-viewport]",
  galleryDots: "[data-gallery-dots]",
  galleryLightbox: "[data-gallery-lightbox]",
};

export const protectedProofSelectors = [
  "[data-flagship-highlights]",
  "[data-supporting-work]",
  "[data-flagship]",
  "[data-supporting-item]",
];

export const protectedProofHtmlSnippets = [
  "data-flagship-highlights",
  "data-supporting-work",
  "data-flagship",
  "data-supporting-item",
];

export const publicGateSelectors = [
  protectedBoundarySelectors.protectedGate,
  protectedBoundarySelectors.lockedGateState,
  '[data-route-visibility="protected"]',
  protectedBoundarySelectors.requestAccessPanel,
  protectedBoundarySelectors.gateForm,
];

export const publicGateHtmlSnippets = [
  protectedBoundaryHtmlSnippets.protectedGate,
  protectedBoundaryHtmlSnippets.lockedGateState,
  protectedBoundaryHtmlSnippets.routeVisibility,
  protectedGateUiHtmlSnippets.requestAccessPanel,
  protectedGateUiHtmlSnippets.gateForm,
];

export const requestAccessLinks = {
  email: {
    href: "mailto:domstepek@gmail.com",
    selector: protectedBoundarySelectors.requestAccessEmailLink,
    htmlSnippet: protectedGateUiHtmlSnippets.requestAccessEmailLink,
  },
  linkedin: {
    href: "https://linkedin.com/in/jean-dominique-stepek",
    selector: protectedBoundarySelectors.requestAccessLinkedInLink,
    htmlSnippet: protectedGateUiHtmlSnippets.requestAccessLinkedInLink,
  },
};

export const gateCopyExpectations = {
  requestAccessLead: /request access/i,
  email: /domstepek@gmail\.com/i,
  linkedin: /linkedin/i,
  passcode: /passcode/i,
};

export const unlockTestInputs = {
  invalidPasscode: "totally-wrong-passcode",
  validPasscode: "correct-session-passcode",
};

export const protectedRouteCarryoverCases = protectedRoutes.map((route, index) => ({
  route,
  nextRoute: protectedRoutes[(index + 1) % protectedRoutes.length],
}));

export const sessionUnlockStorageKey = "portfolio-gate:v1";

export const ensureDistExists = async () => {
  await access(distDir);
};

export const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const readBuiltHtml = async ({ distPath }) => {
  await ensureDistExists();
  const absolutePath = path.join(distDir, distPath);
  return readFile(absolutePath, "utf8");
};

export const getPublicRouteBoundaryIssues = (route, html) => {
  const issues = [];

  if (!html.includes(route.smokeHtmlSnippet)) {
    issues.push(`Expected ${route.route} built HTML to keep its public smoke marker ${route.smokeHtmlSnippet}`);
  }

  for (const [markerName, snippet] of Object.entries(publicBoundaryHtmlSnippets)) {
    if (!html.includes(snippet)) {
      issues.push(`Public route ${route.route} is missing ${markerName} (${snippet}) in built HTML`);
    }
  }

  for (const snippet of publicGateHtmlSnippets) {
    if (html.includes(snippet)) {
      issues.push(`Public route ${route.route} should not cold-render the protected gate marker ${snippet}`);
    }
  }

  return issues;
};

export const getProtectedBoundaryMarkerIssues = (route, html) => {
  const issues = [];

  for (const [markerName, snippet] of Object.entries(protectedBoundaryHtmlSnippets)) {
    if (!html.includes(snippet)) {
      issues.push(`Protected route ${route.route} is missing ${markerName} (${snippet}) in built HTML`);
    }
  }

  return issues;
};

export const getProtectedProofLeakIssues = (route, html) => {
  const issues = [];

  for (const snippet of protectedProofHtmlSnippets) {
    if (html.includes(snippet)) {
      issues.push(`Protected route ${route.route} leaked proof marker ${snippet} into initial built HTML`);
    }
  }

  return issues;
};

export const getProtectedRequestAccessIssues = (route, html) => {
  const issues = [];

  for (const [expectationName, pattern] of Object.entries(gateCopyExpectations)) {
    if (!pattern.test(html)) {
      issues.push(`Protected route ${route.route} is missing request-access ${expectationName} copy in built HTML`);
    }
  }

  for (const [linkName, expectation] of Object.entries(requestAccessLinks)) {
    if (!html.includes(expectation.htmlSnippet)) {
      issues.push(`Protected route ${route.route} is missing ${linkName} request-access marker ${expectation.htmlSnippet}`);
    }

    if (!html.includes(expectation.href)) {
      issues.push(`Protected route ${route.route} is missing canonical ${linkName} request-access href ${expectation.href}`);
    }
  }

  return issues;
};

export const assertNoBoundaryIssues = (issues) => {
  assert.deepEqual(issues, [], issues.join("\n"));
};

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

const resolveRequestPath = async (pathname) => {
  const decodedPath = decodeURIComponent(pathname);
  const relativePath = decodedPath.replace(/^\/+/, "");
  let filePath = path.resolve(distDir, relativePath || "index.html");

  if (decodedPath.endsWith("/")) {
    filePath = path.resolve(distDir, relativePath, "index.html");
  } else {
    try {
      const candidateStats = await stat(filePath);
      if (candidateStats.isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }
    } catch {
      // fall through and let the final read fail into a 404
    }
  }

  assert.ok(filePath.startsWith(distDir), `Refused to serve path outside dist: ${pathname}`);
  return filePath;
};

export const startBuiltSiteServer = async () => {
  await ensureDistExists();

  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
      const filePath = await resolveRequestPath(requestUrl.pathname);
      const body = await readFile(filePath);
      const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";

      response.writeHead(200, { "content-type": contentType });
      response.end(body);
    } catch {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("not found");
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  assert.ok(address && typeof address === "object" && address.port, "Expected built-site server to expose a port");

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))),
  };
};

export const toAbsoluteUrl = (baseUrl, route) => new URL(route, baseUrl).toString();
