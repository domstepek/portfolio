import type { DomainEntry } from '@/data/domains/types';
import { buildDomainProofViewModel } from '@/data/domains/domain-view-model';
import { ScreenshotGallery } from './ScreenshotGallery';
import { MermaidDiagram } from '@/components/diagrams/MermaidDiagram';

interface DomainProofPageProps {
  domain: DomainEntry;
}

/**
 * DomainProofPage — server component rendered for authenticated /domains/[slug] requests.
 *
 * Required DOM marker contract (M002/D015, gate test contract):
 *   data-route-visibility="protected"        — outer wrapper, marks protected route
 *   data-protected-proof-state="revealed"    — proof content is revealed (authenticated)
 *   data-visual-state="revealed"             — backward compat signal (D020, superseded by D033/D035)
 *   data-flagship-highlights                 — flagship section container
 *   data-flagship                            — each flagship article
 *   data-supporting-work                     — supporting work list
 *   data-supporting-item                     — each supporting item
 *
 * Client islands:
 *   <ScreenshotGallery> — 'use client', renders carousel + initializes JS
 *   <MermaidDiagram>     — 'use client', dynamically imports mermaid + renders SVG
 *
 * No 'use client' on this file — pure RSC. Client components are imported as islands.
 * D033: Gate + proof render at same URL; auth check in parent page.tsx.
 * D035: Server-render model supersedes M002 blur animation (no animation here).
 */
export function DomainProofPage({ domain }: DomainProofPageProps) {
  const vm = buildDomainProofViewModel(
    domain,
    (p) => p,
    (slug) => `/domains/${slug}/`,
  );

  return (
    <div
      data-route-visibility="protected"
      data-protected-proof-state="revealed"
      data-visual-state="revealed"
    >
      {/* Domain header */}
      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-[var(--text)]">{vm.title}</h1>
        <p className="text-[var(--muted)] max-w-prose">{vm.thesis}</p>
      </header>

      {/* Flagship highlights */}
      <section data-flagship-highlights="" className="flex flex-col gap-8 mb-10">
        <h2 className="text-[var(--text)]">Flagship work</h2>

        {vm.flagships.map((flagship) => (
          <article
            key={flagship.slug}
            data-flagship=""
            className="border border-[var(--border)] bg-[var(--bg-elevated)] p-6 flex flex-col gap-4"
          >
            <header className="flex flex-col gap-1">
              <h3 className="text-[var(--text)] text-[var(--step-1)]">{flagship.title}</h3>
              <p className="text-[var(--muted)] text-sm">{flagship.role}</p>
            </header>

            <p className="text-[var(--muted)] max-w-prose text-sm">{flagship.summary}</p>

            {/* Problem statement */}
            {flagship.problem && (
              <div className="flex flex-col gap-1">
                <p className="text-[var(--text)] text-xs uppercase tracking-wider">Problem</p>
                <p className="text-[var(--muted)] max-w-prose text-sm">{flagship.problem}</p>
              </div>
            )}

            {/* Constraints */}
            {flagship.constraints.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-[var(--text)] text-xs uppercase tracking-wider">Constraints</p>
                <ul className="flex flex-col gap-1 pl-4">
                  {flagship.constraints.map((constraint, i) => (
                    <li key={i} className="text-[var(--muted)] text-sm">
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Decisions */}
            {flagship.decisions.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-[var(--text)] text-xs uppercase tracking-wider">Decisions</p>
                <ul className="flex flex-col gap-1 pl-4">
                  {flagship.decisions.map((decision, i) => (
                    <li key={i} className="text-[var(--muted)] text-sm">
                      {decision}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {flagship.outcomes.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-[var(--text)] text-xs uppercase tracking-wider">Outcomes</p>
                <ul className="flex flex-col gap-1 pl-4">
                  {flagship.outcomes.map((outcome, i) => (
                    <li key={i} className="text-[var(--muted)] text-sm">
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {flagship.stack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {flagship.stack.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {flagship.proofLinks.length > 0 && (
              <div className="flex gap-4 mt-1">
                {flagship.proofLinks.map((link) => (
                  <a key={link.href} href={link.href} className="text-sm">
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {/* Visual: Mermaid diagram or static image */}
            {flagship.visual?.mermaid && (
              <MermaidDiagram
                definition={flagship.visual.mermaid}
                alt={flagship.visual.alt}
                caption={flagship.visual.caption}
              />
            )}
            {flagship.visual && !flagship.visual.mermaid && flagship.visual.src && (
              <figure className="flagship__figure" data-flagship-visual>
                <img
                  className="flagship__image"
                  src={flagship.visual.src}
                  alt={flagship.visual.alt}
                  loading="lazy"
                  decoding="async"
                />
                {flagship.visual.caption && (
                  <figcaption className="flagship__caption">
                    {flagship.visual.caption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Screenshot gallery */}
            {flagship.screenshots.length > 0 && (
              <ScreenshotGallery screenshots={flagship.screenshots} />
            )}
          </article>
        ))}
      </section>

      {/* Supporting work */}
      {vm.supportingItems.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-[var(--text)]">Supporting work</h2>

          <ul data-supporting-work="" className="flex flex-col gap-4 list-none pl-0">
            {vm.supportingItems.map((item, i) => (
              <li
                key={i}
                data-supporting-item=""
                className="border border-[var(--border)] bg-[var(--bg-elevated)] p-4 flex flex-col gap-2"
              >
                <p className="text-[var(--text)] font-semibold text-sm">{item.title}</p>
                <p className="text-[var(--muted)] text-sm">{item.context}</p>

                {item.proofLinks.length > 0 && (
                  <div className="flex gap-4">
                    {item.proofLinks.map((link) => (
                      <a key={link.href} href={link.href} className="text-sm">
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related domains */}
      {vm.relatedDomains.length > 0 && (
        <section className="mt-8 flex flex-col gap-2">
          <p className="text-[var(--muted)] text-sm">Related domains:</p>
          <div className="flex gap-4">
            {vm.relatedDomains.map((related) => (
              <a key={related.slug} href={related.href} className="text-sm">
                {related.title}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
