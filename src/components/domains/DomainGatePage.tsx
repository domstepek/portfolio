import { Lock } from 'lucide-react';
import { Breadcrumb } from '@/components/arc/breadcrumb/breadcrumb';
import { Badge } from '@/components/arc/badge/badge';
import type { DomainEntry } from '@/data/domains/types';
import { workPath } from '@/lib/paths';
import { GateForm } from './GateForm';

interface DomainGatePageProps {
  slug: string;
  domain: DomainEntry;
}

export function DomainGatePage({ slug, domain }: DomainGatePageProps) {
  return (
    <div className="page domain-page" data-route-visibility="protected" data-gate-state="locked">
      <Breadcrumb items={[{ label: 'Work', href: workPath }, { label: domain.title }]} />
      <section data-protected-gate="" data-protected-proof-state="withheld" className="gate">
        <header className="page-header">
          <h1>{domain.title}</h1>
          <p className="page-header__lead">{domain.thesis}</p>
        </header>

        <div className="surface gate__card">
          <div className="gate__copy">
            <h2><Lock size={16} strokeWidth={1.75} aria-hidden="true" /> These case studies need a passcode</h2>
            <p>If I sent you one, enter it below. If not, I&apos;ll send it over.</p>
          </div>
          <GateForm slug={slug} />
        </div>

        <div className="gate__inside">
          <h2>Inside</h2>
          <div className="badge-row">
            {(domain.flagships ?? []).map((f) => <Badge key={f.slug} pill>{f.title}</Badge>)}
          </div>
        </div>
      </section>
    </div>
  );
}
