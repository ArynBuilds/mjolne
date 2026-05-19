import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { PRODUCT_LIST } from '@/lib/products';
import { CountryTag } from '@/components/primitives/country-tag';
import { TopoLines } from '@/components/primitives/topo-lines';

export const metadata: Metadata = {
  title: 'Story',
  description:
    'It is not just coffee, it is MJØLNE. The roastery, the people, and the discipline behind every Tuesday roast.',
};

export default function StoryPage() {
  const t = useTranslations('story');

  return (
    <article className="bg-surface" style={{ paddingTop: 160, paddingBottom: 'var(--space-10)' }}>
      <div className="container-page max-w-[760px]">
        <p className="eyebrow text-mute mb-12" style={{ letterSpacing: '0.26em' }}>
          {t('tagline')}
        </p>
      </div>

      {/* Section 1 — opening pull-quote */}
      <header className="container-page max-w-[1080px]" style={{ marginBottom: 'var(--space-10)' }}>
        <h1
          className="font-display text-display-xl text-balance"
          style={{ fontWeight: 400, lineHeight: 0.95 }}
        >
          {t('h1')}
        </h1>
        <p
          className="font-display text-display-l italic text-mute"
          style={{
            fontWeight: 300,
            marginTop: 'var(--space-5)',
            paddingLeft: '10%',
          }}
        >
          {t('h2')}
        </p>
      </header>

      {/* Section 2 — essay */}
      <section className="container-page max-w-[760px]" style={{ marginBottom: 'var(--space-10)' }}>
        <p className="text-lead leading-[1.55] mb-7">{t('body1')}</p>
        <p className="text-body leading-[1.75] mb-7 text-ink/85">{t('body2')}</p>
        <p className="text-body leading-[1.75] text-ink/85">{t('body3')}</p>
      </section>

      {/* Full-width image break — placeholder */}
      <div
        className="relative w-full h-[420px] overflow-hidden flex items-center justify-center"
        style={{ marginBottom: 'var(--space-10)', background: 'var(--color-fog)' }}
        aria-hidden
      >
        <TopoLines opacity={0.22} />
        <p
          className="absolute font-display text-h2 text-mute italic"
          style={{ fontWeight: 300 }}
        >
          Roastery, Istanbul
        </p>
      </div>

      {/* Section 3 — sourcing strip */}
      <section className="container-page" style={{ marginBottom: 'var(--space-10)' }}>
        <p className="eyebrow text-mute mb-8" style={{ letterSpacing: '0.26em' }}>
          — Sourcing
        </p>
        <div className="grid grid-cols-4 gap-6">
          {PRODUCT_LIST.filter((p, i, arr) => arr.findIndex((q) => q.country === p.country) === i).map(
            (p) => (
              <div
                key={p.country}
                className="bg-paper border border-hairline rounded-md p-6 flex flex-col gap-3"
              >
                <CountryTag country={p.country} size="md" label={p.name} className="self-start" />
                <p className="text-body leading-[1.6] text-ink/80">
                  {originBlurb(p.country)}
                </p>
                <dl className="font-mono text-caption text-mute mt-auto pt-3 grid grid-cols-[88px_1fr] gap-y-1">
                  <dt>Altitude</dt>
                  <dd className="text-ink/70">{p.altitude}</dd>
                  <dt>Process</dt>
                  <dd className="text-ink/70">{p.process}</dd>
                </dl>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Section 4 — closing */}
      <section
        className="container-page text-center"
        style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-10)' }}
      >
        <h2
          className="font-display text-display-m italic text-balance max-w-[640px] mx-auto"
          style={{ fontWeight: 300 }}
        >
          {t('closing')}
        </h2>
        <a
          href="/catalog.pdf"
          className="inline-flex items-center gap-2 mt-9 text-[11px] uppercase tracking-[0.18em] underline-expand"
        >
          {t('readCatalog')} →
        </a>
      </section>
    </article>
  );
}

function originBlurb(country: 'peru' | 'ethiopia' | 'colombia' | 'brazil'): string {
  switch (country) {
    case 'peru':
      return 'Cajamarca sits in the high northern Andes. Smallholder farms produce washed lots that come to the cup as caramel, hazelnut, and a whisper of citrus.';
    case 'ethiopia':
      return 'Yirgacheffe and Lekempti are the bookends of Ethiopian coffee — bright, washed, structured on one side; floral, natural, generous on the other.';
    case 'colombia':
      return 'Supremo Medellin rewards patience. Walnut, peach, cocoa, and a long finish that rewards the second cup.';
    case 'brazil':
      return 'Selection lots from a single estate, naturally processed. Creamy body, milk-chocolate sweetness, juicy finish — built for espresso.';
  }
}
