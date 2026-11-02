import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { DomainEntry } from '@/data/domains/types';
import { buildDomainProofViewModel } from '@/data/domains/domain-view-model';
import { renderInlineMarkdown } from '@/lib/markdown';
import { workPath } from '@/lib/paths';
import { Breadcrumb } from '@/components/arc/breadcrumb/breadcrumb';
import { Badge } from '@/components/arc/badge/badge';
import { Accordion, type AccordionItem } from '@/components/arc/accordion/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/arc/tabs/tabs';
import { ScreenshotGallery } from './ScreenshotGallery';
import { MermaidDiagram } from '@/components/diagrams/MermaidDiagram';

interface DomainProofPageProps {
  domain: DomainEntry;
}

const Md = ({ text }: { text: string }) => <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(text) }} />;

const MdList = ({ items }: { items: string[] }) => (
  <ul className="bullet-list">
    {items.map((item, i) => <li key={i}><Md text={item} /></li>)}
  </ul>
);

/**
 * DomainProofPage — server component rendered for authenticated /domains/[slug] requests.
 * One tab per flagship project (Arc tabs); the story folds into an Arc accordion.
 *
 * Required DOM marker contract (M002/D015, gate test contract):
 *   data-route-visibility="protected", data-protected-proof-state="revealed",
 *   data-visual-state="revealed", data-flagship-highlights, data-flagship,
 *   data-supporting-work, data-supporting-item
 *
 * The first tab is open by default, and each domain's first flagship carries
 * the gallery and diagram the tests look for.
 */
export function DomainProofPage({ domain }: DomainProofPageProps) {
  const vm = buildDomainProofViewModel(domain, (p) => p, (slug) => `/domains/${slug}/`);

  return (
    <div
      className="page domain-page"
      data-route-visibility="protected"
      data-protected-proof-state="revealed"
      data-visual-state="revealed"
    >
      <Breadcrumb items={[{ label: 'Work', href: workPath }, { label: vm.title }]} />

      <header className="page-header">
        <h1>{vm.title}</h1>
        <p className="page-header__lead">{vm.thesis}</p>
      </header>

      <section data-flagship-highlights="" className="case-study" aria-label="Main projects">
        <Tabs defaultValue={vm.flagships[0]?.slug}>
          <TabsList aria-label="Projects">
            {vm.flagships.map((f) => (
              <TabsTrigger key={f.slug} value={f.slug}>{f.title}</TabsTrigger>
            ))}
          </TabsList>

          {vm.flagships.map((flagship) => {
            const story: AccordionItem[] = [];
            if (flagship.problem) story.push({ title: 'Problem', content: <p><Md text={flagship.problem} /></p> });
            if (flagship.constraints.length) story.push({ title: 'Constraints', content: <MdList items={flagship.constraints} /> });
            if (flagship.decisions.length) story.push({ title: 'Decisions', content: <MdList items={flagship.decisions} /> });
            if (flagship.outcomes.length) story.push({ title: 'Outcomes', content: <MdList items={flagship.outcomes} /> });

            return (
              <TabsContent key={flagship.slug} value={flagship.slug}>
                <article data-flagship="" className="flagship">
                  <div className="flagship__story">
                    <p className="flagship__summary">{flagship.summary}</p>
                    <div className="flagship__role">
                      <h3>My role</h3>
                      <p>{flagship.role}</p>
                    </div>
                    {flagship.stack.length > 0 && (
                      <div className="badge-row" aria-label="Stack">
                        {flagship.stack.map((tag) => <Badge key={tag} pill>{tag}</Badge>)}
                      </div>
                    )}
                    {story.length > 0 && <div className="surface flagship__accordion"><Accordion items={story} /></div>}
                    {flagship.proofLinks.length > 0 && (
                      <p className="flagship__links">
                        {flagship.proofLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
                      </p>
                    )}
                  </div>

                  <div className="flagship__media">
                    {flagship.screenshots.length > 0 && <ScreenshotGallery screenshots={flagship.screenshots} />}
                    {flagship.visual?.mermaid && (
                      <MermaidDiagram definition={flagship.visual.mermaid} alt={flagship.visual.alt} caption={flagship.visual.caption} />
                    )}
                    {flagship.visual && !flagship.visual.mermaid && flagship.visual.src && (
                      <figure className="flagship__figure" data-flagship-visual>
                        <img className="flagship__image" src={flagship.visual.src} alt={flagship.visual.alt} loading="lazy" decoding="async" />
                        {flagship.visual.caption && <figcaption className="flagship__caption">{flagship.visual.caption}</figcaption>}
                      </figure>
                    )}
                  </div>
                </article>
              </TabsContent>
            );
          })}
        </Tabs>
      </section>

      {vm.supportingItems.length > 0 && (
        <section className="page-section" aria-labelledby="supporting-title">
          <h2 id="supporting-title">Also worked on</h2>
          <ul data-supporting-work="" className="surface list-group supporting">
            {vm.supportingItems.map((item, i) => (
              <li key={i} data-supporting-item="" className="supporting__item">
                <h3>{item.title}</h3>
                <p><Md text={item.context} /></p>
                {item.proofLinks.length > 0 && (
                  <p className="supporting__links">
                    {item.proofLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {vm.relatedDomains.length > 0 && (
        <section className="page-section" aria-labelledby="related-title">
          <h2 id="related-title" className="muted-heading">More case studies</h2>
          <ul className="related-links">
            {vm.relatedDomains.map((related) => (
              <li key={related.slug} className="surface related-link">
                <Link className="stretched-link" href={related.href}>{related.title}</Link>
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
