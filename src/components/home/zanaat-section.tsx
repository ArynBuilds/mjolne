import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { ZanaatOriginList } from './zanaat-origin-list';

export function ZanaatSection() {
  const t = useTranslations('zanaat');

  return (
    <section
      className="relative"
      style={{
        background: 'var(--color-surface)',
        paddingBlock: 'var(--space-10)',
      }}
      id="zanaat"
    >
      <div className="container-page">
        <header
          className="grid"
          style={{
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
            columnGap: 'var(--space-9)',
            alignItems: 'end',
            marginBottom: 'var(--space-9)',
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <p
              className="eyebrow text-mute"
              style={{ letterSpacing: '0.28em', marginBottom: 'var(--space-5)' }}
            >
              {t('eyebrow')}
            </p>
            <h2
              className="font-display text-ink text-balance"
              style={{
                fontSize: 'clamp(40px, 4.6vw, 64px)',
                lineHeight: 1.02,
                letterSpacing: '-0.028em',
                fontWeight: 400,
              }}
            >
              {t('headline')}{' '}
              <em className="font-display italic" style={{ fontWeight: 400 }}>
                {t('headlineEm')}
              </em>
            </h2>
          </div>

          <p
            className="text-ink/70"
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              maxWidth: '40ch',
              justifySelf: 'end',
            }}
          >
            {t('paragraph')}
          </p>
        </header>

        <ZanaatOriginList />

        <div style={{ marginTop: 'var(--space-7)' }}>
          <Link
            href="/story"
            className="text-ink underline-expand inline-flex items-center gap-2"
            style={{
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 500,
              fontFamily: 'var(--font-mono)',
            }}
          >
            — {t('readStory')}
            <ArrowUpRight size={12} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
