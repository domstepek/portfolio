import { Download } from 'lucide-react';
import { resumePage } from '@/data/resume';
import { assetPath } from '@/lib/paths';
import { Badge } from '@/components/arc/badge/badge';
import { CopyButton } from '@/components/arc/copy-button/copy-button';
import { LinkButton } from '@/components/layout/LinkButton';
import { GithubIcon, LinkedinIcon } from '@/components/command/icons';

const isCurrent = (dates: string) => /present|now/i.test(dates);
const splitDates = (dates: string) => dates.replace(/\s*[–—-]\s*/, ' to ').replace(/Present/i, 'now');

export function ResumePage() {
  const { contact } = resumePage;
  return (
    <div className="page resume-page" data-resume-page data-route-visibility="public" data-gate-state="open">
      <header className="page-header resume-page__header">
        <h1>{resumePage.name}</h1>
        <p className="page-header__lead">Software engineer building React and TypeScript interfaces for financial and data‑heavy products.</p>
        <div className="resume-page__actions print-hide">
          <LinkButton variant="primary" href={assetPath('Jean-Dominique-Stepek-Resume.pdf')} download icon={<Download size={16} strokeWidth={1.75} aria-hidden="true" />}>
            Download PDF
          </LinkButton>
          <CopyButton value={contact.email} label={contact.email} />
          <LinkButton href={`https://${contact.github}`} target="_blank" rel="noreferrer" aria-label="GitHub" className="icon-button" icon={<GithubIcon />} />
          <LinkButton href={`https://${contact.linkedin}`} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="icon-button" icon={<LinkedinIcon />} />
        </div>
        <p className="resume-page__contact print-only">
          {contact.email} · {contact.phone} · {contact.portfolio} · {contact.github} · {contact.linkedin}
        </p>
      </header>

      <section className="page-section split-section" aria-labelledby="resume-experience-heading">
        <h2 id="resume-experience-heading">Experience</h2>
        <div className="split-section__body">
          {resumePage.experience.map((role) => (
            <div key={`${role.company}-${role.dates}`} className="resume-role">
              <div className="resume-role__header">
                <h3>{role.company}</h3>
                {isCurrent(role.dates) && <Badge tone="info" pill>Current</Badge>}
                <span className="resume-role__dates">{splitDates(role.dates)}</span>
              </div>
              <p className="resume-role__title">{role.title}</p>
              {role.projects.map((project, pIdx) => (
                <div key={project.title || pIdx} className="resume-role__project">
                  {project.title && <h4>{project.title}</h4>}
                  <ul className="bullet-list">
                    {project.bullets.map((bullet, bIdx) => <li key={bIdx}>{bullet.text}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="page-section split-section" aria-labelledby="resume-skills-heading">
        <h2 id="resume-skills-heading">Skills</h2>
        <dl className="split-section__body resume-skills">
          {resumePage.skills.map((category) => (
            <div key={category.label} className="resume-skills__row">
              <dt>{category.label}</dt>
              <dd className="badge-row">
                {category.items.split(/,\s*/).map((item) => <Badge key={item} pill>{item}</Badge>)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="page-section split-section" aria-labelledby="resume-education-heading">
        <h2 id="resume-education-heading">Education</h2>
        <div className="split-section__body">
          {resumePage.education.map((entry) => (
            <div key={entry.school} className="resume-education">
              <div>
                <h3>{entry.school}</h3>
                <p>{entry.degree}</p>
              </div>
              <span className="resume-role__dates">{entry.year}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
