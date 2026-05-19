import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/products';
import { BREW_GUIDES } from '@/lib/brew-guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    '/',
    '/subscribe',
    '/brew-guide',
    '/story',
    '/login',
    '/signup',
  ].map((p) => ({ url: `${base}${p}`, lastModified: now }));

  const productRoutes: MetadataRoute.Sitemap = Object.keys(PRODUCTS).map((slug) => ({
    url: `${base}/coffee/${slug}`,
    lastModified: now,
  }));

  const brewRoutes: MetadataRoute.Sitemap = Object.keys(BREW_GUIDES).map((slug) => ({
    url: `${base}/brew-guide/${slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...productRoutes, ...brewRoutes];
}
