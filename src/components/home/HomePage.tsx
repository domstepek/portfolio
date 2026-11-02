import { homePage } from '@/data/home';
import { buildCommands } from '@/data/commands';
import { getAllNotes } from '@/lib/notes';
import { HomePalette } from '@/components/command/CommandMenu';

/**
 * HomePage — the homepage is a command palette (Arc command-palette block).
 * /work, /about, /resume, /notes navigate; plain text searches pages,
 * case studies, and notes. Markers kept for the public-route tests.
 */
export function HomePage() {
  const commands = buildCommands(
    getAllNotes().map((note) => ({
      slug: note.slug,
      title: note.frontmatter.title,
      published: note.frontmatter.published.toISOString(),
      tags: note.frontmatter.tags,
    })),
  );

  return (
    <div className="home-page" data-home-page data-route-visibility="public" data-gate-state="open">
      <section className="home-page__intro" data-home-hero>
        <div className="home-avatar-wrap">
          <img src={homePage.avatar} alt="Dom" className="home-avatar" width={68} height={68} />
        </div>
        <h1 className="home-page__title">{homePage.title}</h1>
        <p className="home-page__lead">{homePage.paletteLead}</p>
      </section>

      <HomePalette commands={commands} />

      <p className="home-page__now">
        <span className="live-dot" aria-hidden="true" />
        {homePage.now}
      </p>
    </div>
  );
}
