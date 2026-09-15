'use client';

import { Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Ad placement placeholder (PRD §46 — monetization-ready, non-intrusive).
 *
 * FUTURE INTEGRATION:
 * When AdSense is approved, replace the inner placeholder box with the real
 * <ins class="adsbygoogle"> element and push the ad. Keep the reserved height
 * to avoid layout shift (CLS). Never let ads push or cover content, and never
 * render fake advertisements in this space.
 */

interface AdSlotProps {
  /** Descriptive slot name used for future ad-unit targeting. */
  slot: string;
  /** Visual format of the reserved space. */
  format?: 'horizontal' | 'rectangle';
  className?: string;
}

export default function AdSlot({ slot, format = 'horizontal', className }: AdSlotProps) {
  return (
    <aside
      aria-label="Advertisement placeholder"
      data-ad-slot={slot}
      className={cn('not-prose', className)}
    >
      <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
        Advertisement
      </p>
      <div
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-muted/30 text-muted-foreground/50',
          format === 'horizontal' ? 'min-h-[90px] px-4 py-6' : 'min-h-[250px] px-4 py-6'
        )}
      >
        <Megaphone className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="text-xs">Space reserved for future, clearly-labeled ads</span>
      </div>
    </aside>
  );
}
