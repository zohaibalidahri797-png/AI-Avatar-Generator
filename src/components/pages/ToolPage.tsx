'use client';

import { useMemo } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { useSeo } from '@/lib/seo';
import { FAQS } from '@/lib/faq-data';
import { STYLE_GROUPS } from '@/lib/avatar-styles';
import PageHero from '@/components/shared/PageHero';
import CTABanner from '@/components/shared/CTABanner';
import AvatarStudio from '@/components/tool/AvatarStudio';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TOOL_FAQS = FAQS.slice(0, 6);

const RELATED_TOOLS = [
  { title: 'AI PFP Generator', href: '/ai-pfp-generator', description: 'Square profile pictures sized for every platform.' },
  { title: 'AI Headshot Generator', href: '/ai-headshot-generator', description: 'Polished, recruiting-ready professional headshots.' },
  { title: 'AI Avatar From Photo', href: '/ai-avatar-from-photo', description: 'Turn any selfie into a styled AI avatar.' },
  { title: 'AI Avatar Photo Editor', href: '/ai-avatar-photo-editor', description: 'Crop, resize and fine-tune images in your browser.' },
];

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AvatarForge AI Avatar Generator',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Free online AI avatar generator: upload a photo, choose from 31+ styles across 7 families, customize background, lighting, expression and framing, then download your avatar.',
};

export default function ToolPage() {
  useSeo({
    title: 'Free AI Avatar Generator — Create Your AI Avatar Online',
    description:
      'Upload a photo, choose from 31+ avatar styles and generate custom AI avatars, PFPs and portraits online for free. No signup required.',
    path: '/ai-avatar-generator',
  });

  const { query } = useRouter();
  const presetStyle = query.get('style') ?? undefined;
  const presetSubstyle = query.get('substyle')
    ? decodeURIComponent(query.get('substyle') as string)
    : undefined;

  const faqJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: TOOL_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    }),
    []
  );

  return (
    <div>
      <PageHero
        badge="Main tool · Free"
        title="AI Avatar Generator"
        description="Turn a single photo into avatars, PFPs and portraits in 31+ styles — realistic, professional, cartoon, anime, 3D, gaming and social media. No signup, no watermark, free to use."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'AI Avatar Generator' }]}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {['No signup required', '31+ avatar styles', 'JPG · PNG · WebP input', 'PNG download'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </PageHero>

      {/* The generator */}
      <section aria-label="AI avatar generator tool" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <AvatarStudio initialStyleGroup={presetStyle} initialSubstyle={presetSubstyle} />
      </section>

      {/* Style families */}
      <section aria-labelledby="styles-heading" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Style families</p>
        <h2 id="styles-heading" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          One tool, every avatar style you need
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Each style family has its own dedicated page with tips, use cases and FAQs — the generator opens with that
          style pre-selected.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {STYLE_GROUPS.map((g) => (
            <Link key={g.id} href={g.landingHref} className="group rounded-2xl border bg-card p-6 shadow-sm card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{g.label}</h3>
                <Badge variant="secondary">{g.substyles.length} styles</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{g.tagline}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Explore {g.label.toLowerCase()}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="border-t bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">FAQ</p>
          <h2 id="faq-heading" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Quick answers before you start
          </h2>
          <Accordion type="single" collapsible className="mt-6 rounded-2xl border bg-card px-6 shadow-sm">
            {TOOL_FAQS.map((f, i) => (
              <AccordionItem key={i} value={`tool-faq-${i}`}>
                <AccordionTrigger className="text-left font-semibold">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/faq">Read all FAQs</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/how-it-works">See how it works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Related tools */}
      <section aria-labelledby="related-heading" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Keep going</p>
        <h2 id="related-heading" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Related tools
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RELATED_TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="rounded-2xl border bg-card p-6 shadow-sm card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <h3 className="font-bold">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <CTABanner
        title="Forge your next profile picture now"
        text="Upload one photo, pick a style and download a ready-to-use AI avatar — free, no signup."
        primaryLabel="Create Your AI Avatar"
        primaryHref="/ai-avatar-generator"
        secondaryLabel="Explore avatar styles"
        secondaryHref="/categories"
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  );
}
