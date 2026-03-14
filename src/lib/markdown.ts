import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// ---------------------------------------------------------------------------
// Shared inline-markdown → HTML helper
// ---------------------------------------------------------------------------

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

/**
 * Synchronously convert a markdown string to HTML.
 *
 * For single-paragraph input the outer `<p>…</p>` wrapper is stripped so the
 * result can be placed inside an existing `<p>` or `<li>` via
 * `dangerouslySetInnerHTML` without creating invalid nesting.
 *
 * Multi-paragraph input is returned as full HTML (paragraphs intact).
 *
 * Uses only remarkParse → remarkRehype → rehypeStringify — no Shiki, no
 * remark-gfm — keeping it synchronous and lightweight.
 */
export function renderInlineMarkdown(content: string): string {
  const html = String(processor.processSync(content));
  // Strip the outer <p>…</p>\n wrapper for single-paragraph output.
  // Use [\s\S] instead of the `s` flag (dotAll) to stay compatible with ES2017 target.
  const singleParagraph = /^<p>([\s\S]*)<\/p>\n?$/;
  const match = singleParagraph.exec(html);
  return match ? match[1] : html;
}
