# S01: Enhanced Markdown Rendering and Tag System — Research

**Date:** 2026-03-14

## Summary

This slice adds Shiki syntax highlighting, rich markdown rendering (images, tables, blockquotes), tag-based filtering on the notes index, and migrates existing notes to an expanded frontmatter schema. The primary technical risk is converting the synchronous unified pipeline (`processSync`) to async (`process`) to support `@shikijs/rehype` — this propagates to `getNoteBySlug` and its callers. The secondary concern is introducing a `'use client'` tag filter island into the server-component-heavy notes index without disturbing existing DOM marker contracts consumed by Playwright tests.

Both risks are manageable. The route page component (`src/app/notes/[slug]/page.tsx`) is already an async RSC because of Next.js 16's Promise-based params (D046), so `await getNoteBySlug(slug)` is a one-line change. The tag filter component follows the established minimal `'use client'` island pattern used by `GateForm` and `ShaderBackground`.

## Recommendation

**Approach: Shiki via `@shikijs/rehype` default export with single dark theme, `'use client'` tag filter island, expanded frontmatter types.**

1. Install `@shikijs/rehype` (single dependency — pulls in shiki core).
2. Add `rehypeShiki` to the unified pipeline in `notes.ts` between `remarkRehype` and `rehypeStringify`. Use a single dark theme (`theme: 'tokyo-night'` — best match for the green-on-dark retro palette). No dual-theme needed since the site is dark-only.
3. Convert `getNoteBySlug` from sync (`processSync`) to async (`process`). Update the route page component to `await` it.
4. Expand `NoteFrontmatter` with `tags: string[]`, `type: 'note' | 'journal'`, `readTime: number`. Calculate `readTime` from word count at parse time. Add `getAllTags()` helper.
5. Migrate existing notes' frontmatter — add `type: 'note'` and appropriate tags.
6. Build a `TagFilter` `'use client'` component that receives all notes + all tags as props from the server component parent, manages filter state locally, and renders the filtered list. The parent `NotesIndexPage` stays a server component — it fetches data and passes it down.
7. Add CSS for Shiki token colors (override `pre` background to transparent since Shiki sets its own), inline code, images, and tables within `.note-page__body`.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Syntax highlighting in unified pipeline | `@shikijs/rehype` | Designed for exactly this pipeline; handles language detection, theme application, and HTML generation. Rolling a custom highlighter is months of work. |
| Markdown parsing + HTML rendering | `unified` + `remark-parse` + `remark-rehype` + `rehype-stringify` (already installed) | Already the project's pipeline. Just add Shiki as a plugin. |
| Frontmatter parsing | `gray-matter` (already installed) | Already in use. Expand the type, not the parser. |

## Existing Code and Patterns

- `src/lib/notes.ts` — The markdown pipeline. Currently sync with `processSync`. Must become async. The `parseFrontmatter` function needs expansion for tags/type/readTime. The `NoteFrontmatter` type is the S01→S02 boundary contract.
- `src/components/notes/NotesIndexPage.tsx` — Server component rendering notes list. Data fetching happens here via `getAllNotes()`. The tag filter must be injected as a client island that wraps or replaces the list section. DOM markers `data-notes-index`, `data-note-item`, `data-note-link`, `data-note-title`, `data-note-date`, `data-note-summary` are consumed by Playwright tests and must be preserved.
- `src/components/notes/NotePage.tsx` — Server component rendering note detail via `dangerouslySetInnerHTML`. No changes needed beyond receiving the expanded frontmatter (tags display, read time display).
- `src/app/notes/[slug]/page.tsx` — Route file. Already async (D046 Promise params). Change `getNoteBySlug(slug)` to `await getNoteBySlug(slug)`.
- `src/app/globals.css` — Has `.note-page__body pre` styles (border, bg, padding, overflow-x). Shiki generates `<pre>` with inline `style` for background color — need to either set `pre` bg to `transparent` or let Shiki's inline style win. Also has `.site-main code` for font sizing. Needs: inline code highlight styling, image styling, table styling within `.note-page__body`.
- `src/components/gate/GateForm.tsx` — Reference for the `'use client'` island pattern. Small interactive component receiving server data as props.
- `src/content/notes/*.md` — Two existing notes with minimal frontmatter (`title`, `summary`, `published`). Need `type: 'note'` and `tags: []` added.

## Constraints

