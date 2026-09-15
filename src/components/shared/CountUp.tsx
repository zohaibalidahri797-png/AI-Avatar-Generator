'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: number;
  suffix?: string;
  duration?: number;
}

/**
 * Counts from 0 to `value` the first time it scrolls into view.
 * SSR and reduced-motion users always see the final value immediately.
 */
export default function CountUp({ value, suffix = '', duration = 1200 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion (or missing IO support): keep showing the final value — no animation.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (startedRef.current || !entries.some((e) => e.isIntersecting)) return;
        startedRef.current = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          setDisplay(Math.round(eased * value));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
