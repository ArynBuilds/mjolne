'use client';

import { useCart, cartCount, cartSubtotal } from '@/lib/cart-store';
import { getProduct } from '@/lib/products';
import { formatTRY } from '@/lib/format';

const GRIND_LABELS: Record<string, string> = {
  'whole-bean': 'Whole bean',
  'espresso': 'Espresso',
  'filter': 'Filter',
  'french-press': 'French press',
  'moka': 'Moka',
};

export function OrderSummary() {
  const lines = useCart((s) => s.lines);
  const subtotal = cartSubtotal(lines);
  const count = cartCount(lines);

  return (
    <aside className="bg-paper border border-hairline rounded-lg p-6 sticky top-32 h-fit">
      <p className="eyebrow text-mute mb-4">— Your order</p>
      <ul className="flex flex-col gap-4 mb-5">
        {lines.map((line) => {
          const product = getProduct(line.slug);
          if (!product) return null;
          return (
            <li key={`${line.slug}-${line.grind}`} className="flex justify-between text-body">
              <div>
                <p>{product.fullName}</p>
                <p className="text-caption text-mute">
                  {GRIND_LABELS[line.grind]} · {line.quantity} × {product.weight}
                </p>
              </div>
              <span className="font-mono">{formatTRY(line.unitPrice * line.quantity)}</span>
            </li>
          );
        })}
      </ul>
      <div className="hairline mb-4" />
      <div className="flex justify-between mb-2 text-caption text-mute">
        <span>
          Subtotal ({count} {count === 1 ? 'bag' : 'bags'})
        </span>
        <span>{formatTRY(subtotal)}</span>
      </div>
      <div className="flex justify-between mb-4 text-caption text-mute">
        <span>Shipping</span>
        <span>Calculated next</span>
      </div>
      <div className="hairline mb-4" />
      <div className="flex items-baseline justify-between">
        <span className="text-caption text-mute">Total</span>
        <span className="font-display text-h3" style={{ fontWeight: 500 }}>
          {formatTRY(subtotal)}
        </span>
      </div>
    </aside>
  );
}
