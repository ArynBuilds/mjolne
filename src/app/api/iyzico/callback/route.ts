import { NextResponse } from 'next/server';
import { getIyzipay, isIyzicoConfigured } from '@/lib/iyzico';
import { persistence } from '@/lib/persistence';

async function handleCallback(token: string | null) {
  if (!token) {
    return NextResponse.redirect(new URL('/checkout/failed?reason=missing-token', requestOrigin()));
  }
  if (!isIyzicoConfigured()) {
    return NextResponse.redirect(new URL('/checkout/success?stub=1', requestOrigin()));
  }
  const iyzipay = getIyzipay();
  if (!iyzipay) {
    return NextResponse.redirect(new URL('/checkout/failed?reason=server', requestOrigin()));
  }

  const result = await new Promise<unknown>((resolve, reject) => {
    iyzipay.checkoutForm.retrieve({ token, locale: 'tr' }, (err: unknown, data: unknown) => {
      if (err) reject(err);
      else resolve(data);
    });
  }).catch((err: unknown) => ({ error: err }));

  if (typeof result === 'object' && result && 'error' in result) {
    return NextResponse.redirect(new URL('/checkout/failed?reason=retrieve', requestOrigin()));
  }

  type IyzicoRetrieve = {
    status: 'success' | 'failure';
    paymentStatus?: string;
    paymentId?: string;
    conversationId: string;
    errorMessage?: string;
  };
  const data = result as IyzicoRetrieve;

  const order = persistence.getOrder(data.conversationId);
  if (!order) {
    return NextResponse.redirect(new URL('/checkout/failed?reason=unknown-order', requestOrigin()));
  }

  if (data.status === 'success' && data.paymentStatus === 'SUCCESS') {
    persistence.saveOrder({ ...order, status: 'paid', paymentId: data.paymentId });
    // Best-effort transactional email.
    void sendOrderConfirmation(order.email, order.id);
    return NextResponse.redirect(new URL(`/checkout/success?id=${order.id}`, requestOrigin()));
  }

  persistence.saveOrder({ ...order, status: 'failed' });
  const reason = data.errorMessage ?? data.paymentStatus ?? 'failed';
  return NextResponse.redirect(
    new URL(`/checkout/failed?id=${order.id}&reason=${encodeURIComponent(reason)}`, requestOrigin()),
  );
}

function requestOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
}

async function sendOrderConfirmation(email: string, orderId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;
  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);
  await resend.emails
    .send({
      from,
      to: email,
      subject: 'Your beans are on their way',
      text:
        `Order ${orderId}\n\nThank you. Your bag is roasted and shipping shortly.\n\n— MJØLNE`,
    })
    .catch(() => {});
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  return handleCallback(token);
}

export async function POST(req: Request) {
  const formData = await req.formData().catch(() => null);
  const token = formData?.get('token')?.toString() ?? null;
  return handleCallback(token);
}
