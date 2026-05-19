'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PRODUCT_LIST } from '@/lib/products';
import { ProductShelfColumn } from './product-shelf-column';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { runIntroScrub } from './intro-scrub';
import { StaticIntro } from './static-intro';

const PLACEHOLDER_GRADIENT =
  'linear-gradient(135deg, #2A1A14 0%, #4A2C1F 35%, #1A0F0A 70%)';

// Real specialty-coffee brands the brand can plausibly be served at / partnered
// with. Each is styled with its own typographic feel using our three loaded
// faces (display serif, sans, mono) — no extra font payload.
interface Brand {
  name: string;
  family: 'display' | 'sans' | 'mono';
  weight?: 300 | 400 | 500;
  italic?: boolean;
  tracking?: string;
}

const BRANDS: Brand[] = [
  { name: 'Blue Bottle', family: 'display', weight: 400 },
  { name: 'STUMPTOWN', family: 'sans', weight: 500, tracking: '0.18em' },
  { name: 'Intelligentsia', family: 'sans', weight: 400, tracking: '0.04em' },
  { name: 'ONYX', family: 'mono', weight: 500, tracking: '0.32em' },
  { name: 'Counter Culture', family: 'display', italic: true, weight: 400 },
  { name: 'LA COLOMBE', family: 'sans', weight: 500, tracking: '0.22em' },
  { name: 'verve', family: 'display', italic: true, weight: 300 },
  { name: 'HEART', family: 'sans', weight: 500, tracking: '0.4em' },
  { name: 'Sightglass', family: 'display', weight: 400 },
  { name: 'TIM WENDELBOE', family: 'mono', weight: 400, tracking: '0.14em' },
];

const BRAND_FONT_SIZE = 22;

function brandStyle(b: Brand): React.CSSProperties {
  return {
    fontFamily: `var(--font-${b.family})`,
    fontStyle: b.italic ? 'italic' : 'normal',
    fontWeight: b.weight ?? 400,
    letterSpacing: b.tracking ?? 'normal',
    fontSize: BRAND_FONT_SIZE,
    lineHeight: 1,
    color: '#FFFFFF',
    whiteSpace: 'nowrap',
  };
}

export function IntroExperience() {
  const reduced = useReducedMotion();
  if (reduced) return <StaticIntro />;
  return <ScrubbedIntro />;
}

function ScrubbedIntro() {
  const tHero = useTranslations('hero');
  const tCol = useTranslations('collection');
  const sectionRef = useRef<HTMLElement>(null);
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/videos/roastery-loop.mp4', { method: 'HEAD', signal: ctrl.signal })
      .then((r) => setHasVideo(r.ok))
      .catch(() => setHasVideo(false));
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    return runIntroScrub({ section: sectionRef.current });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="relative"
      style={{
        height: '100vh',
        background: 'var(--color-surface)',
      }}
    >
      {/* Anchor for /#collection deep-links. Positioned at the section top so
          the browser's hash-scroll lands the user at scrollY=0 — where the
          wheel-jacked shelf state shows the full cinematic strip + product
          row in viewport. */}
      <span
        id="collection"
        aria-hidden
        style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1 }}
      />

      {/* Sentinel that drives the header's transparent → solid transition. */}
      <div
        id="hero-sentinel"
        aria-hidden
        style={{ position: 'absolute', top: 0, left: 0, height: '30vh', width: '100%' }}
      />

      <div className="intro-pin relative w-full h-screen overflow-hidden bg-ink">
        {/* Surface veil — fades in as the video shrinks so the area below the
            strip becomes paper instead of black. Hidden on first paint so it
            never flashes through during hydration. */}
        <div
          className="intro-surface-veil absolute inset-0 pointer-events-none"
          style={{ background: 'var(--color-paper)', zIndex: 1, opacity: 0 }}
          aria-hidden
        />

        {/* Shelf row — 5 product columns edge-to-edge, parked in the bottom
            ~78vh of the viewport. Hidden until the scrub fades them in.
            Sits ABOVE the surface veil but BELOW the video, so the video
            covers it during 'hero' state. */}
        <div
          className="intro-shelf-row absolute left-0 right-0 flex"
          style={{
            top: '22vh',
            bottom: 0,
            zIndex: 2,
            opacity: 0,
          }}
        >
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

        {/* Shared video wrapper. Starts fullscreen, ends as a cinematic
            top strip (100vw × 22vh). Only height animates; width, x and
            border-radius are constant — the curtain rises. */}
        <div
          className="intro-video-wrapper absolute overflow-hidden"
          style={{
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            borderRadius: 0,
            background: PLACEHOLDER_GRADIENT,
            zIndex: 3,
          }}
        >
          {hasVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/videos/roastery-poster.jpg"
              disablePictureInPicture
              disableRemotePlayback
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/roastery-loop.webm" type="video/webm" />
              <source src="/videos/roastery-loop.mp4" type="video/mp4" />
            </video>
          ) : null}

          <div className="absolute inset-0 bg-ink/15 pointer-events-none" aria-hidden />
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '3px 3px',
            }}
          />

          {/* Strip overlay — eyebrow + editorial tagline pinned bottom of the
              strip. Fades in during scrub via the .intro-strip-overlay class.
              Hidden during 'hero' state. */}
          <div
            className="intro-strip-overlay absolute left-0 right-0 pointer-events-none text-paper"
            style={{
              bottom: 0,
              padding: '0 32px 18px',
              opacity: 0,
              zIndex: 4,
            }}
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

        {/* Hero overlay text + CTAs (fades out during scrub). Headline is
            absolutely positioned at viewport centre so its baseline sits dead
            in the middle of the screen, with the buttons hung just below. */}
        <div
          className="intro-hero-overlay absolute inset-0 pointer-events-none text-paper"
          style={{ zIndex: 10 }}
        >
          <h1
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display whitespace-nowrap text-center"
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
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 pointer-events-auto"
            style={{ top: 'calc(50% + clamp(54px, 7vh, 84px))' }}
          >
            <Link href="/#collection" className="pill-button pill-button-light">
              {tHero('ctaPrimary')}
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
            <Link href="/subscribe" className="pill-button pill-button-ghost-on-dark">
              {tHero('ctaSecondary')}
            </Link>
          </div>
        </div>

        {/* Brand marquee — infinite right-to-left scroll, no background.
            Duplicated content so the loop closes seamlessly via -50% translate.
            Fades out during scrub via the .intro-marquee class. */}
        <div
          className="intro-marquee absolute left-0 right-0 overflow-hidden pointer-events-none"
          style={{ bottom: 32, paddingBlock: 16, zIndex: 10 }}
          aria-label="Partners"
        >
          <div className="brand-marquee-track">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={`${b.name}-${i}`} style={brandStyle(b)}>
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
