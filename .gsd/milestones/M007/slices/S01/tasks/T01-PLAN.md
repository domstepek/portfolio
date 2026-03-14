---
estimated_steps: 6
estimated_files: 5
---

# T01: Upgrade Markdown Pipeline — Shiki, Async Conversion, Expanded Frontmatter

**Slice:** S01 — Enhanced Markdown Rendering and Tag System
**Milestone:** M007

## Description

Install `@shikijs/rehype` and integrate it into the unified markdown pipeline in `notes.ts`. Convert the synchronous `processSync` call to async `process` (required by Shiki). Expand `NoteFrontmatter` with `tags`, `type`, and `readTime` fields that form the S01→S02 boundary contract. Migrate the two existing notes to the new schema. Update the route file to await the now-async `getNoteBySlug`.

## Steps

1. Install `@shikijs/rehype` via `pnpm add @shikijs/rehype`
2. Expand `NoteFrontmatter` type: add `tags: string[]`, `type: 'note' | 'journal'`, `readTime: number`. Update `NoteEntry` and `NoteWithContent` accordingly.
3. Update `parseFrontmatter` to handle new fields: parse `tags` (default `[]`), `type` (default `'note'`), calculate `readTime` from word count (words / 200, rounded up, minimum 1). Accept raw markdown content as a parameter for readTime calculation.
4. Convert `getNoteBySlug`: replace `processSync(content)` with `await unified()...use(rehypeShiki, { theme: 'tokyo-night' })...process(content)`. Add `rehypeShiki` between `remarkRehype` and `rehypeStringify`. Return type becomes `Promise<NoteWithContent | null>`.
5. Add `getAllTags()` export that reads all notes and returns a deduplicated sorted array of tags. Keep `getAllNotes()` and `getAllNoteSlugs()` synchronous (no Shiki needed for listing).
6. Migrate existing notes frontmatter: add `type: note` and `tags: [opinion, engineering]` to both `keep-the-path-explicit.md` and `systems-over-abstractions.md`. Update route file `src/app/notes/[slug]/page.tsx`: change `getNoteBySlug(slug)` to `await getNoteBySlug(slug)` in both `NoteRoute` and `generateMetadata`.

## Must-Haves

- [ ] `@shikijs/rehype` installed and added to unified pipeline with `theme: 'tokyo-night'`
- [ ] `getNoteBySlug` returns `Promise<NoteWithContent | null>` (async)
- [ ] `NoteFrontmatter` includes `tags: string[]`, `type: 'note' | 'journal'`, `readTime: number`
- [ ] `getAllTags()` exported from `notes.ts`
- [ ] Both existing notes have `type: 'note'` and `tags` in frontmatter
- [ ] Route file awaits `getNoteBySlug` in both component and metadata functions
- [ ] `pnpm build` succeeds

## Verification

- `pnpm build` completes without errors — confirms async pipeline works, Shiki loads, and static generation succeeds
- Inspect `.next/server/app/notes/` build output to confirm HTML is generated (not `[object Promise]`)
- `tsc --noEmit` passes (type correctness of expanded frontmatter and async return types)

## Observability Impact

- Signals added/changed: Shiki adds `class="shiki"` and `class="shiki-themes"` to `<pre>` elements plus inline `style` with `background-color` and `color` on token `<span>` elements — these are machine-inspectable markers for rendering verification
- How a future agent inspects this: Check rendered HTML for `class="shiki"` on `<pre>` elements; check `NoteFrontmatter` type for `tags`/`type`/`readTime` fields
- Failure state exposed: If `processSync` is accidentally used with Shiki, the build fails immediately with a clear Shiki async error. If frontmatter is malformed, `parseFrontmatter` defaults preserve backward compatibility.

## Inputs

- `src/lib/notes.ts` — current sync pipeline with `processSync`, minimal `NoteFrontmatter`
- `src/app/notes/[slug]/page.tsx` — already async RSC (D046), currently calls sync `getNoteBySlug`
- `src/content/notes/*.md` — two existing notes with `title`, `summary`, `published` frontmatter only

## Expected Output

- `src/lib/notes.ts` — async pipeline with Shiki, expanded types, `getAllTags()` helper
- `src/app/notes/[slug]/page.tsx` — awaits async `getNoteBySlug`
- `src/content/notes/keep-the-path-explicit.md` — migrated frontmatter with `type: note`, `tags: [opinion, engineering]`
- `src/content/notes/systems-over-abstractions.md` — migrated frontmatter with `type: note`, `tags: [opinion, engineering]`
- `package.json` — includes `@shikijs/rehype` dependency
