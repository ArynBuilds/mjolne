import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Sign up',
};

export default function SignupPage() {
  return (
    <div className="bg-surface min-h-screen flex flex-col items-center pt-32 pb-24">
      <Link href="/" className="font-display text-h2 mb-12" style={{ fontWeight: 500 }} aria-label="MJØLNE home">
        MJØLNE
      </Link>
      <h1 className="font-display text-h1 mb-2" style={{ fontWeight: 400 }}>
        Sign up.
      </h1>
      <p className="text-body text-mute mb-10">Enter your email to start an account.</p>
      <AuthForm mode="signup" />
    </div>
  );
}
