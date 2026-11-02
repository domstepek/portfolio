import Link from "next/link";
import { TerminalPanel } from "@/components/layout/TerminalPanel";
import { getAllNotes, getAllTags } from "@/lib/notes";
import { homePath } from "@/lib/paths";
import { TagFilter, type SerializedNoteEntry } from "./TagFilter";

export function NotesIndexPage() {
  const notes = getAllNotes();
  const allTags = getAllTags();

  // Serialize notes for the client boundary (Date → ISO string)
  const serializedNotes: SerializedNoteEntry[] = notes.map((note) => ({
    slug: note.slug,
    frontmatter: {
      ...note.frontmatter,
      published: note.frontmatter.published.toISOString(),
      updated: note.frontmatter.updated?.toISOString(),
    },
  }));

  return (
    <div className="notes-index" data-notes-index>
      <p className="notes-index__back">
        <Link className="notes-index__back-link" href={homePath}>
          Back home
        </Link>
      </p>

      <TerminalPanel>
        <section className="notes-index__intro">
          <h1>Notes</h1>
          <p>
            Short field notes on system shape, product decisions, and the small
            implementation details that either clarify a workflow or quietly make
            it worse.
          </p>
        </section>

        <TagFilter notes={serializedNotes} allTags={allTags} />
      </TerminalPanel>
    </div>
  );
}
