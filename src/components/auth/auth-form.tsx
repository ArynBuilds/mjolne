'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    if (mode === 'signup' && !consent) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await signIn('resend', {
        email,
        redirect: false,
        callbackUrl: '/account',
      });
      if (res?.error) {
        setError('We could not send the link. Make sure RESEND_API_KEY is configured.');
      } else {
        setSent(true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center max-w-[480px]">
        <h2 className="font-display text-h2 mb-3" style={{ fontWeight: 400 }}>
          Check your inbox.
        </h2>
        <p className="text-body text-mute">
          We sent a link to <span className="text-ink">{email}</span>. It works once and expires in 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-[480px] flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="eyebrow text-mute block mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-paper border border-hairline rounded-md px-4 py-3 outline-none focus:border-ink transition-colors"
        />
      </div>

      {mode === 'signup' ? (
        <label className="flex items-start gap-3 text-caption text-mute">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1"
          />
          <span>
            I agree to receive transactional emails and accept the{' '}
            <Link href="/terms" className="underline">
              terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline">
              privacy policy
            </Link>
            .
          </span>
        </label>
      ) : null}

      <button
        type="submit"
        disabled={submitting || !email || (mode === 'signup' && !consent)}
        className="pill-button pill-button-primary justify-center"
        style={{ height: 52, width: '100%' }}
      >
        {submitting ? 'Sending…' : 'Send link'} <ArrowRight size={14} strokeWidth={1.5} />
      </button>

      {error ? <p className="text-caption text-colombia">{error}</p> : null}

      <div className="my-4 flex items-center gap-4 text-caption text-mute">
        <span className="flex-1 hairline" />
        <span>or</span>
        <span className="flex-1 hairline" />
      </div>

      {mode === 'login' ? (
        <p className="text-body text-mute">
          New here?{' '}
          <Link href="/signup" className="underline-expand text-ink">
            Create an account →
          </Link>
        </p>
      ) : (
        <p className="text-body text-mute">
          Already have an account?{' '}
          <Link href="/login" className="underline-expand text-ink">
            Sign in →
          </Link>
        </p>
      )}
    </form>
  );
}
