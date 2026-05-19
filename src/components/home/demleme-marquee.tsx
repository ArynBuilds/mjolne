import type { BrewGuide } from '@/lib/brew-guides';

interface DemlemeMarqueeProps {
  guide: BrewGuide;
}

function buildPhrase(g: BrewGuide): string {
  const r = g.headline;
  return [
    g.name.toUpperCase(),
    r.coffee,
    r.water,
    r.time,
    r.ratio,
    `${g.recipe?.grind ?? ''}`.toUpperCase(),
  ]
    .filter(Boolean)
    .join('   ·   ');
}

export function DemlemeMarquee({ guide }: DemlemeMarqueeProps) {
  const phrase = buildPhrase(guide);
  const copies = Array.from({ length: 6 }, () => `${phrase}   ·   `).join('');

  return (
    <div
      aria-hidden
      style={{
        overflow: 'hidden',
        background: 'var(--color-paper)',
        borderTop: '0.5px solid var(--color-hairline)',
        borderBottom: '0.5px solid var(--color-hairline)',
        height: 36,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="demleme-marquee-track">
        <span
          className="font-mono text-mute"
          style={{
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          {copies}
        </span>
        <span
          className="font-mono text-mute"
          style={{
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          {copies}
        </span>
      </div>
    </div>
  );
}
