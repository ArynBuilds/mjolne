import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { persistence } from '@/lib/persistence';

interface WebhookBody {
  iyziEventType: string;
  subscriptionReferenceCode?: string;
  orderReferenceCode?: string;
  customerReferenceCode?: string;
  merchantId: string;
}

function verifySignature(rawBody: string, signature: string | null, body: WebhookBody): boolean {
  const secret = process.env.IYZIPAY_SECRET_KEY;
  if (!secret) return false;
  if (!signature) return false;
  const concat = `${secret}${body.merchantId}${body.iyziEventType}${body.subscriptionReferenceCode ?? ''}${body.orderReferenceCode ?? ''}${body.customerReferenceCode ?? ''}`;
  const expected = crypto.createHmac('sha256', secret).update(concat).digest('hex');
  // Constant-time compare
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const raw = await req.text();
  let parsed: WebhookBody;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const signature = req.headers.get('x-iyz-signature-v3');
  const verified = verifySignature(raw, signature, parsed);
  if (!verified && process.env.IYZIPAY_SECRET_KEY) {
    return NextResponse.json({ ok: false, error: 'signature mismatch' }, { status: 401 });
  }

  switch (parsed.iyziEventType) {
    case 'subscription.order.success': {
      if (parsed.subscriptionReferenceCode) {
        const sub = persistence.listSubscriptions().find(
          (s) => s.subscriptionReferenceCode === parsed.subscriptionReferenceCode,
        );
        if (sub) persistence.saveSubscription({ ...sub, status: 'active' });
      }
      break;
    }
    case 'subscription.order.failure': {
      // Mark and notify; we don't change status here because retry may succeed.
      console.warn('[iyzico] subscription order failure', parsed.subscriptionReferenceCode);
      break;
    }
    case 'subscription.cancel': {
      if (parsed.subscriptionReferenceCode) {
        const sub = persistence.listSubscriptions().find(
          (s) => s.subscriptionReferenceCode === parsed.subscriptionReferenceCode,
        );
        if (sub) persistence.saveSubscription({ ...sub, status: 'cancelled' });
      }
      break;
    }
    default: {
      // Standard payment events for one-off orders, or unknown types.
      console.info('[iyzico] event', parsed.iyziEventType);
    }
  }

  return NextResponse.json({ ok: true });
}
