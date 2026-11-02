import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Component, Globe, Lock, Mail, Smartphone, Table2 } from 'lucide-react';
import { Badge } from '@/components/arc/badge/badge';
import { LinkButton } from '@/components/layout/LinkButton';
import { homePage } from '@/data/home';
import { domains } from '@/data/domains';
import { domainPath } from '@/lib/paths';
import { LiveGrid } from '@/components/live-grid/LiveGrid';

const highlightIcons = [Table2, Component, Smartphone, Globe];
const icon = { size: 20, strokeWidth: 1.75, 'aria-hidden': true } as const;

export function WorkPage() {
  const { current } = homePage;
  return (
    <div className="page work-page" data-work-page data-route-visibility="public" data-gate-state="open">
      <header className="page-header">
        <h1>Work</h1>
        <p className="page-header__lead">What I&apos;m building now, and case studies from the four years before it.</p>
      </header>

      <section className="surface work-current" aria-labelledby="work-current-title" data-home-current>
        <div className="work-current__title-row">
          <h2 id="work-current-title">{current.company}</h2>
          <Badge tone="info" pill>Current</Badge>
          <span className="work-current__dates">{current.meta}</span>
        </div>
        <p className="work-current__intro">{current.intro}</p>
        <ul className="work-current__highlights">
          {current.highlights.map((item, i) => {
            const Icon = highlightIcons[i % highlightIcons.length];
            return (
              <li key={item.title}>
                <Icon {...icon} className="accent-icon" />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                {i === 0 && <a className="work-current__demo-link" href="#live-grid">Try it below ↓</a>}
              </li>
            );
          })}
        </ul>
        <div>
          <LinkButton href={current.link.href} target="_blank" rel="noreferrer" icon={<ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />}>
            {current.link.label}
          </LinkButton>
        </div>
      </section>

      <section className="live-grid-section" id="live-grid" aria-labelledby="live-grid-title">
        <div className="section-head">
          <div>
            <h2 id="live-grid-title">See it under load</h2>
            <p>
              The pattern behind the live grids I build: each cell subscribes to its own value, so a price tick re-renders
              one cell instead of the table. Grow it to 10,000 rows, then switch to naive.
            </p>
          </div>
        </div>
        <LiveGrid />
      </section>

      <section className="work-earlier" aria-labelledby="work-earlier-title" data-home-domain-nav>
        <div className="section-head">
          <div>
            <h2 id="work-earlier-title">{homePage.workHeading}</h2>
            <p>{homePage.domainIntro}</p>
          </div>
          <LinkButton href="mailto:domstepek@gmail.com?subject=Portfolio%20passcode" icon={<Mail size={16} strokeWidth={1.75} aria-hidden="true" />}>
            Email for a passcode
          </LinkButton>
        </div>
        <ul className="work-cards">
          {domains.map((domain) => {
            const names = (domain.flagships ?? []).map((f) => f.title);
            return (
              <li key={domain.slug} className="surface work-card">
                <div className="work-card__top">
                  <Lock size={16} strokeWidth={1.75} aria-label="Passcode required" />
                  <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" className="work-card__arrow" />
                </div>
                <h3>
                  <Link className="stretched-link" data-home-domain-link href={domainPath(domain.slug)}>{domain.title}</Link>
                </h3>
                <p>{domain.summary}</p>
                <div className="badge-row">
                  {names.slice(0, 2).map((n) => <Badge key={n} pill>{n}</Badge>)}
                  {names.length > 2 && <Badge pill>+{names.length - 2}</Badge>}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
