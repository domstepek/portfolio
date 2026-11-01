import type { DomainEntry } from '@/data/domains/types';
import { TerminalPanel } from '@/components/layout/TerminalPanel';
import { GateForm } from './GateForm';

interface DomainGatePageProps {
  slug: string;
  domain: DomainEntry;
}

/**
 * DomainGatePage — server component rendered for unauthenticated /domains/[slug] requests.
 *
 * Required DOM marker contract (D015, gate test contract):
 *   data-route-visibility="protected", data-gate-state="locked",
 *   data-protected-gate, data-protected-proof-state="withheld"
 *
 * No proof content (flagships, supporting work) is rendered here.
 */
export function DomainGatePage({ slug, domain }: DomainGatePageProps) {
  return (
    <div className="domain-page" data-route-visibility="protected" data-gate-state="locked">
      <TerminalPanel path={`~/work/${slug}`}>
        <section data-protected-gate="" data-protected-proof-state="withheld" className="gate">
          <header className="domain-page__header">
            <h1>{domain.title}</h1>
            <p className="domain-page__thesis">{domain.thesis}</p>
            <p className="domain-page__scope">{domain.scope}</p>
          </header>

          <div className="gate__box">
            <div className="gate__copy">
              <h2>These case studies need a passcode</h2>
              <p>If I sent you one, enter it below. If not, email me and I&apos;ll send it over.</p>
              <p className="gate__links">
                <a href="mailto:domstepek@gmail.com?subject=Portfolio%20passcode">Email for a passcode</a>
                <a href="https://linkedin.com/in/jean-dominique-stepek" rel="noreferrer">Message me on LinkedIn</a>
              </p>
            </div>
            <GateForm slug={slug} />
          </div>
        </section>
      </TerminalPanel>
    </div>
  );
}
