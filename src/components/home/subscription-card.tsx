import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function SubscriptionCard() {
  const t = useTranslations('subscription');

  return (
    <Link
      href="/subscribe"
      className="subscription-card block relative group"
      aria-label={`${t('cardLabel')} — ${t('cta')}`}
      style={{
        width: '100%',
        maxWidth: 640,
        aspectRatio: '1.6 / 1',
        borderRadius: 'var(--radius-md)',
        border: '0.5px solid rgba(10,10,10,0.08)',
        overflow: 'hidden',
        position: 'relative',
        textDecoration: 'none',
        color: 'var(--color-ink)',
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 holo-shimmer transition-opacity"
        style={{
          backgroundImage: 'var(--gradient-holo)',
          backgroundSize: '220% 220%',
          transitionDuration: '600ms',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity holo-shimmer"
        style={{
          backgroundImage: 'var(--gradient-holo-active)',
          backgroundSize: '220% 220%',
          transitionDuration: '600ms',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      />

      <div
        className="relative flex flex-col h-full"
        style={{
          padding: 'clamp(24px, 3.4vw, 36px)',
          justifyContent: 'space-between',
        }}
      >
        <div className="flex items-baseline justify-between">
          <span
            className="font-display"
            style={{
              fontSize: 18,
              letterSpacing: '0.04em',
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            {t('cardWordmark')}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              opacity: 0.78,
            }}
          >
            {t('cardLabel')}
          </span>
        </div>

        <div>
          <p
            className="font-display text-balance"
            style={{
              fontSize: 'clamp(36px, 4.4vw, 60px)',
              lineHeight: 1.02,
              letterSpacing: '-0.028em',
              fontWeight: 400,
              maxWidth: '14ch',
            }}
          >
            {t('cardHeadline')}{' '}
            <em className="font-display italic" style={{ fontWeight: 400 }}>
              {t('cardHeadlineEm')}
            </em>
          </p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <CardTab label={t('cardCadence')} />
          <CardTab label={t('cardPrice')} align="right" />
        </div>
      </div>
    </Link>
  );
}

interface CardTabProps {
  label: string;
  align?: 'left' | 'right';
}

function CardTab({ label, align = 'left' }: CardTabProps) {
  return (
    <div
      className="flex flex-col"
      style={{ gap: 6, alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}
    >
      <span
        aria-hidden
        style={{
          width: 32,
          height: 1,
          background: 'rgba(10,10,10,0.45)',
        }}
      />
      <span
        className="font-mono"
        style={{
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  );
}
