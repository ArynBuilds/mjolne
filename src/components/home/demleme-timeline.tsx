import type { BrewGuide } from '@/lib/brew-guides';

type Locale = 'tr' | 'en';

interface DemlemeTimelineProps {
  guide: BrewGuide;
  locale: Locale;
  conditionLabels: Record<string, string>;
}

export function DemlemeTimeline({
  guide,
  locale,
  conditionLabels,
}: DemlemeTimelineProps) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-5)' }}>
      <ol
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        {guide.timeline.map((row, i) => (
          <li
            key={i}
            className="grid"
            style={{
              gridTemplateColumns: '64px 16px 1fr',
              columnGap: 'var(--space-3)',
              alignItems: 'baseline',
            }}
          >
            <span
              className="font-mono text-mute"
              style={{
                fontSize: 13,
                letterSpacing: '0.04em',
                textAlign: 'right',
                fontWeight: 500,
              }}
            >
              {row.t}
            </span>
            <span
              className="font-mono text-mute"
              style={{ fontSize: 13, textAlign: 'center' }}
              aria-hidden
            >
              →
            </span>
            <span
              className="font-mono text-ink"
              style={{
                fontSize: 13,
                lineHeight: 1.55,
                letterSpacing: '0.01em',
              }}
            >
              {locale === 'tr' ? row.step : row.stepEN}
            </span>
          </li>
        ))}
      </ol>

      <div
        aria-hidden
        style={{
          height: '0.5px',
          background: 'var(--color-hairline)',
        }}
      />

      <dl
        className="grid"
        style={{
          gridTemplateColumns: '88px 1fr',
          rowGap: 'var(--space-3)',
          columnGap: 'var(--space-4)',
          margin: 0,
        }}
      >
        {guide.conditions.map((c) => (
          <ConditionRow
            key={c.labelKey}
            label={conditionLabels[c.labelKey] ?? c.labelKey}
            value={c.value}
          />
        ))}
      </dl>
    </div>
  );
}

function ConditionRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt
        className="font-mono text-mute"
        style={{
          fontSize: 10,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        {label}
      </dt>
      <dd
        className="font-mono text-ink"
        style={{
          fontSize: 13,
          letterSpacing: '0.02em',
          margin: 0,
        }}
      >
        {value}
      </dd>
    </>
  );
}
