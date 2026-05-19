'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
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

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const lines = useCart((s) => s.lines);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  const subtotal = cartSubtotal(lines);
  const count = cartCount(lines);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!isOpen}
        onClick={close}
        className="fixed inset-0 bg-ink/30 z-40 transition-opacity duration-300"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        className="fixed top-0 right-0 z-50 h-screen bg-paper flex flex-col"
        style={{
          width: 480,
          transform: `translateX(${isOpen ? '0' : '100%'})`,
          transition: 'transform 460ms var(--ease-out-expo)',
          boxShadow: isOpen ? '-32px 0 80px -32px rgba(10,10,10,0.18)' : 'none',
        }}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-hairline">
          <h2 className="font-display text-h3" style={{ fontWeight: 500 }}>
            Your bag
          </h2>
          <button
            type="button"
            onClick={close}
            className="hover:bg-fog rounded-full p-2 transition-colors"
            aria-label="Close cart"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {lines.length === 0 ? (
            <EmptyCart onClose={close} />
          ) : (
            <ul className="divide-y divide-hairline">
              {lines.map((line) => {
                const product = getProduct(line.slug);
                if (!product) return null;
                return (
                  <li key={`${line.slug}-${line.grind}`} className="flex gap-4 px-6 py-5">
                    {/* Mini bag mock */}
                    <div className="relative w-[88px] h-[88px] bg-paper border border-hairline rounded-md overflow-hidden flex-shrink-0">
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

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-h3 leading-none mb-1" style={{ fontWeight: 500 }}>
                            {product.fullName}
                          </p>
                          <p className="text-caption text-mute">
                            {GRIND_LABELS[line.grind]} · {product.weight}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(line.slug, line.grind)}
                          className="text-caption text-mute hover:text-ink underline-expand"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-3">
                        <div className="flex items-center gap-3 border border-hairline rounded-pill px-2 py-1">
                          <button
                            type="button"
                            onClick={() => setQuantity(line.slug, line.grind, line.quantity - 1)}
                            className="hover:bg-fog rounded-full p-1"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} strokeWidth={1.5} />
                          </button>
                          <span className="font-mono text-caption w-6 text-center">{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(line.slug, line.grind, line.quantity + 1)}
                            className="hover:bg-fog rounded-full p-1"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                        <span className="font-mono text-body">
                          {formatTRY(line.unitPrice * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 ? (
          <footer className="border-t border-hairline px-6 py-5">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-caption text-mute">
                Subtotal ({count} {count === 1 ? 'bag' : 'bags'})
              </span>
              <span className="font-display text-h3" style={{ fontWeight: 500 }}>
                {formatTRY(subtotal)}
              </span>
            </div>
            <p className="text-caption text-mute mb-4">Shipping calculated at checkout.</p>
            <Link
              href="/checkout"
              onClick={close}
              className="pill-button pill-button-primary w-full justify-center"
            >
              Checkout
            </Link>
          </footer>
        ) : null}
      </aside>
    </>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="font-display text-h2 mb-3" style={{ fontWeight: 400 }}>
        Your bag is empty.
      </p>
      <p className="text-mute text-body mb-6">Start with the collection.</p>
      <Link
        href="/#collection"
        onClick={onClose}
        className="pill-button pill-button-primary inline-flex"
      >
        See coffees
      </Link>
    </div>
  );
}
