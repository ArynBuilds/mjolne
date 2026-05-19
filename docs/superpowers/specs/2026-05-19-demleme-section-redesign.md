# Demleme Section Redesign — Specification

**Date:** 2026-05-19
**Status:** Draft, pending user review
**Owner:** Aringör

## Problem

The current `DemlemeSection` (bento layout: 2 hero cards + 4 compact tiles) reads as flat blocks of text. The user rejected it as not visually interesting and asked for: visible framing, motion (right-to-left marquee), creative visual hierarchy, and a treatment more on the level of best-in-class roastery sites — while staying in MJØLNE's editorial, type-led, Norwegian-tinged register.

Constraints carried in:
- No photography or video assets available. Type, motion, color, layout only.
- Section sits between `ZanaatSection` (products / origins) and `SubscriptionTeaser` on the home page.
- All copy is in Turkish (canonical), aligned with James Hoffmann's published brewing methods.
- Brand bans: identical card grids, gradient text, glassmorphism, em dashes in copy, default modals.

## Direction

**"The Specimen Sheet."** Six full-width horizontal panels stacked vertically, each method as one specimen page in a typographic atlas. The drama comes from data — huge mono numerals — and motion comes from per-panel marquees and natural-scroll entry animations. Inspired by Onyx Coffee Lab's "numeric precision as ornament" and La Cabra's mono recipe-timeline rhythm.

## Structure

```
SECTION (#demleme, bg = --color-surface, padBlock = --space-10)
├── HEADER (container-page)
│     eyebrow:  — DEMLEME / 06
│     h2:       Altı yöntem, [italic] altı disiplin.
│     credit:   Tariflerimiz <i>James Hoffmann</i>'ın yöntemleriyle hizalı...
│
└── PANELS  (container-page, stack with gap = 0)
    ├── PANEL 01 — Espresso
    ├── MARQUEE STRIP                       (espresso parameters cycle)
    ├── PANEL 02 — Filtre
    ├── MARQUEE STRIP                       (filter parameters cycle)
    ├── PANEL 03 — V60          [Yakında]
    ├── MARQUEE STRIP                       (V60 parameters cycle)
    ├── PANEL 04 — AeroPress    [Yakında]
    ├── MARQUEE STRIP                       (AeroPress parameters cycle)
    ├── PANEL 05 — French Press [Yakında]
    ├── MARQUEE STRIP                       (French Press parameters cycle)
    └── PANEL 06 — Moka         [Yakında]
```

### Header

- `Eyebrow`: small uppercase letter-spaced, includes a method counter `— DEMLEME / 06`.
- `h2`: existing copy `Altı yöntem, altı disiplin.` with `disiplin` in display serif italic.
- `Credit paragraph`: existing `tr.json` `demleme.credit` value. Italic on the literal `James Hoffmann`. Sits to the right of the headline on a 2-column header grid (same `1.1fr / 1fr` rhythm as `ZanaatSection`).

### Panel (one specimen)

A two-column horizontal frame, 0.5px hairline border, paper bg on surface section bg (per DESIGN.md ≥13-level card/bg contrast), `--radius-lg` corners, internal padding `--space-8` vertical and `--space-7` horizontal. `min-height: 520px`.

```
┌─────────────────────────────────────────────────────────────┐
│  01 / 06                              [YAKINDA badge]       │  top row
│                                                             │
│  Espresso                            00 : 00  →  18g doz    │
│                                      00 : 06  →  ilk damla  │
│  ── (italic-serif description)       00 : 27  →  36g · dur  │
│                                                             │
│  18g   ·   36g                       ─                      │
│  25–30s   ·   1:2                    ÖĞÜTÜM    ince         │
│                                      SICAKLIK  93°C         │
│  [country tag] [country tag]         BASINÇ    9 bar        │
│                                                             │
│  ─────────────────────────────────                          │  bottom row
│  tarifi gör →                                               │
└─────────────────────────────────────────────────────────────┘
```

**Left column (~58% / 1.2fr):**

