'use client';

import { useActionState } from 'react';
import { submitPasscode } from '@/app/domains/actions';

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

  return (
    <form action={action} className="gate__form">
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
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? 'gate-error' : undefined}
          className="gate__input"
        />
        <button data-passcode-submit="" type="submit" disabled={pending} className="button button--primary">
          {pending ? 'Checking…' : 'Unlock case studies'}
        </button>
      </div>

      {state?.error && (
        <span id="gate-error" data-gate-error="" className="gate__error" role="alert">
          {state.error}
        </span>
      )}
    </form>
  );
}
