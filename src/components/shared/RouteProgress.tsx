'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from '@/lib/router';

/**
 * Thin gradient progress bar shown during SPA route changes.
 * Since client navigation is instant, this is an honest visual cue that the
 * view changed (and covers the brief render/scroll settle), not a fake
 * loading percentage. Reduced-motion users get an instant, static flash.
 */
export default function RouteProgress() {
  const { path } = useRouter();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const firstRender = useRef(true);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];

    const finish = () => {
      setVisible(false);
      setProgress(0);
    };

    if (reduce) {
      // All state updates happen inside timer callbacks (never synchronously
      // in the effect body) to keep React's effect contract happy.
      timers.current.push(
        window.setTimeout(() => {
          setVisible(true);
          setProgress(100);
        }, 10),
        window.setTimeout(finish, 400)
      );
    } else {
      const steps: Array<[number, number]> = [
        [25, 10],
        [65, 180],
        [100, 400],
      ];
      for (const [value, delay] of steps) {
        timers.current.push(
          window.setTimeout(() => {
            setVisible(true);
            setProgress(value);
          }, delay)
        );
      }
      timers.current.push(window.setTimeout(finish, 780));
    }

    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, [path]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms ease' }}
    >
      <div className="h-[3px] w-full bg-transparent">
        <div className="route-progress-fill h-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
