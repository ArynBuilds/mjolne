'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCart, type GrindKey } from '@/lib/cart-store';
import { formatTRY } from '@/lib/format';
import type { Product, CountryKey } from '@/lib/products';
import { HoloSticker } from '@/components/primitives/holo-sticker';

const COUNTRY_COLOR: Record<CountryKey, string> = {
  peru: 'var(--color-peru)',
  ethiopia: 'var(--color-ethiopia)',
  colombia: 'var(--color-colombia)',
  brazil: 'var(--color-brazil)',
};

interface ProductShelfColumnProps {
  product: Product;
  index: number;
  total: number;
  hairlineLeft?: boolean;
}

export function ProductShelfColumn({
  product,
  index,
  total,
  hairlineLeft = true,
}: ProductShelfColumnProps) {
  const [hovered, setHovered] = useState(false);
  const add = useCart((s) => s.add);
  const grind: GrindKey = product.brew === 'Espresso' ? 'espresso' : 'filter';
  const brewSlug = product.brew.toLowerCase();
  const countryColor = COUNTRY_COLOR[product.country];

  const handleAdd = () => {
    add({
      slug: product.slug,
      grind,
      quantity: 1,
      unitPrice: product.price,
    });
  };

  return (
    <div
      className="shelf-column relative flex-1 min-w-0 h-full flex flex-col bg-paper"
      style={{
        borderLeft: hairlineLeft ? '0.5px solid var(--color-hairline)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hovered={hovered ? 'true' : 'false'}
    >
      {/* HEADER BAND — full-width country color. Region on the left,
          ordinal on the right. Mirrors the packaging dieline. */}
      <div
        className="relative flex items-center justify-between text-paper"
        style={{
          background: countryColor,
          height: 36,
          paddingInline: 20,
        }}
      >
        <span
          className="uppercase font-medium"
          style={{
            fontSize: 11,
            letterSpacing: hovered ? '0.22em' : '0.18em',
            transition: 'letter-spacing 320ms var(--ease-out-quart)',
          }}
        >
          {product.name} · {product.region}
        </span>
        <span
          className="font-mono"
          style={{ fontSize: 11, letterSpacing: '0.04em', opacity: 0.78 }}
        >
          {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* PHOTO BLOCK — bag photo + holo. The whole block routes to the
          PDP. Country-tinted radial sits behind to give each column its
          own atmosphere without backgrounds competing with the bag. */}
      <Link
        href={`/coffee/${product.slug}`}
        className="relative block flex-1 min-h-0 overflow-hidden focus:outline-none"
        aria-label={`${product.fullName} — detayları aç`}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 36%, ${product.color}14 0%, transparent 62%)`,
            opacity: hovered ? 1 : 0.7,
            transition: 'opacity 320ms var(--ease-out-quart)',
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative"
            style={{
              width: '78%',
              height: '78%',
              transform: hovered
                ? 'scale(1.045) translateY(-4px)'
                : 'scale(1) translateY(0)',
              transition: 'transform 540ms var(--ease-out-expo)',
              filter: hovered
                ? 'drop-shadow(0 22px 30px rgba(10,10,10,0.22))'
                : 'drop-shadow(0 6px 10px rgba(10,10,10,0.06))',
              transitionProperty: 'transform, filter',
              transitionDuration: '540ms',
              transitionTimingFunction: 'var(--ease-out-expo)',
            }}
          >
            <Image
              src={`/images/products/${product.slug}.png`}
              alt={product.fullName}
              fill
              sizes="(min-width: 1440px) 280px, 22vw"
              priority={index <= 2}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Holo sticker pinned to the bottom of the photo area. Shimmers
            on hover; the primary token is the region, secondary is the brew. */}
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ bottom: 16 }}
        >
          <HoloSticker
            primary={product.region.split(' ')[0]}
            secondary={product.brew.toUpperCase()}
            size="md"
            active={false}
            className="holo-shimmer"
          />
        </div>
      </Link>

      {/* INFO BLOCK — always-on. Buyer reads the whole column without
          having to hover anything. */}
      <div
        className="relative flex flex-col gap-4"
        style={{
          borderTop: '0.5px solid var(--color-hairline)',
          padding: '22px 24px 22px',
        }}
      >
        <div>
          <p className="eyebrow">TAT PROFİLİ</p>
          <p
            className="text-ink mt-2"
            style={{
              fontSize: 15,
              lineHeight: 1.42,
              fontWeight: 400,
              maxWidth: '34ch',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: `calc(3 * 1.42em)`,
            }}
          >
            {product.flavorTR.join(', ')}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <SpecField label="VARYETE" value={product.variety} />
          <SpecField label="İŞLEME" value={product.processTR} />
          <SpecField label="RAKIM" value={product.altitude} />
        </div>

        <div
          className="flex items-end justify-between gap-3"
          style={{ marginTop: 2 }}
        >
          <div>
            <p
              className="eyebrow"
              style={{ marginBottom: 4, fontSize: 9 }}
            >
              FİYAT · {product.weight}
            </p>
            <p
              className="font-display text-ink"
              style={{
                fontSize: 28,
                lineHeight: 1,
                letterSpacing: '-0.025em',
                fontWeight: 500,
              }}
            >
              {formatTRY(product.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="pill-button"
            style={{
              height: 42,
              background: hovered ? 'var(--color-ink)' : 'transparent',
              color: hovered ? 'var(--color-paper)' : 'var(--color-ink)',
              border: '1px solid var(--color-ink)',
              fontSize: 11,
              paddingInline: 18,
            }}
          >
            Sepete ekle
            <ArrowRight size={12} strokeWidth={1.5} />
          </button>
        </div>

        <Link
          href={`/brew-guide/${brewSlug}`}
          className="text-mute underline-expand inline-flex items-center gap-1.5 self-start"
          style={{
            fontSize: 10,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Demleme rehberi
          <ArrowRight size={11} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}

interface SpecFieldProps {
  label: string;
  value: string;
}

function SpecField({ label, value }: SpecFieldProps) {
  return (
    <div className="min-w-0">
      <p className="eyebrow" style={{ fontSize: 9 }}>
        {label}
      </p>
      <p
        className="font-mono mt-1.5 text-ink"
        style={{
          fontSize: 12,
          letterSpacing: '0.02em',
          lineHeight: 1.3,
          minHeight: '2.6em',
        }}
      >
        {value}
      </p>
    </div>
  );
}
