import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import './globals.css';
import { fontDisplay, fontSans, fontMono } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { StickyPillHeader } from '@/components/header/sticky-pill-header';
import { Footer } from '@/components/footer/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';

export const metadata: Metadata = {
  title: {
    default: 'MJØLNE Roastery Co.',
    template: '%s — MJØLNE Roastery Co.',
  },
  description: 'Crafted for early risers. Single-origin coffee, roasted Tuesdays in Istanbul.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'MJØLNE Roastery Co.',
    images: ['/images/og/og-default.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAFAFA',
  colorScheme: 'light',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MJØLNE Roastery Co.',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mjolne.co',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mjolne.co'}/icon.svg`,
    address: { '@type': 'PostalAddress', addressLocality: 'Istanbul', addressCountry: 'TR' },
  };

  return (
    <html lang={locale} className={cn(fontDisplay.variable, fontSans.variable, fontMono.variable)}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StickyPillHeader />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
