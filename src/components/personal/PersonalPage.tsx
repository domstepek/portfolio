import { Activity, Boxes, Compass, Mail, MousePointerClick, Network, ShieldCheck, Users } from 'lucide-react';
import { personalPage, type PersonalCraft } from '@/data/personal';
import { notesPath, resumePath } from '@/lib/paths';
import { LinkButton } from '@/components/layout/LinkButton';
import Link from 'next/link';

const icon = { size: 20, strokeWidth: 1.75, 'aria-hidden': true, className: 'accent-icon' } as const;

export function PersonalPage() {
  const { performance, components, interaction, visualization } = personalPage.craft.items;
  const craft: (PersonalCraft & { key: string; Icon: typeof Activity })[] = [
    { key: 'performance', Icon: Activity, ...performance },
    { key: 'components', Icon: Boxes, ...components },
    { key: 'interaction', Icon: MousePointerClick, ...interaction },
    { key: 'visualization', Icon: Network, ...visualization },
  ];
  const { product, quality, collaboration } = personalPage.howIWork.principles;
  const principles = [
    { key: 'product', Icon: Compass, ...product },
    { key: 'quality', Icon: ShieldCheck, ...quality },
    { key: 'collaboration', Icon: Users, ...collaboration },
  ];

  return (
    <div className="page personal-page" data-personal-page data-route-visibility="public" data-gate-state="open">
      <header className="page-header">
        <h1>{personalPage.title}</h1>
        <p className="page-header__lead">{personalPage.lead}</p>
      </header>

      <section className="page-section split-section" aria-labelledby="personal-craft-heading" data-craft>
        <h2 id="personal-craft-heading">{personalPage.craft.title}</h2>
        <div className="split-section__body">
          <div className="craft-grid">
            {craft.map(({ key, Icon, title, body, link }) => (
              <section key={key} className="craft">
                <Icon {...icon} />
                <h3>{title}</h3>
                <p>{body}</p>
                {link && <Link className="craft__link" href={link.href}>{link.label} →</Link>}
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section split-section" aria-labelledby="personal-how-i-work-heading" data-how-i-work>
        <h2 id="personal-how-i-work-heading">{personalPage.howIWork.title}</h2>
        <div className="split-section__body">
          <div className="principles">
            {principles.map(({ key, Icon, title, body }) => (
              <section key={key} className="principle" {...{ [`data-how-i-work-${key}`]: '' }}>
                <Icon {...icon} />
                <h3>{title}</h3>
                <p>{body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section split-section" aria-labelledby="personal-toolkit-heading" data-toolkit>
        <h2 id="personal-toolkit-heading">{personalPage.toolkit.title}</h2>
        <div className="split-section__body">
          <ul className="toolkit" aria-label="Tools I use">
            {personalPage.toolkit.items.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </section>

      <section className="page-section split-section" aria-labelledby="personal-open-to-heading" data-open-to>
        <h2 id="personal-open-to-heading">{personalPage.openTo.title}</h2>
        <div className="split-section__body">
          <p className="secondary">{personalPage.openTo.intro}</p>
          <div className="open-to-groups">
            <section>
              <h3 className="muted-heading">Roles</h3>
              <ul className="bullet-list">{personalPage.openTo.roles.map((r) => <li key={r}>{r}</li>)}</ul>
            </section>
            <section>
              <h3 className="muted-heading">Problems I like</h3>
              <ul className="bullet-list">{personalPage.openTo.problemSpaces.map((p) => <li key={p}>{p}</li>)}</ul>
            </section>
            <section>
              <h3 className="muted-heading">How I choose</h3>
              <ul className="bullet-list">{personalPage.openTo.boundaries.map((b) => <li key={b}>{b}</li>)}</ul>
            </section>
          </div>
        </div>
      </section>

      <section className="page-section split-section" aria-labelledby="personal-next-heading" data-resume-section>
        <h2 id="personal-next-heading">{personalPage.resume.title}</h2>
        <div className="split-section__body">
          <p className="secondary">
            {personalPage.resume.summary} Lighter field notes live in{' '}
            <Link data-personal-notes-link href={notesPath}>notes</Link>.
          </p>
          <div className="button-row">
            <LinkButton variant="primary" href={resumePath}>Read my resume</LinkButton>
            <LinkButton href="mailto:domstepek@gmail.com" icon={<Mail size={16} strokeWidth={1.75} aria-hidden="true" />}>Email me</LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
