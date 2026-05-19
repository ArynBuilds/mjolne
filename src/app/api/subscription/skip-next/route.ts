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

  if (!isIyzicoConfigured()) {
    return NextResponse.json({ ok: true, stub: true, message: 'Skipped next delivery (stub).' });
  }

  // TODO(iyzico-subscription): the iyzico add-on does not expose a first-class
  // "skip next" — implement by pausing for the duration of one cycle, or by
  // canceling and re-creating with a future start date. Document the choice
  // in DECISIONS.md once implemented.
  return NextResponse.json({
    ok: false,
    error: 'Skip-next via iyzico API not yet wired.',
  }, { status: 501 });
}
