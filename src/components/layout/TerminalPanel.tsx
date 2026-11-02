/**
 * TerminalPanel — server component
 *
 * Green-tinted dark panel with macOS traffic-light dots.
 * Wraps page content for readability over the dithered shader background.
 * Direct port of TerminalPanel.astro.
 */
export function TerminalPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="terminal-panel">
      <div className="terminal-panel__bar" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="terminal-panel__body">
        {children}
      </div>
    </div>
  );
}
