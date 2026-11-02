'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Search } from 'lucide-react';
import { CommandPalette, type CommandItem } from '@/components/arc/command-palette/command-palette';
import { BottomSheet } from '@/components/arc/bottom-sheet/bottom-sheet';
import type { SiteCommand } from '@/data/commands';
import { navigateWithTransition } from '@/lib/motion/navigate';
import { commandIcon } from './icons';

const OPEN_EVENT = 'portfolio:open-palette';
const COPIED_EVENT = 'portfolio:copied';
const COPIED_MS = 1900;

/** Pulse origin for the shader: the highlighted row, else the screen center. */
function activeRowOrigin() {
  const row = document.querySelector('[role="option"][aria-selected="true"]');
  const box = row?.getBoundingClientRect();
  if (!box) return { x: 0.5, y: 0.4 };
  return { x: (box.left + box.width / 2) / window.innerWidth, y: (box.top + box.height / 2) / window.innerHeight };
}

const isEditable = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

/** The letter a key press stands for, from the physical key (Option+W on a Mac yields "∑", not "w"). */
const letterOf = (event: KeyboardEvent) => (/^Key[A-Z]$/.test(event.code) ? event.code.slice(3) : null);

function useModifierLabel() {
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);
  return mac ? { mod: '⌘', alt: '⌥' } : { mod: 'Ctrl', alt: 'Alt' };
}

/** Maps site commands to palette items and runs them. */
function useCommands(commands: SiteCommand[], onNavigate?: () => void) {
  const router = useRouter();
  const pathname = usePathname();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    const onCopied = (e: Event) => {
      setCopiedId((e as CustomEvent<string>).detail);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopiedId(null), COPIED_MS);
    };
    window.addEventListener(COPIED_EVENT, onCopied);
    return () => window.removeEventListener(COPIED_EVENT, onCopied);
  }, []);

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
            shortcut: c.shortcut,
            mono: c.label.startsWith('/'),
          };
        }),
    [commands, copiedId, pathname],
  );

  const runCommand = useCallback(
    (command: SiteCommand) => {
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
            window.dispatchEvent(new CustomEvent(COPIED_EVENT, { detail: command.id }));
          });
          break;
      }
    },
    [onNavigate, router],
  );

  const run = useCallback(
    (item: CommandItem) => {
      const command = commands.find((c) => c.id === item.id);
      if (command) runCommand(command);
    },
    [commands, runCommand],
  );

  return { items, run, runCommand };
}

/** The inline palette on the homepage. */
export function HomePalette({ commands }: { commands: SiteCommand[] }) {
  const { items, run } = useCommands(commands);
  const wrap = useRef<HTMLDivElement>(null);
  const { alt } = useModifierLabel();

  // Not focused on load, so single-key shortcuts work. Any other printable
  // key (or "/") focuses the search, and that keystroke lands in it.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditable(event.target) || document.querySelector('[role="dialog"]')) return;
      const input = wrap.current?.querySelector('input');
      if (!input) return;
      if (event.key.length === 1 || event.key === 'ArrowDown' || event.key === 'ArrowUp') input.focus({ preventScroll: true });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="home-palette" data-home-palette>
      <div ref={wrap}>
        <CommandPalette
          items={items}
          onSelect={run}
          label="Go to a page, case study, or note"
          placeholder="Type / for commands, or search the site"
        />
      </div>
      <p className="home-palette__hint">
        Press a key to jump from anywhere on the site. While typing, hold <kbd className="kbd">{alt}</kbd>.
      </p>
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

/**
 * ⌘K anywhere but the homepage: the palette on its own over a dimmed page
 * (a bottom sheet on phones). Also owns the site-wide single-key shortcuts.
 */
export function CommandMenu({ commands }: { commands: SiteCommand[] }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const pathname = usePathname();
  const phone = useIsPhone();
  const reduced = useReducedMotion();
  const close = useCallback(() => setOpen(false), []);
  const { items, run, runCommand } = useCommands(commands, close);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ⌘K, and the open event from the header button.
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

  // Single-key shortcuts. Outside text fields a plain key works; inside one
  // (including the palette's search) hold Alt/Option so typing still types.
  useEffect(() => {
    const byKey = new Map(commands.filter((c) => c.shortcut).map((c) => [c.shortcut!, c]));
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const letter = letterOf(event);
      const command = letter && byKey.get(letter);
      if (!command) return;
      const editing = isEditable(event.target);
      if (editing !== event.altKey) return;
      if (command.action.type === 'href' && command.action.href === window.location.pathname) return;
      event.preventDefault();
      runCommand(command);
      if (command.action.type === 'copy') setToast(`Copied ${command.action.value}`);
      if (command.action.type === 'download') setToast('Downloading resume PDF');
    };
    document.addEventListener('keydown', onKey, { capture: true });
    return () => document.removeEventListener('keydown', onKey, { capture: true });
  }, [commands, runCommand]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), COPIED_MS);
    return () => window.clearTimeout(id);
  }, [toast]);

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

  const fade = { duration: reduced ? 0 : 0.16 };

  return (
    <>
      {phone ? (
        <BottomSheet open={open} onOpenChange={setOpen} title="Jump to" detents={[0.72, 0.94]} className="command-sheet">
          {palette}
        </BottomSheet>
      ) : (
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
          <AnimatePresence>
            {open && (
              <DialogPrimitive.Portal forceMount>
                <DialogPrimitive.Overlay asChild forceMount>
                  <motion.div className="command-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade} />
                </DialogPrimitive.Overlay>
                <DialogPrimitive.Content
                  asChild
                  forceMount
                  aria-describedby={undefined}
                  onOpenAutoFocus={(event) => event.preventDefault()} // the palette focuses its own search
                >
                  <motion.div className="command-dialog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade}>
                    <DialogPrimitive.Title className="visually-hidden">Jump to a page</DialogPrimitive.Title>
                    {palette}
                  </motion.div>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            )}
          </AnimatePresence>
        </DialogPrimitive.Root>
      )}
      <div className="shortcut-toast" role="status" aria-live="polite" data-visible={toast ? '' : undefined}>
        {toast}
      </div>
    </>
  );
}

/** Header trigger. On the homepage it focuses the inline palette instead. */
export function JumpButton() {
  const { mod } = useModifierLabel();

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
