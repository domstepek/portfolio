import type { DomainEntry } from '@/data/domains/types';
import { buildDomainProofViewModel } from '@/data/domains/domain-view-model';
import { renderInlineMarkdown } from '@/lib/markdown';
import { ScreenshotGallery } from './ScreenshotGallery';
import { MermaidDiagram } from '@/components/diagrams/MermaidDiagram';
import { TerminalPanel } from '@/components/layout/TerminalPanel';

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
      className="domain-page"
      data-route-visibility="protected"
      data-protected-proof-state="revealed"
      data-visual-state="revealed"
    >
      <TerminalPanel path={`~/work/${domain.slug}`}>
      <header className="domain-page__header">
        <h1>{vm.title}</h1>
        <p className="domain-page__thesis">{vm.thesis}</p>
      </header>

      {/* Flagship highlights */}
      <section data-flagship-highlights="" className="domain-page__section">
        <h2>Main projects</h2>

        {vm.flagships.map((flagship) => (
          <article
            key={flagship.slug}
            data-flagship=""
            className="flagship"
          >
            <header className="flagship__header">
              <h3 className="flagship__title">{flagship.title}</h3>
              <p className="flagship__role">{flagship.role}</p>

              {flagship.stack.length > 0 && (
                <div className="flagship__stack">
                  {flagship.stack.map((tag) => (
                    <span
                      key={tag}
                      className="flagship__tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

            </header>

            <p className="flagship__summary">{flagship.summary}</p>

            {/* Problem statement */}
            {flagship.problem && (
              <div className="flagship__block">
                <h4 className="flagship__label">Problem</h4>
                <p className="flagship__text"><span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(flagship.problem) }} /></p>
              </div>
            )}

            {/* Constraints */}
            {flagship.constraints.length > 0 && (
              <div className="flagship__block">
                <h4 className="flagship__label">Constraints</h4>
                <ul className="flagship-list">
                  {flagship.constraints.map((constraint, i) => (
                    <li key={i}>
                      <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(constraint) }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Decisions */}
            {flagship.decisions.length > 0 && (
              <div className="flagship__block">
                <h4 className="flagship__label">Decisions</h4>
                <ul className="flagship-list">
                  {flagship.decisions.map((decision, i) => (
                    <li key={i}>
                      <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(decision) }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {flagship.outcomes.length > 0 && (
              <div className="flagship__block">
                <h4 className="flagship__label">Outcomes</h4>
                <ul className="flagship-list">
                  {flagship.outcomes.map((outcome, i) => (
                    <li key={i}>
                      <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(outcome) }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {flagship.proofLinks.length > 0 && (
              <div className="flagship__links">
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
        <section className="domain-page__section">
          <h2>Also worked on</h2>

          <ul data-supporting-work="" className="supporting">
            {vm.supportingItems.map((item, i) => (
              <li
                key={i}
                data-supporting-item=""
                className="supporting__item"
              >
                <p className="supporting__title">{item.title}</p>
                <p className="supporting__context"><span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.context) }} /></p>

                {item.proofLinks.length > 0 && (
                  <div className="supporting__links">
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
        <section className="domain-page__related">
          <h2>More case studies</h2>
          <div className="domain-page__related-links">
            {vm.relatedDomains.map((related) => (
              <a key={related.slug} href={related.href} className="text-sm">
                {related.title}
              </a>
            ))}
          </div>
        </section>
      )}
      </TerminalPanel>
    </div>
  );
}
