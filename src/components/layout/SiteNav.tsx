'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { aboutPath, notesPath, resumePath, workPath } from '@/lib/paths';

const links = [
  { href: workPath, label: 'work', match: ['/work', '/domains'] },
  { href: aboutPath, label: 'about', match: ['/about'] },
  { href: notesPath, label: 'notes', match: ['/notes'] },
  { href: resumePath, label: 'resume', match: ['/resume'] },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="site-nav" aria-label="Primary">
      {links.map((link) => {
        const active = link.match.some((m) => pathname.startsWith(m));
        return (
          <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
