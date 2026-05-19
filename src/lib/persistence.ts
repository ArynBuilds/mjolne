// In-memory persistence stub. Replace with Drizzle + Postgres before production.
// TODO(persistence): swap for a real database adapter.
import 'server-only';

export interface OrderRecord {
  id: string;
  email: string;
  status: 'pending' | 'paid' | 'failed';
  amount: number;
  iyzicoToken?: string;
  paymentId?: string;
  createdAt: number;
}

export interface SubscriptionRecord {
  id: string;
  customerReferenceCode: string;
  email: string;
  origin: string;
  grind: string;
  volume: string;
  frequency: string;
  pricingPlanReferenceCode: string;
  subscriptionReferenceCode?: string;
  status: 'pending' | 'active' | 'cancelled' | 'paused';
  createdAt: number;
}

export interface PricingPlanCacheEntry {
  productReferenceCode: string;
  pricingPlanReferenceCode: string;
}

interface Store {
  orders: Map<string, OrderRecord>;
  subscriptions: Map<string, SubscriptionRecord>;
  pricingPlans: Map<string, PricingPlanCacheEntry>; // key: `${origin}-${grind}-${volume}-${frequency}`
}

declare global {
  // eslint-disable-next-line no-var
  var __mjolne_store: Store | undefined;
}

function getStore(): Store {
  if (!globalThis.__mjolne_store) {
    globalThis.__mjolne_store = {
      orders: new Map(),
      subscriptions: new Map(),
      pricingPlans: new Map(),
    };
  }
  return globalThis.__mjolne_store;
}

export const persistence = {
  saveOrder(record: OrderRecord) {
    getStore().orders.set(record.id, record);
  },
  getOrder(id: string) {
    return getStore().orders.get(id);
  },
  listOrders(email?: string) {
    const all = Array.from(getStore().orders.values());
    return email ? all.filter((o) => o.email === email) : all;
  },
  saveSubscription(record: SubscriptionRecord) {
    getStore().subscriptions.set(record.id, record);
  },
  getSubscription(id: string) {
    return getStore().subscriptions.get(id);
  },
  listSubscriptions(email?: string) {
    const all = Array.from(getStore().subscriptions.values());
    return email ? all.filter((s) => s.email === email) : all;
  },
  cachePricingPlan(key: string, entry: PricingPlanCacheEntry) {
    getStore().pricingPlans.set(key, entry);
  },
  getPricingPlan(key: string) {
    return getStore().pricingPlans.get(key);
  },
};

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
