/**
 * Everything the command palette can do. Plain data (no React), so server
 * components can build the list and pass it to the client palette.
 */
import { domains } from './domains';
import { resumePage } from './resume';
import { aboutPath, assetPath, domainPath, homePath, notePath, notesPath, resumePath, workPath } from '@/lib/paths';

export type CommandIcon =
  | 'home' | 'work' | 'about' | 'resume' | 'notes' | 'lock' | 'note'
  | 'copy' | 'copied' | 'github' | 'linkedin' | 'download' | 'demo';

export type CommandAction =
  | { type: 'href'; href: string }
  | { type: 'external'; href: string }
  | { type: 'copy'; value: string }
  | { type: 'download'; href: string };

export interface SiteCommand {
  id: string;
  label: string;
  description?: string;
  group: string;
  keywords?: string[];
  icon: CommandIcon;
  action: CommandAction;
  /** Single key. Works anywhere outside a text field; hold Alt/Option while typing. */
  shortcut?: string;
}

export interface CommandNote {
  slug: string;
  title: string;
  published: string; // ISO
  tags: string[];
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));

export function buildCommands(notes: CommandNote[]): SiteCommand[] {
  const go: SiteCommand[] = [
    { id: 'go-home', shortcut: 'H', label: '/home', description: 'Back to the start', group: 'Go to', icon: 'home', keywords: ['start', 'index'], action: { type: 'href', href: homePath } },
    { id: 'go-work', shortcut: 'W', label: '/work', description: 'Case studies and current work', group: 'Go to', icon: 'work', keywords: ['projects', 'portfolio', 'godel', 'case studies'], action: { type: 'href', href: workPath } },
    { id: 'go-demo', shortcut: 'D', label: '/demo', description: 'Live grid: up to 160,000 updates a second', group: 'Go to', icon: 'demo', keywords: ['performance', 'legend state', 'grid', 'worker', 'live'], action: { type: 'href', href: `${workPath}#live-grid` } },
    { id: 'go-about', shortcut: 'A', label: '/about', description: "How I work and what I'm looking for", group: 'Go to', icon: 'about', keywords: ['me', 'bio', 'roles'], action: { type: 'href', href: aboutPath } },
    { id: 'go-resume', shortcut: 'R', label: '/resume', description: 'Experience, skills, and a PDF', group: 'Go to', icon: 'resume', keywords: ['cv', 'experience', 'skills'], action: { type: 'href', href: resumePath } },
    { id: 'go-notes', shortcut: 'N', label: '/notes', description: 'Field notes from building things', group: 'Go to', icon: 'notes', keywords: ['blog', 'writing', 'journal'], action: { type: 'href', href: notesPath } },
  ];

  const caseStudies: SiteCommand[] = domains.map((domain) => ({
    id: `case-${domain.slug}`,
    label: domain.title,
    description: 'Passcode required',
    group: 'Case studies',
    icon: 'lock',
    keywords: [domain.slug, ...(domain.flagships ?? []).map((f) => f.title)],
    action: { type: 'href', href: domainPath(domain.slug) },
  }));

  const noteCommands: SiteCommand[] = notes.map((note) => ({
    id: `note-${note.slug}`,
    label: note.title,
    description: formatDate(note.published),
    group: 'Notes',
    icon: 'note',
    keywords: note.tags,
    action: { type: 'href', href: notePath(note.slug) },
  }));

  const contact: SiteCommand[] = [
    { id: 'copy-email', shortcut: 'C', label: 'Copy email', description: resumePage.contact.email, group: 'Contact', icon: 'copy', keywords: ['mail', 'contact'], action: { type: 'copy', value: resumePage.contact.email } },
    { id: 'download-resume', shortcut: 'P', label: 'Download resume PDF', description: 'One page', group: 'Contact', icon: 'download', keywords: ['cv', 'pdf'], action: { type: 'download', href: assetPath('Jean-Dominique-Stepek-Resume.pdf') } },
    { id: 'github', shortcut: 'G', label: 'GitHub', description: resumePage.contact.github, group: 'Contact', icon: 'github', keywords: ['code', 'repos'], action: { type: 'external', href: `https://${resumePage.contact.github}` } },
    { id: 'linkedin', shortcut: 'L', label: 'LinkedIn', description: 'in/jean-dominique-stepek', group: 'Contact', icon: 'linkedin', keywords: ['contact'], action: { type: 'external', href: `https://${resumePage.contact.linkedin}` } },
  ];

  return [...go, ...caseStudies, ...noteCommands, ...contact];
}
