'use client';

import { useEffect } from 'react';
import { normalizeHref } from '@/lib/router';

/**
 * Legacy-hash migration shim (hydration-time safety net).
 *
 * Hash fragments are never sent to the server, so old links like
 * `/#/ai-avatar-generator` or `/#/gallery?fav=1` land on `/` with a hash.
 * The root layout also ships an inline pre-hydration script that performs
 * this migration before React loads; this component is an idempotent
 * fallback that rewrites the URL via location.replace() (no history entry,
 * no redirect loop) if the hash is ever still present after hydration.
 */
export default function HashRedirect() {
  useEffect(() => {
    const raw = window.location.hash;
    if (!raw.startsWith('#/')) return;
    const target = raw.slice(1); // '#/gallery?fav=1' -> '/gallery?fav=1'
    window.location.replace(normalizeHref(target));
  }, []);

  return null;
}
