import Link from 'next/link';
import { TerminalPanel } from '@/components/layout/TerminalPanel';

/**
 * Custom 404 page — renders inside the root layout.
 *
 * Next.js automatically invokes this component for unknown routes.
 * Keeps the retro terminal aesthetic with a minimal "not found" message.
 */
export default function NotFound() {
  return (
    <div data-not-found-page>
      <TerminalPanel>
        <h1>page not found</h1>
        <p>the route you requested does not exist.</p>
        <p>
          <Link href="/">return home</Link>
        </p>
      </TerminalPanel>
    </div>
  );
}
