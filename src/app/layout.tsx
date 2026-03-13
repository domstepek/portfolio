import type { Metadata } from 'next';
import Link from 'next/link';
import ShaderBackground from '@/components/shader/ShaderBackground';
import { siteConfig } from '@/data/site';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.defaultDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="site-shell">
        <ShaderBackground />
        <a className="skip-link" href="#main-content">skip to content</a>
        <header className="site-header">
          <div className="shell site-header__inner">
            <Link className="site-title" href="/">{siteConfig.name}</Link>
          </div>
        </header>
        <main id="main-content" className="site-main shell">
          {children}
        </main>
        <footer className="site-footer">
          <div className="shell site-footer__inner">
            <p>minimal shell for systems, products, and tooling.</p>
          </div>
        </footer>
        <div className="crt-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
