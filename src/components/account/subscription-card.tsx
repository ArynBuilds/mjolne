'use client';

import { useState } from 'react';
import type { SubscriptionRecord } from '@/lib/persistence';
import { getProduct } from '@/lib/products';
import { CountryTag } from '@/components/primitives/country-tag';
import { FREQUENCY_LABEL } from '@/lib/subscription-config';

interface SubscriptionCardProps {
  subscription: SubscriptionRecord;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const product = getProduct(subscription.origin);
  const [busy, setBusy] = useState<null | 'skip' | 'cancel'>(null);
  const [status, setStatus] = useState(subscription.status);
  const [message, setMessage] = useState<string | null>(null);

  async function call(action: 'cancel' | 'skip-next') {
    setBusy(action === 'cancel' ? 'cancel' : 'skip');
    setMessage(null);
    try {
      const res = await fetch(`/api/subscription/${action}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.id }),
      });
      const json = await res.json();
      if (json.ok) {
        if (action === 'cancel') setStatus('cancelled');
        setMessage(json.message ?? (action === 'cancel' ? 'Cancelled.' : 'Next delivery skipped.'));
      } else {
        setMessage(json.error ?? 'Could not complete the action.');
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <article className="bg-paper border border-hairline rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          {product ? (
            <CountryTag country={product.country} size="sm" label={product.name} className="mb-3" />
          ) : null}
          <h2 className="font-display text-h2" style={{ fontWeight: 400 }}>
            {product?.fullName ?? subscription.origin}
          </h2>
          <p className="text-caption text-mute mt-1">
            {subscription.grind} · {subscription.volume} · delivered {FREQUENCY_LABEL[subscription.frequency as keyof typeof FREQUENCY_LABEL]}
          </p>
        </div>
        <span
          className="text-caption uppercase tracking-[0.18em]"
          style={{ color: status === 'active' ? 'var(--color-peru)' : 'var(--color-mute)' }}
        >
          {status}
        </span>
      </div>

      <div className="hairline my-4" />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => call('skip-next')}
          disabled={busy !== null || status !== 'active'}
          className="pill-button border border-hairline text-ink hover:border-mute"
          style={{ background: 'transparent', height: 40 }}
        >
          {busy === 'skip' ? 'Working…' : 'Skip next'}
        </button>
        <button
          type="button"
          onClick={() => call('cancel')}
          disabled={busy !== null || status === 'cancelled'}
          className="pill-button border border-hairline text-ink hover:border-mute"
          style={{ background: 'transparent', height: 40 }}
        >
          {busy === 'cancel' ? 'Working…' : 'Cancel'}
        </button>
      </div>

      {message ? <p className="text-caption text-mute mt-3">{message}</p> : null}
    </article>
  );
}
