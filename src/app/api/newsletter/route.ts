import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid email' }, { status: 400 });
  }

  const { email } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    // No keys configured — accept the request locally so the UX flows in dev.
    console.info('[newsletter] stub-accept', email);
    return NextResponse.json({ ok: true, stub: true });
  }

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);
  const result = await resend.contacts.create({ email, audienceId });

  if (result.error) {
    return NextResponse.json({ ok: false, error: result.error.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
