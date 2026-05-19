import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProduct } from '@/lib/products';
import { ProductDetail } from '@/components/product/product-detail';

interface Params {
  slug: string;
}

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProduct(params.slug);
  if (!p) return { title: 'Coffee' };
  return {
    title: p.fullName,
    description: `${p.fullName} — ${p.flavorEN.join(', ')}. Brewed for ${p.brew}. ${p.altitude}.`,
  };
}

export default function CoffeePage({ params }: { params: Params }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.fullName,
    description: `${product.flavorEN.join(', ')}. Brewed for ${product.brew}. ${product.altitude}.`,
    brand: { '@type': 'Brand', name: 'MJØLNE Roastery Co.' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TRY',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <ProductDetail product={product} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
