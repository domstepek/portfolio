---
id: T01
parent: S01
milestone: M007
provides:
  - Async unified pipeline with Shiki syntax highlighting (tokyo-night theme)
  - Expanded NoteFrontmatter type with tags, type, readTime fields
  - getAllTags() helper for tag aggregation
  - Migrated existing notes to expanded frontmatter schema
key_files:
  - src/lib/notes.ts
  - src/app/notes/[slug]/page.tsx
  - src/content/notes/keep-the-path-explicit.md
  - src/content/notes/systems-over-abstractions.md
key_decisions:
  - readTime calculated as ceil(wordCount / 200), minimum 1
  - parseFrontmatter accepts raw markdown content parameter for readTime calculation
  - getAllNotes and getAllNoteSlugs remain synchronous (no Shiki needed for listing)
patterns_established:
  - Async getNoteBySlug returns Promise<NoteWithContent | null>
  - NoteFrontmatter tags default to [] and type defaults to 'note' for backward compatibility
observability_surfaces:
  - Shiki adds class="shiki" and inline style on <pre> elements when code blocks are present
  - Build failure with clear async error if processSync accidentally used with Shiki
  - parseFrontmatter defaults preserve backward compatibility for malformed frontmatter
duration: 10m
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# T01: Upgrade Markdown Pipeline — Shiki, Async Conversion, Expanded Frontmatter

**Installed `@shikijs/rehype`, converted sync pipeline to async, expanded `NoteFrontmatter` with tags/type/readTime, added `getAllTags()`, migrated both existing notes.**

## What Happened

Installed `@shikijs/rehype` (v4.0.2). Rewrote `src/lib/notes.ts` to integrate `rehypeShiki` with `theme: 'tokyo-night'` in the unified pipeline between `remarkRehype` and `rehypeStringify`. Converted `getNoteBySlug` from sync (`processSync`) to async (`process`), changing its return type to `Promise<NoteWithContent | null>`. Expanded `NoteFrontmatter` with `tags: string[]`, `type: 'note' | 'journal'`, and `readTime: number`. Updated `parseFrontmatter` to accept raw markdown content for readTime calculation (words/200, ceil, min 1) and handle new fields with safe defaults. Added `getAllTags()` export. Updated the route file to `await getNoteBySlug()` in both `NoteRoute` and `generateMetadata`. Migrated both existing notes with `type: note` and `tags: [opinion, engineering]`.

## Verification

- `tsc --noEmit` — passes (type correctness confirmed)
- `pnpm build` — succeeds, both notes statically generated at `/notes/keep-the-path-explicit` and `/notes/systems-over-abstractions`
- Build output HTML inspected — no `[object Promise]` found, real content rendered
- `pnpm test` (CI=true) — all 18 Playwright tests pass

### Slice-level verification (intermediate — T01 of 3):
- ✅ `pnpm build` — production build succeeds with async pipeline and Shiki
- ✅ `pnpm test` — all 18 existing Playwright tests pass
- ⏳ Rendered HTML with Shiki `class="shiki"` — no code blocks in existing notes yet (T02 creates test note)
- ⏳ Tag filter component — not yet implemented (T03)

## Diagnostics

- Shiki integration verifiable by checking rendered HTML for `class="shiki"` on `<pre>` elements (once code-block-containing notes exist)
- `NoteFrontmatter` type enforces tags/type/readTime at compile time
- `parseFrontmatter` defaults (`tags: []`, `type: 'note'`, `readTime: 1`) ensure backward compatibility if frontmatter is incomplete

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `package.json` / `pnpm-lock.yaml` — added `@shikijs/rehype` dependency
- `src/lib/notes.ts` — async pipeline with Shiki, expanded types, `getAllTags()` helper
- `src/app/notes/[slug]/page.tsx` — awaits async `getNoteBySlug` in component and metadata
- `src/content/notes/keep-the-path-explicit.md` — added `type: note`, `tags: [opinion, engineering]`
- `src/content/notes/systems-over-abstractions.md` — added `type: note`, `tags: [opinion, engineering]`
