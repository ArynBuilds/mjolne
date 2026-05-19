'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useCart, cartCount } from '@/lib/cart-store';

type IntroState = 'hero' | 'shelf' | null;

export function StickyPillHeader() {
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement>(null);
  const [sentinelOut, setSentinelOut] = useState(false);
  const [introState, setIntroState] = useState<IntroState>(null);

  const lines = useCart((s) => s.lines);
  const openBag = useCart((s) => s.open);
  const count = cartCount(lines);

  // Watch the hero sentinel via IntersectionObserver — drives transparent ↔ solid
  // on pages that don't have the wheel-jacked intro (everywhere except home, and
  // home once you've scrolled past the intro).
  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel');
    if (!sentinel) {
      setSentinelOut(true);
      setIntroState(null);
      return;
    }
    setSentinelOut(false);

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setSentinelOut(!entry.isIntersecting);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -88% 0px' },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [pathname]);

  // Listen to the intro state machine — when the user reaches the shelf
  // (products) state we want the header to solidify immediately, even though
  // scrollY is still 0. The sentinel-driven path still handles the rest.
  useEffect(() => {
    function onIntroState(e: Event) {
      const detail = (e as CustomEvent<{ state: IntroState }>).detail;
      setIntroState(detail?.state ?? null);
    }
    window.addEventListener('intro:state', onIntroState);
    return () => window.removeEventListener('intro:state', onIntroState);
  }, []);

  // Solid the moment products appear, OR once the hero sentinel has exited.
  const solid = sentinelOut || introState === 'shelf';
  const hidden = false;

  const onCoffeeClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (pathname === '/') {
        // Let the intro state machine handle the transition — it knows the
        // GSAP timeline and scroll positioning.
        window.dispatchEvent(new CustomEvent('intro:request-shelf'));
      } else {
        router.push('/#collection');
      }
    },
    [pathname, router],
  );

  const onLogoClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname === '/') {
        // Already on home — reset the state machine back to hero instead of
        // doing a no-op route push.
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('intro:request-hero'));
      }
      // Otherwise let the Link navigate to /.
    },
    [pathname],
  );

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed left-1/2 z-50 flex items-center justify-between',
        'transition-[background,color,border-color,box-shadow,backdrop-filter,transform,opacity] duration-[400ms] ease-out-expo',
      )}
      style={{
        top: 16,
        height: 56,
        minWidth: 720,
        maxWidth: 'calc(100vw - 64px)',
        padding: '8px 24px',
        borderRadius: 'var(--radius-pill)',
        background: solid ? 'var(--color-fog)' : 'transparent',
        color: solid ? 'var(--color-ink)' : 'var(--color-paper)',
        border: solid
          ? '0.5px solid var(--color-hairline)'
          : '1px solid rgba(255,255,255,0.30)',
        backdropFilter: solid ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(20px) saturate(180%)' : 'none',
        boxShadow: solid ? 'var(--shadow-card)' : 'none',
        // Compose the centering translate with an optional translateY so we
        // can slide the pill out of view during the hexagon state without
        // fighting Tailwind's transform variables.
        transform: `translateX(-50%) translateY(${hidden ? 'calc(-100% - 32px)' : '0'})`,
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
      }}
      data-state={hidden ? 'hidden' : solid ? 'solid' : 'transparent'}
    >
      <Link
        href="/"
        onClick={onLogoClick}
        className="font-display tracking-[0.02em] hover:scale-[1.02] transition-transform duration-200 ease-out-quart"
        style={{ fontSize: 18, fontWeight: 500 }}
        aria-label="MJØLNE home"
      >
        MJØLNE
      </Link>

      <nav className="flex items-center gap-7 text-[11px] uppercase tracking-[0.18em] font-medium">
        <a href="/#collection" onClick={onCoffeeClick} className="underline-expand">
          {t('coffee')}
        </a>
        <Link href="/subscribe" className="underline-expand">
          {t('subscribe')}
        </Link>
        <Link href="/brew-guide" className="underline-expand">
          {t('brewGuide')}
        </Link>
        <Link href="/story" className="underline-expand">
          {t('story')}
        </Link>
      </nav>

      <button
        type="button"
        onClick={openBag}
        className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-medium underline-expand"
        aria-label={`${t('bag')} (${count})`}
      >
        <ShoppingBag size={14} strokeWidth={1.5} aria-hidden />
        <span>
          {t('bag')} ({count})
        </span>
      </button>
    </header>
  );
}
