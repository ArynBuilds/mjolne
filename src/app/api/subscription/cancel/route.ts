import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isIyzicoConfigured } from '@/lib/iyzico';
import { persistence } from '@/lib/persistence';

const schema = z.object({
  subscriptionId: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid request' }, { status: 400 });
  }
  const sub = persistence.getSubscription(parsed.data.subscriptionId);
  if (!sub) {
    return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 });
  }

  if (!isIyzicoConfigured() || !sub.subscriptionReferenceCode) {
    persistence.saveSubscription({ ...sub, status: 'cancelled' });
    return NextResponse.json({ ok: true, stub: true });
  }

  // TODO(iyzico-subscription): call iyzipay.subscription.cancel(...)
  return NextResponse.json({
    ok: false,
    error: 'Cancellation via iyzico API not yet wired.',
  }, { status: 501 });
}
