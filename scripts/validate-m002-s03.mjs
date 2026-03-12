import { protectedRoutes, readBuiltHtml } from "../tests/helpers/site-boundary-fixtures.mjs";

const PREFIX = "[validate:m002:s03]";
const errors = [];

for (const route of protectedRoutes) {
  const html = await readBuiltHtml(route);

  // S03 contract: no <img> tags inside proof mount regions in cold-load HTML
  // Check for proof-related image patterns that should not appear before unlock
  const proofImagePatterns = [
    { pattern: /class="[^"]*screenshot-gallery__image[^"]*"/g, label: "screenshot-gallery__image class" },
    { pattern: /class="[^"]*flagship__image[^"]*"/g, label: "flagship__image class" },
  ];

  for (const { pattern, label } of proofImagePatterns) {
    if (pattern.test(html)) {
      errors.push(
        `Protected route ${route.route} has ${label} in cold-load HTML — proof images should not be pre-rendered`,
      );
    }
  }

  // S03 contract: no data-screenshot-gallery marker in cold-load HTML
  if (html.includes("data-screenshot-gallery")) {
    errors.push(
      `Protected route ${route.route} has data-screenshot-gallery in cold-load HTML — gallery markup should not be pre-rendered`,
    );
  }

  // S03 contract: no data-visual-state in cold-load HTML (it's added dynamically after unlock)
  if (html.includes("data-visual-state")) {
    errors.push(
      `Protected route ${route.route} has data-visual-state in cold-load HTML — visual state should only appear after client-side unlock`,
    );
  }

  // S03 contract: no <img> tags inside [data-proof-mount] in static HTML
  // Use a simple heuristic: check if there are <img> tags near proof-mount markers
  const proofMountMatch = html.match(/data-proof-mount[\s\S]*?<\/[a-z]+>/gi);
  if (proofMountMatch) {
    for (const fragment of proofMountMatch) {
      if (/<img\s/i.test(fragment)) {
        errors.push(
          `Protected route ${route.route} has <img> tags inside proof mount region in cold-load HTML`,
        );
        break;
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`${PREFIX} Visual protection contract failed:\n`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `${PREFIX} Visual protection contract passed for ${protectedRoutes.length} protected routes — no proof images or gallery markup in cold-load HTML.`,
  );
}
