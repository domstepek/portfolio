"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ChipGroup } from "@/components/arc/chip-group/chip-group";
import { Badge } from "@/components/arc/badge/badge";
import { notePath } from "@/lib/paths";

// Serializable type — dates as ISO strings for server→client boundary
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

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

const ALL = "__all";

interface TagFilterProps {
  notes: SerializedNoteEntry[];
  allTags: string[];
}

export function TagFilter({ notes, allTags }: TagFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredNotes = activeTag ? notes.filter((n) => n.frontmatter.tags.includes(activeTag)) : notes;

  return (
    <>
      {allTags.length > 0 && (
        <div className="tag-filter" data-tag-filter>
          <ChipGroup
            label="Filter notes by tag"
            multiple={false}
            options={[{ value: ALL, label: "All" }, ...allTags.map((tag) => ({ value: tag, label: tag }))]}
            value={[activeTag ?? ALL]}
            onValueChange={(value) => setActiveTag(value[0] && value[0] !== ALL ? value[0] : null)}
          />
        </div>
      )}

      <div className="surface list-group notes-list">
        {filteredNotes.map((note) => (
          <article key={note.slug} className="notes-list__item" data-note-item>
            <div className="notes-list__meta">
              <time data-note-date dateTime={note.frontmatter.published}>{formatDate(note.frontmatter.published)}</time>
              <span>{note.frontmatter.readTime} min read</span>
            </div>
            <div className="notes-list__body">
              <h2 className="notes-list__title" data-note-title>
                <Link className="stretched-link" data-note-link href={notePath(note.slug)}>{note.frontmatter.title}</Link>
              </h2>
              <p data-note-summary>{note.frontmatter.summary}</p>
              {note.frontmatter.tags.length > 0 && (
                <div className="badge-row">
                  {note.frontmatter.tags.map((tag) => <Badge key={tag} pill>{tag}</Badge>)}
                </div>
              )}
            </div>
            <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" className="notes-list__arrow" />
          </article>
        ))}
      </div>
    </>
  );
}
