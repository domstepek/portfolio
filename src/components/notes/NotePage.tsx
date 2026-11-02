import { Breadcrumb } from "@/components/arc/breadcrumb/breadcrumb";
import { Badge } from "@/components/arc/badge/badge";
import { MermaidRunner } from "@/components/notes/MermaidRunner";
import type { NoteWithContent } from "@/lib/notes";
import { notesPath } from "@/lib/paths";

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(value);

interface NotePageProps {
  note: NoteWithContent;
}

export function NotePage({ note }: NotePageProps) {
  const { tags, readTime } = note.frontmatter;

  return (
    <div className="page note-page" data-note-page>
      <Breadcrumb items={[{ label: "Notes", href: notesPath }, { label: note.frontmatter.title }]} />

      <header className="page-header">
        <h1 data-note-title>{note.frontmatter.title}</h1>
        <p className="note-page__meta">
          <time data-note-date dateTime={note.frontmatter.published.toISOString()}>{formatDate(note.frontmatter.published)}</time>
          <span aria-hidden="true">·</span>
          <span data-note-read-time>{readTime} min read</span>
        </p>
        {tags.length > 0 && (
          <div className="badge-row" data-note-tags>
            {tags.map((tag) => <Badge key={tag} pill>{tag}</Badge>)}
          </div>
        )}
        <p className="page-header__lead">{note.frontmatter.summary}</p>
      </header>

      <article className="prose note-page__body" data-note-body dangerouslySetInnerHTML={{ __html: note.contentHtml }} />
      {note.hasMermaid && <MermaidRunner />}
    </div>
  );
}
