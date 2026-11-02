'use client';

import { useEffect, useRef } from 'react';

interface MermaidDiagramProps {
  definition: string;
  alt: string;
  caption?: string;
}

/** Guard: mermaid.initialize() should only be called once globally. */
let mermaidInitialized = false;

/**
 * MermaidDiagram — client component that renders a Mermaid definition as SVG.
 *
 * Dynamic import of 'mermaid' inside useEffect avoids SSR crash (mermaid
 * accesses `window`/`document` at module scope). The initialize() call is
 * guarded with a module-level flag so it only runs once even if multiple
 * instances mount.
 *
 * Observability:
 *   - data-mermaid-definition on container — presence selector, contains raw definition
 *   - Rendered SVG replaces <pre> content — check `[data-mermaid-definition] svg`
 *   - Failure: raw definition text visible in <pre> instead of SVG
 */
export function MermaidDiagram({ definition, alt, caption }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    import('mermaid').then(({ default: mermaid }) => {
      if (cancelled || !containerRef.current) return;

      if (!mermaidInitialized) {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            darkMode: true,
            background: '#141414',
            primaryColor: '#2a2a2a',
            primaryTextColor: '#e0e0e0',
            primaryBorderColor: '#6fba7f',
            lineColor: '#8a8a8a',
            secondaryColor: '#1a1a1a',
            tertiaryColor: '#0a0a0a',
            nodeTextColor: '#e0e0e0',
            mainBkg: '#1a1a1a',
            nodeBorder: '#6fba7f',
            clusterBkg: '#141414',
            clusterBorder: '#2a2a2a',
            titleColor: '#e0e0e0',
            edgeLabelBackground: '#141414',
            fontFamily:
              '"Space Mono", ui-monospace, "SFMono-Regular", "SF Mono", Consolas, monospace',
          },
        });
        mermaidInitialized = true;
      }

      // Scope run to this specific container (not global .mermaid selector)
      mermaid.run({ nodes: containerRef.current.querySelectorAll('.mermaid') });
    });

    return () => {
      cancelled = true;
    };
  }, [definition]);

  return (
    <figure className="flagship__figure mermaid-figure" data-flagship-visual>
      <div
        className="mermaid-diagram"
        data-mermaid-definition={definition}
        role="img"
        aria-label={alt}
        ref={containerRef}
      >
        <pre className="mermaid">{definition}</pre>
      </div>
      {caption && <figcaption className="flagship__caption">{caption}</figcaption>}
    </figure>
  );
}