- **Async pipeline is mandatory** — `@shikijs/rehype` is async-only. `processSync` will throw. This means `getNoteBySlug` must return `Promise<NoteWithContent | null>`.
- **DOM marker contract is a hard boundary** — Tests 5, 6, 8 in `public.spec.ts` assert on `data-notes-index`, `data-note-item`, `data-note-page`, `data-note-body`, etc. Any refactoring must preserve these attributes exactly.
- **`dynamicParams = false` on the slug route** — `generateStaticParams` still works since `getAllNoteSlugs` stays sync (no Shiki needed for listing slugs).
- **Dark-only site** — No light theme needed. Single Shiki theme simplifies config and CSS.
- **Shiki generates inline styles on `<span>` tokens** — The `<pre>` and `<code>` elements get inline `style` with `background-color` and `color`. Existing `.note-page__body pre` background (`var(--bg-elevated)`) will be overridden by Shiki's inline style unless we override the Shiki bg via CSS or tell Shiki to use our bg.
- **Bracket-link styles (`a::before`, `a::after`)** — Global `a` styles add `[` and `]` around links. Links inside rendered markdown (e.g., `[text](url)`) will also get brackets. May need `.note-page__body a::before, .note-page__body a::after { content: none; }` to suppress.
- **Tailwind v4** — Project uses `@import "tailwindcss"` and `@theme` for custom properties. Custom component styles live in `globals.css`. Follow this pattern for new styles.

## Common Pitfalls

- **Forgetting to await the async pipeline** — `processSync` → `process` changes the return from `VFile` to `Promise<VFile>`. If `getNoteBySlug` returns the Promise without awaiting, the route will get `[object Promise]` as HTML. The fix is straightforward: `const result = await unified()...process(content)`.
- **Shiki `pre` background clashing with existing styles** — Shiki sets `background-color` inline on `<pre>`. If we also set it in CSS, there's a conflict. Best approach: set `.note-page__body pre[style]` to inherit Shiki's background or use `background: transparent !important` on our CSS and let Shiki control it. Or better: configure Shiki's theme bg to match `var(--bg-elevated)`.
- **Tag filter breaking server component boundary** — The tag filter needs `useState` for the active tag. Don't make `NotesIndexPage` a client component — extract a `NotesListWithFilter` client component that receives notes as a serialized prop. Dates in frontmatter need serialization (Date objects can't cross the server→client boundary). Serialize to ISO string before passing.
- **readTime field on existing notes** — If `readTime` is calculated at parse time, existing notes (which are short) will get low values. This is fine — just ensure the calculation is reasonable (words / 200, rounded up, minimum 1).
- **Shiki singleton highlighter across builds** — The default `@shikijs/rehype` import uses a singleton highlighter that persists across processes. This is fine for build-time SSG but be aware it caches themes/languages. For this use case (build-time only, single theme), the default import is the right choice.

## Open Risks

- **Shiki bundle size impact on build** — Shiki includes grammar definitions for all languages. The default import bundles everything. For a build-time-only pipeline (SSG), this affects build memory/speed, not client bundle. Monitor build time. If it degrades significantly, switch to fine-grained bundle (`@shikijs/rehype/core`) with explicit language imports.
- **Shiki theme not matching the retro palette exactly** — `tokyo-night` is the closest built-in dark theme to the green-on-dark aesthetic, but token colors may not feel cohesive. May need CSS overrides for `.shiki span` colors or a custom theme. Evaluate visually after initial integration.
- **Date serialization across server→client boundary** — When passing notes to the `'use client'` tag filter component, `Date` objects become strings. Need to serialize dates before passing and parse them in the client component, or use ISO strings throughout.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Shiki code blocks | `andrelandgraf/fullstackrecipes@shiki-code-blocks` | available (75 installs) — covers Shiki integration patterns |
| Next.js markdown | `joyco-studio/skills@markdown-content` | available (17 installs) — generic markdown content handling |
| Frontend design | `frontend-design` | installed — for tag filter UI styling |

The `shiki-code-blocks` skill (75 installs) is the most directly relevant. The others are low-install-count and tangential.

## Sources

- `@shikijs/rehype` rehype plugin API — unified pipeline integration with `theme`/`themes` option, async processing required (source: [Shiki docs via Context7](/shikijs/shiki))
- Shiki theme options — `tokyo-night`, `nord`, `github-dark`, `vitesse-dark` available as built-in dark themes (source: [Shiki docs via Context7](/shikijs/shiki))
- Existing codebase: `src/lib/notes.ts`, `src/components/notes/`, `src/app/globals.css`, `tests/e2e/public.spec.ts` — direct file reads
- D046, D047, D048, D056 — architectural decisions constraining implementation approach
