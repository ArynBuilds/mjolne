# MJØLNE Design Tokens

All values come from `mjolne-build-brief.md`. Don't introduce alternatives without flagging — the client locked these.

## Palette

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#0A0A0A` | Primary text, dark surfaces |
| `--color-paper` | `#FFFFFF` | Canvas, cards (pure white — cards must stay clearly distinct from surface to resist perceptual color adaptation) |
| `--color-surface` | `#F8F8F8` | Page background, near-white (~7 levels darker than paper). Card elevation comes from `--shadow-card`, not tonal contrast |
| `--color-hairline` | `#E0E0E0` | 0.5px borders, form-field outlines, dividers. Tuned to stay visible against the near-white `#F8F8F8` surface. |
| `--color-mute` | `#999999` | Secondary text, kickers |
| `--color-fog` | `#EDEDED` | Sticky header bg, modals |
| `--color-peru` | `#1C4732` | Peru tag (also success role) |
| `--color-ethiopia` | `#4475D4` | Ethiopia tags (both regions) |
| `--color-colombia` | `#6B1818` | Colombia tag (also error role) |
| `--color-brazil` | `#E89832` | Brazil tag |
| `--color-live` | `#FF4444` | Live-feed indicator dot |

The two gradients (`--gradient-holo`, `--gradient-holo-active`) live in `src/app/globals.css`. Don't introduce additional gradients or blurs.

## Shadows

| Token | Value | Use |
|---|---|---|
| `--shadow-card` | `0 1px 2px rgba(10,10,10,0.07), 0 8px 24px rgba(10,10,10,0.09)` | Lift bordered paper cards off the near-white surface. Two-layer for soft depth. Tuned for HDR displays — slightly stronger than SDR-only would need. |
| `--shadow-card-hover` | `0 2px 4px rgba(10,10,10,0.09), 0 16px 36px rgba(10,10,10,0.14)` | Optional hover lift. Use only when the card is itself the primary affordance. |

Shadows are felt, not seen. Anything you can "spot" on first glance is too strong. The card border (0.5px hairline) does the framing; the shadow adds depth. Never combine `--shadow-card` with glassmorphism or other gradient overlays.

## Typography

- **Display / headlines / logo:** PP Editorial New → Cormorant Garamond fallback, Georgia, serif.
- **Body / UI:** Inter, system fallback.
- **Numerals / tabular:** JetBrains Mono.

Inter ships only weights 400 and 500. The brand never uses 600/700. Cormorant ships 300, 400, 500 + italic.

## Type scale (desktop)

```
Display XL  96px / 0.95 / -0.035em / serif
Display L   64px / 0.95 / -0.030em / serif
Display M   46px / 1.00 / -0.025em / serif
H1          40px / 1.05 / -0.030em / serif
H2          30px / 1.10 / -0.025em / serif
H3          22px / 1.20 / -0.015em / serif
Lead        18px / 1.55 /  0       / sans
Body        16px / 1.65 /  0       / sans
Caption     13px / 1.45 /  0.02em  / sans
Eyebrow     10px / 1.20 /  0.22em UPPER / sans
```

Line length cap: 65–75ch.

## Spacing (4px base)

```
1=4px  2=8px  3=12px  4=16px  5=24px  6=32px  7=48px  8=64px  9=96px  10=128px
```

## Radii

```
sm = 4px   (sticker labels)
md = 8px   (tiles)
lg = 14px  (product cards)
pill = 999px
```

## Easing

```
--ease-out-quart   cubic-bezier(0.25, 1, 0.5, 1)
--ease-out-expo    cubic-bezier(0.16, 1, 0.3, 1)
--ease-in-out-expo cubic-bezier(0.87, 0, 0.13, 1)
--ease-scrub       cubic-bezier(0.65, 0, 0.35, 1)
```

`linear` and `ease` are forbidden outside trivial cases (e.g., a brightness fade on a background blob).

## Container

- `--container-max: 1440px`
- `--container-padding: 32px`

## Component primitives

- **`<HoloSticker>`** — the brand's signature. Holographic gradient rectangle, ink text on top, optional shimmer. Sizes: sm/md/lg.
- **`<CountryTag>`** — flat country-color rectangle, white text. Sharp corners (matches packaging).
- **`<TopoLines>`** — inline SVG of wavy horizontal paths, decorative, stretches to container.
- **`<BagTile>`** — compact product preview combining the three above.
- **`<HolographicBorder>`** — 1px gradient border for special elements.

## Component placement rules

- The hexagon collection lives only at `/#collection`.
- The pill header is fixed top-center, 56px tall, transitions opaque on scroll past hero.
- The "Live" indicator persists across hero state and the small video tile inside the hexagon.
- Subscription teaser appears once, after the collection section.
- Footer is editorial, dark on `--color-ink`.

## Motion principles

- Animate `transform` and `opacity` only for the hexagon scrub. No layout-property animation.
- All hover transitions: 200ms `ease-out-quart`.
- The holo sticker hover swap: 600ms `ease-out-expo`.
- Reduced-motion users: scrub disabled, hexagon static, hover effects 0ms.

## Bans (carry over from impeccable shared laws plus brief)

- No side-stripe colored borders on cards
- No gradient text via `background-clip: text`
- No glassmorphism as default (one place only: scrolled header)
- No identical card grids (we have one, and it's a hexagon)
- No modals as first thought (cart drawer is fine; use sparingly)
- No emoji
- No em dashes in copy
- No backwards-compat shims; no commented-out code
