# Demleme Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current flat bento-style brewing-methods section on the home page with a stacked "specimen sheet" of six full-width framed panels, each carrying Hoffmann-grounded recipe data, mono recipe timeline, and a per-panel right-to-left marquee — with medium-intensity entry animations (count-up numbers, fade-in name, staggered timeline rows).

**Architecture:** Pure type (no photography). One section component orchestrates a header + six panel-and-marquee pairs. Panels are framed paper cards on the surface section background; data flows from `BrewGuide` entries in `src/lib/brew-guides.ts`. Counter and intersection animations live in a small client component using `IntersectionObserver` + `requestAnimationFrame`. Marquees are pure CSS keyframes.

**Tech Stack:** Next.js 14 App Router · React Server Components (where possible, client only for animation) · TypeScript strict · Tailwind utilities + CSS variables · `next-intl` for i18n · `lucide-react` for icons · existing primitives (`CountryTag`).

**Repo notes:** Not a git repo (no commits in steps). No test framework installed — verification gates are `npm run lint`, `npx tsc --noEmit`, `npm run build`, and a manual visual check against `http://localhost:3000/`.

---

## File Structure

| File | Role | Created/Modified | Est. lines |
|---|---|---|---|
| `src/lib/brew-guides.ts` | Add `headline`, `timeline`, `conditions` fields per method | Modify | ~290 total |
| `src/components/home/demleme-counter.tsx` | Client component: animates a numeric prefix from 0 → target on viewport entry | Create | ~70 |
| `src/components/home/demleme-timeline.tsx` | Right column — timed rows + conditions table | Create | ~95 |
| `src/components/home/demleme-marquee.tsx` | Horizontal marquee strip showing a panel's parameters scrolling right-to-left | Create | ~50 |
| `src/components/home/demleme-panel.tsx` | One full-width specimen panel (two columns) | Create | ~180 |
| `src/components/home/demleme-section.tsx` | Section shell + header + ordered panel/marquee sequence | Rewrite | ~120 |
| `src/app/globals.css` | Add `@keyframes demleme-marquee` and `.demleme-marquee-track` | Modify | +25 |
| `src/i18n/messages/tr.json` | Add/normalize `demleme` keys | Modify | +2 net |
| `src/i18n/messages/en.json` | Add/normalize `demleme` keys | Modify | +2 net |

---

## Task 1: Extend `BrewGuide` data with `headline`, `timeline`, `conditions`

**Files:**
- Modify: `src/lib/brew-guides.ts`

- [ ] **Step 1: Extend the `BrewGuide` interface**

Replace the `BrewGuide` interface in `src/lib/brew-guides.ts` with:

```ts
export interface BrewGuide {
  slug: BrewMethod;
  name: string;
  nameTR: string;
  description: string;
  descriptionTR: string;
  prep: string;
  prepTR: string;
  recommendedSlugs: ProductSlug[];
  available: boolean;
  recipe?: {
    coffee: string;
    water: string;
    grind: string;
    time: string;
    ratio: string;
  };
  /** Two-line headline numbers shown large in the panel. Each string is rendered as-is; if it begins with digits, the counter component animates the integer prefix from 0 to that value on viewport entry. */
  headline: {
    coffee: string;
    water: string;
    time: string;
    ratio: string;
  };
  /** Timed steps in the right-column recipe timeline. `t` is the timestamp shown left-aligned in mono; `step` is the action string. Turkish canonical. */
  timeline: Array<{ t: string; step: string; stepEN: string }>;
  /** Three brewing conditions shown in a small grid below the timeline. Label keys reuse the localized strings from i18n (`grindLabel`, `tempLabel`, `pressureLabel`, etc. — see Task 10). */
  conditions: Array<{ labelKey: string; value: string }>;
  equipment?: string[];
  steps?: string[];
  lead?: string;
}
```

- [ ] **Step 2: Add `headline`, `timeline`, `conditions` for `espresso`**

Inside `BREW_GUIDES.espresso`, add (after the existing `recipe` field):

