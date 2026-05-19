# MJØLNE Roastery Co. — Product Brief

## Register

**Brand-led with embedded product UI.** Marketing surfaces (home, story, brew guide, product detail) are the primary register — the design IS the product. Subscription configurator, account, and checkout are product UI in service of the brand. Hold the editorial tone everywhere; never let utility surfaces drift into generic SaaS.

## Users

Istanbul-based corporate buyers and craft-coffee enthusiasts. They drink coffee at work, buy in office quantities or personal subscriptions, and recognize quiet design as a signal of quality. Norwegian-tinged restraint is a feature, not a bug.

Personas:
- **The early riser.** Subscribes monthly, knows their roast, picks one origin and stays. Wants frictionless pause/skip and predictable Tuesday delivery.
- **The office buyer.** Procures for an open-plan office of 20–80. Needs wholesale-ish ergonomics inside a consumer flow. Values reliability over novelty.
- **The first-time visitor.** Lands from a Mikla recommendation or word of mouth. Should feel like they walked into a serious roastery, not a SaaS storefront.

## Brand voice

Quiet, confident, craft-focused. Norwegian-tinged. Sentences are short. Restraint over emphasis. The brand says less and trusts the reader.

Tagline: **"Crafted for early risers."**
Manifesto: **"It's not just coffee, it's MJØLNE."**

Use Turkish as canonical. English is a parallel translation, never the source of truth.

## Anti-references

These are everything MJØLNE is not. If a design choice would be at home in any of these, reject it.

- **SaaS dashboards** with hero-metric grids and cards-of-cards.
- **Generic e-commerce themes** with rounded everything, gradient buttons, drop-shadowed product cards.
- **Crypto / fintech** maximalism — neon, glassmorphism, dark mode by default.
- **Specialty-coffee cliché** — kraft paper, distressed serif, raw textures, "small batch" stamps.
- **Tech-bro minimalism** — pure white, Inter at 14px, gray-600 everywhere.

## Strategic principles

1. **The holographic sticker is the only sanctioned gradient.** UI surfaces are flat: paper, ink, or a single country color.
2. **Italic is semantic.** "Whatever your *roast*" — italic carries meaning. Never decorative.
3. **Sentence case everywhere except country tags and eyebrows.** Country tags are uppercase by design (matching packaging). Eyebrows are uppercase by typographic convention.
4. **The hexagon is the marquee.** Every other interaction defers to it. If something competes with the hexagon, soften it.
5. **Editorial spacing.** Generous vertical rhythm; cards are not the default container.
6. **Light only.** `color-scheme: light` is set explicitly. No dark mode in v1.
7. **No emoji. Ever.**
8. **Currency: TRY (₺).** Always formatted via `Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })`.
9. **Desktop-only for v1.** Don't optimize below 1024px. Mobile is phase 2.
10. **When uncertain, choose restraint.**

## Locked: registers, palette, typography, animations

See `DESIGN.md` for the canonical token list. All values come from the build brief at `mjolne-build-brief.md` and are not subject to drift without explicit client approval.

## Out of scope (v1)

- Mobile breakpoints below 1024px
- Multi-currency (architect for it but ship TRY only)
- Loyalty / referral
- Wholesale inquiry form (recommended addition; flagged for client)
- Real-time roast date from Sanity (hardcoded for v1)