1. **Top row** — mono index `01 / 06` aligned left, badge slot right (used for `YAKINDA` on coming-soon panels, empty on available ones).
2. **Method name** — display serif 96–140px (clamp), `font-weight: 400`, `letter-spacing: -0.03em`. Mixed case (`Espresso`, not `ESPRESSO`) — uppercase is reserved for country tags and eyebrows per `PRODUCT.md`.
3. **Italic-serif description** — Hoffmann-grounded 1–2 sentence intro from `descriptionTR`. Capped at ~46ch. Subtle text-balance.
4. **Headline recipe numbers** — JetBrains Mono, two lines, sized large: line 1 = coffee · water (e.g., `18g · 36g`), line 2 = time · ratio (e.g., `25–30s · 1:2`). Size: 32–40px. Tracks `letter-spacing: 0.04em`. The numbers are the visual event.
5. **Country tags** — pairing tags using existing `<CountryTag>` primitive at `size="sm"`, 2 max. These tie this section back to the products section above.
6. **CTA** — `tarifi gör →` for `available: true` methods, `yakında →` for the rest. Both link to `/brew-guide/[slug]`. Mono uppercase letter-spaced, `underline-expand` hover, anchored bottom-left.

**Right column (~42% / 1fr):**

A vertical recipe timeline. Each row is one timed step in JetBrains Mono:

```
00:00   →   18g doz · dağıt + tampla
00:06   →   ilk damla
00:27   →   36g · dur
─── (0.5px hairline divider)
ÖĞÜTÜM    ince
SICAKLIK  93°C
BASINÇ    9 bar
```

- Time column: 64px wide, right-aligned, mono 14px, `var(--color-mute)`.
- Arrow: 24px wide, centered, mono 14px, `var(--color-mute)`.
- Description column: flexible, mono 14px, `var(--color-ink)`, line-height 1.6.
- Below the timeline, a 0.5px hairline divider, then 3 condition rows (`ÖĞÜTÜM`, `SICAKLIK`, `BASINÇ` or method-relevant equivalents — orientation/time for AeroPress, etc.) in a `60px / 1fr` mono grid.

Timeline data lives in `brew-guides.ts` as a new field `timeline: { t: string; step: string }[]` on each guide.

### Marquee strip (between panels)

A 36px-tall horizontal strip between every pair of panels and below the last panel. Pure CSS `@keyframes` translateX animation, infinite, linear, ~60s for one full pass at desktop width (matches existing `.brand-marquee-track` cadence). Right-to-left direction.

Content: each marquee shows **its preceding panel's parameters** in JetBrains Mono uppercase letter-spaced, repeated to fill 2× container width and translated `-50%` for a seamless loop. Example after the Espresso panel:

```
ESPRESSO · 18g · 36g · 25–30s · 1:2 · 9 BAR · İNCE ÖĞÜTÜM · ESPRESSO · 18g · 36g · ...
```

