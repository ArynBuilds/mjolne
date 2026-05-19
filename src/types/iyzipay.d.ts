// Minimal ambient types for the official iyzipay package.
// Only what the app uses is declared.

declare module 'iyzipay' {
  type IyzipayCallback<T = unknown> = (err: unknown, data: T) => void;

  interface IyzipayConfig {
    apiKey: string;
    secretKey: string;
    uri: string;
  }

  interface CheckoutFormInitialize {
    create(payload: Record<string, unknown>, cb: IyzipayCallback): void;
  }
  interface CheckoutForm {
    retrieve(payload: Record<string, unknown>, cb: IyzipayCallback): void;
  }

  class Iyzipay {
    constructor(config: IyzipayConfig);
    checkoutFormInitialize: CheckoutFormInitialize;
    checkoutForm: CheckoutForm;
  }

  export = Iyzipay;
}
