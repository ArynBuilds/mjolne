import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thank you',
};

interface PageProps {
  searchParams: { id?: string; context?: string };
}

export default function CheckoutSuccessPage({ searchParams }: PageProps) {
  const orderId = searchParams.id ?? '—';
  const isSubscription = searchParams.context === 'subscription';

  return (
    <div className="bg-surface min-h-screen flex items-center" style={{ paddingTop: 144, paddingBottom: 'var(--space-10)' }}>
      <div className="container-page max-w-[640px]">
        <p className="eyebrow text-mute mb-8" style={{ letterSpacing: '0.26em' }}>
          {isSubscription ? '— Subscription started' : '— Order received'}
        </p>
        <h1
          className="font-display text-display-l mb-8 text-balance"
          style={{ fontWeight: 400, lineHeight: 0.95 }}
        >
          {isSubscription
            ? 'Your ritual begins.'
            : 'Your beans are on their way.'}
        </h1>
        <p className="text-lead text-ink/85 mb-9">
          {isSubscription
            ? 'We will roast Tuesday and ship same day. Look out for a delivery email when each bag goes out.'
            : 'We will roast Tuesday and ship same day. Look out for a delivery email when your bag goes out.'}
        </p>

        <dl className="grid grid-cols-[140px_1fr] gap-y-2 font-mono text-caption mb-12">
          <dt className="text-mute uppercase tracking-[0.14em]">
            {isSubscription ? 'Subscription' : 'Order'} ID
          </dt>
          <dd>{orderId}</dd>
          <dt className="text-mute uppercase tracking-[0.14em]">Estimated delivery</dt>
          <dd>3–5 business days from next Tuesday</dd>
        </dl>

        <div className="flex flex-col gap-3">
          <Link href="/account/orders" className="pill-button pill-button-primary inline-flex w-fit">
            Track your order <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
          <Link
            href="/"
            className="text-caption uppercase tracking-[0.18em] text-mute hover:text-ink underline-expand w-fit"
          >
            Return to coffee →
          </Link>
        </div>
      </div>
    </div>
  );
}
