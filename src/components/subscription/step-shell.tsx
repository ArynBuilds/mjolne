'use client';

import { Check } from 'lucide-react';

interface StepShellProps {
  index: number;
  title: string;
  isOpen: boolean;
  isComplete: boolean;
  isFirst?: boolean;
  summary?: string;
  onOpen: () => void;
  children: React.ReactNode;
}

/**
 * One accordion step inside the configurator paper card. Steps share the
 * card's paper bg — no per-step background toggle. Hairline top divider
 * separates each step from the one above (except the first).
 */
export function StepShell({
  index,
  title,
  isOpen,
  isComplete,
  isFirst,
  summary,
  onOpen,
  children,
}: StepShellProps) {
  return (
    <section
      style={{
        borderTop: isFirst ? 'none' : '0.5px solid var(--color-hairline)',
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="w-full flex items-center justify-between text-left"
        style={{ paddingBlock: 'var(--space-6)' }}
      >
        <div className="flex items-baseline" style={{ gap: 'var(--space-5)' }}>
          <span
            className="font-mono text-mute"
            style={{
              fontSize: 11,
              letterSpacing: '0.22em',
              fontWeight: 500,
              width: 24,
            }}
          >
            {String(index).padStart(2, '0')}
          </span>
          <h2 className="font-display text-h2" style={{ fontWeight: 400 }}>
            {title}
          </h2>
        </div>
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          {summary && !isOpen ? (
            <span className="text-caption text-mute">{summary}</span>
          ) : null}
          {isComplete && !isOpen ? (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ink text-paper">
              <Check size={12} strokeWidth={2} />
            </span>
          ) : null}
        </div>
      </button>

      <div
        className="overflow-hidden grid"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transitionProperty: 'grid-template-rows',
          transitionDuration: '500ms',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      >
        <div className="min-h-0 overflow-hidden">
          <div style={{ paddingBottom: 'var(--space-7)' }}>{children}</div>
        </div>
      </div>
    </section>
  );
}
