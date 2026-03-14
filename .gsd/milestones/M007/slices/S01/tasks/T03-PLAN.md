---
estimated_steps: 5
estimated_files: 3
---

# T03: Tag Filter Component and Notes Index Integration

**Slice:** S01 — Enhanced Markdown Rendering and Tag System
**Milestone:** M007

## Description

Build a `TagFilter` `'use client'` component that receives serialized notes and all tags as props, manages active filter state via `useState`, and renders the filtered note list. Integrate it into `NotesIndexPage` as a client island — the parent stays a server component. Display tags on each note item in the index. Preserve all `data-*` DOM markers consumed by Playwright tests. Run full verification: build + all 18 tests.

## Steps

1. Create `src/components/notes/TagFilter.tsx` as a `'use client'` component. Define a serializable `SerializedNoteEntry` type (dates as ISO strings, not Date objects). Accept props: `notes: SerializedNoteEntry[]`, `allTags: string[]`. Use `useState<string | null>(null)` for the active tag. Render: a row of clickable tag chips (active tag highlighted), then the filtered note list. Each note item must have `data-note-item`, and its children must have `data-note-link`, `data-note-title`, `data-note-date`, `data-note-summary` — matching the existing contract exactly.
2. Add CSS for the tag filter in `globals.css`: tag chip styling (pill shape, border, muted color when inactive, accent color when active), tag chip row layout (flex-wrap, gap), tag display on note items (small chips after the date).
3. Update `NotesIndexPage.tsx`: import `getAllNotes` and `getAllTags` from `notes.ts`. Serialize notes for the client boundary (convert `Date` to ISO string). Pass serialized notes and tags to `TagFilter`. Keep the `data-notes-index` attribute on the outer container. Remove the inline note list rendering (now delegated to `TagFilter`). Keep the intro section and back link in the server component.
4. Display tags on each note item in the index — small tag chips next to or below the date. Tags appear both in the filter bar and on individual note items.
5. Run full verification: `pnpm build` succeeds, `pnpm test` — all 18 Playwright tests pass. Fix any DOM marker regressions.

## Must-Haves

- [ ] `TagFilter` is a `'use client'` component with `useState` for active tag
- [ ] Notes are serialized (Date → ISO string) before crossing the server→client boundary
- [ ] Clicking a tag filters the note list; clicking the active tag deselects it (shows all)
- [ ] All `data-*` DOM markers preserved: `data-notes-index`, `data-note-item`, `data-note-link`, `data-note-title`, `data-note-date`, `data-note-summary`
- [ ] Tags displayed on each note item in the index
- [ ] Tag chips styled with retro terminal aesthetic (pill shape, accent colors)
- [ ] `pnpm build` succeeds
- [ ] All 18 existing Playwright tests pass (`pnpm test`)

## Verification

- `pnpm build` completes without errors
- `pnpm test` — all 18 Playwright tests pass (critical: tests 5, 6, 8 check notes DOM markers)
- `tsc --noEmit` passes
- Tag filter renders on `/notes/` and clicking a tag filters the visible note list

## Observability Impact

- Signals added/changed: None (client-side filtering is stateless and ephemeral)
- How a future agent inspects this: Check `[data-notes-index]` contains `[data-note-item]` elements; check tag filter renders via `[data-tag-filter]` attribute on the filter container
- Failure state exposed: If serialization is wrong (Date objects crossing client boundary), React will throw a hydration error visible in browser console

## Inputs

- `src/lib/notes.ts` — T01's `getAllNotes()`, `getAllTags()`, expanded `NoteFrontmatter`
- `src/components/notes/NotesIndexPage.tsx` — current server component with inline note list
- `src/app/globals.css` — T02's styles (add tag filter styles alongside)
- `tests/e2e/public.spec.ts` — tests 5, 6, 8 define the DOM marker contract

## Expected Output

- `src/components/notes/TagFilter.tsx` — new `'use client'` component with tag filtering
- `src/components/notes/NotesIndexPage.tsx` — updated to use `TagFilter` island with serialized data
- `src/app/globals.css` — tag filter and tag chip styles added
- All 18 Playwright tests passing (verified by `pnpm test`)
