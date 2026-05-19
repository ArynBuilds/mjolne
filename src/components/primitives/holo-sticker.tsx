import { cn } from '@/lib/utils';

interface HoloStickerProps {
  primary: string;
  secondary?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  active?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { h: 18, primaryFs: 8, secondaryFs: 6, gap: 4, px: 8 },
  md: { h: 28, primaryFs: 11, secondaryFs: 8, gap: 6, px: 12 },
  lg: { h: 40, primaryFs: 15, secondaryFs: 11, gap: 8, px: 16 },
} as const;

export function HoloSticker({
  primary,
  secondary,
  size = 'md',
  animated = false,
  active = false,
  className,
}: HoloStickerProps) {
  const s = sizeMap[size];
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-sm transition-[background-image] duration-[600ms] ease-out-expo',
        animated ? 'holo-shimmer' : '',
        className,
      )}
      style={{
        height: s.h,
        paddingInline: s.px,
        backgroundImage: active ? 'var(--gradient-holo-active)' : 'var(--gradient-holo)',
        backgroundSize: animated ? '200% 200%' : '100% 100%',
        gap: s.gap,
      }}
    >
      <span
        className="font-medium text-ink uppercase whitespace-nowrap"
        style={{
          fontSize: s.primaryFs,
          letterSpacing: '0.12em',
        }}
      >
        {primary}
      </span>
      {secondary ? (
        <>
          <span
            aria-hidden
            className="inline-block bg-ink/40"
            style={{ width: 1, height: s.h - 8 }}
          />
          <span
            className="font-medium text-ink/80 uppercase whitespace-nowrap"
            style={{
              fontSize: s.secondaryFs,
              letterSpacing: '0.14em',
            }}
          >
            {secondary}
          </span>
        </>
      ) : null}
    </div>
  );
}
