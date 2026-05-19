import type { Metadata } from 'next';
import { SubscriptionConfigurator } from '@/components/subscription/configurator';

export const metadata: Metadata = {
  title: 'Subscribe',
  description: 'Pick a roast. Pick a frequency. Skip whenever. Cancel anytime.',
};

export default function SubscribePage() {
  return (
    <div className="bg-surface" style={{ paddingTop: 144, paddingBottom: 'var(--space-10)' }}>
      <div className="container-page" style={{ maxWidth: 1280 }}>
        <p className="eyebrow text-mute mb-6" style={{ letterSpacing: '0.26em' }}>
          The ritual
        </p>
        <h1
          className="font-display text-display-l mb-12"
          style={{ fontWeight: 400, lineHeight: 0.95, maxWidth: 720 }}
        >
          Build your <em className="font-display italic">subscription.</em>
        </h1>
        <SubscriptionConfigurator />
      </div>
    </div>
  );
}
