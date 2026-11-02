import { getAllNotes, getAllTags } from "@/lib/notes";
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
    <div className="page notes-index" data-notes-index>
      <header className="page-header">
        <h1>Notes</h1>
        <p className="page-header__lead">
          Short field notes on system shape, product decisions, and the small details that make a workflow clearer or quietly worse.
        </p>
      </header>
      <TagFilter notes={serializedNotes} allTags={allTags} />
    </div>
  );
}