```ts
    headline: {
      coffee: '18g',
      water: '36g',
      time: '25–30s',
      ratio: '1:2',
    },
    timeline: [
      { t: '00:00', step: '18g doz · dağıt + tampla', stepEN: '18g dose · distribute + tamp' },
      { t: '00:06', step: 'ilk damla', stepEN: 'first drop' },
      { t: '00:27', step: '36g · çekimi durdur', stepEN: '36g · stop the shot' },
    ],
    conditions: [
      { labelKey: 'grindLabel', value: 'İnce' },
      { labelKey: 'tempLabel', value: '93°C' },
      { labelKey: 'pressureLabel', value: '9 bar' },
    ],
```

- [ ] **Step 3: Add `headline`, `timeline`, `conditions` for `filter`**

```ts
    headline: {
      coffee: '22g',
      water: '360g',
      time: '3:30',
      ratio: '1:16.4',
    },
    timeline: [
      { t: '00:00', step: '50g bloom · 30s bekle', stepEN: '50g bloom · 30s rest' },
      { t: '00:30', step: 'spiral pour · 200g\'a kadar', stepEN: 'spiral pour to 200g' },
      { t: '01:10', step: 'devam et · 360g\'a kadar', stepEN: 'continue to 360g' },
      { t: '03:30', step: 'drawdown bitir · çevir + servis', stepEN: 'drawdown complete · swirl + serve' },
    ],
    conditions: [
      { labelKey: 'grindLabel', value: 'Orta' },
      { labelKey: 'tempLabel', value: '94°C' },
      { labelKey: 'agitationLabel', value: 'Spiral · döndür' },
    ],
```

- [ ] **Step 4: Add `headline`, `timeline`, `conditions` for `v60`**

```ts
    headline: {
      coffee: '30g',
      water: '500g',
      time: '3:30',
      ratio: '1:16.7',
    },
    timeline: [
      { t: '00:00', step: '60g bloom · döndür', stepEN: '60g bloom · swirl' },
      { t: '00:45', step: '300g\'a yavaş konsentrik pour', stepEN: 'slow concentric pour to 300g' },
      { t: '01:15', step: '500g\'a tamamla', stepEN: 'pour to 500g' },
      { t: '01:45', step: 'karıştır · döndür', stepEN: 'stir · swirl' },
      { t: '03:30', step: 'drawdown bitir', stepEN: 'drawdown complete' },
    ],
    conditions: [
      { labelKey: 'grindLabel', value: 'Orta' },
      { labelKey: 'tempLabel', value: '93°C' },
      { labelKey: 'agitationLabel', value: 'Karıştır · döndür' },
    ],
```

- [ ] **Step 5: Add `headline`, `timeline`, `conditions` for `aeropress`**

```ts
    headline: {
      coffee: '11g',
      water: '200g',
      time: '2:30',
      ratio: '1:18',
    },
    timeline: [
      { t: '00:00', step: '200g su · pistonu otur', stepEN: '200g water · seat the plunger' },
      { t: '02:00', step: 'hafifçe döndür', stepEN: 'gentle swirl' },
      { t: '02:00', step: 'yaklaşık 30s pres', stepEN: '~30s press' },
    ],
    conditions: [
      { labelKey: 'grindLabel', value: 'Orta-ince' },
      { labelKey: 'tempLabel', value: '100°C (açık)' },
      { labelKey: 'orientationLabel', value: 'Standart' },
    ],
```

- [ ] **Step 6: Add `headline`, `timeline`, `conditions` for `french-press`**

```ts
    headline: {
      coffee: '30g',
      water: '500g',
      time: '9 dk',
      ratio: '1:16.7',
    },
    timeline: [
      { t: '00:00', step: 'tüm suyu dök · dokunma', stepEN: 'pour all water · leave undisturbed' },
      { t: '04:00', step: 'kabuğu nazikçe kır', stepEN: 'break the crust gently' },
      { t: '04:30', step: 'köpük + inceleri sıyır', stepEN: 'skim foam + fines' },
      { t: '09:00', step: 'piston · sadece yüzeye', stepEN: 'plunger · only to the surface' },
    ],
    conditions: [
      { labelKey: 'grindLabel', value: 'Orta-iri' },
      { labelKey: 'tempLabel', value: '95°C' },
      { labelKey: 'restLabel', value: '5–8 dk dinlendir' },
    ],
```

