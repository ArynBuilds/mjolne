'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PRODUCT_LIST } from '@/lib/products';

export function Footer() {
  const t = useTranslations('footer');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'content-type': 'application/json' },
      });
      setStatus(res.ok ? 'ok' : 'err');
      if (res.ok) setEmail('');
    } catch {
      setStatus('err');
    }
  }

  return (
    <footer className="bg-ink text-paper" style={{ paddingBlock: 'var(--space-9)' }}>
      <div className="container-page">
        {/* Top row — logo and newsletter */}
        <div className="flex flex-wrap items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <p className="font-display text-display-m" style={{ fontWeight: 400 }}>
              MJØLNE
            </p>
            <p className="eyebrow text-white/60 mt-2">Roastery Co.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-3 min-w-[360px]">
            <label htmlFor="newsletter-email" className="sr-only">
              {t('newsletter')}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletterPlaceholder')}
              className="flex-1 bg-transparent border-b border-white/30 focus:border-white outline-none py-2 text-sm placeholder:text-white/40 transition-colors"
            />
            <button
              type="submit"
              className="text-[11px] uppercase tracking-[0.18em] font-medium flex items-center gap-2 underline-expand text-white"
              disabled={status === 'loading'}
            >
              {t('newsletterCta')}
              <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
            </button>
          </form>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-4 gap-8 py-12">
          <Column title={t('coffee')}>
            {PRODUCT_LIST.map((p) => (
              <FooterLink key={p.slug} href={`/coffee/${p.slug}`}>
                {p.fullName}
              </FooterLink>
            ))}
            <FooterLink href="/subscribe">{t('subscribe')}</FooterLink>
          </Column>
          <Column title={t('company')}>
            <FooterLink href="/story">{t('story')}</FooterLink>
            <FooterLink href="/wholesale">{t('wholesale')}</FooterLink>
            <FooterLink href="/press">{t('press')}</FooterLink>
            <FooterLink href="/careers">{t('careers')}</FooterLink>
          </Column>
          <Column title={t('help')}>
            <FooterLink href="/brew-guide">{t('brewGuide')}</FooterLink>
            <FooterLink href="/shipping">{t('shipping')}</FooterLink>
            <FooterLink href="/returns">{t('returns')}</FooterLink>
            <FooterLink href="/account">{t('account')}</FooterLink>
          </Column>
          <Column title={t('visit')}>
            <p className="text-white/70 text-sm leading-relaxed">{t('city')}</p>
            <a href="mailto:hello@mjolne.co" className="text-white/70 hover:text-white text-sm underline-expand">
              hello@mjolne.co
            </a>
            <p className="text-white/70 text-sm">+90 212 555 0144</p>
          </Column>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-white/10 pt-6 flex justify-between items-center text-[12px] text-white/50">
          <span>{t('rights')}</span>
          <span>{t('tagline')}</span>
          <span className="flex gap-6">
            <Link href="/privacy" className="underline-expand hover:text-white">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="underline-expand hover:text-white">
              {t('terms')}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-h3 text-paper mb-4" style={{ fontWeight: 500 }}>
        {title}
      </h3>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-white/70 hover:text-white text-sm underline-expand transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
