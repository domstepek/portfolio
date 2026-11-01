'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { submitPasscode } from '@/app/domains/actions';
import { cssTime } from '@/lib/motion/css-time';

interface GateFormProps {
  slug: string;
}

/**
 * GateForm — client component for the portfolio gate passcode form.
 *
 * Uses useActionState for progressive-enhancement-friendly error display.
 * Hidden `slug` input carries the domain slug to the server action for redirect.
 *
 * Required data-* attributes (gate test contract, D015):
 *   data-passcode-input — the password input
 *   data-passcode-submit — the submit button
 *   data-gate-error — error span (only rendered when error exists)
 *
 * D042: GateForm is 'use client' with useActionState; DomainGatePage stays a pure server component.
 */
export function GateForm({ slug }: GateFormProps) {
  const [state, action, pending] = useActionState(submitPasscode, {
    error: null,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorShown, setErrorShown] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Wrong passcode: shake the field, show the message, fade it after a hold.
  // State-driven so React owns the classes across re-renders and form resets.
  useEffect(() => {
    if (!state?.error) return;
    const shakeMs = cssTime('--shake-dur-a', 80) * 2 + cssTime('--shake-dur-b', 60) * 2;
    setErrorShown(true);
    setShaking(false);
    const raf = requestAnimationFrame(() => setShaking(true)); // replay on repeat errors
    const stop = window.setTimeout(() => setShaking(false), shakeMs + 40);
    const revert = window.setTimeout(() => setErrorShown(false), shakeMs + cssTime('--revert-hold', 3000));
    inputRef.current?.select();
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(stop);
      window.clearTimeout(revert);
    };
  }, [state]);

  return (
    <form action={action} className="gate__form">
      <div className={`gate__field t-input-wrap${errorShown ? ' is-error' : ''}`}>
      <input name="slug" value={slug} type="hidden" readOnly />

        <label htmlFor="gate-passcode" className="gate__label">Passcode</label>
      <div className="gate__row">
        <input
          id="gate-passcode"
          name="passcode"
          type="password"
          data-passcode-input=""
          autoComplete="off"
          required
          aria-invalid={errorShown ? true : undefined}
          aria-describedby={state?.error ? 'gate-error' : undefined}
          ref={inputRef}
          className={`gate__input t-input${errorShown ? ' is-error' : ''}${shaking ? ' is-shaking' : ''}`}
          onInput={() => setErrorShown(false)}
        />
        <button data-passcode-submit="" type="submit" disabled={pending} className="button button--primary">
          {pending ? 'Checking…' : 'Unlock case studies'}
        </button>
      </div>

      {state?.error && (
        <span id="gate-error" data-gate-error="" className="gate__error t-error-msg" role="alert">
          {state.error}
        </span>
      )}
      </div>
    </form>
  );
}
