'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Mail } from 'lucide-react';
import { submitPasscode } from '@/app/domains/actions';
import { PasswordField } from '@/components/arc/password-field/password-field';
import { Alert } from '@/components/arc/alert/alert';
import { Button } from '@/components/arc/button/button';
import { LinkButton } from '@/components/layout/LinkButton';
import { cssTime } from '@/lib/motion/css-time';

interface GateFormProps {
  slug: string;
}

/**
 * GateForm — passcode form (Arc password field, alert, and button).
 *
 * Required data-* attributes (gate test contract, D015):
 *   data-passcode-input — the password input
 *   data-passcode-submit — the submit button
 *   data-gate-error — the error alert (only rendered when an error exists)
 *
 * D042: GateForm is 'use client' with useActionState; DomainGatePage stays a pure server component.
 */
export function GateForm({ slug }: GateFormProps) {
  const [state, action, pending] = useActionState(submitPasscode, { error: null });
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorShown, setErrorShown] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Wrong passcode: shake the field, show the alert, keep it until they type.
  useEffect(() => {
    if (!state?.error) return;
    const shakeMs = cssTime('--shake-dur-a', 80) * 2 + cssTime('--shake-dur-b', 60) * 2;
    setErrorShown(true);
    setShaking(false);
    const raf = requestAnimationFrame(() => setShaking(true)); // replay on repeat errors
    const stop = window.setTimeout(() => setShaking(false), shakeMs + 40);
    inputRef.current?.select();
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(stop);
    };
  }, [state]);

  return (
    <form action={action} className="gate__form">
      <input name="slug" value={slug} type="hidden" readOnly />

      {state?.error && (
        <Alert
          tone="danger"
          title="That passcode didn't match"
          open={errorShown}
          data-gate-error=""
          id="gate-error"
        >
          Check for typos, or email me for a new one.
        </Alert>
      )}

      <div className={`gate__field${shaking ? ' is-shaking' : ''}`}>
        <PasswordField
          ref={inputRef}
          label="Passcode"
          description="Passcodes are case-sensitive."
          name="passcode"
          data-passcode-input=""
          autoComplete="off"
          required
          aria-invalid={errorShown ? true : undefined}
          onInput={() => setErrorShown(false)}
        />
      </div>

      <div className="gate__actions">
        <Button type="submit" variant="primary" className="button-accent" loading={pending} data-passcode-submit="">
          Unlock case studies
        </Button>
        <LinkButton href="mailto:domstepek@gmail.com?subject=Portfolio%20passcode" icon={<Mail size={16} strokeWidth={1.75} aria-hidden="true" />}>
          Email for a passcode
        </LinkButton>
      </div>
    </form>
  );
}
