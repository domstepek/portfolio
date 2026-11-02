import { LinkButton } from '@/components/layout/LinkButton';

export default function NotFound() {
  return (
    <div className="page not-found" data-not-found-page>
      <header className="page-header">
        <p className="not-found__code">404</p>
        <h1>Page not found</h1>
        <p className="page-header__lead">That route doesn&apos;t exist. Press ⌘K to jump anywhere, or start over.</p>
      </header>
      <div>
        <LinkButton variant="primary" href="/">Return home</LinkButton>
      </div>
    </div>
  );
}