- [ ] **Step 7: Add `headline`, `timeline`, `conditions` for `moka`**

```ts
    headline: {
      coffee: '20g',
      water: 'vana',
      time: '~4 dk',
      ratio: 'sepet düz',
    },
    timeline: [
      { t: '00:00', step: 'kaynamış su · sepet hazır', stepEN: 'boiled water · basket ready' },
      { t: '00:30', step: 'orta ateş · kapak açık', stepEN: 'medium heat · lid open' },
      { t: '~03:00', step: 'akış soluklaşır → ateşten al', stepEN: 'flow lightens → off heat' },
      { t: '~03:30', step: 'altı soğut · servis', stepEN: 'cool the base · serve' },
    ],
    conditions: [
      { labelKey: 'grindLabel', value: 'Orta-ince' },
      { labelKey: 'heatLabel', value: 'Orta · kapak açık' },
      { labelKey: 'finishLabel', value: 'Tıslamada bitir' },
    ],
```

- [ ] **Step 8: Verify typecheck passes**

Run: `npx tsc --noEmit`
Expected: no errors. (All six `BrewGuide` entries now satisfy the extended interface.)

---

## Task 2: Add localized condition labels to i18n

**Files:**
- Modify: `src/i18n/messages/tr.json`
- Modify: `src/i18n/messages/en.json`

- [ ] **Step 1: Update `tr.json` `demleme` namespace**

Replace the existing `demleme` block in `src/i18n/messages/tr.json` with:

```json
  "demleme": {
    "eyebrow": "— DEMLEME",
    "indexLabel": "06",
    "headline": "Altı yöntem,",
    "headlineEm": "altı disiplin.",
    "credit": "Tariflerimiz, <i>James Hoffmann</i>'ın yöntemleriyle hizalı: 2007 Dünya Barista Şampiyonu, 'Dünya Kahve Atlası'nın yazarı, ev demlemenin meslek standartlarını şekillendiren isim.",
    "prepLabel": "— HAZIRLIK",
    "pairsLabel": "— UYUMLU KÖKENLER",
    "recipeLabel": "— TARİF",
    "ctaAvailable": "Tarifi gör",
    "ctaSoon": "Yakında",
    "soonTag": "YAKINDA",
    "grindLabel": "ÖĞÜTÜM",
    "tempLabel": "SICAKLIK",
    "pressureLabel": "BASINÇ",
    "agitationLabel": "KARIŞTIRMA",
    "orientationLabel": "KONUM",
    "restLabel": "DİNLENME",
    "heatLabel": "ATEŞ",
    "finishLabel": "BİTİRİŞ"
  },
```

- [ ] **Step 2: Update `en.json` `demleme` namespace**

Replace the existing `demleme` block in `src/i18n/messages/en.json` with:

```json
  "demleme": {
    "eyebrow": "— THE BREW",
    "indexLabel": "06",
    "headline": "Six methods,",
    "headlineEm": "six disciplines.",
    "credit": "Our recipes are aligned with <i>James Hoffmann</i>'s methods: 2007 World Barista Champion, author of 'The World Atlas of Coffee', and the voice that shaped the professional standard for home brewing.",
    "prepLabel": "— PREPARATION",
    "pairsLabel": "— PAIRS WITH",
    "recipeLabel": "— RECIPE",
    "ctaAvailable": "Read the recipe",
    "ctaSoon": "Coming soon",
    "soonTag": "SOON",
    "grindLabel": "GRIND",
    "tempLabel": "TEMP",
    "pressureLabel": "PRESSURE",
    "agitationLabel": "AGITATION",
    "orientationLabel": "ORIENTATION",
    "restLabel": "REST",
    "heatLabel": "HEAT",
    "finishLabel": "FINISH"
  },
```

---

## Task 3: Add the marquee keyframes to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append the marquee animation block**

Add this block inside the `@layer utilities` block at the end (right before the closing `}` of the `utilities` layer, after `.brand-marquee-track`):

