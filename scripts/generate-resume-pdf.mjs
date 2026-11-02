import puppeteer from "puppeteer";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "resume.html");
const outputPath = path.join(__dirname, "..", "public", "Jean-Dominique-Stepek-Resume.pdf");

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });

await page.pdf({
  path: outputPath,
  format: "Letter",
  margin: { top: "0.45in", bottom: "0.45in", left: "0.5in", right: "0.5in" },
  printBackground: true,
});

await browser.close();
console.log(`PDF generated: ${outputPath}`);
