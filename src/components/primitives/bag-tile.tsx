'use client';

import { useState, type MouseEventHandler } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/products';
import { CountryTag } from './country-tag';
import { TopoLines } from './topo-lines';
import { HoloSticker } from './holo-sticker';

interface BagTileProps {
  product: Product;
  size?: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
  forceActive?: boolean;
  dimmed?: boolean;
  scale?: number;
}

// Layered composition: product image as the main visual, with country tag,
// topo decoration, and holo sticker overlaid for readable identity at the
// 165px hex size.
export function BagTile({
  product,
  size = 110,
  onClick,
  className,
  forceActive = false,
  dimmed = false,
  scale = 1,
}: BagTileProps) {
  const [hover, setHover] = useState(false);
  const active = hover || forceActive;

  const innerSize: 'sm' | 'md' = size <= 130 ? 'sm' : 'md';

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
      className={cn(
        'relative overflow-hidden bg-paper select-none',
        onClick && 'cursor-pointer',
        className,
      )}
      style={{
        width: size,
        height: size,
        borderRadius: 16,
        border: `0.5px solid ${active ? 'rgba(153,153,153,0.30)' : 'var(--color-hairline)'}`,
        transform: `translateY(${active ? -2 : 0}px) scale(${scale})`,
        opacity: dimmed ? 0.6 : 1,
        transition:
          'transform 200ms var(--ease-out-quart), opacity 200ms var(--ease-out-quart), border-color 200ms var(--ease-out-quart)',
        viewTransitionName: `tile-${product.slug}`,
      }}
    >
      <Image
        src={`/images/products/${product.slug}.png`}
        alt={product.fullName}
        width={1000}
        height={1000}
        sizes={`${size}px`}
        priority
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${Math.round(size * 0.83)}px`,
          height: `${Math.round(size * 0.83)}px`,
          objectFit: 'contain',
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 flex justify-center"
        style={{
          transform: active ? 'scaleX(1.07)' : 'scaleX(1)',
          transformOrigin: 'center top',
          transition: 'transform 220ms var(--ease-out-quart)',
        }}
      >
        <CountryTag country={product.country} size={innerSize} label={product.name} className="w-full" />
      </div>

      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: `${size * 0.22}px`,
          height: `${size * 0.42}px`,
        }}
      >
        <TopoLines opacity={active ? 0.5 : 0.32} />
      </div>

      <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: 8 }}>
        <HoloSticker
          primary={product.region.split(' ')[0]}
          size={innerSize}
          active={false}
          className="holo-shimmer"
        />
      </div>
    </div>
  );
}
