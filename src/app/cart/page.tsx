'use client';

import Link from 'next/link';
import { useCart, cartCount, cartSubtotal } from '@/lib/cart-store';
import { getProduct } from '@/lib/products';
import { formatTRY } from '@/lib/format';
import { CountryTag } from '@/components/primitives/country-tag';
import { TopoLines } from '@/components/primitives/topo-lines';

const GRIND_LABELS: Record<string, string> = {
  'whole-bean': 'Whole bean',
  'espresso': 'Espresso',
  'filter': 'Filter',
  'french-press': 'French press',
  'moka': 'Moka',
};

export default function CartPage() {
  const lines = useCart((s) => s.lines);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const subtotal = cartSubtotal(lines);
  const count = cartCount(lines);

  return (
    <div className="bg-surface" style={{ paddingTop: 144, paddingBottom: 'var(--space-10)' }}>
      <div className="container-page max-w-[960px]">
        <p className="eyebrow text-mute mb-6" style={{ letterSpacing: '0.26em' }}>
          — Your bag
        </p>
        <h1
          className="font-display text-display-l mb-12 text-balance"
          style={{ fontWeight: 400, lineHeight: 0.95 }}
        >
          Review and check out.
        </h1>

        {lines.length === 0 ? (
          <div className="bg-paper border border-hairline rounded-lg p-12 text-center">
            <p className="font-display text-h2 mb-3" style={{ fontWeight: 400 }}>
              Your bag is empty.
            </p>
            <p className="text-mute mb-6">Start with the collection.</p>
            <Link href="/#collection" className="pill-button pill-button-primary inline-flex">
              See coffees
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_320px] gap-12">
            <ul className="divide-y divide-hairline border-y border-hairline">
              {lines.map((line) => {
                const product = getProduct(line.slug);
                if (!product) return null;
                return (
                  <li key={`${line.slug}-${line.grind}`} className="flex gap-6 py-6">
                    <div className="relative w-[120px] h-[120px] bg-paper border border-hairline rounded-md overflow-hidden flex-shrink-0">
                      <CountryTag
                        country={product.country}
                        size="sm"
                        label={product.name}
                        className="w-full"
                      />
                      <div className="absolute inset-0 top-4 pointer-events-none">
                        <TopoLines opacity={0.4} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-h2 mb-1" style={{ fontWeight: 400 }}>
                        {product.fullName}
                      </p>
                      <p className="text-caption text-mute mb-4">
                        {GRIND_LABELS[line.grind]} · {product.weight}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 border border-hairline rounded-pill px-3 py-1">
                          <button
                            onClick={() => setQuantity(line.slug, line.grind, line.quantity - 1)}
                            className="hover:bg-fog rounded-full w-7 h-7"
                          >
                            −
                          </button>
                          <span className="font-mono w-6 text-center">{line.quantity}</span>
                          <button
                            onClick={() => setQuantity(line.slug, line.grind, line.quantity + 1)}
                            className="hover:bg-fog rounded-full w-7 h-7"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => remove(line.slug, line.grind)}
                          className="text-caption text-mute hover:text-ink underline-expand"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-body">
                        {formatTRY(line.unitPrice * line.quantity)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <aside className="bg-paper border border-hairline rounded-lg p-6 h-fit sticky top-32">
              <p className="eyebrow text-mute mb-4">— Summary</p>
              <dl className="grid grid-cols-2 gap-y-2 mb-4">
                <dt className="text-caption text-mute">
                  Subtotal ({count} {count === 1 ? 'bag' : 'bags'})
                </dt>
                <dd className="font-mono text-right">{formatTRY(subtotal)}</dd>
                <dt className="text-caption text-mute">Shipping</dt>
                <dd className="text-caption text-mute text-right">at checkout</dd>
              </dl>
              <div className="hairline mb-4" />
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-caption text-mute">Total</span>
                <span className="font-display text-h3" style={{ fontWeight: 500 }}>
                  {formatTRY(subtotal)}
                </span>
              </div>
              <Link href="/checkout" className="pill-button pill-button-primary w-full justify-center">
                Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
