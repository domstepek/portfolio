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
    <form action={action} className="flex flex-col gap-3 mt-6">
      <input name="slug" value={slug} type="hidden" readOnly />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="gate-passcode"
          className="text-[var(--muted)] text-sm uppercase tracking-widest"
        >
          Passcode
        </label>
        <input
          id="gate-passcode"
          name="passcode"
          type="password"
          data-passcode-input=""
          placeholder="Enter passcode"
          autoComplete="off"
          required
          className="bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] font-mono px-3 py-2 focus:outline-none focus:border-[var(--accent)] w-full max-w-xs"
        />
      </div>

      <button
        data-passcode-submit=""
        type="submit"
        disabled={pending}
        className="self-start px-4 py-2 border border-[var(--accent)] text-[var(--accent-strong)] font-mono text-sm hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Checking...' : 'Submit'}
      </button>

      {state?.error && (
        <span data-gate-error="" className="text-red-400 text-sm font-mono">
          {state.error}
        </span>
      )}
    </form>
  );
}
