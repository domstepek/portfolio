'use client';

import { useCallback, useRef, useState } from 'react';

interface CopyChipProps {
  copyText: string;
  label: string;
  printText: string;
}

export function CopyChip({ copyText, label, printText }: CopyChipProps) {
  const [state, setState] = useState<'idle' | 'hovered' | 'copied'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (state !== 'copied') setState('hovered');
  }, [state]);

  const handleMouseLeave = useCallback(() => {
    if (state === 'hovered') setState('idle');
  }, [state]);

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(copyText);
    } catch {
      // silent fail — clipboard not available
    }
    setState('copied');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setState('idle'), 1200);
  }, [copyText]);

  const className = [
    'resume-page__chip',
    state === 'hovered' && 'is-hovered',
    state === 'copied' && 'is-copied',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={className}
      type="button"
      data-copy={copyText}
      data-print-text={printText}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <span className="resume-page__chip-label">{label}</span>
      <span className="resume-page__chip-hover">click to cp</span>
      <span className="resume-page__chip-done">copied</span>
    </button>
  );
}

export function PrintButton() {
  return (
    <button
      className="resume-page__download"
      type="button"
      onClick={() => window.print()}
    >
      print / save as pdf
    </button>
  );
}
