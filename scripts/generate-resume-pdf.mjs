/**
 * Builds public/Jean-Dominique-Stepek-Resume.pdf from src/data/resume.ts, the
 * same data the /resume page renders, so the PDF can't drift from the site.
 *
 *   pnpm resume:pdf
 *
 * Node 22.18+ strips the TypeScript types when importing resume.ts.
 */
import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(here, "..", "public", "Jean-Dominique-Stepek-Resume.pdf");
const { resumePage: r } = await import("../src/data/resume.ts");
const css = await readFile(path.join(here, "resume.css"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const link = (href, text) => `<a href="${href}">${esc(text)}</a>`;
const sep = '<span class="sep">|</span>';

const contact = [
  esc(r.contact.phone),
  link(`mailto:${r.contact.email}`, r.contact.email),
  link(`https://${r.contact.portfolio}`, r.contact.portfolio),
  link(`https://${r.contact.github}`, r.contact.github),
  link(`https://${r.contact.linkedin}`, r.contact.linkedin),
].join(sep);

const skills = r.skills
  .map((s) => `<div class="skill-label">${esc(s.label)}</div><div class="skill-items">${esc(s.items)}</div>`)
  .join("");

const roles = r.experience
  .map(
    (role) => `
  <div class="role">
    <div class="role-header">
      <div><span class="role-company">${esc(role.company)}</span><span class="role-title">${esc(role.title)}</span></div>
      <div class="role-dates">${esc(role.dates)}</div>
    </div>
    ${role.projects
      .map(
        (p) => `${p.title ? `<div class="project-title">${esc(p.title)}</div>` : ""}
    <ul class="bullets">${p.bullets.map((b) => `<li>${esc(b.text)}</li>`).join("")}</ul>`,
      )
      .join("")}
  </div>`,
  )
  .join("");

const education = r.education
  .map((e) => `<div class="edu-row"><div><span class="edu-school">${esc(e.school)}</span>, ${esc(e.degree)}</div><div class="edu-year">${esc(e.year)}</div></div>`)
  .join("");

const doc = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><title>${esc(r.name)} resume</title><style>${css}</style></head>
<body>
<header class="header">
  <div class="name">${esc(r.name)}</div>
  <div class="headline">${esc(r.headline)}</div>
  <div class="contact">${contact}</div>
</header>
<section class="section"><h2 class="section-title">Experience</h2>${roles}</section>
<section class="section"><h2 class="section-title">Skills</h2><div class="skills-grid">${skills}</div></section>
<section class="section"><h2 class="section-title">Education</h2>${education}</section>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(doc, { waitUntil: "load" });
await page.pdf({ path: outputPath, format: "Letter", printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(`PDF generated: ${outputPath}`);
