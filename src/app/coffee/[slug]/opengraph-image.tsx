import { ImageResponse } from 'next/og';
import { getProduct } from '@/lib/products';

export const runtime = 'edge';
export const alt = 'MJØLNE coffee';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const COUNTRY_TINT: Record<string, string> = {
  peru: '#1C4732',
  ethiopia: '#4475D4',
  colombia: '#6B1818',
  brazil: '#E89832',
};

export default async function OG({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) {
    return new ImageResponse(<div>MJØLNE</div>, size);
  }
  const tint = COUNTRY_TINT[product.country] ?? '#0A0A0A';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#FAFAFA',
          padding: 80,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 70% 50%, ${tint}33 0%, transparent 60%)`,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <span style={{ fontSize: 28, letterSpacing: '0.04em', fontWeight: 500 }}>MJØLNE</span>
          <span style={{ fontSize: 18, letterSpacing: '0.22em', color: '#999', textTransform: 'uppercase' }}>
            Roastery Co.
          </span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 720 }}>
            <span
              style={{
                background: tint,
                color: 'white',
                padding: '8px 16px',
                fontSize: 18,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                width: 'fit-content',
                marginBottom: 24,
              }}
            >
              {product.name}
            </span>
            <h1 style={{ fontSize: 96, lineHeight: 1, margin: 0, fontWeight: 400 }}>
              {product.region}
            </h1>
            <p style={{ fontSize: 32, color: '#666', marginTop: 24 }}>
              {product.flavorEN.join(' · ')}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, color: '#999', position: 'relative' }}>
          <span>{product.altitude}</span>
          <span>{product.process}</span>
          <span>{product.brew}</span>
        </div>
      </div>
    ),
    size,
  );
}
