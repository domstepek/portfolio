import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const CNAME_PATH = resolve(process.cwd(), "public", "CNAME");
const EXPECTED_DOMAIN = "jean-dominique-stepek.is-a.dev";
const failures = [];

try {
  const content = (await readFile(CNAME_PATH, "utf8")).trim();
  if (!content) {
    failures.push("public/CNAME exists but is empty.");
  } else if (content !== EXPECTED_DOMAIN) {
    failures.push(
      `public/CNAME should contain "${EXPECTED_DOMAIN}", received "${content}".`
    );
  }
} catch {
  failures.push(`public/CNAME is missing (${CNAME_PATH}).`);
}

if (failures.length > 0) {
  console.error("Phase 6 validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Phase 6 validation passed.");
console.log("- public/CNAME exists and contains the expected custom domain.");
