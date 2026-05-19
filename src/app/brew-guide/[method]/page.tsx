import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BREW_GUIDES, BREW_LIST, type BrewMethod } from '@/lib/brew-guides';
import { getProduct } from '@/lib/products';
import { BagTile } from '@/components/primitives/bag-tile';
import { HoloSticker } from '@/components/primitives/holo-sticker';

interface Params {
  method: string;
}

export function generateStaticParams() {
  return BREW_LIST.map((g) => ({ method: g.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const g = (BREW_GUIDES as Record<string, (typeof BREW_LIST)[number]>)[params.method];
  if (!g) return { title: 'Brew guide' };
  return {
    title: g.name,
    description: g.description,
  };
}

export default function BrewGuideMethodPage({ params }: { params: Params }) {
  const guide = (BREW_GUIDES as Record<string, (typeof BREW_LIST)[number]>)[params.method as BrewMethod];
  if (!guide) notFound();

  const recommendedProducts = guide.recommendedSlugs
    .map((s) => getProduct(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];

  return (
    <article className="bg-surface" style={{ paddingTop: 144, paddingBottom: 'var(--space-10)' }}>
      <div className="container-page max-w-[720px]">
        <Link
          href="/brew-guide"
          className="inline-flex items-center gap-2 text-caption text-mute hover:text-ink mb-10 underline-expand"
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          All methods
        </Link>

        <p className="eyebrow text-mute mb-4" style={{ letterSpacing: '0.26em' }}>
          — {guide.nameTR}
        </p>
        <h1
          className="font-display text-display-l mb-8 text-balance"
          style={{ fontWeight: 400, lineHeight: 0.95 }}
        >
          {guide.name}
        </h1>

        {guide.lead ? (
          <p className="text-lead leading-[1.55] mb-12 text-ink/85">{guide.lead}</p>
        ) : null}

        {!guide.available ? (
          <ComingSoon name={guide.name} />
        ) : (
          <>
            {guide.equipment ? (
              <section className="mb-12">
                <h2 className="font-display text-h2 mb-5" style={{ fontWeight: 400 }}>
                  Equipment
                </h2>
                <ul className="flex flex-col gap-2 text-body text-ink/85">
                  {guide.equipment.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-mute">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {guide.recipe ? (
              <section className="mb-12">
                <h2 className="font-display text-h2 mb-5" style={{ fontWeight: 400 }}>
                  Recipe
                </h2>
                <dl
                  className="font-mono text-body grid gap-y-3 border-y border-hairline py-6"
                  style={{ gridTemplateColumns: '120px 1fr' }}
                >
                  <RecipeRow term="Coffee" def={guide.recipe.coffee} />
                  <RecipeRow term="Water" def={guide.recipe.water} />
                  <RecipeRow term="Grind" def={guide.recipe.grind} />
                  <RecipeRow term="Time" def={guide.recipe.time} />
                  <RecipeRow term="Ratio" def={guide.recipe.ratio} />
                </dl>
              </section>
            ) : null}

            {guide.steps ? (
              <section className="mb-16">
                <h2 className="font-display text-h2 mb-5" style={{ fontWeight: 400 }}>
                  Method
                </h2>
                <ol className="flex flex-col gap-5 text-body text-ink/85">
                  {guide.steps.map((step, i) => (
                    <li key={i} className="flex gap-5">
                      <span className="font-mono text-caption text-mute pt-1 w-6 flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </>
        )}

        {recommendedProducts.length > 0 ? (
          <section>
            <p className="eyebrow text-mute mb-6">— MJØLNE picks</p>
            <div className="flex gap-4">
              {recommendedProducts.map((p) => (
                <Link key={p.slug} href={`/coffee/${p.slug}`} className="block">
                  <BagTile product={p} size={150} />
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}

function RecipeRow({ term, def }: { term: string; def: string }) {
  return (
    <>
      <dt className="text-mute uppercase tracking-[0.14em] text-caption">{term}</dt>
      <dd className="text-ink">{def}</dd>
    </>
  );
}

function ComingSoon({ name }: { name: string }) {
  return (
    <div
      className="border border-hairline rounded-lg p-12 flex flex-col items-center text-center gap-5 bg-paper"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <HoloSticker primary="Coming soon" size="lg" animated />
      <p className="text-body text-mute max-w-[420px]">
        We are still calibrating our recipe for {name.toLowerCase()}. It will land here when it is ready, not before.
      </p>
      <Link
        href="/brew-guide"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] underline-expand"
      >
        Browse the methods we have ready <ArrowRight size={14} strokeWidth={1.5} />
      </Link>
    </div>
  );
}
