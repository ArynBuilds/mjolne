import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { SubscriptionCard } from './subscription-card';

export function SubscriptionTeaser() {
  const t = useTranslations('subscription');

  return (
    <section
      className="relative bg-paper"
      style={{ paddingBlock: 'var(--space-10)' }}
      id="subscribe-pitch"
    >
      <div className="container-page relative">
        <div
          className="grid"
          style={{
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            columnGap: 'var(--space-9)',
            alignItems: 'center',
          }}
        >
          <div style={{ justifySelf: 'start', width: '100%' }}>
            <SubscriptionCard />
          </div>

          <div
            className="flex flex-col"
            style={{
              maxWidth: 480,
              alignSelf: 'center',
              justifySelf: 'start',
            }}
          >
            <p
              className="eyebrow text-mute"
              style={{ letterSpacing: '0.28em', marginBottom: 'var(--space-5)' }}
            >
              {t('eyebrow')}
            </p>

            <h2
              className="font-display text-ink text-balance"
              style={{
                fontSize: 'clamp(34px, 3.8vw, 50px)',
                lineHeight: 1.06,
                letterSpacing: '-0.026em',
                fontWeight: 400,
                marginBottom: 'var(--space-5)',
              }}
            >
              {t('question')}
            </h2>

            <p
              className="text-ink/70"
              style={{
                fontSize: 17,
                lineHeight: 1.55,
                marginBottom: 'var(--space-6)',
                maxWidth: '38ch',
              }}
            >
              {t('body')}
            </p>

            <Link
              href="/subscribe"
              className="pill-button pill-button-primary inline-flex self-start"
            >
              {t('cta')}
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>

            <p
              className="text-mute"
              style={{
                marginTop: 'var(--space-4)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {t('caption')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
