import Image from 'next/image';
import type { Product } from '@/lib/products';

interface ProductBagMockProps {
  product: Product;
  width?: number;
}

// Renders the product bag photo (which already carries country tag, holo
// sticker, region, name, and weight baked into the image). Square aspect
// matches the source 1000×1000.
export function ProductBagMock({ product, width = 360 }: ProductBagMockProps) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width,
        height: width,
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        viewTransitionName: `tile-${product.slug}`,
      }}
    >
      <Image
        src={`/images/products/${product.slug}.png`}
        alt={product.fullName}
        width={1000}
        height={1000}
        sizes={`${width}px`}
        priority
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
}
