import { useTranslations } from 'next-intl';
import { PRODUCT_LIST, type Product } from '@/lib/products';
import { CountryTag } from '@/components/primitives/country-tag';

type TasteKey =
  | 'tastePeru'
  | 'tasteEthiopiaYirgacheffe'
  | 'tasteEthiopiaLekempti'
  | 'tasteColombia'
  | 'tasteBrazil';

const TASTE_KEY_BY_SLUG: Record<Product['slug'], TasteKey> = {
  peru: 'tastePeru',
  'ethiopia-yirgacheffe': 'tasteEthiopiaYirgacheffe',
  'ethiopia-lekempti': 'tasteEthiopiaLekempti',
  colombia: 'tasteColombia',
  brazil: 'tasteBrazil',
};

export function ZanaatOriginList() {
  const t = useTranslations('zanaat');

  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {PRODUCT_LIST.map((p) => (
        <li
          key={p.slug}
          className="grid items-center"
          style={{
            gridTemplateColumns: '120px 1fr 92px 1fr',
            columnGap: 'var(--space-4)',
            paddingBlock: 'var(--space-4)',
            borderBottom: '0.5px solid var(--color-hairline)',
          }}
        >
          <CountryTag
            country={p.country}
            size="md"
            label={p.name}
            className="self-center justify-self-start"
          />
          <span
            aria-hidden
            style={{
              height: 1,
              background:
                'repeating-linear-gradient(to right, var(--color-hairline) 0 4px, transparent 4px 8px)',
            }}
          />
          <span
            className="font-mono text-ink"
            style={{
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            {p.brewTR}
          </span>
          <span
            className="text-ink/75"
            style={{
              fontSize: 13,
              lineHeight: 1.45,
              letterSpacing: '0.01em',
            }}
          >
            {t(TASTE_KEY_BY_SLUG[p.slug])}
          </span>
        </li>
      ))}
    </ol>
  );
}
