'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductSlug } from './products';

export type GrindKey = 'whole-bean' | 'espresso' | 'filter' | 'french-press' | 'moka';

export interface CartLine {
  slug: ProductSlug;
  grind: GrindKey;
  quantity: number;
  unitPrice: number;
}

interface CartState {
  isOpen: boolean;
  lines: CartLine[];
  add: (line: CartLine) => void;
  remove: (slug: ProductSlug, grind: GrindKey) => void;
  setQuantity: (slug: ProductSlug, grind: GrindKey, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      isOpen: false,
      lines: [],
      add: (line) =>
        set((state) => {
          const idx = state.lines.findIndex((l) => l.slug === line.slug && l.grind === line.grind);
          if (idx >= 0) {
            const next = [...state.lines];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + line.quantity };
            return { lines: next, isOpen: true };
          }
          return { lines: [...state.lines, line], isOpen: true };
        }),
      remove: (slug, grind) =>
        set((state) => ({
          lines: state.lines.filter((l) => !(l.slug === slug && l.grind === grind)),
        })),
      setQuantity: (slug, grind, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.slug === slug && l.grind === grind ? { ...l, quantity } : l))
            .filter((l) => l.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: 'mjolne-cart',
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
}
