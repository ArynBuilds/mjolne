'use client';

import { PRODUCT_LIST } from '@/lib/products';
import { BagTile } from '@/components/primitives/bag-tile';
import type { SubscriptionConfig } from '@/lib/subscription-config';

interface StepOriginProps {
  config: SubscriptionConfig;
  onChange: (slug: SubscriptionConfig['origin']) => void;
}

const TILE_SIZE = 148;

/**
 * 5 origins, all equal size. Flex-wrap with justify-center means the
 * trailing row centers naturally without an orphan-left look. Selection
 * is signalled by a 3px translate-up + an 8px ink dot in the tile corner
 * (same language as the accordion's completed-step badge).
 */
export function StepOrigin({ config, onChange }: StepOriginProps) {
  return (
    <div
      className="flex flex-wrap justify-center"
      style={{ gap: 'var(--space-5)' }}
    >
      {PRODUCT_LIST.map((p) => {
        const selected = config.origin === p.slug;
        return (
          <button
            key={p.slug}
            type="button"
            onClick={() => onChange(p.slug)}
            aria-pressed={selected}
            className="text-center"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              width: TILE_SIZE,
              transform: selected ? 'translateY(-3px)' : 'translateY(0)',
              transition: 'transform 200ms var(--ease-out-quart)',
            }}
          >
            <div className="relative inline-flex items-center justify-center">
              <BagTile product={p} size={TILE_SIZE} forceActive={selected} />
              {selected ? (
                <span
                  aria-hidden
                  className="absolute inline-block rounded-full bg-ink"
                  style={{ width: 8, height: 8, top: 8, right: 8 }}
                />
              ) : null}
            </div>

            <p
              className="font-display"
              style={{
                fontWeight: 400,
                fontSize: 17,
                lineHeight: 1.2,
                letterSpacing: '-0.015em',
                marginTop: 'var(--space-4)',
                color: 'var(--color-ink)',
              }}
            >
              {p.fullName}
            </p>
            <p
              className="text-mute"
              style={{
                fontSize: 12,
                lineHeight: 1.45,
                letterSpacing: '0.01em',
                marginTop: 4,
              }}
            >
              {p.flavorEN.slice(0, 2).join(' · ')}
            </p>
          </button>
        );
      })}
    </div>
  );
}
