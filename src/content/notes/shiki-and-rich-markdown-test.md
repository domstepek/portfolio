---
title: Shiki and rich markdown test
summary: A fixture note that exercises every rich rendering path — code blocks, tables, blockquotes, inline code, and horizontal rules.
published: 2026-03-14
type: journal
tags: [testing, webdev]
---

This note exists to verify that the markdown pipeline renders every element correctly with the retro terminal theme.

## Code blocks

A TypeScript function:

```typescript
interface Config {
  theme: string;
  lineNumbers: boolean;
}

function createHighlighter(config: Config): void {
  const { theme, lineNumbers } = config;
  console.log(`Using theme: ${theme}, lines: ${lineNumbers}`);
}
```

A bash snippet:

```bash
#!/usr/bin/env bash
set -euo pipefail

for file in src/content/notes/*.md; do
  echo "Processing $file"
  wc -w "$file"
done
```

## Blockquote

> Good defaults beat clever configuration. Ship the obvious thing, then iterate when someone actually needs the knob.

## Inline code

Use `pnpm build` to generate the production bundle. The `unified` pipeline chains `remarkParse` → `remarkRehype` → `rehypeShiki` → `rehypeStringify`.

## Table

| Tool | Purpose | Language |
|------|---------|----------|
| Shiki | Syntax highlighting | TypeScript |
| unified | Markdown processing | TypeScript |
| Playwright | Integration testing | TypeScript |

---

That horizontal rule above exercises `hr` rendering. If you see all elements styled correctly, the rich markdown CSS is working.
