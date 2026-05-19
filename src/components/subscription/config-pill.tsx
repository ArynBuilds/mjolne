import { cn } from '@/lib/utils';

interface ConfigPillProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  /** Inline secondary caption shown under the label (replaces the old hover-only hint tooltip — keyboard and touch accessible). */
  caption?: string;
  className?: string;
}

export function ConfigPill({ selected, onClick, label, caption, className }: ConfigPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative rounded-pill border transition-colors duration-200 text-left',
        selected ? 'border-ink bg-ink text-paper' : 'border-hairline bg-paper text-ink hover:border-mute',
        className,
      )}
      style={{
        paddingInline: 'var(--space-5)',
        paddingBlock: 'var(--space-3)',
      }}
      aria-pressed={selected}
    >
      <span className="block font-medium" style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        {label}
      </span>
      {caption ? (
        <span
          className={cn('block', selected ? 'text-paper/65' : 'text-mute')}
          style={{ marginTop: 4, fontSize: 12, letterSpacing: '0.02em' }}
        >
          {caption}
        </span>
      ) : null}
    </button>
  );
}
