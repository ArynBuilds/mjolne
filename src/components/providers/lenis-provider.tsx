'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

// Register GSAP plugins once at module load — needed so ScrollTrigger's snap
// can move the scroll position via ScrollToPlugin.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    window.__lenis = lenis;

    // Tell ScrollTrigger to recompute on every smoothed-scroll frame so its
    // progress values stay in lockstep with Lenis.
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker — single rAF for both libraries means
    // they can never disagree about the current scroll position. This is the
    // canonical integration recipe.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [reduced]);

  return <>{children}</>;
}
