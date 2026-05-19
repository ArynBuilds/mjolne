import { cn } from '@/lib/utils';

interface HolographicBorderProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  radius?: number;
  active?: boolean;
}

export function HolographicBorder({
  children,
  className,
  innerClassName,
  radius = 8,
  active = true,
}: HolographicBorderProps) {
  return (
    <div
      className={cn('relative', className)}
      style={{
        padding: 1,
        borderRadius: radius,
        backgroundImage: active ? 'var(--gradient-holo-active)' : 'var(--gradient-holo)',
      }}
    >
      <div
        className={cn('bg-paper w-full h-full', innerClassName)}
        style={{ borderRadius: radius - 1 }}
      >
        {children}
      </div>
    </div>
  );
}
