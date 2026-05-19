'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { type Product, PRODUCT_LIST } from '@/lib/products';
import { ProductBagMock } from './product-bag-mock';
import { AddToBagControls } from './add-to-bag-controls';
import { CountryTag } from '@/components/primitives/country-tag';
import { BagTile } from '@/components/primitives/bag-tile';

const COUNTRY_TINT: Record<Product['country'], string> = {
  peru: '#1C4732',
  ethiopia: '#4475D4',
  colombia: '#6B1818',
  brazil: '#E89832',
};

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const tint = COUNTRY_TINT[product.country];
  const others = PRODUCT_LIST.filter((p) => p.slug !== product.slug);

  function navigate(slug: string) {
    type DocVT = Document & { startViewTransition?: (cb: () => void) => unknown };
    const doc = document as DocVT;
    const href = `/coffee/${slug}`;
    if (typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(() => router.push(href));
    } else {
      router.push(href);
    }
  }

  return (
    <article className="bg-surface" style={{ paddingTop: 144, paddingBottom: 'var(--space-10)' }}>
      <div className="container-page">
        <div className="flex items-center gap-3 mb-6 text-caption text-mute">
          <Link
            href="/#collection"
            className="inline-flex items-center gap-1 hover:text-ink underline-expand"
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            Coffee
          </Link>
          <span>/</span>
          <span>{product.fullName}</span>
        </div>

        <p className="eyebrow text-mute mb-10" style={{ letterSpacing: '0.26em' }}>
          Crafted for early risers.
        </p>

        {/* Hero — two columns */}
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Left: bag with country halo */}
          <div className="relative h-[640px] flex items-center justify-center">
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${tint}40 0%, transparent 60%)`,
                filter: 'blur(40px)',
              }}
            />
            <ProductBagMock product={product} width={380} />
          </div>

          {/* Right: specs + CTAs */}
          <div className="max-w-[480px]">
            <CountryTag country={product.country} size="md" label={product.name} className="mb-6" />
            <h1
              className="font-display text-display-l mb-2"
              style={{ fontWeight: 400, lineHeight: 0.95 }}
            >
              {product.name}
            </h1>
            <p
              className="font-display text-h2 italic text-mute mb-7"
              style={{ fontWeight: 300 }}
            >
              {product.region}
            </p>

            <p className="text-lead mb-8">
              {product.flavorEN.join(' · ')}
            </p>

            <div className="hairline mb-6" />

            <dl
              className="font-mono text-caption grid gap-y-3"
              style={{ gridTemplateColumns: '120px 1fr' }}
            >
              <dt className="text-mute uppercase tracking-[0.14em]">Variety</dt>
              <dd>{product.variety}</dd>

              <dt className="text-mute uppercase tracking-[0.14em]">Process</dt>
              <dd>
                {product.process} <span className="text-mute">({product.processTR})</span>
              </dd>

              <dt className="text-mute uppercase tracking-[0.14em]">Altitude</dt>
              <dd>{product.altitude}</dd>

              <dt className="text-mute uppercase tracking-[0.14em]">Brewed for</dt>
              <dd>{product.brew} coffee</dd>
            </dl>

            <div className="hairline my-6" />

            <AddToBagControls product={product} />

            <p className="text-caption text-mute mt-6">Roasted Tuesday.</p>
            <p className="text-caption text-mute">Best between 7 and 21 days from roast.</p>
          </div>
        </div>

        {/* Below-fold */}
        <section
          className="max-w-[680px] mx-auto"
          style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-9)' }}
        >
          <p className="eyebrow text-mute mb-4">— About this origin</p>
          <p className="text-lead leading-[1.55] mb-3">
            {originParagraph(product)}
          </p>
          <p className="text-caption text-mute italic">PLACEHOLDER — pending client review.</p>
        </section>

        {/* How to brew */}
        <section className="grid grid-cols-2 gap-8 mb-16">
          <div className="bg-paper border border-hairline rounded-lg p-8">
            <p className="eyebrow text-mute mb-3">— How to brew</p>
            <h3 className="font-display text-h2 mb-4" style={{ fontWeight: 400 }}>
              {product.brew} method
            </h3>
            <p className="text-body text-ink/80 mb-5">
              The recipe we use here at the roastery, calibrated to this lot.
            </p>
            <Link
              href={`/brew-guide/${product.brew.toLowerCase()}`}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] underline-expand"
            >
              See the recipe <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
          <div className="bg-paper border border-hairline rounded-lg p-8">
            <p className="eyebrow text-mute mb-3">— Ritual</p>
            <h3 className="font-display text-h2 mb-4" style={{ fontWeight: 400 }}>
              Subscribe and skip the reorder.
            </h3>
            <p className="text-body text-ink/80 mb-5">
              Pick a frequency. Pause anytime. Cancel with one click.
            </p>
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] underline-expand"
            >
              Build my subscription <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </section>

        {/* More from MJØLNE */}
        <section>
          <p className="eyebrow text-mute mb-6">— More from MJØLNE</p>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {others.map((p) => (
              <BagTile
                key={p.slug}
                product={p}
                size={180}
                onClick={() => navigate(p.slug)}
                className="flex-shrink-0"
              />
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

function originParagraph(p: Product): string {
  switch (p.slug) {
    case 'peru':
      return 'Northern Peru. The Cajamarca region rises into the Andes, and small farms there work washed lots with care for clarity. Caramel, hazelnut, and a clean citrus tail — a filter cup that reads like sunrise.';
    case 'ethiopia-yirgacheffe':
      return 'Yirgacheffe is the bright shoulder of southern Ethiopia. Washed lots from cooperative wet mills, structured and aromatic — bergamot citrus and dark chocolate, with the elastic acidity that built the reputation of the region.';
    case 'ethiopia-lekempti':
      return 'Lekempti, west of Addis. Heirloom varieties processed naturally — a generous, fruit-forward profile with sweet-wine sweetness, balanced body, and a finish that holds.';
    case 'colombia':
      return 'Supremo Medellin lots from Antioquia. Washed Arabica with a gentle, grown-up character: walnut, peach, cocoa, with a long quiet finish that rewards a second pour.';
    case 'brazil':
      return 'A natural-process selection from a single estate. Juicy and floral on entry, milk-chocolate sweetness through the middle, creamy body that holds shape in milk.';
  }
}
