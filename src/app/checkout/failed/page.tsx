import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payment failed',
};

interface PageProps {
  searchParams: { reason?: string; id?: string };
}

export default function CheckoutFailedPage({ searchParams }: PageProps) {
  const reason = searchParams.reason ?? 'unknown';

  return (
    <div className="bg-surface min-h-screen flex items-center" style={{ paddingTop: 144, paddingBottom: 'var(--space-10)' }}>
      <div className="container-page max-w-[640px]">
        <p className="eyebrow text-mute mb-8" style={{ letterSpacing: '0.26em' }}>
          — Payment incomplete
        </p>
        <h1
          className="font-display text-display-l mb-8 text-balance"
          style={{ fontWeight: 400, lineHeight: 0.95 }}
        >
          Something stopped the payment.
        </h1>
        <p className="text-lead text-ink/85 mb-3">
          We have not charged your card. You can try again or use a different one.
        </p>
        <p className="text-caption text-mute mb-12">Reason: {reason}</p>

        <div className="flex flex-col gap-3">
          <Link href="/checkout" className="pill-button pill-button-primary inline-flex w-fit">
            Try again
          </Link>
          <Link
            href="/cart"
            className="text-caption uppercase tracking-[0.18em] text-mute hover:text-ink underline-expand w-fit"
          >
            Review your bag →
          </Link>
        </div>
      </div>
    </div>
  );
}
