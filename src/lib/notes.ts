import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NoteFrontmatter {
  title: string;
  summary: string;
  published: Date;
  updated?: Date;
  tags: string[];
  type: "note" | "journal";
  readTime: number;
}

export interface NoteEntry {
  slug: string;
  frontmatter: NoteFrontmatter;
}

export interface NoteWithContent extends NoteEntry {
  contentHtml: string;
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

const NOTES_DIR = path.join(process.cwd(), "src/content/notes");

/** Calculate read time from word count: words / 200, rounded up, minimum 1. */
function calculateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parseFrontmatter(
  raw: Record<string, unknown>,
  content: string,
): NoteFrontmatter {
  const rawTags = raw.tags;
  const tags: string[] = Array.isArray(rawTags)
    ? rawTags.map(String)
    : [];

  const rawType = String(raw.type ?? "note");
  const type: "note" | "journal" = rawType === "journal" ? "journal" : "note";

  return {
    title: String(raw.title ?? ""),
    summary: String(raw.summary ?? ""),
    published:
      raw.published instanceof Date
        ? raw.published
        : new Date(String(raw.published)),
    updated: raw.updated
      ? raw.updated instanceof Date
        ? raw.updated
        : new Date(String(raw.updated))
      : undefined,
    tags,
    type,
    readTime: calculateReadTime(content),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Return all notes sorted by published date (newest first). */
export function getAllNotes(): NoteEntry[] {
  const files = fs.readdirSync(NOTES_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(NOTES_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        frontmatter: parseFrontmatter(data, content),
      };
    })
    .sort(
      (a, b) =>
        b.frontmatter.published.getTime() - a.frontmatter.published.getTime(),
    );
}

/** Return a single note with its markdown body rendered to HTML. */
export async function getNoteBySlug(
  slug: string,
): Promise<NoteWithContent | null> {
  const filePath = path.join(NOTES_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeShiki, { theme: "tokyo-night" })
    .use(rehypeStringify)
    .process(content);

  return {
    slug,
    frontmatter: parseFrontmatter(data, content),
    contentHtml: String(result),
  };
}

/** Return all note slugs for generateStaticParams. */
export function getAllNoteSlugs(): string[] {
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** Return a deduplicated, sorted array of all tags across all notes. */
export function getAllTags(): string[] {
  const notes = getAllNotes();
  const tagSet = new Set<string>();
  for (const note of notes) {
    for (const tag of note.frontmatter.tags) {
      tagSet.add(tag);
    }
  }
  return [...tagSet].sort();
}