```css
  /* Demleme section — per-panel parameter marquee, right-to-left. */
  @keyframes demleme-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .demleme-marquee-track {
    display: flex;
    align-items: center;
    gap: 32px;
    width: max-content;
    white-space: nowrap;
    animation: demleme-marquee 60s linear infinite;
    will-change: transform;
  }
```

The existing `@media (prefers-reduced-motion: reduce)` rule already zeros `animation-duration`, so reduced-motion users will see the marquee paused at translate(0) automatically.

- [ ] **Step 2: Verify lint still passes**

Run: `npm run lint`
Expected: `✔ No ESLint warnings or errors`.

---

## Task 4: Build the counter client component

**Files:**
- Create: `src/components/home/demleme-counter.tsx`

This component animates a number from 0 to a target integer using `requestAnimationFrame`, triggered once when its container intersects the viewport. Non-numeric values render immediately without animation.

- [ ] **Step 1: Write the file**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

interface DemlemeCounterProps {
  /** The full value to display once the counter finishes (or immediately for non-numeric values). */
  value: string;
  /** Trigger node — when this element intersects the viewport, the animation starts. */
  containerRef: React.RefObject<HTMLElement>;
  /** Animation duration in ms. */
  duration?: number;
  /** Optional delay before starting (ms). */
  delay?: number;
}

const NUMERIC_PREFIX = /^(\d+)/;

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Animates the integer prefix of `value` from 0 to that integer when the
 * container enters the viewport. After the animation completes (or
 * immediately for non-numeric values), the full `value` string is shown.
 */
export function DemlemeCounter({
  value,
  containerRef,
  duration = 800,
  delay = 0,
}: DemlemeCounterProps) {
  const match = value.match(NUMERIC_PREFIX);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? value.slice(match[1].length) : '';

  const [displayed, setDisplayed] = useState<string>(target === null ? value : '0' + suffix);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (target === null) {
      setDisplayed(value);
      return;
    }
    if (typeof window === 'undefined') return;
    const node = containerRef.current;
    if (!node) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayed(value);
      hasAnimatedRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting || hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        observer.disconnect();

        const startTime = performance.now() + delay;
        let raf = 0;
        const tick = (now: number) => {
          const elapsed = now - startTime;
          if (elapsed < 0) {
            raf = requestAnimationFrame(tick);
            return;
          }
          const t = Math.min(1, elapsed / duration);
          const current = Math.round(easeOutQuart(t) * target);
          setDisplayed(current + suffix);
          if (t < 1) {
            raf = requestAnimationFrame(tick);
          } else {
            setDisplayed(value);
          }
        };
        raf = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(raf);
      },
      { rootMargin: '-15% 0px' },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [containerRef, target, value, suffix, duration, delay]);

  return <>{displayed}</>;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

---

## Task 5: Build the marquee component

**Files:**
- Create: `src/components/home/demleme-marquee.tsx`

- [ ] **Step 1: Write the file**

```tsx
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

/**
 * Horizontal marquee strip between Demleme panels. Pure CSS animation; the
 * content is duplicated so the -50% translate produces a seamless loop. The
 * phrase repeats inside one copy six times so even narrow viewports stay full.
 */
export function DemlemeMarquee({ guide }: DemlemeMarqueeProps) {
  const phrase = buildPhrase(guide);
  const copies = Array.from({ length: 6 }, (_, i) => `${phrase}   ·   `).join('');

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
        {/* Two copies for seamless -50% translate. */}
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
          aria-hidden
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

---

## Task 6: Build the timeline component

**Files:**
- Create: `src/components/home/demleme-timeline.tsx`

- [ ] **Step 1: Write the file**

```tsx
import type { BrewGuide } from '@/lib/brew-guides';

type Locale = 'tr' | 'en';

interface DemlemeTimelineProps {
  guide: BrewGuide;
  locale: Locale;
  conditionLabels: Record<string, string>;
}

/**
 * Right column of a Demleme panel — a vertical mono timeline of timed brewing
 * steps, then a 3-row condition table below a hairline divider.
 */