- Bg: `var(--color-paper)` (same as panels — strip reads as part of the panel's "page").
- Color: `var(--color-mute)` (subtle, not loud).
- Font: JetBrains Mono 11px, letter-spacing 0.22em, uppercase.
- Border-top + border-bottom: 0.5px hairline.
- `prefers-reduced-motion` → animation paused at translate(0).

Per-panel marquees (each strip carries the panel above it) make the marquee feel meaningful rather than decorative. The user's parameters scroll past — not random brand noise.

### Hover state (panels)

- Subtle holo gradient wash overlay at opacity 0.08, 500ms `--ease-out-expo` fade-in.
- No transform, no shadow. Restraint.

### Entry animation (medium — natural scroll)

When a panel intersects the viewport (`IntersectionObserver`, `rootMargin: '-15% 0px'`, single trigger):

1. **Method name** — fades in (`opacity 0 → 1`) with a 16px Y-translate, 600ms `--ease-out-expo`, no delay.
2. **Headline numbers** — count up via `requestAnimationFrame` from `0` to target. Each headline value has a parsed numeric prefix (`18` from `18g`, `25` from `25–30s`) which animates from 0 to that integer; the full rendered string (`18g`, `25–30s`) only displays once the count finishes. Non-numeric values (e.g., `1:2`) fade in without counting. Duration 800ms, `--ease-out-quart`, single pass. 200ms delay after the name starts.
3. **Italic description** — fades in with 8px Y-translate, 500ms, 300ms delay.
4. **Timeline rows** — staggered fade-in (60ms each, 8px Y-translate, 400ms each), starting 400ms after the name.
5. **Country tags + CTA** — fade in last, 300ms, 600ms delay.

Marquees scroll continuously regardless of viewport.

`prefers-reduced-motion: reduce` → all entry animations resolve to final state instantly. Marquees pause.

### Coming-soon treatment

`available: false` panels (V60, AeroPress, French Press, Moka):

- Same panel size and grid as the available ones — no visual demotion. Hoffmann's recipes are real for all six.
- `YAKINDA` badge in mono in the top-right slot of the panel's top row.
- CTA changes from `tarifi gör →` to `yakında →` (still routes to `/brew-guide/[slug]`, which already shows a "coming soon" treatment downstream).
- Country tags still appear (the pairing logic doesn't change).

## Data shape

Extend `BrewGuide` in `src/lib/brew-guides.ts`:

```ts
export interface BrewGuide {
  // ...existing fields...

  /** Headline numbers shown large in the panel. */
  headline: {
    coffee: string;   // "18g"
    water: string;    // "36g"
    time: string;     // "25–30s"
    ratio: string;    // "1:2"
  };

  /** Vertical recipe timeline shown on the right column. */
  timeline: Array<{ t: string; step: string }>;

  /** Brewing conditions below the timeline (3 rows). */
  conditions: Array<{ label: string; value: string }>;
}
```

Add for all six methods using Hoffmann's published numbers (already collected in this session).

i18n adds (`tr.json` / `en.json` under `demleme`):

```
"soon": "YAKINDA"
"ctaAvailable": "Tarifi gör"
"ctaSoon": "Yakında"
"indexLabel": "06"        # the "/ 06" in eyebrow
```

(`ctaRead`, `ctaSoon`, `soonTag` keys already exist — reuse and remove duplicates during implementation.)

## Files

| File | Action | Responsibility | Est. lines |
|---|---|---|---|
| `src/lib/brew-guides.ts` | Edit | Add `headline`, `timeline`, `conditions` to all 6 guides | +160 (≈ 290 total) |
| `src/components/home/demleme-section.tsx` | Rewrite | Section shell, header, panel list, marquees between | ~120 |
| `src/components/home/demleme-panel.tsx` | New | One specimen panel (two columns, all internal layout) | ~180 |
| `src/components/home/demleme-marquee.tsx` | New | Per-panel marquee strip (client component, CSS-only) | ~50 |
| `src/components/home/demleme-counter.tsx` | New | Client component: number count-up using IntersectionObserver + rAF | ~80 |
| `src/components/home/demleme-timeline.tsx` | New | Vertical timeline + conditions block | ~100 |
| `src/app/globals.css` | Edit | Add `@keyframes demleme-marquee` and `.demleme-marquee-track` | +25 |
| `src/i18n/messages/tr.json` | Edit | Add `demleme.soon`, `demleme.indexLabel`; drop unused | +3 |
| `src/i18n/messages/en.json` | Edit | Same as above | +3 |

All files stay well under the 500-line ceiling. Component splits match the one-module-one-concern rule from CLAUDE.md.

## Out of scope (v1 of this redesign)

- No scroll-pinning (deferred — heavy GSAP work, can conflict with the hexagon intro scrub).
- No per-panel illustration / SVG ornament (deferred — the user opted for pure-type).
- No background alternation (paper / fog rhythm) — start with all-paper panels on surface bg. Iterate after we see it live.
- No keyboard-arrow navigation between panels. Anchor links from nav can come later if useful.
- Mobile layout — out of scope per `PRODUCT.md` ("Desktop-only for v1").

## Acceptance

- All six methods render as full-width framed panels in the order: espresso, filter, V60, AeroPress, French Press, Moka.
- The first marquee appears after panel 01 and there is a marquee strip between every consecutive pair of panels and one after panel 06.
- On entering the viewport, each panel's numbers count up from 0 to target, the description fades in, and the timeline rows stagger in.
- Marquees scroll continuously right-to-left at the documented speed.
- Hover a panel → holo wash fades in at 0.08 opacity.
- `prefers-reduced-motion` users see no counter animation, no entry fade, no marquee motion — content sits at final state.
- `npm run lint`, `npx tsc --noEmit`, and `npm run build` all clean.
- Both `tr` and `en` locales render correctly.

## Verification plan

1. Type/lint/build clean.
2. Visual check on `http://localhost:3000/` — confirm 6 panels render in the right order with correct recipes (against the Hoffmann numbers in this session's research).
3. Scroll the section and verify each panel's count-up fires on entry and runs once.
4. Verify marquees scroll continuously.
5. Toggle Chrome DevTools' `prefers-reduced-motion: reduce` and reload — confirm everything is static and at final state.
6. Test `/tr` and `/en` paths if locale routing is present.
