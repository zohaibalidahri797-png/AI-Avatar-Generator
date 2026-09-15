'use client';

import { useEffect, useState } from 'react';
import { Check, HelpCircle, Link2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import CTABanner from '@/components/shared/CTABanner';
import PageHero from '@/components/shared/PageHero';
import { FAQ_GROUPS, FAQS } from '@/lib/faq-data';
import { Link, useRouter } from '@/lib/router';
import { useSeo } from '@/lib/seo';
import { site } from '@/lib/site';
import { useToast } from '@/hooks/use-toast';
import type { FaqItem } from '@/lib/types';
import { cn } from '@/lib/utils';

/** Stable DOM ids used by the quick-jump chips (buttons + scrollIntoView, hash-router safe). */
const GROUP_IDS = [
  'faq-getting-started',
  'faq-styles-customization',
  'faq-downloads-formats',
  'faq-accounts-privacy',
];

const GROUP_META: { id: string; kicker: string; description: React.ReactNode }[] = [
  {
    id: GROUP_IDS[0],
    kicker: 'Part 1 of 4',
    description:
      'New to AI avatars? Start here — how the tool works, what it costs and what makes a good source photo.',
  },
  {
    id: GROUP_IDS[1],
    kicker: 'Part 2 of 4',
    description:
      'Professional, anime, gaming and platform-specific looks — plus backgrounds, lighting and framing options.',
  },
  {
    id: GROUP_IDS[2],
    kicker: 'Part 3 of 4',
    description:
      'What you get out of the studio: file formats, download quality, timing and how many avatars you can create.',
  },
  {
    id: GROUP_IDS[3],
    kicker: 'Part 4 of 4',
    description: (
      <>
        No accounts, no public galleries. How your photo is handled (see the{' '}
        <Link
          href="/privacy-policy"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Privacy Policy
        </Link>
        ) and what you may do with your avatars. Anything missing?{' '}
        <Link href="/contact" className="font-medium text-primary underline-offset-4 hover:underline">
          Ask us directly
        </Link>
        .
      </>
    ),
  },
];

function scrollToGroup(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function FaqAccordion({
  items,
  groupIndex,
  highlight,
  onCopy,
  copiedKey,
}: {
  items: FaqItem[];
  groupIndex: number;
  highlight: number;
  onCopy: (groupIndex: number, qi: number) => void;
  copiedKey: string | null;
}) {
  // Controlled accordion: a deep link (?g=&q=) can arrive one tick after
  // mount (the router syncs the query from the address bar after hydration),
  // and Radix ignores `defaultValue` changes — so the open item is managed
  // explicitly and adjusted when the highlight prop changes.
  const [openValue, setOpenValue] = useState<string | undefined>(
    highlight >= 0 ? `q-${groupIndex}-${highlight}` : undefined
  );
  const [lastHighlight, setLastHighlight] = useState(highlight);
  if (highlight !== lastHighlight) {
    setLastHighlight(highlight);
    setOpenValue(highlight >= 0 ? `q-${groupIndex}-${highlight}` : undefined);
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={openValue}
      onValueChange={setOpenValue}
    >
      {items.map((faq, qi) => {
        const isHighlighted = highlight >= 0 && qi === highlight;
        const copyKey = `${groupIndex}-${qi}`;
        return (
          <AccordionItem
            key={faq.question}
            value={`q-${groupIndex}-${qi}`}
            id={`q-${groupIndex}-${qi}`}
            className={cn('scroll-mt-28', isHighlighted && 'border-primary/40 bg-accent/40 px-3 sm:px-4')}
          >
            <div className="relative">
              <AccordionTrigger className="pr-9 text-left text-base font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <button
                type="button"
                onClick={() => onCopy(groupIndex, qi)}
                aria-label={`Copy a link to this question: ${faq.question}`}
                title="Copy a link to this answer"
                className="absolute right-0 top-1 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {copiedKey === copyKey ? (
                  <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                ) : (
                  <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default function FAQPage() {
  const { query } = useRouter();
  const { toast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  /** Deep link: #/faq?g=1&q=2 opens & scrolls to that exact question. */
  const deepLink = (() => {
    const g = Number.parseInt(query.get('g') ?? '', 10);
    const q = Number.parseInt(query.get('q') ?? '', 10);
    if (
      Number.isInteger(g) &&
      g >= 0 &&
      g < FAQ_GROUPS.length &&
      Number.isInteger(q) &&
      q >= 0 &&
      q < FAQ_GROUPS[g].questions.length
    ) {
      return { g, q };
    }
    return null;
  })();

  useEffect(() => {
    if (!deepLink) return;
    let cancelled = false;
    const t = window.setTimeout(() => {
      if (cancelled) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document
        .getElementById(`q-${deepLink.g}-${deepLink.q}`)
        ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [deepLink]);

  useEffect(() => {
    if (copiedKey === null) return;
    const t = window.setTimeout(() => setCopiedKey(null), 2000);
    return () => window.clearTimeout(t);
  }, [copiedKey]);

  const copyFaqLink = (gi: number, qi: number) => {
    const url = `${site.url}/faq/?g=${gi}&q=${qi}`;
    const done = () => {
      setCopiedKey(`${gi}-${qi}`);
      toast({ title: 'Link copied', description: 'It opens this answer directly, already expanded.' });
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(() => {
        toast({ title: 'Could not copy', description: url });
      });
    } else {
      toast({ title: 'Copy not available', description: url });
    }
  };

  useSeo({
    title: 'AI Avatar Generator FAQ — Questions & Answers | AvatarForge',
    description:
      'Answers to common questions about the free AI avatar generator: photo requirements, styles, downloads, formats, privacy, accounts and tips for better results.',
    path: '/faq',
  });

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <>
      <PageHero
        badge="FAQ"
        title="Frequently asked questions"
        description="Everything about creating AI avatars with AvatarForge — styles, formats, privacy and tips."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'FAQ' },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Quick jump */}
      <section aria-label="Jump to a question group" className="pb-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2">
            {FAQ_GROUPS.map((group, gi) => (
              <Button
                key={group.title}
                variant="outline"
                size="sm"
                onClick={() => scrollToGroup(GROUP_IDS[gi])}
                className="rounded-full"
              >
                {group.title}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Question groups */}
      {FAQ_GROUPS.map((group, gi) => (
        <section
          key={group.title}
          id={GROUP_META[gi].id}
          aria-labelledby={`${GROUP_META[gi].id}-heading`}
          className="scroll-mt-24 py-10 sm:py-14"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {GROUP_META[gi].kicker}
              </p>
              <h2
                id={`${GROUP_META[gi].id}-heading`}
                className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl"
              >
                {group.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {GROUP_META[gi].description}
              </p>
              <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
                <FaqAccordion
                  items={group.questions}
                  groupIndex={gi}
                  highlight={deepLink && deepLink.g === gi ? deepLink.q : -1}
                  onCopy={copyFaqLink}
                  copiedKey={copiedKey}
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Help note */}
      <section className="pb-14 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 rounded-2xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
              aria-hidden="true"
            >
              <HelpCircle className="h-5 w-5" />
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Can&apos;t find your answer?{' '}
              <Link
                href="/contact"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Send us a message
              </Link>{' '}
              and we&apos;ll get back to you. Curious how uploaded photos are handled? The{' '}
              <Link
                href="/privacy-policy"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>{' '}
              explains it in plain language.
            </p>
          </div>
        </div>
      </section>

      <CTABanner
        title="Still have questions?"
        text="Reach out and we'll help you out — or jump straight into the studio and see how easy it is to turn a photo into an avatar."
        primaryLabel="Contact us"
        primaryHref="/contact"
        secondaryLabel="Try the generator"
        secondaryHref="/ai-avatar-generator"
      />
    </>
  );
}
