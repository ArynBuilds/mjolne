'use client';

import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { getProduct, type ProductSlug } from '@/lib/products';
import {
  GRINDS,
  VOLUMES,
  FREQUENCIES,
  pricePerBag,
  pricePerMonth,
  type SubscriptionConfig,
  FREQUENCY_LABEL,
} from '@/lib/subscription-config';
import { formatTRY } from '@/lib/format';
import { ConfigPill } from './config-pill';
import { StepShell } from './step-shell';
import { StepOrigin } from './step-origin';
import { PreviewPane } from './preview-pane';

const STEPS = ['Origin', 'Grind', 'Volume', 'Frequency'] as const;

const DEFAULT: SubscriptionConfig = {
  origin: 'peru',
  grind: 'filter',
  volume: '250g',
  frequency: 'monthly',
};

export function SubscriptionConfigurator() {
  const [config, setConfig] = useState<SubscriptionConfig>(DEFAULT);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const product = getProduct(config.origin)!;
  const monthly = pricePerMonth(product.price, config.volume, config.frequency);
  const perBag = pricePerBag(product.price, config.volume);

  const summaries = useMemo(
    () => ({
      0: product.fullName,
      1: GRINDS.find((g) => g.key === config.grind)?.label ?? '',
      2: VOLUMES.find((v) => v.key === config.volume)?.label ?? '',
      3: FREQUENCIES.find((f) => f.key === config.frequency)?.label ?? '',
    }),
    [product, config.grind, config.volume, config.frequency],
  );

  function update<K extends keyof SubscriptionConfig>(key: K, value: SubscriptionConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }));
  }

  function advance() {
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  async function startSubscription() {
    if (!email) return;
    setErrorMessage(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...config, email }),
      });
      const json = await res.json();
      if (json.checkoutFormContent) {
        window.location.href = `/checkout?token=${encodeURIComponent(json.token)}&context=subscription`;
      } else if (json.stub) {
        window.location.href = `/checkout/success?context=subscription&id=${json.id}`;
      } else {
        setErrorMessage(json.error ?? 'Could not start your subscription. Please try again.');
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="grid items-start"
      style={{
        gridTemplateColumns: 'minmax(0, 38fr) minmax(0, 62fr)',
        columnGap: 'var(--space-9)',
      }}
    >
      <PreviewPane product={product} config={config} />

      <div
        className="relative flex flex-col bg-paper"
        style={{
          borderRadius: 'var(--radius-lg)',
          border: '0.5px solid var(--color-hairline)',
          boxShadow: 'var(--shadow-card)',
          paddingInline: 'var(--space-7)',
        }}
      >
        <div style={{ paddingTop: 'var(--space-6)' }}>
          <StepShell
            index={1}
            title="Origin"
            isOpen={step === 0}
            isComplete={step > 0}
            isFirst
            summary={summaries[0]}
            onOpen={() => setStep(0)}
          >
            <StepOrigin
              config={config}
              onChange={(slug: ProductSlug) => {
                update('origin', slug);
                advance();
              }}
            />
          </StepShell>

          <StepShell
            index={2}
            title="Grind"
            isOpen={step === 1}
            isComplete={step > 1}
            summary={summaries[1]}
            onOpen={() => setStep(1)}
          >
            <div className="flex flex-wrap" style={{ gap: 'var(--space-3)' }}>
              {GRINDS.map((g) => (
                <ConfigPill
                  key={g.key}
                  selected={config.grind === g.key}
                  onClick={() => {
                    update('grind', g.key);
                    advance();
                  }}
                  label={g.label}
                  caption={g.hint}
                />
              ))}
            </div>
          </StepShell>

          <StepShell
            index={3}
            title="Volume"
            isOpen={step === 2}
            isComplete={step > 2}
            summary={summaries[2]}
            onOpen={() => setStep(2)}
          >
            <div className="flex flex-wrap" style={{ gap: 'var(--space-3)' }}>
              {VOLUMES.map((v) => (
                <ConfigPill
                  key={v.key}
                  selected={config.volume === v.key}
                  onClick={() => {
                    update('volume', v.key);
                    advance();
                  }}
                  label={v.label}
                  caption={v.cupHint}
                />
              ))}
            </div>
          </StepShell>

          <StepShell
            index={4}
            title="Frequency"
            isOpen={step === 3}
            isComplete={step > 3}
            summary={summaries[3]}
            onOpen={() => setStep(3)}
          >
            <div className="flex flex-wrap" style={{ gap: 'var(--space-3)' }}>
              {FREQUENCIES.map((f) => (
                <ConfigPill
                  key={f.key}
                  selected={config.frequency === f.key}
                  onClick={() => update('frequency', f.key)}
                  label={f.label}
                  caption={`${formatTRY(perBag * f.perMonthMultiplier)}/mo`}
                />
              ))}
            </div>
            <p
              className="text-mute"
              style={{
                fontSize: 12,
                lineHeight: 1.45,
                marginTop: 'var(--space-6)',
              }}
            >
              {formatTRY(monthly)} per month, charged on the day of delivery.
            </p>
          </StepShell>
        </div>

        <div
          className="sticky"
          style={{
            bottom: 0,
            background: 'var(--color-paper)',
            borderTop: '0.5px solid var(--color-hairline)',
            paddingBlock: 'var(--space-5)',
            marginInline: 'calc(-1 * var(--space-7))',
            paddingInline: 'var(--space-7)',
            borderBottomLeftRadius: 'var(--radius-lg)',
            borderBottomRightRadius: 'var(--radius-lg)',
            zIndex: 1,
          }}
        >
          <div
            className="grid items-center"
            style={{
              gridTemplateColumns: 'minmax(0, 1fr) auto auto',
              columnGap: 'var(--space-5)',
            }}
          >
            <input
              type="email"
              required
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              aria-invalid={errorMessage ? true : undefined}
              className="border border-hairline rounded-pill outline-none transition-colors focus:bg-paper focus:border-ink"
              style={{
                background: 'var(--color-fog)',
                paddingInline: 'var(--space-5)',
                paddingBlock: 'var(--space-3)',
                fontSize: 15,
              }}
            />
            <span className="font-display" style={{ fontSize: 22, fontWeight: 500 }}>
              {formatTRY(monthly)}<span className="text-mute" style={{ fontSize: 13, marginLeft: 4 }}>/ay</span>
            </span>
            <button
              type="button"
              disabled={!email || submitting}
              onClick={startSubscription}
              className="pill-button pill-button-primary"
              style={{ height: 48 }}
            >
              {submitting ? 'Starting…' : 'Start subscription'}
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </div>

          {errorMessage ? (
            <p
              role="alert"
              className="font-display italic text-ink"
              style={{
                fontSize: 14,
                lineHeight: 1.45,
                marginTop: 'var(--space-3)',
                fontWeight: 400,
              }}
            >
              {errorMessage}
            </p>
          ) : (
            <p
              className="text-mute"
              style={{
                fontSize: 12,
                lineHeight: 1.45,
                marginTop: 'var(--space-3)',
              }}
            >
              Pause, skip or cancel from your account. Roasted Tuesday, shipped Wednesday.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
