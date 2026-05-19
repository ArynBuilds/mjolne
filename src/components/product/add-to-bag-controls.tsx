'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCart, type GrindKey } from '@/lib/cart-store';
import { formatTRY } from '@/lib/format';
import type { Product } from '@/lib/products';
import { cn } from '@/lib/utils';

const GRINDS: { key: GrindKey; label: string }[] = [
  { key: 'whole-bean', label: 'Whole bean' },
  { key: 'espresso', label: 'Espresso' },
  { key: 'filter', label: 'Filter' },
  { key: 'french-press', label: 'French press' },
  { key: 'moka', label: 'Moka' },
];

interface AddToBagControlsProps {
  product: Product;
}

export function AddToBagControls({ product }: AddToBagControlsProps) {
  const defaultGrind: GrindKey = product.brew === 'Espresso' ? 'espresso' : 'filter';
  const [grind, setGrind] = useState<GrindKey>(defaultGrind);
  const add = useCart((s) => s.add);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="eyebrow text-mute mb-2">Grind</p>
        <div className="flex flex-wrap gap-2">
          {GRINDS.map((g) => {
            const selected = g.key === grind;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setGrind(g.key)}
                className={cn(
                  'px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-medium rounded-pill border transition-colors duration-200',
                  selected
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-paper text-ink border-hairline hover:border-mute',
                )}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() =>
            add({
              slug: product.slug,
              grind,
              quantity: 1,
              unitPrice: product.price,
            })
          }
          className="pill-button pill-button-primary justify-center"
          style={{ height: 52, fontSize: 12 }}
        >
          Add to bag — {product.weight} · {formatTRY(product.price)}
        </button>
        <Link
          href="/subscribe"
          className="pill-button border border-ink text-ink justify-center hover:bg-ink hover:text-paper"
          style={{
            height: 52,
            fontSize: 12,
            background: 'transparent',
          }}
        >
          Subscribe — from {formatTRY(240)} <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
