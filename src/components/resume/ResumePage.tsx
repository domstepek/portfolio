import Link from 'next/link';
import { resumePage } from '@/data/resume';
import { homePath, assetPath } from '@/lib/paths';
import { TerminalPanel } from '@/components/layout/TerminalPanel';
import { CopyChip, PrintButton } from '@/components/resume/CopyChip';

export function ResumePage() {
  return (
    <div className="resume-page" data-resume-page data-route-visibility="public" data-gate-state="open">
      <p className="resume-page__back print-hide">
        <Link className="resume-page__back-link" href={homePath}>Back home</Link>
      </p>

      <TerminalPanel>
        <div className="resume-page__sheet">
          <header className="resume-page__header">
            <h1 className="resume-page__name">{resumePage.name}</h1>
            <p className="resume-page__headline">{resumePage.headline}</p>
            <div className="resume-page__contact">
              <span className="resume-page__phone">{resumePage.contact.phone}</span>
              <CopyChip
                copyText={resumePage.contact.email}
                label="email"
                printText={resumePage.contact.email}
              />
              <CopyChip
                copyText={`https://${resumePage.contact.portfolio}`}
                label="portfolio"
                printText={resumePage.contact.portfolio}
              />
              <CopyChip
                copyText={`https://${resumePage.contact.github}`}
                label="github"
                printText={resumePage.contact.github}
              />
              <CopyChip
                copyText={`https://${resumePage.contact.linkedin}`}
                label="linkedin"
                printText={resumePage.contact.linkedin}
              />
            </div>
          </header>

          <section className="resume-page__section" aria-labelledby="resume-skills-heading">
            <h2 className="resume-page__section-title" id="resume-skills-heading">Skills</h2>
            <dl className="resume-page__skills">
              {resumePage.skills.map((category) => (
                <div key={category.label} className="resume-page__skill-row">
                  <dt className="resume-page__skill-label">{category.label}</dt>
                  <dd className="resume-page__skill-items">{category.items}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="resume-page__section" aria-labelledby="resume-experience-heading">
            <h2 className="resume-page__section-title" id="resume-experience-heading">Experience</h2>
            {resumePage.experience.map((role) => (
              <div key={`${role.company}-${role.dates}`} className="resume-page__role">
                <div className="resume-page__role-header">
                  <p className="resume-page__role-company">
                    {role.company} — {role.title}
                  </p>
                  <p className="resume-page__role-dates">{role.dates}</p>
                </div>
                {role.projects.map((project, pIdx) => (
                  <div key={project.title || pIdx} className="resume-page__project">
                    {project.title && (
                      <p className="resume-page__project-title">{project.title}</p>
                    )}
                    <ul className="resume-page__bullets">
                      {project.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet.text}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </section>

          <section className="resume-page__section" aria-labelledby="resume-education-heading">
            <h2 className="resume-page__section-title" id="resume-education-heading">Education</h2>
            {resumePage.education.map((entry) => (
              <div key={entry.school} className="resume-page__education-row">
                <p className="resume-page__education-school">
                  {entry.school} — {entry.degree}
                </p>
                <p className="resume-page__education-year">{entry.year}</p>
              </div>
            ))}
          </section>
        </div>

        <div className="resume-page__actions print-hide">
          <a className="resume-page__download" href={assetPath('Jean-Dominique-Stepek-Resume.pdf')} download>
            download pdf
          </a>
          <PrintButton />
        </div>
      </TerminalPanel>
    </div>
  );
}
