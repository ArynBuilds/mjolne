'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/lib/cart-store';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  surname: z.string().min(1),
  phone: z.string().min(8),
  identityNumber: z.string().min(5).default('11111111111'),
  address: z.string().min(8),
  city: z.string().min(1),
  zipCode: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutForm() {
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [iframeHtml, setIframeHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!iframeHtml) return;
    // Inject iyzico's checkoutFormContent into the page.
    const target = document.getElementById('iyzipay-checkout-form');
    if (target) {
      target.innerHTML = iframeHtml;
      const scripts = target.querySelectorAll('script');
      scripts.forEach((old) => {
        const fresh = document.createElement('script');
        if (old.src) fresh.src = old.src;
        else fresh.text = old.text;
        old.replaceWith(fresh);
      });
    }
  }, [iframeHtml]);

  async function onSubmit(values: FormValues) {
    setError(null);
    const res = await fetch('/api/iyzico/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...values, country: 'Türkiye', lines }),
    });
    const json = await res.json();
    if (json.stub) {
      clear();
      window.location.href = json.redirect ?? '/checkout/success';
      return;
    }
    if (!json.ok) {
      setError(json.error ?? 'Could not start checkout.');
      return;
    }
    setIframeHtml(json.checkoutFormContent);
  }

  if (iframeHtml) {
    return (
      <section>
        <p className="eyebrow text-mute mb-3">— Payment</p>
        <p className="text-body mb-6">
          Complete card details and 3D Secure below. You will be returned to MJØLNE on success.
        </p>
        <div id="iyzipay-checkout-form" className="bg-paper border border-hairline rounded-lg p-6" />
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-12">
      <section>
        <p className="eyebrow text-mute mb-4">01 · Contact</p>
        <Field id="email" label="Email" {...register('email')} error={errors.email?.message} type="email" />
      </section>

      <section>
        <p className="eyebrow text-mute mb-4">02 · Shipping</p>
        <div className="grid grid-cols-2 gap-4">
          <Field id="name" label="First name" {...register('name')} error={errors.name?.message} />
          <Field id="surname" label="Last name" {...register('surname')} error={errors.surname?.message} />
        </div>
        <Field id="phone" label="Phone" {...register('phone')} error={errors.phone?.message} />
        <Field
          id="identityNumber"
          label="TC Kimlik No"
          {...register('identityNumber')}
          error={errors.identityNumber?.message}
        />
        <Field id="address" label="Address" {...register('address')} error={errors.address?.message} />
        <div className="grid grid-cols-2 gap-4">
          <Field id="city" label="City" {...register('city')} error={errors.city?.message} />
          <Field id="zipCode" label="Postal code" {...register('zipCode')} error={errors.zipCode?.message} />
        </div>
      </section>

      <section>
        <p className="eyebrow text-mute mb-4">03 · Payment</p>
        <p className="text-body text-mute mb-4">
          You will be taken to a secure iyzico card form to complete payment.
        </p>
        {error ? <p className="text-caption text-colombia mb-3">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting || lines.length === 0}
          className="pill-button pill-button-primary w-full justify-center"
          style={{ height: 52 }}
        >
          {isSubmitting ? 'Starting payment…' : 'Continue to payment'}
        </button>
      </section>
    </form>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

const Field = ({ id, label, error, type = 'text', ...rest }: FieldProps) => (
  <label htmlFor={id} className="block mb-3">
    <span className="block eyebrow text-mute mb-2">{label}</span>
    <input
      id={id}
      type={type}
      {...rest}
      className="w-full border border-hairline rounded-md px-4 py-3 outline-none transition-colors focus:bg-paper focus:border-ink"
      style={{ background: 'var(--color-fog)' }}
    />
    {error ? <span className="block text-caption text-colombia mt-1">{error}</span> : null}
  </label>
);
