'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { morphText } from '@/lib/motion/morph-text';

interface CopyChipProps {
  copyText: string;
  label: string;
  printText: string;
}

export function CopyChip({ copyText, label, printText }: CopyChipProps) {
  const [state, setState] = useState<'idle' | 'hovered' | 'copied'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    morphText(el, state === 'copied' ? 'copied' : state === 'hovered' ? 'click to cp' : label);
  }, [state, label]);

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
      <span ref={labelRef} className="resume-page__chip-label t-morph" aria-live="polite">
        {label}
      </span>
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
