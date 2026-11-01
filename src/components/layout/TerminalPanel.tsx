import { TerminalTitle } from './TerminalTitle';

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
        <TerminalTitle path={path} />
      </div>
      <div className="terminal-panel__body">
        {children}
      </div>
    </div>
  );
}
