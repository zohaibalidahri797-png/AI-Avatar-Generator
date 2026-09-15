'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';
import Reveal from '@/components/shared/Reveal';

interface CTABannerProps {
  title: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

/** Reusable gradient call-to-action banner used at the bottom of content pages. */
export default function CTABanner({
  title,
  text,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CTABannerProps) {
  return (
    <section aria-label="Call to action" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-fuchsia-500 px-6 py-12 text-center shadow-xl shadow-primary/25 sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 bg-dots opacity-40"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{title}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
              {text}
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={primaryHref} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="btn-sheen w-full gap-2 bg-white text-primary shadow-lg hover:bg-white/90 sm:w-auto"
                >
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              {secondaryLabel && secondaryHref && (
                <Link href={secondaryHref} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
                  >
                    {secondaryLabel}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
