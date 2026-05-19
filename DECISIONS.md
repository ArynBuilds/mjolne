# DECISIONS

Choices made by the agent that the brief left open or implied.

## State management

- **Cart store:** `zustand` (per brief §6.3 implicit need; the brief calls out cart drawer + qty stepper; zustand is the most popular zero-config option). Persisted to `localStorage` so a page refresh doesn't drop the bag.
- **Server state:** none. All data flows are RSC + server actions; no SWR/React-Query.

## Smooth scroll

- **Library:** `lenis` (renamed from `@studio-freight/lenis`). Disabled when `prefers-reduced-motion: reduce`.

## Animations

- **GSAP plugins:** `ScrollTrigger`, `Flip`. ScrollSmoother and SplitText are paid Club plugins — avoided.
- **View Transitions API:** Next.js 14.2 supports it via the `experimental.viewTransition` flag. Fallback for Firefox is the default Next.js navigation.

## Auth

- **NextAuth v5 (Auth.js)** with the email provider routed through Resend. No password column in v1. Magic link tokens expire in 24h.

## Database

- **Not provisioned in v1.** The agent stubs persistence with in-memory maps in `lib/persistence/`. A `// TODO(persistence)` marker flags every site that needs DB swap-in. Next step: client picks Postgres on Vercel, Neon, or Supabase. The architectural assumption is "any Postgres + Drizzle ORM."

## Iyzico

- **Sandbox by default.** Switch via `IYZIPAY_BASE_URL`. The agent stubs the API client when keys are missing so the dev server still boots.
- **Subscription plan creation:** lazy. We create iyzico Products and Pricing Plans on demand the first time a unique `(origin, grind, volume, frequency)` combo is requested. Reference codes cached in our store.
- **Currency format:** all amounts sent to iyzico as strings with two decimals (`"280.00"`).

## Internationalization

- **next-intl** with default locale `tr`, secondary `en`.
- We do **not** use locale-prefixed routes in v1 (`/tr/coffee/peru` would feel heavy). Locale is selected via cookie + a small toggle in account settings. The architecture supports `[locale]/...` route segments later if SEO requires it.

## Email

- **Resend** for transactional + magic links. `RESEND_AUDIENCE_ID` is used for the newsletter signup destination (per Open Question #3, recommended default).

## Fonts

- **PP Editorial New is licensed.** Until the client uploads font files to `/public/fonts/pp-editorial-new/`, we fall back to **Cormorant Garamond** loaded from `next/font/google` (weights 300/400/500 + italic). When the licensed file is added, swap to `next/font/local`.
- **Inter** is loaded via `next/font/google` with weights 400 and 500 only.
- **JetBrains Mono** is loaded via `next/font/google` with weight 400 only.

## Placeholder assets

Per brief §3, until the client provides assets:
- **Hero video:** static linear gradient (`linear-gradient(135deg, #2A1A14 0%, #4A2C1F 35%, #1A0F0A 70%)`) + the "Roastery · Live" indicator overlay. The `<video>` element renders only when files exist at `/public/videos/roastery-loop.{webm,mp4}`.
- **Bag images:** procedurally rendered `<BagTile>` (country tag + topo lines + holo sticker). On product detail, a larger SVG mock fills the same slot.
- **Story photography:** soft `--color-surface` blocks with the topo pattern. Replaced when images land at `/public/images/story/`.

## Text rendering

- `<svg>` topo lines use `vector-effect="non-scaling-stroke"` so the stroke stays 0.5px regardless of container size.

## CMS

- Sanity is **not** installed in v1. All product, story, and brew-guide content is hardcoded in `src/lib/content/`. Sanity is wired up by adding `@sanity/client` later and pointing the same `getProducts()` etc. helpers at the CMS.

## Routing

- `/coffee` is intentionally not a Next.js route. The header's "Coffee" button scrolls to `/#collection`. On other routes, it pushes `/` and the home component runs the scroll on mount.
- All `app/**` route groups are flat — no `(marketing)` / `(commerce)` segmentation in v1. The footprint is small enough.

## File-size policy

Per CLAUDE.md (user's global instructions): no file exceeds 500 lines. The agent split components aggressively where layouts are dense (hexagon section, subscription configurator, product detail). Where the brief implies one component, the agent split into a parent + leaves when total LOC trended above 400.
