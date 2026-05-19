import { cn } from '@/lib/utils';
import type { CountryKey } from '@/lib/products';

interface CountryTagProps {
  country: CountryKey;
  size?: 'sm' | 'md';
  label?: string;
  className?: string;
}

const colorMap: Record<CountryKey, string> = {
  peru: 'var(--color-peru)',
  ethiopia: 'var(--color-ethiopia)',
  colombia: 'var(--color-colombia)',
  brazil: 'var(--color-brazil)',
};

const sizeMap = {
  sm: { h: 14, px: 8, fs: 7 },
  md: { h: 22, px: 10, fs: 11 },
} as const;

export function CountryTag({ country, size = 'md', label, className }: CountryTagProps) {
  const s = sizeMap[size];
  return (
    <span
      className={cn('inline-flex items-center justify-center text-paper font-medium uppercase whitespace-nowrap', className)}
      style={{
        height: s.h,
        paddingInline: s.px,
        fontSize: s.fs,
        letterSpacing: '0.14em',
        background: colorMap[country],
        borderRadius: 0,
      }}
    >
      {label ?? country}
    </span>
  );
}
