'use client';

import { useEffect, useRef, useState } from 'react';

interface DemlemeCounterProps {
  value: string;
  containerRef: React.RefObject<HTMLElement>;
  duration?: number;
  delay?: number;
}

const NUMERIC_PREFIX = /^(\d+)/;

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function DemlemeCounter({
  value,
  containerRef,
  duration = 800,
  delay = 0,
}: DemlemeCounterProps) {
  const match = value.match(NUMERIC_PREFIX);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? value.slice(match[1].length) : '';

  const [displayed, setDisplayed] = useState<string>(
    target === null ? value : '0' + suffix,
  );
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (target === null) {
      setDisplayed(value);
      return;
    }
    if (typeof window === 'undefined') return;
    const node = containerRef.current;
    if (!node) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayed(value);
      hasAnimatedRef.current = true;
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting || hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        observer.disconnect();

        const startTime = performance.now() + delay;
        const tick = (now: number) => {
          const elapsed = now - startTime;
          if (elapsed < 0) {
            raf = requestAnimationFrame(tick);
            return;
          }
          const t = Math.min(1, elapsed / duration);
          const current = Math.round(easeOutQuart(t) * target);
          setDisplayed(current + suffix);
          if (t < 1) {
            raf = requestAnimationFrame(tick);
          } else {
            setDisplayed(value);
          }
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: '-15% 0px' },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [containerRef, target, value, suffix, duration, delay]);

  return <>{displayed}</>;
}
