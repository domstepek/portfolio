"use client";

import { useState } from "react";
import Link from "next/link";
import { notePath } from "@/lib/paths";

// ---------------------------------------------------------------------------
// Serializable type — dates as ISO strings for server→client boundary
// ---------------------------------------------------------------------------

export interface SerializedNoteEntry {
  slug: string;
  frontmatter: {
    title: string;
    summary: string;
    published: string; // ISO string
    updated?: string; // ISO string
    tags: string[];
    type: "note" | "journal";
    readTime: number;
  };
}

// ---------------------------------------------------------------------------
// Date formatting (mirrors NotesIndexPage original)
// ---------------------------------------------------------------------------

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(iso))
    .toLowerCase();

// ---------------------------------------------------------------------------
// TagFilter component
// ---------------------------------------------------------------------------

interface TagFilterProps {
  notes: SerializedNoteEntry[];
  allTags: string[];
}

export function TagFilter({ notes, allTags }: TagFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredNotes = activeTag
    ? notes.filter((n) => n.frontmatter.tags.includes(activeTag))
    : notes;

  const handleTagClick = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <>
      {allTags.length > 0 && (
        <div className="tag-filter" data-tag-filter>
          <div className="tag-filter__chips">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag-filter__chip${activeTag === tag ? " tag-filter__chip--active" : ""}`}
                onClick={() => handleTagClick(tag)}
                aria-pressed={activeTag === tag}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="notes-index__list">
        {filteredNotes.map((note) => (
          <article
            key={note.slug}
            className="notes-index__item"
            data-note-item
          >
            <div className="notes-index__meta">
              <time data-note-date dateTime={note.frontmatter.published}>
                {formatDate(note.frontmatter.published)}
              </time>
              {note.frontmatter.tags.length > 0 && (
                <span className="notes-index__tags">
                  {note.frontmatter.tags.map((tag) => (
                    <span key={tag} className="notes-index__tag">
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </div>
            <h2 className="notes-index__title" data-note-title>
              <Link data-note-link href={notePath(note.slug)}>
                {note.frontmatter.title}
              </Link>
            </h2>
            <p data-note-summary>{note.frontmatter.summary}</p>
          </article>
        ))}
      </div>
    </>
  );
}
