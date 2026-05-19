import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { OrderSummary } from '@/components/checkout/order-summary';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default function CheckoutPage() {
  return (
    <div className="bg-surface" style={{ paddingTop: 144, paddingBottom: 'var(--space-10)' }}>
      <div className="container-page max-w-[1080px]">
        <p className="eyebrow text-mute mb-6" style={{ letterSpacing: '0.26em' }}>
          — Checkout
        </p>
        <h1
          className="font-display text-display-l mb-12 text-balance"
          style={{ fontWeight: 400, lineHeight: 0.95 }}
        >
          Almost there.
        </h1>
        <div className="grid grid-cols-[1fr_360px] gap-12">
          <CheckoutForm />
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
