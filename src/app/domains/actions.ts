'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash } from 'node:crypto';

/**
 * submitPasscode — server action for the portfolio gate.
 *
 * Validates the submitted passcode against GATE_HASH (SHA-256).
 * On mismatch: returns error state (no redirect, no cookie).
 * On match: sets HttpOnly auth cookie, then redirects to the domain route.
 *
 * CRITICAL: redirect() is called OUTSIDE any try/catch. Next.js redirect()
 * works by throwing a NEXT_REDIRECT error — catching it silently kills it.
 *
 * D033: middleware + HttpOnly cookie gate model.
 * D041: Node.js crypto.createHash (not crypto.subtle).
 * D037: Session-scoped cookie (no maxAge/expires).
 */
export async function submitPasscode(
  prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const passcode = (formData.get('passcode') as string) ?? '';
  const slug = (formData.get('slug') as string) ?? '';

  const hash = createHash('sha256').update(passcode).digest('hex');

  if (hash !== process.env.GATE_HASH) {
    console.log('[gate] invalid passcode attempt');
    return { error: 'Incorrect passcode. Please try again.' };
  }

  // Cookie set before redirect — redirect() must not be inside try/catch
  (await cookies()).set('portfolio-gate', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/domains',
  });

  redirect(`/domains/${slug}/`);
}
