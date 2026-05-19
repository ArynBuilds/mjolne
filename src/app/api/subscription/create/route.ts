import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isIyzicoConfigured } from '@/lib/iyzico';
import { persistence, newId } from '@/lib/persistence';
import { pricingPlanCacheKey, pricePerMonth } from '@/lib/subscription-config';
import { getProduct, type ProductSlug } from '@/lib/products';

const createSchema = z.object({
  email: z.string().email(),
  origin: z.string(),
  grind: z.string(),
  volume: z.string(),
  frequency: z.enum(['weekly', 'biweekly', 'monthly']),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid request' }, { status: 400 });
  }
  const { email, origin, grind, volume, frequency } = parsed.data;
  const product = getProduct(origin);
  if (!product) {
    return NextResponse.json({ ok: false, error: 'unknown origin' }, { status: 400 });
  }

  const id = newId('sub');
  const planKey = pricingPlanCacheKey({
    origin: origin as ProductSlug,
    grind: grind as never,
    volume: volume as never,
    frequency: frequency as never,
  });
  const monthly = pricePerMonth(product.price, volume as never, frequency);

  if (!isIyzicoConfigured()) {
    persistence.saveSubscription({
      id,
      email,
      customerReferenceCode: `cust_${email}`,
      origin,
      grind,
      volume,
      frequency,
      pricingPlanReferenceCode: `plan_${planKey}_stub`,
      status: 'active',
      createdAt: Date.now(),
    });
    return NextResponse.json({ ok: true, stub: true, id, monthly });
  }

  // TODO(iyzico-subscription): the official SDK exposes the Subscription add-on
  // under `iyzipay.subscriptionProduct`, `subscriptionPricingPlan`, and
  // `subscriptionInitialize`. Once the merchant panel has the add-on enabled
  // and we have a Postgres-backed store of plans, wire up:
  //   1. Look up cached pricing plan by `planKey` in `persistence.getPricingPlan`.
  //   2. If missing, create a `SubscriptionProduct`, then a `SubscriptionPricingPlan`
  //      tied to that product, then cache both reference codes.
  //   3. Call `subscriptionInitialize.create({ pricingPlanReferenceCode, customer })`
  //      to receive a checkoutFormContent + token, return them to the client.
  //   4. After 3DS callback succeeds, the subscription becomes ACTIVE.

  return NextResponse.json({
    ok: false,
    error:
      'Subscription add-on not yet wired. Configure plan creation in /api/subscription/create.',
  }, { status: 501 });
}
