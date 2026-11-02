import Link from 'next/link';
import { personalPage } from '@/data/personal';
import { homePath, notesPath, resumePath } from '@/lib/paths';
import { TerminalPanel } from '@/components/layout/TerminalPanel';

export function PersonalPage() {
  const { systems, product, collaboration } = personalPage.howIWork.principles;

  return (
    <div className="personal-page" data-personal-page data-route-visibility="public" data-gate-state="open">
      <p className="personal-page__back">
        <Link className="personal-page__back-link" href={homePath}>Back home</Link>
      </p>

      <TerminalPanel>
        <section className="personal-page__intro">
          <h1 className="personal-page__title">{personalPage.title}</h1>
          <p className="personal-page__lead">{personalPage.lead}</p>
        </section>

        <section
          className="personal-page__section"
          aria-labelledby="personal-how-i-work-heading"
          data-how-i-work
        >
          <h2 className="personal-page__section-title" id="personal-how-i-work-heading">
            {personalPage.howIWork.title}
          </h2>
          <p>{personalPage.howIWork.intro}</p>

          <div className="personal-page__principles">
            <section className="personal-page__principle" data-how-i-work-systems>
              <h3>{systems.title}</h3>
              <p>{systems.body}</p>
            </section>

            <section className="personal-page__principle" data-how-i-work-product>
              <h3>{product.title}</h3>
              <p>{product.body}</p>
            </section>

            <section className="personal-page__principle" data-how-i-work-collaboration>
              <h3>{collaboration.title}</h3>
              <p>{collaboration.body}</p>
            </section>
          </div>
        </section>

        <section className="personal-page__section" aria-labelledby="personal-open-to-heading" data-open-to>
          <h2 className="personal-page__section-title" id="personal-open-to-heading">
            {personalPage.openTo.title}
          </h2>
          <p>{personalPage.openTo.intro}</p>

          <div className="personal-page__groups">
            <section className="personal-page__group">
              <h3 className="personal-page__group-title">Role modes</h3>
              <ul className="personal-page__list">
                {personalPage.openTo.roles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            </section>

            <section className="personal-page__group">
              <h3 className="personal-page__group-title">Best-fit problems</h3>
              <ul className="personal-page__list">
                {personalPage.openTo.problemSpaces.map((ps) => (
                  <li key={ps}>{ps}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="personal-page__group">
            <h3 className="personal-page__group-title">Boundaries</h3>
            <ul className="personal-page__list">
              {personalPage.openTo.boundaries.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        </section>

        <section
          className="personal-page__section"
          id="resume"
          aria-labelledby="personal-resume-heading"
          data-resume-section
        >
          <h2 className="personal-page__section-title" id="personal-resume-heading">
            {personalPage.resume.title}
          </h2>
          <p>{personalPage.resume.summary}</p>
          <ul className="personal-page__list">
            {personalPage.resume.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <p className="personal-page__note">
            {personalPage.resume.note} <Link href={resumePath}>Full resume</Link>
          </p>
        </section>

        <p className="personal-page__notes">
          {personalPage.notes.intro}{' '}
          <Link data-personal-notes-link href={notesPath}>{personalPage.notes.label}</Link>.
        </p>
      </TerminalPanel>
    </div>
  );
}
