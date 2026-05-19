import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function LoginPage() {
  return (
    <div className="bg-surface min-h-screen flex flex-col items-center pt-32 pb-24">
      <Link href="/" className="font-display text-h2 mb-12" style={{ fontWeight: 500 }} aria-label="MJØLNE home">
        MJØLNE
      </Link>
      <h1 className="font-display text-h1 mb-2" style={{ fontWeight: 400 }}>
        Welcome back.
      </h1>
      <p className="text-body text-mute mb-10">Enter your email to sign in.</p>
      <AuthForm mode="login" />
    </div>
  );
}
