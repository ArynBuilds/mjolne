import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { BREW_GUIDES, type BrewGuide } from '@/lib/brew-guides';
import { PRODUCTS } from '@/lib/products';
import { CountryTag } from '@/components/primitives/country-tag';

type Locale = 'tr' | 'en';

const ORDER: BrewGuide[] = [
  BREW_GUIDES.espresso,
  BREW_GUIDES.filter,
  BREW_GUIDES.v60,
  BREW_GUIDES.aeropress,
  BREW_GUIDES['french-press'],
  BREW_GUIDES.moka,
];

const PUZZLE_IMAGE = '/images/demleme-espresso.jpg?v=3';
const PUZZLE_COLS = 3;
const PUZZLE_ROWS = 2;

function tilePosition(index: number): { x: number; y: number } {
  const col = index % PUZZLE_COLS;
  const row = Math.floor(index / PUZZLE_COLS);
  const x = (col / (PUZZLE_COLS - 1)) * 100;
  const y = (row / (PUZZLE_ROWS - 1)) * 100;
  return { x, y };
}

function pickName(g: BrewGuide, locale: Locale) {
  return locale === 'tr' ? g.nameTR : g.name;
}

function pickTag(g: BrewGuide, locale: Locale) {
  return locale === 'tr' ? g.tagTR : g.tagEN;
}

interface DemlemeCardProps {
  guide: BrewGuide;
  index: number;
  locale: Locale;
  labels: {
    soon: string;
    ctaAvailable: string;
    ctaSoon: string;
  };
}

function DemlemeCard({ guide, index, locale, labels }: DemlemeCardProps) {
  const pair = guide.recommendedSlugs[0]
    ? PRODUCTS[guide.recommendedSlugs[0]]
    : null;
  const h = guide.headline;
  const ratioLine = `${h.coffee}  ·  ${h.water}  ·  ${h.time}  ·  ${h.ratio}`;
  const { x, y } = tilePosition(index - 1);

  return (
    <Link
      href={`/brew-guide/${guide.slug}`}
      className="group relative flex flex-col bg-paper border border-hairline transition-shadow duration-500"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-7)',
        height: 360,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        transitionTimingFunction: 'var(--ease-out-expo)',
      }}
    >
      <header className="relative flex items-baseline justify-between">
        <span
          className="font-mono text-mute"
          style={{
            fontSize: 10,
            letterSpacing: '0.28em',
            fontWeight: 500,
          }}
        >
          {String(index).padStart(2, '0')} / 06
        </span>
        {!guide.available ? (
          <span
            className="font-mono text-mute"
            style={{
              fontSize: 9,
              letterSpacing: '0.3em',
              fontWeight: 500,
            }}
          >
            {labels.soon}
          </span>
        ) : null}
      </header>

      <h3
        className="font-display text-ink relative"
        style={{
          fontSize: 'clamp(46px, 4.4vw, 64px)',
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
          fontWeight: 400,
          marginTop: 'var(--space-5)',
        }}
      >
        {pickName(guide, locale)}
      </h3>

      <p
        className="relative text-ink/75 font-display italic"
        style={{
          fontSize: 17,
          lineHeight: 1.45,
          maxWidth: '32ch',
          marginTop: 'var(--space-3)',
          fontWeight: 400,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {pickTag(guide, locale)}
      </p>

      <p
        className="relative font-mono text-ink"
        style={{
          fontSize: 13,
          letterSpacing: '0.04em',
          marginTop: 'var(--space-4)',
          fontWeight: 500,
        }}
      >
        {ratioLine}
      </p>

      <div className="relative mt-auto flex items-end justify-between" style={{ paddingTop: 'var(--space-5)' }}>
        {pair ? (
          <CountryTag country={pair.country} size="md" label={pair.name} />
        ) : (
          <span />
        )}
        <span
          className="text-ink underline-expand inline-flex items-center gap-2"
          style={{
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
          }}
        >
          {guide.available ? labels.ctaAvailable : labels.ctaSoon}
          <ArrowUpRight size={11} strokeWidth={1.5} />
        </span>
      </div>

      <div
        aria-hidden
        className="absolute inset-0 opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0 pointer-events-none"
        style={{
          backgroundImage: `url(${PUZZLE_IMAGE})`,
          backgroundSize: `${PUZZLE_COLS * 100}% ${PUZZLE_ROWS * 100}%`,
          backgroundPosition: `${x}% ${y}%`,
          backgroundRepeat: 'no-repeat',
          transitionProperty: 'opacity',
          transitionDuration: '500ms',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      />

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0 pointer-events-none"
        style={{
          height: 64,
          background:
            'linear-gradient(to top, rgba(10,10,10,0.55), rgba(10,10,10,0))',
          transitionProperty: 'opacity',
          transitionDuration: '500ms',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      />

      <div
        aria-hidden
        className="absolute opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0 pointer-events-none font-display text-paper italic"
        style={{
          left: 'var(--space-6)',
          bottom: 'var(--space-6)',
          fontSize: 22,
          letterSpacing: '-0.015em',
          fontWeight: 400,
          transitionProperty: 'opacity',
          transitionDuration: '500ms',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      >
        {locale === 'tr' ? guide.nameTR : guide.name}
      </div>
    </Link>
  );
}

export function DemlemeSection() {
  const t = useTranslations('demleme');
  const locale = useLocale() as Locale;

  const labels = {
    soon: t('soonTag'),
    ctaAvailable: t('ctaAvailable'),
    ctaSoon: t('ctaSoon'),
  };

  return (
    <section
      className="relative"
      style={{
        background: 'var(--color-surface)',
        paddingBlock: 'var(--space-7)',
      }}
      id="demleme"
    >
      <div className="container-page">
        <header
          className="grid"
          style={{
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
            columnGap: 'var(--space-9)',
            alignItems: 'end',
            marginBottom: 'var(--space-7)',
          }}
        >
          <div>
            <p
              className="eyebrow text-mute"
              style={{ letterSpacing: '0.28em', marginBottom: 'var(--space-4)' }}
            >
              {t('eyebrow')} / {t('indexLabel')}
            </p>
            <h2
              className="font-display text-ink text-balance"
              style={{
                fontSize: 'clamp(32px, 3.4vw, 48px)',
                lineHeight: 1.02,
                letterSpacing: '-0.028em',
                fontWeight: 400,
              }}
            >
              {t('headline')}{' '}
              <em className="font-display italic" style={{ fontWeight: 400 }}>
                {t('headlineEm')}
              </em>
            </h2>
          </div>
          <p
            className="text-ink/70"
            style={{
              fontSize: 13,
              lineHeight: 1.55,
              maxWidth: '52ch',
              justifySelf: 'end',
            }}
          >
            {t.rich('credit', {
              i: (chunks) => (
                <em className="font-display italic" style={{ fontWeight: 400 }}>
                  {chunks}
                </em>
              ),
            })}
          </p>
        </header>

        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {ORDER.map((guide, i) => (
            <DemlemeCard
              key={guide.slug}
              guide={guide}
              index={i + 1}
              locale={locale}
              labels={labels}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
