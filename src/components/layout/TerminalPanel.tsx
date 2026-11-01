/**
 * TerminalPanel — server component
 *
 * Terminal-window chrome. The title shows the shell path for the current page,
 * which is the page's one structural label.
 */
export function TerminalPanel({
  children,
  path = '~',
}: {
  children: React.ReactNode;
  path?: string;
}) {
  return (
    <div className="terminal-panel">
      <div className="terminal-panel__bar" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <code className="terminal-panel__title">dom@portfolio: {path}</code>
      </div>
      <div className="terminal-panel__body">
        {children}
      </div>
    </div>
  );
}
