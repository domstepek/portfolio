---
id: T03
parent: S01
milestone: M007
provides:
  - TagFilter 'use client' component with useState-driven tag filtering
  - Serialized note data crossing server→client boundary (Date→ISO string)
  - Tag chips displayed on each note item in the notes index
  - data-tag-filter DOM marker for observability
key_files:
  - src/components/notes/TagFilter.tsx
  - src/components/notes/NotesIndexPage.tsx
  - src/app/globals.css
key_decisions:
  - SerializedNoteEntry type defined locally in TagFilter.tsx with dates as ISO strings — keeps serialization boundary explicit at the component level
patterns_established:
  - Client island pattern — server component (NotesIndexPage) serializes data and passes to 'use client' component (TagFilter) as props; filtering is entirely client-side with useState
  - Tag chip styling reuses retro terminal aesthetic (pill shape for filter, rectangular for item tags) with consistent border/accent color pattern
observability_surfaces:
  - data-tag-filter attribute on filter container for agent inspection
  - Existing data-* markers preserved (data-notes-index, data-note-item, data-note-link, data-note-title, data-note-date, data-note-summary)
duration: 12m
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# T03: Tag Filter Component and Notes Index Integration

**Built TagFilter client island with clickable tag chips that filter the notes index list, tag display on each note item, and full DOM marker preservation.**

## What Happened

Created `TagFilter.tsx` as a `'use client'` component with `useState<string | null>` for the active tag. The component receives serialized notes (dates as ISO strings via `SerializedNoteEntry` type) and all tags as props. Clicking a tag filters the note list; clicking the active tag deselects it (shows all). Each note item displays its tags as small chips next to the date.

Updated `NotesIndexPage.tsx` to import `getAllNotes` and `getAllTags`, serialize note dates to ISO strings, and pass serialized data to `TagFilter` as a client island. The intro section and back link remain in the server component. The inline note list rendering was removed (now delegated to `TagFilter`).

Added CSS in `globals.css`: pill-shaped filter chips (`.tag-filter__chip`) with inactive/active/hover states, rectangular tag chips on note items (`.notes-index__tag`), flex-wrap layout for both chip rows, and bracket-link suppression on tag elements.

## Verification

- `tsc --noEmit` — passed (zero errors)
- `pnpm build` — succeeded, all 9 routes generated including 3 note slugs
- `pnpm test` — all 18 Playwright tests passed (including tests 5, 6, 8 that check notes DOM markers)
- Browser verification: navigated to `/notes/`, confirmed `data-notes-index`, `data-tag-filter`, `data-note-item`, `data-note-link`, `data-note-title`, `data-note-date`, `data-note-summary` all visible
- Tag filter: clicked "testing" tag → note count reduced from 3 to 1; clicked again → all 3 notes restored
- Slice verification status: all 4 checks pass (build ✓, tests ✓, Shiki class on pre ✓ from T02, tag filter renders and filters ✓)

## Diagnostics

- `[data-tag-filter]` attribute on the filter container for agent/test inspection
- `[data-note-item]` count changes when a tag is active (observable via `querySelectorAll`)
- React hydration errors in browser console would indicate serialization failure (Date objects crossing client boundary)

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/components/notes/TagFilter.tsx` — new 'use client' component with SerializedNoteEntry type, tag filtering, and note list rendering
- `src/components/notes/NotesIndexPage.tsx` — updated to serialize notes and delegate rendering to TagFilter client island
- `src/app/globals.css` — added tag filter chip styles, note item tag styles, and notes-index__meta flex layout
