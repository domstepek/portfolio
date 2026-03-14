import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NotePage } from "@/components/notes/NotePage";
import { getAllNoteSlugs, getNoteBySlug } from "@/lib/notes";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNoteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    return { title: "Not Found" };
  }

  return {
    title: note.frontmatter.title,
    description: note.frontmatter.summary,
  };
}

export default async function NoteRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  return <NotePage note={note} />;
}
