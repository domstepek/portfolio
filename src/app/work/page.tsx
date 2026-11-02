import type { Metadata } from 'next';
import { WorkPage } from '@/components/work/WorkPage';

export const metadata: Metadata = {
  title: 'Work',
  description: 'What Dom is building at Godel Terminal, and case studies from Tapestry and Charla.',
  alternates: { canonical: '/work/' },
};

export default function Work() {
  return <WorkPage />;
}
