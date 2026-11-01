import Link from 'next/link';
import { homePage } from '@/data/home';
import { domains } from '@/data/domains';
import { aboutPath, domainPath, notesPath, resumePath } from '@/lib/paths';
import { TerminalPanel } from '@/components/layout/TerminalPanel';

const isExternalHttpLink = (href: string) => href.startsWith('https://');

export function HomePage() {
  const homeDomains = domains.map((domain) => ({
    ...domain,
    href: domainPath(domain.slug),
  }));

  return (
    <div className="home-page" data-home-page data-route-visibility="public" data-gate-state="open">
      <section className="home-page__hero" data-home-hero>
        <div className="home-avatar-wrap">
          <img
            src={homePage.avatar}
            alt="dom"
            className="home-avatar"
            width={160}
            height={160}
          />
        </div>
        <p className="home-page__eyebrow">{homePage.eyebrow}</p>
        <h1>{homePage.title}</h1>
        <p className="home-page__lead">{homePage.lead}</p>
      </section>

      <TerminalPanel>
        <nav
          className="home-page__section home-page__domains"
          aria-labelledby="home-domain-nav-title"
          data-home-domain-nav
        >
          <div className="home-page__section-copy">
            <p className="home-page__label" aria-hidden="true">// case studies</p>
            <h2 id="home-domain-nav-title">Selected work</h2>
            <p className="home-page__domain-intro">{homePage.domainIntro}</p>
          </div>
          <ul className="home-page__domain-list">
            {homeDomains.map((domain, index) => (
              <li key={domain.slug} className="home-page__domain-item">
                <span className="home-page__domain-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="home-page__domain-body">
                  <Link className="home-page__domain-link" data-home-domain-link href={domain.href}>
                    {domain.title}
                  </Link>
                  <p className="home-page__domain-summary">{domain.summary}</p>
                </div>
                <span className="home-page__domain-arrow" aria-hidden="true">→</span>
              </li>
            ))}
          </ul>
        </nav>

        <section
          className="home-page__section home-page__personal"
          aria-labelledby="home-personal-title"
          data-home-personal-teaser
        >
          <div className="home-page__section-copy">
            <p className="home-page__label" aria-hidden="true">// about</p>
            <h2 id="home-personal-title">{homePage.personalTeaser.heading}</h2>
            <p>{homePage.personalTeaser.body}</p>
          </div>
          <div className="home-page__personal-links">
            <Link data-home-personal-link href={aboutPath}>
              {homePage.personalTeaser.aboutLabel}
            </Link>
            <Link data-home-resume-link href={resumePath}>
              {homePage.personalTeaser.resumeLabel}
            </Link>
            <Link data-home-notes-link href={notesPath}>
              {homePage.personalTeaser.notesLabel}
            </Link>
          </div>
        </section>

        <div className="home-page__meta">
          <section className="home-page__section home-page__contact" aria-labelledby="home-contact-title">
            <h2 id="home-contact-title">{homePage.contactHeading}</h2>
            <ul className="home-page__contact-list" data-home-contact-links>
              {homePage.contactLinks.map((link) => (
                <li key={link.key}>
                  {isExternalHttpLink(link.href) ? (
                    <a data-home-contact-link href={link.href} rel="noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <a data-home-contact-link href={link.href}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section
            className="home-page__section home-page__freshness"
            aria-labelledby="home-freshness-title"
          >
            <h2 id="home-freshness-title">{homePage.freshness.label}</h2>
            <p className="home-page__freshness-copy" data-home-freshness>
              {homePage.freshness.value}
              <span className="home-page__freshness-note"> {homePage.freshness.note}</span>
            </p>
          </section>
        </div>
      </TerminalPanel>
    </div>
  );
}
