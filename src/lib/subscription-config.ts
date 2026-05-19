import type { ProductSlug } from './products';

export type GrindOption = {
  key: 'whole-bean' | 'espresso' | 'filter' | 'french-press' | 'moka';
  label: string;
  hint: string;
};

export type VolumeOption = {
  key: '250g' | '500g' | '1kg';
  label: string;
  multiplier: number;
  cupHint?: string;
};

export type FrequencyOption = {
  key: 'weekly' | 'biweekly' | 'monthly';
  label: string;
  perMonthMultiplier: number;
};

export const GRINDS: GrindOption[] = [
  { key: 'whole-bean', label: 'Whole bean', hint: 'Grind at home for peak freshness.' },
  { key: 'espresso', label: 'Espresso', hint: 'Fine, for pressurised extraction.' },
  { key: 'filter', label: 'Filter', hint: 'Medium, for pour-over and drip.' },
  { key: 'french-press', label: 'French press', hint: 'Coarse, for full immersion.' },
  { key: 'moka', label: 'Moka', hint: 'Medium-fine, for stovetop pressure.' },
];

export const VOLUMES: VolumeOption[] = [
  { key: '250g', label: '250g', multiplier: 1 },
  { key: '500g', label: '500g', multiplier: 1.85 },
  { key: '1kg', label: '1kg', multiplier: 3.4, cupHint: '~40 cups' },
];

export const FREQUENCIES: FrequencyOption[] = [
  { key: 'weekly', label: 'Weekly', perMonthMultiplier: 4 },
  { key: 'biweekly', label: 'Every 2 weeks', perMonthMultiplier: 2 },
  { key: 'monthly', label: 'Monthly', perMonthMultiplier: 1 },
];

export const FREQUENCY_LABEL: Record<FrequencyOption['key'], string> = {
  weekly: 'every week',
  biweekly: 'every 2 weeks',
  monthly: 'every month',
};

export interface SubscriptionConfig {
  origin: ProductSlug;
  grind: GrindOption['key'];
  volume: VolumeOption['key'];
  frequency: FrequencyOption['key'];
}

const SUBSCRIPTION_DISCOUNT = 0.86;

export function pricePerBag(originPrice: number, volumeKey: VolumeOption['key']): number {
  const v = VOLUMES.find((x) => x.key === volumeKey);
  if (!v) return originPrice;
  return Math.round(originPrice * v.multiplier * SUBSCRIPTION_DISCOUNT);
}

export function pricePerMonth(
  originPrice: number,
  volumeKey: VolumeOption['key'],
  frequencyKey: FrequencyOption['key'],
): number {
  const f = FREQUENCIES.find((x) => x.key === frequencyKey);
  return pricePerBag(originPrice, volumeKey) * (f?.perMonthMultiplier ?? 1);
}

export function pricingPlanCacheKey(c: SubscriptionConfig): string {
  return `${c.origin}-${c.grind}-${c.volume}-${c.frequency}`;
}
