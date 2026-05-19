import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BREW_LIST } from '@/lib/brew-guides';
import { getProduct } from '@/lib/products';
import { HoloSticker } from '@/components/primitives/holo-sticker';

export const metadata: Metadata = {
  title: 'Brew guide',
  description:
    'Six methods, six rituals. Recipes calibrated to MJØLNE roasts — espresso, filter, V60, AeroPress, French press, Moka.',
};

export default function BrewGuideIndex() {
  return (
    <div className="bg-surface" style={{ paddingTop: 160, paddingBottom: 'var(--space-10)' }}>
      <div className="container-page max-w-[1080px]">
        <p className="eyebrow text-mute mb-6" style={{ letterSpacing: '0.26em' }}>
          — Brew guide
        </p>
        <h1
          className="font-display text-display-l mb-12 text-balance"
          style={{ fontWeight: 400, lineHeight: 0.95, maxWidth: 760 }}
        >
          Six methods, <em className="font-display italic">six rituals.</em>
        </h1>

        <div className="grid grid-cols-2 gap-6">
          {BREW_LIST.map((g) => {
            const recommended = g.recommendedSlugs[0]
              ? getProduct(g.recommendedSlugs[0])
              : null;
            return (
              <Link
                key={g.slug}
                href={`/brew-guide/${g.slug}`}
                className="group relative bg-paper border border-hairline rounded-lg p-8 flex flex-col gap-5 transition-[box-shadow,colors] duration-300 hover:shadow-[var(--shadow-card-hover)]"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.14] transition-opacity duration-500 rounded-lg pointer-events-none"
                  style={{ background: 'var(--gradient-holo)' }}
                />
                <div className="flex items-start justify-between relative">
                  <div>
                    <h2
                      className="font-display text-h2 mb-2"
                      style={{ fontWeight: 400 }}
                    >
                      {g.name}
                    </h2>
                    <p className="eyebrow text-mute">{g.nameTR}</p>
                  </div>
                  {!g.available ? (
                    <span className="text-caption text-mute uppercase tracking-[0.18em]">Coming soon</span>
                  ) : null}
                </div>
                <p className="text-body text-ink/85 max-w-[420px] relative">{g.description}</p>
                <div className="mt-auto pt-4 flex items-end justify-between relative">
                  {recommended ? (
                    <div className="flex flex-col gap-2">
                      <p className="eyebrow text-mute">Best with</p>
                      <HoloSticker primary={recommended.name} secondary={recommended.region.split(' ')[0]} size="md" />
                    </div>
                  ) : (
                    <span />
                  )}
                  <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] underline-expand">
                    {g.available ? 'Read recipe' : 'Notify me'}
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
