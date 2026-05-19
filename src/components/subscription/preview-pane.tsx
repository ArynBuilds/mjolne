import { type Product } from '@/lib/products';
import { ProductBagMock } from '@/components/product/product-bag-mock';
import { CountryTag } from '@/components/primitives/country-tag';
import type { SubscriptionConfig } from '@/lib/subscription-config';
import { GRINDS, VOLUMES, FREQUENCY_LABEL } from '@/lib/subscription-config';

interface PreviewPaneProps {
  product: Product;
  config: SubscriptionConfig;
}

/**
 * Sticky centered preview. Bag and caption stack centered in the column,
 * with a soft radial glow behind the bag. Consistency over asymmetry —
 * the user explicitly asked for centered alignment after a prior pass.
 */
export function PreviewPane({ product, config }: PreviewPaneProps) {
  const grindLabel = GRINDS.find((g) => g.key === config.grind)?.label ?? config.grind;
  const volumeLabel = VOLUMES.find((v) => v.key === config.volume)?.label ?? config.volume;

  return (
    <div
      className="sticky"
      style={{
        top: 160,
        minHeight: 560,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-7)',
        textAlign: 'center',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none"
        style={{
          position: 'absolute',
          inset: '0 -10%',
          background: `radial-gradient(ellipse at 50% 40%, ${product.color}33 0%, transparent 60%)`,
          filter: 'blur(56px)',
          zIndex: -1,
        }}
      />

      <ProductBagMock product={product} width={320} />

      <div
        className="flex flex-col items-center"
        style={{ gap: 'var(--space-3)' }}
      >
        <CountryTag country={product.country} size="md" label={product.name} />
        <p
          className="font-display text-ink"
          style={{
            fontSize: 'clamp(28px, 2.6vw, 36px)',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            fontWeight: 400,
          }}
        >
          {product.fullName}
        </p>
        <p
          className="font-mono text-mute"
          style={{
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          {grindLabel} · {volumeLabel} · {FREQUENCY_LABEL[config.frequency]}
        </p>
      </div>
    </div>
  );
}
