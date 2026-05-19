'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PRODUCT_LIST } from '@/lib/products';
import { ProductShelfColumn } from './product-shelf-column';

const PLACEHOLDER_GRADIENT =
  'linear-gradient(135deg, #2A1A14 0%, #4A2C1F 35%, #1A0F0A 70%)';

/**
 * Reduced-motion fallback for the home intro. Mirrors the scrubbed layout
 * (cinematic strip + product shelf) but without any GSAP, scroll-jacking,
 * or pin behaviour — everything scrolls naturally.
 */
export function StaticIntro() {
  const tHero = useTranslations('hero');
  const tCol = useTranslations('collection');
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/videos/roastery-loop.mp4', { method: 'HEAD', signal: ctrl.signal })
      .then((r) => setHasVideo(r.ok))
      .catch(() => setHasVideo(false));
    return () => ctrl.abort();
  }, []);

  return (
    <>
      {/* Static hero — full-viewport video with headline overlay. */}
      <section
        id="intro"
        className="relative w-full overflow-hidden bg-ink"
        style={{ height: '100vh' }}
      >
        <div
          id="hero-sentinel"
          aria-hidden
          style={{ position: 'absolute', inset: 0, height: '60vh' }}
        />

        {hasVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/roastery-loop.webm" type="video/webm" />
            <source src="/videos/roastery-loop.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0" style={{ background: PLACEHOLDER_GRADIENT }} />
        )}

        <div className="absolute inset-0 bg-ink/15 pointer-events-none" aria-hidden />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-paper pointer-events-none">
          <div className="container-page text-center">
            <h1
              className="font-display whitespace-nowrap mb-10"
              style={{
                fontSize: 'clamp(64px, 6.5vw, 110px)',
                fontWeight: 500,
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
              }}
            >
              {tHero('headline')}{' '}
              <em className="font-display italic" style={{ fontWeight: 500 }}>
                {tHero('headlineEm')}
              </em>
            </h1>
            <div className="flex items-center justify-center gap-3 pointer-events-auto">
              <Link href="#collection" className="pill-button pill-button-light">
                {tHero('ctaPrimary')}
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
              <Link href="/subscribe" className="pill-button pill-button-ghost-on-dark">
                {tHero('ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Static shelf — cinematic strip + 5-column product wall. */}
      <section
        id="collection"
        className="relative bg-surface"
        style={{ height: '100vh' }}
      >
        {/* Strip — replays the look of the post-scrub mast without any motion. */}
        <div
          className="relative overflow-hidden bg-ink"
          style={{ height: '22vh' }}
        >
          {hasVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/roastery-loop.webm" type="video/webm" />
              <source src="/videos/roastery-loop.webm" type="video/webm" />
            <source src="/videos/roastery-loop.mp4" type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0" style={{ background: PLACEHOLDER_GRADIENT }} />
          )}

          <div className="absolute inset-0 bg-ink/15 pointer-events-none" aria-hidden />

          <div
            className="absolute left-0 right-0 text-paper pointer-events-none"
            style={{ bottom: 0, padding: '0 32px 18px' }}
          >
            <div className="max-w-[60ch]">
              <p
                className="uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.28em',
                  opacity: 0.78,
                  marginBottom: 10,
                  fontWeight: 500,
                }}
              >
                Beş köken · Tek zanaat
              </p>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(22px, 2.2vw, 30px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  fontWeight: 500,
                  textWrap: 'balance',
                }}
              >
                {tCol('headline')}{' '}
                <em className="font-display italic">{tCol('headlineEm')}</em>{' '}
                {tCol('headlineTail')}
              </h2>
            </div>
          </div>
        </div>

        {/* Shelf row */}
        <div className="flex" style={{ height: '78vh' }}>
          {PRODUCT_LIST.map((p, i) => (
            <ProductShelfColumn
              key={p.slug}
              product={p}
              index={i + 1}
              total={PRODUCT_LIST.length}
              hairlineLeft={i > 0}
            />
          ))}
        </div>
      </section>
    </>
  );
}
