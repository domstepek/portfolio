import Link from "next/link";
import { TerminalPanel } from "@/components/layout/TerminalPanel";
import type { NoteWithContent } from "@/lib/notes";
import { notesPath } from "@/lib/paths";

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(value)
    .toLowerCase();

interface NotePageProps {
  note: NoteWithContent;
}

export function NotePage({ note }: NotePageProps) {
  const { tags, readTime } = note.frontmatter;

  return (
    <div className="note-page" data-note-page>
      <p className="note-page__back">
        <Link className="note-page__back-link" href={notesPath}>
          Back to notes
        </Link>
      </p>

      <TerminalPanel>
        <section className="note-page__intro">
          <h1 data-note-title>{note.frontmatter.title}</h1>
          <p className="note-page__meta">
            <time
              data-note-date
              dateTime={note.frontmatter.published.toISOString()}
            >
              {formatDate(note.frontmatter.published)}
            </time>
            <span className="note-page__read-time" data-note-read-time>
              {readTime} min read
            </span>
          </p>
          {tags.length > 0 && (
            <div className="note-page__tags" data-note-tags>
              {tags.map((tag) => (
                <span key={tag} className="note-page__tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="note-page__summary">{note.frontmatter.summary}</p>
        </section>

        <article
          className="note-page__body"
          data-note-body
          dangerouslySetInnerHTML={{ __html: note.contentHtml }}
        />
      </TerminalPanel>
    </div>
  );
}