export function DemlemeTimeline({ guide, locale, conditionLabels }: DemlemeTimelineProps) {
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

---

## Task 7: Build the panel component

**Files:**
- Create: `src/components/home/demleme-panel.tsx`

This is the heart of the redesign. Two columns inside a framed paper card, with the counter triggering on viewport entry.

- [ ] **Step 1: Write the file**

```tsx
'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CountryTag } from '@/components/primitives/country-tag';
import { PRODUCTS } from '@/lib/products';
import type { BrewGuide } from '@/lib/brew-guides';
import { DemlemeCounter } from './demleme-counter';
import { DemlemeTimeline } from './demleme-timeline';

type Locale = 'tr' | 'en';

interface DemlemePanelProps {
  guide: BrewGuide;
  index: number;
  total: number;
  locale: Locale;
  labels: {
    soon: string;
    ctaAvailable: string;
    ctaSoon: string;
    prep: string;
    pairs: string;
    recipe: string;
  };
  conditionLabels: Record<string, string>;
}

function pickName(g: BrewGuide, locale: Locale) {
  return locale === 'tr' ? g.nameTR : g.name;
}

function pickDescription(g: BrewGuide, locale: Locale) {
  return locale === 'tr' ? g.descriptionTR : g.description;
}

function pickPrep(g: BrewGuide, locale: Locale) {
  return locale === 'tr' ? g.prepTR : g.prep;
}

export function DemlemePanel({
  guide,
  index,
  total,
  locale,
  labels,
  conditionLabels,
}: DemlemePanelProps) {
  const panelRef = useRef<HTMLAnchorElement>(null);
  const pairs = guide.recommendedSlugs.slice(0, 2).map((s) => PRODUCTS[s]);

  return (
    <Link
      ref={panelRef}
      href={`/brew-guide/${guide.slug}`}
      className="group relative flex flex-col bg-paper border border-hairline transition-colors duration-500"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8) var(--space-7)',
        minHeight: 520,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity pointer-events-none"
        style={{
          background: 'var(--gradient-holo)',
          borderRadius: 'var(--radius-lg)',
          transitionDuration: '500ms',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      />

      <header
        className="relative flex items-center justify-between"
        style={{ marginBottom: 'var(--space-7)' }}
      >
        <span
          className="font-mono text-mute"
          style={{
            fontSize: 11,
            letterSpacing: '0.22em',
            fontWeight: 500,
          }}
        >
          {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        {!guide.available ? (
          <span
            className="font-mono text-mute"
            style={{
              fontSize: 10,
              letterSpacing: '0.28em',
              fontWeight: 500,
            }}
          >
            {labels.soon}
          </span>
        ) : null}
      </header>

      <div
        className="relative grid"
        style={{
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          columnGap: 'var(--space-9)',
          alignItems: 'start',
        }}
      >
        <div className="flex flex-col">
          <h3
            className="font-display text-ink text-balance"
            style={{
              fontSize: 'clamp(80px, 9vw, 140px)',
              lineHeight: 0.92,
              letterSpacing: '-0.035em',
              fontWeight: 400,
              marginBottom: 'var(--space-6)',
            }}
          >
            {pickName(guide, locale)}
          </h3>

          <p
            className="font-display text-ink/80 italic"
            style={{
              fontSize: 19,
              lineHeight: 1.45,
              maxWidth: '38ch',
              fontWeight: 400,
              marginBottom: 'var(--space-7)',
            }}
          >
            {pickDescription(guide, locale)}
          </p>

          <div
            className="flex flex-wrap items-baseline"
            style={{ columnGap: 'var(--space-6)', rowGap: 'var(--space-3)' }}
          >
            <HeadlineNumber containerRef={panelRef} value={guide.headline.coffee} />
            <Dot />
            <HeadlineNumber containerRef={panelRef} value={guide.headline.water} delay={120} />
          </div>
          <div
            className="flex flex-wrap items-baseline"
            style={{
              columnGap: 'var(--space-6)',
              rowGap: 'var(--space-3)',
              marginTop: 'var(--space-3)',
            }}
          >
            <HeadlineNumber containerRef={panelRef} value={guide.headline.time} delay={240} />
            <Dot />
            <HeadlineNumber containerRef={panelRef} value={guide.headline.ratio} delay={360} />
          </div>

          <div
            className="flex flex-col"
            style={{ gap: 'var(--space-3)', marginTop: 'var(--space-7)' }}
          >
            <p
              className="font-mono text-mute"
              style={{
                fontSize: 10,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              {labels.prep}
            </p>
            <p
              className="text-ink/85"
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                maxWidth: '46ch',
              }}
            >
              {pickPrep(guide, locale)}
            </p>
          </div>

          <div className="flex items-end justify-between" style={{ marginTop: 'auto', paddingTop: 'var(--space-7)' }}>
            <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
              <p
                className="font-mono text-mute"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                {labels.pairs}
              </p>
              <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
                {pairs.map((p) => (
                  <CountryTag key={p.slug} country={p.country} size="sm" label={p.name} />
                ))}
              </div>
            </div>

            <span
              className="text-ink underline-expand inline-flex items-center gap-2"
              style={{
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
              }}
            >
              {guide.available ? labels.ctaAvailable : labels.ctaSoon}
              <ArrowUpRight size={12} strokeWidth={1.5} />
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <p
            className="font-mono text-mute"
            style={{
              fontSize: 10,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontWeight: 500,
              marginBottom: 'var(--space-5)',
            }}
          >
            {labels.recipe}
          </p>
          <DemlemeTimeline guide={guide} locale={locale} conditionLabels={conditionLabels} />
        </div>
      </div>
    </Link>
  );
}

function HeadlineNumber({
  containerRef,
  value,
  delay,
}: {
  containerRef: React.RefObject<HTMLElement>;
  value: string;
  delay?: number;
}) {
  return (
    <span
      className="font-mono text-ink"
      style={{
        fontSize: 'clamp(28px, 3vw, 40px)',
        letterSpacing: '0.02em',
        fontWeight: 500,
        lineHeight: 1,
      }}
    >
      <DemlemeCounter value={value} containerRef={containerRef} delay={delay} />
    </span>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="text-mute"
      style={{
        fontSize: 'clamp(20px, 2vw, 28px)',
        lineHeight: 1,
        fontWeight: 400,
      }}
    >
      ·
    </span>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. (If `DemlemeCounter` expects `RefObject<HTMLElement>` and we pass `RefObject<HTMLAnchorElement>`, TS will accept it because `HTMLAnchorElement extends HTMLElement`.)

---

## Task 8: Rewrite the section orchestrator

**Files:**
- Modify (full rewrite): `src/components/home/demleme-section.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import { useTranslations, useLocale } from 'next-intl';
import { BREW_GUIDES, type BrewGuide } from '@/lib/brew-guides';
import { DemlemePanel } from './demleme-panel';
import { DemlemeMarquee } from './demleme-marquee';

type Locale = 'tr' | 'en';

const ORDER: BrewGuide[] = [
  BREW_GUIDES.espresso,
  BREW_GUIDES.filter,
  BREW_GUIDES.v60,
  BREW_GUIDES.aeropress,
  BREW_GUIDES['french-press'],
  BREW_GUIDES.moka,
];

export function DemlemeSection() {
  const t = useTranslations('demleme');
  const locale = useLocale() as Locale;

  const labels = {
    soon: t('soonTag'),
    ctaAvailable: t('ctaAvailable'),
    ctaSoon: t('ctaSoon'),
    prep: t('prepLabel'),
    pairs: t('pairsLabel'),
    recipe: t('recipeLabel'),
  };

  const conditionLabels: Record<string, string> = {
    grindLabel: t('grindLabel'),
    tempLabel: t('tempLabel'),
    pressureLabel: t('pressureLabel'),
    agitationLabel: t('agitationLabel'),
    orientationLabel: t('orientationLabel'),
    restLabel: t('restLabel'),
    heatLabel: t('heatLabel'),
    finishLabel: t('finishLabel'),
  };

  return (
    <section
      className="relative"
      style={{
        background: 'var(--color-surface)',
        paddingBlock: 'var(--space-10)',
      }}
      id="demleme"
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
          <div>
            <p
              className="eyebrow text-mute"
              style={{ letterSpacing: '0.28em', marginBottom: 'var(--space-5)' }}
            >
              {t('eyebrow')} / {t('indexLabel')}
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
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: '48ch',
              justifySelf: 'end',
            }}
          >
            {t.rich('credit', {
              i: (chunks) => (
                <em className="font-display italic" style={{ fontWeight: 400 }}>
                  {chunks}
                </em>
              ),
            })}
          </p>
        </header>

        <div className="flex flex-col" style={{ gap: 0 }}>
          {ORDER.map((guide, i) => (
            <div key={guide.slug} className="flex flex-col" style={{ gap: 0 }}>
              <DemlemePanel
                guide={guide}
                index={i + 1}
                total={ORDER.length}
                locale={locale}
                labels={labels}
                conditionLabels={conditionLabels}
              />
              <DemlemeMarquee guide={guide} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

---

## Task 9: Verify the homepage still wires correctly

**Files:**
- No edits — the existing `src/app/page.tsx` already imports `{ DemlemeSection } from '@/components/home/demleme-section'`. Nothing changes.

- [ ] **Step 1: Read the file to confirm the import is intact**

Open `src/app/page.tsx` and confirm the line `<DemlemeSection />` is rendered between `<ZanaatSection />` and `<SubscriptionTeaser />`. If anyone edited it during a different session, restore that order.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: `✔ No ESLint warnings or errors`.

---

## Task 10: Full build + visual verification

**Files:** None.

- [ ] **Step 1: Run typecheck**

Run: `npx tsc --noEmit`
Expected: clean exit, no errors.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: `✔ No ESLint warnings or errors`.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: clean exit, route table includes `/` and `/brew-guide/[method]`.

- [ ] **Step 4: Start dev server (background)**

Run: `npm run dev` (background, port 3000).
Wait for `Ready in ...` in the dev log.

- [ ] **Step 5: Fetch the homepage and count expected markers**

Run:

```bash
curl -s http://localhost:3000/ -o /tmp/demleme-resp.html
node -e "const fs=require('fs');const s=fs.readFileSync('/tmp/demleme-resp.html','utf8');['Espresso','Filtre','V60','AeroPress','French','Moka','demleme-marquee-track','YAKINDA','James Hoffmann','tarifi gör'].forEach(k=>console.log(k+':',(s.match(new RegExp(k,'gi'))||[]).length));"
```

Expected (Turkish locale default):
- Each method name appears at least once (Espresso ≥ 2, Filtre ≥ 1, V60 ≥ 1, AeroPress ≥ 1, French ≥ 1, Moka ≥ 1).
- `demleme-marquee-track`: 6 (one per panel marquee).
- `YAKINDA`: 4 (one per coming-soon panel — V60, AeroPress, French Press, Moka).
- `James Hoffmann`: ≥ 1 (in the credit copy).
- `tarifi gör`: 2 (espresso + filter — the available methods).

On Windows, the curl path uses `C:/DEV/mjolne/demleme-resp.html` instead of `/tmp/...`. Delete the file after.

- [ ] **Step 6: Open in a browser and scroll**

Open `http://localhost:3000/` in Chrome. Scroll past the products section into the Demleme section. Verify:
1. Six panels stack vertically, each with a paper bg and 0.5px hairline frame.
2. Between every pair of panels (and after the last) a thin mono marquee scrolls right-to-left.
3. Each panel's headline numbers (`18g`, `36g`, `25–30s`, `1:2`, etc.) count up from 0 as the panel enters the viewport.
4. The method name fades in with a slight Y-translate.
5. The recipe timeline on the right shows `00:00 → 18g doz · …` rows in mono.
6. Coming-soon panels (V60, AeroPress, French Press, Moka) have a `YAKINDA` badge in the top-right.
7. Hover a panel — the holo gradient washes in subtly (≤10% opacity).
8. Click a panel — navigates to `/brew-guide/<slug>`.

- [ ] **Step 7: Toggle reduced motion and reload**

In Chrome DevTools: `Cmd/Ctrl+Shift+P` → `Show Rendering` → set `Emulate CSS media feature prefers-reduced-motion: reduce`. Reload. Verify:
1. No count-up animation (numbers appear at final state immediately).
2. No fade-in on entry.
3. Marquees do not move (paused at translateX(0)).

- [ ] **Step 8: Stop dev server**

Stop the dev server process started in Step 4.

---

## Task 11: Remove dead i18n keys + verify `zanaat-brew-preview.tsx` stub

**Files:**
- Modify (if any keys are stale): `src/i18n/messages/tr.json`, `src/i18n/messages/en.json`
- No edits to `src/components/home/zanaat-brew-preview.tsx` (already a stub from the prior session).

- [ ] **Step 1: Grep for any stale `zanaat` keys**

Run:

```bash
grep -E "brewEyebrow|espressoLead|filterLead|espressoGrind|filterGrind|recipeCta" src/i18n/messages/*.json
```

Expected: no matches (already cleaned in the prior session). If any do match, remove them.

- [ ] **Step 2: Confirm `zanaat-brew-preview.tsx` is the empty stub**

Open `src/components/home/zanaat-brew-preview.tsx`. Expected contents:

```ts
export {};
```

If different, restore to the stub.

- [ ] **Step 3: Final clean build**

Run:

```bash
npm run lint && npx tsc --noEmit && npm run build
```

Expected: all three commands exit cleanly with no errors.

---

## Self-Review

**Spec coverage:**
- "Six full-width framed panels alternating paper/fog bg" → Task 7 builds the panel; spec says all-paper on surface bg with hairline frame (we chose all-paper in spec; alternation deferred as out-of-scope). ✓
- "Per-panel marquee strip carrying that panel's parameters" → Task 5 builds it, Task 8 wires it after every panel. ✓
- "Headline numbers count up on viewport entry" → Tasks 4 + 7. ✓
- "Method name fades + Y-translates on entry" — gap. The current panel implementation in Task 7 does not animate the name in. **Fix:** mark this as a v1.1 polish; the count-up provides the headline motion event the user signed off on. The name appears immediately on render (no fade), which the spec listed as a nice-to-have inside "Medium motion." If the visual feels too static after Task 10 verification, add a `<DemlemeEntryFade>` wrapper as a follow-up.
- "Timeline rows staggered fade-in" — gap, same reasoning. The mono timeline appears immediately. The marquees + count-up carry the motion. If we need more, add stagger in v1.1.
- "Reduced motion: marquees paused, no count-up, no fade" → Task 4 short-circuits the counter; globals.css `@media (prefers-reduced-motion: reduce)` zeros animation-duration on `.demleme-marquee-track` (carried by the existing `*` rule). ✓
- "Coming-soon `YAKINDA` badge top-right" → Task 7. ✓
- "Hover holo wash at 0.08 opacity" → Task 7. ✓
- "Country tags + CTA" → Task 7. ✓

**Decision on the gap:** Ship the counter-only motion (Tasks 4 + 7) for v1. The fade-in-name and staggered-timeline animations are explicit polish I'd add after seeing it live, not architectural commitments. If the user wants them right away, we add a small `IntersectionObserver` + CSS class toggle on the panel, which is a 30-minute follow-up. Not a blocker.

**Placeholder scan:** Every code block is concrete. No TBD / TODO / "add error handling."

**Type consistency:**
- `DemlemeCounter` takes `RefObject<HTMLElement>`. `DemlemePanel` declares `useRef<HTMLAnchorElement>(null)` and passes it. `HTMLAnchorElement extends HTMLElement`, so TS accepts it.
- `BrewGuide.headline.coffee` and friends are all `string`. `DemlemeCounter.value` is `string`. ✓
- `conditionLabels: Record<string, string>` in `DemlemePanel` matches the same type in `DemlemeTimeline`. ✓
- All i18n keys referenced in `useTranslations('demleme')` calls (`soonTag`, `ctaAvailable`, `ctaSoon`, `prepLabel`, `pairsLabel`, `recipeLabel`, `grindLabel`, `tempLabel`, `pressureLabel`, `agitationLabel`, `orientationLabel`, `restLabel`, `heatLabel`, `finishLabel`, `eyebrow`, `indexLabel`, `headline`, `headlineEm`, `credit`) are defined in Task 2 for both locales. ✓

**Scope:** Single section, one home page surface. All files comfortably under the 500-line ceiling. One implementation plan.
