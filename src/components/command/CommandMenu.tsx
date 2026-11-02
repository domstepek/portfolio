'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { CommandPalette, type CommandItem } from '@/components/arc/command-palette/command-palette';
import { Dialog, DialogContent } from '@/components/arc/dialog/dialog';
import { BottomSheet } from '@/components/arc/bottom-sheet/bottom-sheet';
import type { SiteCommand } from '@/data/commands';
import { navigateWithTransition } from '@/lib/motion/navigate';
import { commandIcon } from './icons';

const OPEN_EVENT = 'portfolio:open-palette';
const COPIED_MS = 1900;

/** Pulse origin for the shader: the highlighted row, else the screen center. */
function activeRowOrigin() {
  const row = document.querySelector('[role="option"][aria-selected="true"]');
  const box = row?.getBoundingClientRect();
  if (!box) return { x: 0.5, y: 0.4 };
  return { x: (box.left + box.width / 2) / window.innerWidth, y: (box.top + box.height / 2) / window.innerHeight };
}

/** Maps site commands to palette items and runs them. */
function useCommands(commands: SiteCommand[], onNavigate?: () => void) {
  const router = useRouter();
  const pathname = usePathname();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const items: CommandItem[] = useMemo(
    () =>
      commands
        // Don't offer the page you're already on.
        .filter((c) => !(c.action.type === 'href' && c.action.href === pathname))
        .map((c) => {
          const copied = c.id === copiedId;
          return {
            id: c.id,
            label: copied ? 'Copied' : c.label,
            description: c.description,
            group: c.group,
            keywords: c.keywords,
            icon: commandIcon(copied ? 'copied' : c.icon),
          };
        }),
    [commands, copiedId, pathname],
  );

  const run = useCallback(
    (item: CommandItem) => {
      const command = commands.find((c) => c.id === item.id);
      if (!command) return;
      const { action } = command;
      switch (action.type) {
        case 'href':
          onNavigate?.();
          navigateWithTransition(router, action.href, activeRowOrigin());
          break;
        case 'external':
          window.open(action.href, '_blank', 'noopener,noreferrer');
          break;
        case 'download': {
          const a = document.createElement('a');
          a.href = action.href;
          a.download = '';
          a.click();
          break;
        }
        case 'copy':
          void navigator.clipboard?.writeText(action.value).then(() => {
            setCopiedId(command.id);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setCopiedId(null), COPIED_MS);
          });
          break;
      }
    },
    [commands, onNavigate, router],
  );

  return { items, run };
}

/** The inline palette on the homepage. */
export function HomePalette({ commands }: { commands: SiteCommand[] }) {
  const { items, run } = useCommands(commands);
  const wrap = useRef<HTMLDivElement>(null);

  // Ready to type on desktop; on phones, don't pop the keyboard on load.
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) {
      wrap.current?.querySelector('input')?.focus({ preventScroll: true });
    }
  }, []);

  return (
    <div ref={wrap} className="home-palette" data-home-palette>
      <CommandPalette
        items={items}
        onSelect={run}
        label="Go to a page, case study, or note"
        placeholder="Type / for commands, or search the site"
      />
    </div>
  );
}

function useIsPhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return phone;
}

/** ⌘K anywhere but the homepage: a dialog on desktop, a bottom sheet on phones. */
export function CommandMenu({ commands }: { commands: SiteCommand[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const phone = useIsPhone();
  const close = useCallback(() => setOpen(false), []);
  const { items, run } = useCommands(commands, close);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
      if (window.location.pathname === '/') return; // the inline palette handles it
      event.preventDefault();
      setOpen((value) => !value);
    };
    const onOpen = () => setOpen(true);
    document.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  const palette = (
    <CommandPalette
      items={items}
      onSelect={run}
      onClose={close}
      autoFocus={!phone}
      label="Jump to a page, case study, or note"
      placeholder="Jump to a page, case study, or note"
    />
  );

  if (phone) {
    return (
      <BottomSheet open={open} onOpenChange={setOpen} title="Jump to" detents={[0.72, 0.94]}>
        {palette}
      </BottomSheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent title="Jump to" className="command-dialog">
        {palette}
      </DialogContent>
    </Dialog>
  );
}

/** Header trigger. On the homepage it focuses the inline palette instead. */
export function JumpButton() {
  const [mod, setMod] = useState('⌘');
  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setMod('Ctrl');
  }, []);

  const onClick = () => {
    const inline = document.querySelector<HTMLInputElement>('[data-home-palette] input');
    if (inline) {
      inline.focus();
      inline.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    window.dispatchEvent(new Event(OPEN_EVENT));
  };

  return (
    <button type="button" className="jump-button" onClick={onClick} aria-label="Jump to a page">
      <Search size={16} strokeWidth={1.75} aria-hidden="true" />
      <span className="jump-button__label">Jump to</span>
      <kbd className="kbd jump-button__kbd">{mod} K</kbd>
    </button>
  );
}
