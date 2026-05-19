// Server-only iyzico client. Never import this from a 'use client' file.
import 'server-only';
import Iyzipay from 'iyzipay';

let cached: Iyzipay | null = null;

export function getIyzipay(): Iyzipay | null {
  if (cached) return cached;

  const apiKey = process.env.IYZIPAY_API_KEY;
  const secretKey = process.env.IYZIPAY_SECRET_KEY;
  const uri = process.env.IYZIPAY_BASE_URL ?? 'https://sandbox-api.iyzipay.com';

  if (!apiKey || !secretKey) {
    return null;
  }

  cached = new Iyzipay({ apiKey, secretKey, uri });
  return cached;
}

export function isIyzicoConfigured(): boolean {
  return Boolean(process.env.IYZIPAY_API_KEY && process.env.IYZIPAY_SECRET_KEY);
}

export function iyzicoAmount(n: number): string {
  return n.toFixed(2);
}
