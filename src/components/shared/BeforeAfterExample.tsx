'use client';

import { useRef, useState } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

import type { LandingConfig } from '@/lib/types';

/**
 * Before/after example for style landing pages.
 *
 * Every pair shows a real transformation produced by the site's own
 * generation API, and both people are fictional AI-generated characters —
 * the caption states this honestly. Fully keyboard accessible.
 */
export default function BeforeAfterExample({ showcase }: { showcase: NonNullable<LandingConfig['showcase']> }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(97, Math.max(3, pct)));
  };

  return (
    <figure className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <div
        ref={containerRef}
        className="relative mx-auto aspect-square w-full max-w-xl cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border"
        onPointerDown={(e) => {
          draggingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (draggingRef.current) updateFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          draggingRef.current = false;
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
        }}
      >
        {/* Result (full layer) */}
        <img
          src={showcase.after}
          alt={showcase.afterAlt}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          loading="lazy"
        />
        {/* Source photo clipped to the left of the handle */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} aria-hidden="true">
          <img
            src={showcase.before}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
            loading="lazy"
          />
        </div>

        {/* Divider + handle */}
        <div className="absolute inset-y-0 w-0.5 bg-white/90" style={{ left: `${pos}%` }} aria-hidden="true" />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Compare the source photo with the generated avatar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              setPos((p) => Math.max(3, p - 4));
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              setPos((p) => Math.min(97, p + 4));
            } else if (e.key === 'Home') {
              e.preventDefault();
              setPos(3);
            } else if (e.key === 'End') {
              e.preventDefault();
              setPos(97);
            }
          }}
          className="compare-handle absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-800 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ left: `${pos}%` }}
        >
          <ChevronsLeftRight className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Corner labels */}
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white">
          Source photo
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white">
          Avatar result
        </span>
      </div>

      <figcaption className="mx-auto mt-4 max-w-xl text-center">
        <p className="text-sm leading-relaxed text-muted-foreground">{showcase.caption}</p>
        <p className="mt-1.5 text-xs text-muted-foreground/80">
          Example shows a fictional, AI-generated person — drag the handle to compare.
        </p>
      </figcaption>
    </figure>
  );
}
