'use client';

import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'avatarforge-cookie-notice-acknowledged';

/** Lightweight, honest cookie notice (this site only uses strictly necessary storage). */
export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        if (!window.localStorage.getItem(STORAGE_KEY)) {
          setVisible(true);
        }
      } catch {
        /* storage unavailable — stay hidden to avoid nagging */
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-border bg-card p-4 shadow-xl shadow-primary/10 sm:inset-x-6"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
          <Cookie className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-relaxed text-foreground">
            We only use essential storage to remember your preferences. See our{' '}
            <Link href="/cookie-policy" className="font-medium text-primary underline underline-offset-2">
              Cookie Policy
            </Link>
            .
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={dismiss}>
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
