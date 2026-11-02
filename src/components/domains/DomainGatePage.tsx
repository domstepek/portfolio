import type { DomainEntry } from '@/data/domains/types';
import { GateForm } from './GateForm';

interface DomainGatePageProps {
  slug: string;
  domain: DomainEntry;
}

/**
 * DomainGatePage — server component rendered for unauthenticated /domains/[slug] requests.
 *
 * Required DOM marker contract (D015, gate test contract):
 *   data-route-visibility="protected" — outer wrapper marking this as a protected route
 *   data-gate-state="locked"           — current auth state
 *   data-protected-gate                — gate section presence marker
 *   data-protected-proof-state="withheld" — proof content is withheld (not rendered)
 *
 * No proof content (flagships, supporting work) is rendered here.
 * GateForm handles passcode submission via server action.
 *
 * D036: Gate renders at same URL as proof page (no separate /gate?next= route).
 * D042: This component is a pure server component; GateForm handles client state.
 */
export function DomainGatePage({ slug, domain }: DomainGatePageProps) {
  return (
    <div
      data-route-visibility="protected"
      data-gate-state="locked"
    >
      <section
        data-protected-gate=""
        data-protected-proof-state="withheld"
        className="flex flex-col gap-6"
      >
        {/* Domain identity — visible to unauthenticated visitors */}
        <header className="flex flex-col gap-2">
          <h1 className="text-[var(--text)]">{domain.title}</h1>
          <p className="text-[var(--muted)] max-w-prose">{domain.thesis}</p>
        </header>

        <p className="text-[var(--muted)] max-w-prose text-sm">{domain.scope}</p>

        {/* Gate explanation */}
        <div className="border border-[var(--border)] bg-[var(--bg-elevated)] p-4 flex flex-col gap-2 max-w-prose">
          <p className="text-[var(--muted)] text-sm">
            This portfolio section is passcode-protected. If you received access credentials, enter them below.
            Otherwise, reach out to request access.
          </p>

          <div className="flex flex-col gap-1 mt-1 text-sm">
            <a
              href="mailto:domstepek@gmail.com"
              className="self-start"
            >
              Request access via email
            </a>
            <a
              href="https://linkedin.com/in/jean-dominique-stepek"
              className="self-start"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>

        <GateForm slug={slug} />
      </section>
    </div>
  );
}
