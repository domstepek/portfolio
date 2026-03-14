'use client';

import { useEffect } from 'react';

let mermaidInitialized = false;

/**
 * MermaidRunner — side-effect client component for note pages.
 *
 * Scans the note body for `.mermaid` pre elements (emitted by the
 * rehypeMermaidBlocks pipeline plugin) and renders them as SVG via the
 * mermaid library. Mirrors the theme config from MermaidDiagram.tsx.
 *
 * Observability:
 *   - `.mermaid-block svg` presence in DOM confirms successful render
 *   - Failure: raw definition text visible inside `.mermaid` pre
 */
export function MermaidRunner() {
  useEffect(() => {
    import('mermaid').then(({ default: mermaid }) => {
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
            fontFamily: '"Space Mono", ui-monospace, "SFMono-Regular", "SF Mono", Consolas, monospace',
          },
        });
        mermaidInitialized = true;
      }
      mermaid.run({ querySelector: '.note-page__body .mermaid' });
    });
  }, []);

  return null;
}
