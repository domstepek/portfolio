'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArcProvider, type ArcLinkComponent } from '@/components/arc/lib/arc-provider';

// Arc renders navigation through next/link, so crumbs get client routing.
const NextArcLink: ArcLinkComponent = ({ href, ...props }) => <Link href={href} {...props} />;

export function Providers({ children }: { children: ReactNode }) {
  return <ArcProvider link={NextArcLink}>{children}</ArcProvider>;
}
