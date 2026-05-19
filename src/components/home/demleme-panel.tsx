'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CountryTag } from '@/components/primitives/country-tag';
import { PRODUCTS } from '@/lib/products';
import type { BrewGuide } from '@/lib/brew-guides';
import { DemlemeCounter } from './demleme-counter';
import { DemlemeTimeline } from './demleme-timeline';

type Locale = 'tr' | 'en';

interface DemlemePanelProps {
  guide: BrewGuide;
  index: number;
  total: number;
  locale: Locale;
  labels: {
    soon: string;
    ctaAvailable: string;
    ctaSoon: string;
    prep: string;
    pairs: string;
    recipe: string;
  };
  conditionLabels: Record<string, string>;
}

function pickName(g: BrewGuide, locale: Locale) {
  return locale === 'tr' ? g.nameTR : g.name;
}

function pickDescription(g: BrewGuide, locale: Locale) {
  return locale === 'tr' ? g.descriptionTR : g.description;
}

function pickPrep(g: BrewGuide, locale: Locale) {
  return locale === 'tr' ? g.prepTR : g.prep;
}

export function DemlemePanel({
  guide,
  index,
  total,
  locale,
  labels,
  conditionLabels,
}: DemlemePanelProps) {
  const panelRef = useRef<HTMLAnchorElement>(null);
  const pairs = guide.recommendedSlugs.slice(0, 2).map((s) => PRODUCTS[s]);

  return (
    <Link
      ref={panelRef}
      href={`/brew-guide/${guide.slug}`}
      className="group relative flex flex-col bg-paper border border-hairline transition-colors duration-500"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8) var(--space-7)',
        minHeight: 520,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity pointer-events-none"
        style={{
          background: 'var(--gradient-holo)',
          borderRadius: 'var(--radius-lg)',
          transitionDuration: '500ms',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      />

      <header
        className="relative flex items-center justify-between"
        style={{ marginBottom: 'var(--space-7)' }}
      >
        <span
          className="font-mono text-mute"
          style={{
            fontSize: 11,
            letterSpacing: '0.22em',
            fontWeight: 500,
          }}
        >
          {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        {!guide.available ? (
          <span
            className="font-mono text-mute"
            style={{
              fontSize: 10,
              letterSpacing: '0.28em',
              fontWeight: 500,
            }}
          >
            {labels.soon}
          </span>
        ) : null}
      </header>

      <div
        className="relative grid"
        style={{
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          columnGap: 'var(--space-9)',
          alignItems: 'start',
        }}
      >
        <div className="flex flex-col">
          <h3
            className="font-display text-ink text-balance"
            style={{
              fontSize: 'clamp(80px, 9vw, 140px)',
              lineHeight: 0.92,
              letterSpacing: '-0.035em',
              fontWeight: 400,
              marginBottom: 'var(--space-6)',
            }}
          >
            {pickName(guide, locale)}
          </h3>

          <p
            className="font-display text-ink/80 italic"
            style={{
              fontSize: 19,
              lineHeight: 1.45,
              maxWidth: '38ch',
              fontWeight: 400,
              marginBottom: 'var(--space-7)',
            }}
          >
            {pickDescription(guide, locale)}
          </p>

          <div
            className="flex flex-wrap items-baseline"
            style={{ columnGap: 'var(--space-6)', rowGap: 'var(--space-3)' }}
          >
            <HeadlineNumber containerRef={panelRef} value={guide.headline.coffee} />
            <Dot />
            <HeadlineNumber containerRef={panelRef} value={guide.headline.water} delay={120} />
          </div>
          <div
            className="flex flex-wrap items-baseline"
            style={{
              columnGap: 'var(--space-6)',
              rowGap: 'var(--space-3)',
              marginTop: 'var(--space-3)',
            }}
          >
            <HeadlineNumber containerRef={panelRef} value={guide.headline.time} delay={240} />
            <Dot />
            <HeadlineNumber containerRef={panelRef} value={guide.headline.ratio} delay={360} />
          </div>

          <div
            className="flex flex-col"
            style={{ gap: 'var(--space-3)', marginTop: 'var(--space-7)' }}
          >
            <p
              className="font-mono text-mute"
              style={{
                fontSize: 10,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              {labels.prep}
            </p>
            <p
              className="text-ink/85"
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                maxWidth: '46ch',
              }}
            >
              {pickPrep(guide, locale)}
            </p>
          </div>

          <div
            className="flex items-end justify-between"
            style={{ marginTop: 'auto', paddingTop: 'var(--space-7)' }}
          >
            <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
              <p
                className="font-mono text-mute"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                {labels.pairs}
              </p>
              <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
                {pairs.map((p) => (
                  <CountryTag key={p.slug} country={p.country} size="sm" label={p.name} />
                ))}
              </div>
            </div>

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
              <ArrowUpRight size={12} strokeWidth={1.5} />
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <p
            className="font-mono text-mute"
            style={{
              fontSize: 10,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontWeight: 500,
              marginBottom: 'var(--space-5)',
            }}
          >
            {labels.recipe}
          </p>
          <DemlemeTimeline guide={guide} locale={locale} conditionLabels={conditionLabels} />
        </div>
      </div>
    </Link>
  );
}

function HeadlineNumber({
  containerRef,
  value,
  delay,
}: {
  containerRef: React.RefObject<HTMLElement>;
  value: string;
  delay?: number;
}) {
  return (
    <span
      className="font-mono text-ink"
      style={{
        fontSize: 'clamp(28px, 3vw, 40px)',
        letterSpacing: '0.02em',
        fontWeight: 500,
        lineHeight: 1,
      }}
    >
      <DemlemeCounter value={value} containerRef={containerRef} delay={delay} />
    </span>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="text-mute"
      style={{
        fontSize: 'clamp(20px, 2vw, 28px)',
        lineHeight: 1,
        fontWeight: 400,
      }}
    >
      ·
    </span>
  );
}
