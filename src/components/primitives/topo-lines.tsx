import { cn } from '@/lib/utils';

interface TopoLinesProps {
  className?: string;
  strokeWidth?: number;
  opacity?: number;
}

const PATHS = [
  'M0 14 Q25 6 50 14 T100 14',
  'M0 26 Q25 18 50 26 T100 26',
  'M0 40 Q25 32 50 40 T100 40',
  'M0 54 Q25 46 50 54 T100 54',
  'M0 68 Q25 60 50 68 T100 68',
  'M0 82 Q25 74 50 82 T100 82',
];

export function TopoLines({ className, strokeWidth = 0.5, opacity = 0.32 }: TopoLinesProps) {
  return (
    <svg
      viewBox="0 0 100 96"
      preserveAspectRatio="none"
      className={cn('block w-full h-full', className)}
      aria-hidden
      focusable="false"
    >
      <g stroke="#BBBBBB" fill="none" strokeWidth={strokeWidth} opacity={opacity}>
        {PATHS.map((d, i) => (
          <path key={i} d={d} className="topo-stroke" />
        ))}
      </g>
    </svg>
  );
}
