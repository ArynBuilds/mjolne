import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getIyzipay, isIyzicoConfigured, iyzicoAmount } from '@/lib/iyzico';
import { persistence, newId } from '@/lib/persistence';
import { getProduct } from '@/lib/products';

const lineSchema = z.object({
  slug: z.string(),
  grind: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

const requestSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  surname: z.string().min(1),
  phone: z.string().min(5),
  identityNumber: z.string().min(5).default('11111111111'),
  address: z.string().min(5),
  city: z.string().min(1),
  country: z.string().min(1).default('Türkiye'),
  zipCode: z.string().min(1),
  lines: z.array(lineSchema).min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid request', details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { email, name, surname, phone, identityNumber, address, city, country, zipCode, lines } =
    parsed.data;

  const orderId = newId('ord');
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  persistence.saveOrder({
    id: orderId,
    email,
    status: 'pending',
    amount: subtotal,
    createdAt: Date.now(),
  });

  if (!isIyzicoConfigured()) {
    // Stub mode — pretend the payment succeeded for local dev.
    persistence.saveOrder({
      id: orderId,
      email,
      status: 'paid',
      amount: subtotal,
      createdAt: Date.now(),
    });
    return NextResponse.json({
      ok: true,
      stub: true,
      id: orderId,
      redirect: `/checkout/success?id=${orderId}`,
    });
  }

  const iyzipay = getIyzipay();
  if (!iyzipay) {
    return NextResponse.json({ ok: false, error: 'iyzipay unavailable' }, { status: 500 });
  }

  const callbackUrl = process.env.IYZIPAY_CALLBACK_URL!;

  const basketItems = lines.map((line) => {
    const product = getProduct(line.slug);
    return {
      id: `${line.slug}-${line.grind}`,
      name: product?.fullName ?? line.slug,
      category1: 'Coffee',
      itemType: 'PHYSICAL',
      price: iyzicoAmount(line.unitPrice * line.quantity),
    };
  });

  const payload = {
    locale: 'tr',
    conversationId: orderId,
    price: iyzicoAmount(subtotal),
    paidPrice: iyzicoAmount(subtotal),
    currency: 'TRY',
    basketId: orderId,
    paymentGroup: 'PRODUCT',
    callbackUrl,
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: email,
      name,
      surname,
      gsmNumber: phone,
      email,
      identityNumber,
      registrationAddress: address,
      city,
      country,
      ip: req.headers.get('x-forwarded-for') ?? '127.0.0.1',
    },
    shippingAddress: { contactName: `${name} ${surname}`, city, country, address, zipCode },
    billingAddress: { contactName: `${name} ${surname}`, city, country, address, zipCode },
    basketItems,
  };

  const result = await new Promise<unknown>((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(payload, (err: unknown, data: unknown) => {
      if (err) reject(err);
      else resolve(data);
    });
  }).catch((err: unknown) => ({ error: err }));

  type IyzicoInit = {
    status: 'success' | 'failure';
    token: string;
    checkoutFormContent: string;
    paymentPageUrl?: string;
    errorMessage?: string;
  };

  if (typeof result === 'object' && result && 'error' in result) {
    return NextResponse.json({ ok: false, error: 'iyzipay rejected the request' }, { status: 502 });
  }
  const data = result as IyzicoInit;
  if (data.status !== 'success') {
    return NextResponse.json(
      { ok: false, error: data.errorMessage ?? 'iyzipay rejected the request' },
      { status: 502 },
    );
  }

  persistence.saveOrder({
    id: orderId,
    email,
    status: 'pending',
    amount: subtotal,
    iyzicoToken: data.token,
    createdAt: Date.now(),
  });

  return NextResponse.json({
    ok: true,
    id: orderId,
    token: data.token,
    checkoutFormContent: data.checkoutFormContent,
    paymentPageUrl: data.paymentPageUrl,
  });
}
