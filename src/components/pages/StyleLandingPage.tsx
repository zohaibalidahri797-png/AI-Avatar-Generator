'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
  Camera,
  Image,
  ImagePlus,
  Wand2,
  Palette,
  Boxes,
  Gamepad2,
  Share2,
  Briefcase,
  User,
  Users,
  Zap,
  ShieldCheck,
  Smartphone,
  Download,
  RefreshCw,
  Upload,
  Crop,
  Layers,
  Sun,
  Smile,
  Square,
  Circle,
  SlidersHorizontal,
  PlayCircle,
  MessageCircle,
  Music2,
  Link2,
  type LucideIcon,
} from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import BeforeAfterExample from '@/components/shared/BeforeAfterExample';
import CTABanner from '@/components/shared/CTABanner';
import PageHero from '@/components/shared/PageHero';
import Reveal from '@/components/shared/Reveal';
import { getLandingConfig } from '@/lib/landing-pages';
import { GALLERY_IMAGES, categorySlug } from '@/lib/gallery-data';
import { Link, useRouter } from '@/lib/router';
import { useSeo } from '@/lib/seo';
import { site } from '@/lib/site';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/** Icon registry — config files reference icons by these string keys. */
const ICONS: Record<string, LucideIcon> = {
  camera: Camera,
  image: Image,
  'image-plus': ImagePlus,
  wand: Wand2,
  sparkles: Sparkles,
  palette: Palette,
  boxes: Boxes,
  gamepad: Gamepad2,
  share: Share2,
  briefcase: Briefcase,
  user: User,
  users: Users,
  zap: Zap,
  shield: ShieldCheck,
  smartphone: Smartphone,
  download: Download,
  refresh: RefreshCw,
  upload: Upload,
  check: Check,
  crop: Crop,
  layers: Layers,
  sun: Sun,
  smile: Smile,
  square: Square,
  circle: Circle,
  sliders: SlidersHorizontal,
  play: PlayCircle,
  message: MessageCircle,
  music: Music2,
  star: Sparkles,
};

function ConfigIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = ICONS[name] ?? Sparkles;
  return <IconComponent className={className} aria-hidden="true" />;
}

const SECTION_CLASS = 'py-14 sm:py-20';
const CONTAINER_CLASS = 'mx-auto max-w-7xl px-4 sm:px-6';
const KICKER_CLASS = 'eyebrow text-xs font-semibold uppercase tracking-wider text-primary';
const H2_CLASS = 'mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl';
const CARD_CLASS = 'group rounded-2xl border bg-card p-6 shadow-sm card-hover';

const NOT_FOUND_SEO = {
  title: 'Style not found | AvatarForge',
  description:
    'This AvatarForge style page does not exist. Browse all free AI avatar tools instead — generators for PFPs, headshots, portraits and more.',
};

/** Generic SEO landing page driven entirely by a LandingConfig from lib/landing-pages. */
export default function StyleLandingPage({ slug }: { slug: string }) {
  const config = getLandingConfig(slug);
  const { query } = useRouter();
  const { toast } = useToast();
  const [copiedFaq, setCopiedFaq] = useState<number | null>(null);

  /** Deep link: #/slug?faq=2 opens & scrolls to that question. */
  const deepFaq = useMemo(() => {
    const raw = query.get('faq');
    if (raw === null || !config) return -1;
    const n = Number.parseInt(raw, 10);
    return Number.isInteger(n) && n >= 0 && n < config.faqs.length ? n : -1;
  }, [query, config]);

  // Controlled accordion: a deep link (?faq=2) can arrive one tick after
  // mount (the router syncs the query after hydration) and Radix ignores
  // `defaultValue` changes — so the open item is managed explicitly and
  // adjusted when the deep-link target changes.
  const [openFaq, setOpenFaq] = useState<string | undefined>(
    deepFaq >= 0 ? `faq-${deepFaq}` : undefined
  );
  const [lastDeepFaq, setLastDeepFaq] = useState(deepFaq);
  if (deepFaq !== lastDeepFaq) {
    setLastDeepFaq(deepFaq);
    setOpenFaq(deepFaq >= 0 ? `faq-${deepFaq}` : undefined);
  }

  // A copied-link state resets when the question changes
  useEffect(() => {
    if (copiedFaq === null) return;
    const t = window.setTimeout(() => setCopiedFaq(null), 2000);
    return () => window.clearTimeout(t);
  }, [copiedFaq]);

  // Scroll to the deep-linked question after the page settles.
  useEffect(() => {
    if (deepFaq < 0) return;
    let cancelled = false;
    const t = window.setTimeout(() => {
      if (cancelled) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document
        .getElementById(`faq-${deepFaq}`)
        ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [deepFaq]);

  const copyFaqLink = (index: number) => {
    const url = `${site.url}/${slug}/?faq=${index}`;
    const done = () => {
      setCopiedFaq(index);
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

  /** Gallery categories that honestly illustrate this landing page's style family. */
  const exampleCategories: Record<string, string[]> = {
    'ai-avatar-from-photo': ['Realistic'],
    'ai-pfp-generator': ['Social Media', 'Gaming'],
    'ai-cartoon-avatar-generator': ['Cartoon'],
    'ai-anime-avatar-generator': ['Anime'],
    'ai-3d-avatar-generator': ['3D'],
    'ai-gaming-avatar-generator': ['Gaming'],
    'ai-headshot-generator': ['Professional', 'Business'],
    'ai-portrait-generator': ['Realistic'],
    'professional-ai-avatar': ['Professional', 'Business'],
    'ai-character-avatar-generator': ['Character', 'Gaming'],
    'ai-face-generator': ['Realistic'],
    'ai-avatar-background-generator': ['Business', 'Professional'],
    'social-media-avatar-generator': ['Social Media'],
    'ai-avatar-photo-editor': ['Realistic', 'Professional'],
  };
  const examples = (config ? exampleCategories[slug] ?? [] : [])
    .flatMap((category) => GALLERY_IMAGES.filter((img) => img.category === category))
    .slice(0, 4);
  /** Deep-link target: this family's gallery category page (falls back to /gallery). */
  const primaryCategory = config ? exampleCategories[slug]?.[0] : undefined;
  const galleryHref = primaryCategory ? `/gallery/${categorySlug(primaryCategory)}` : '/gallery';


  useSeo(
    config
      ? { title: config.metaTitle, description: config.metaDescription, path: `/${slug}` }
      : { ...NOT_FOUND_SEO, path: `/${slug}` }
  );

  if (!config) {
    return (
      <section className={SECTION_CLASS}>
        <div className={CONTAINER_CLASS}>
          <div className="mx-auto max-w-md rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-10">
            <p className={KICKER_CLASS}>404</p>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Style not found</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This style page doesn&apos;t exist yet.
            </p>
            <Link href="/tools" className="mt-6 inline-block">
              <Button>Browse all tools</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const generatorHref = `/ai-avatar-generator?style=${config.preset.styleGroup}&substyle=${encodeURIComponent(
    config.preset.substyle
  )}`;
  const remainingIntro = config.intro.slice(1);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: config.h1,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <>
      {/* a. Hero with breadcrumbs, badge, H1, lede, highlights and primary CTA */}
      <PageHero
        badge={config.badge}
        title={config.h1}
        description={config.intro[0]}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'AI Avatar Tools', href: '/tools' },
          { label: config.breadcrumbLabel },
        ]}
      >
        <div className="flex flex-wrap items-end gap-x-10 gap-y-4" aria-label={`Key facts about ${config.h1}`}>
          {config.highlights.map((highlight) => (
            <div key={highlight.label}>
              <p className="gradient-text text-3xl font-extrabold">{highlight.stat}</p>
              <p className="mt-1 text-sm text-muted-foreground">{highlight.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-7">
          <Link href={generatorHref}>
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
              Start creating — free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </PageHero>

      {/* b. Intro copy (first paragraph already used in the hero) */}
      <section className={SECTION_CLASS} aria-label="About this tool">
        <div className={CONTAINER_CLASS}>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <ConfigIcon name={config.icon} className="h-5 w-5" />
              </span>
              <p className={KICKER_CLASS}>About this tool</p>
            </div>
            <h2 className={H2_CLASS}>What this tool does</h2>
            {remainingIntro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="mt-4 leading-relaxed text-muted-foreground first:mt-6"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* b2. Real before/after example (only where a pair exists) */}
      {config.showcase && (
        <section className={SECTION_CLASS} aria-labelledby="showcase-heading">
          <Reveal className={CONTAINER_CLASS}>
            <div className="mx-auto max-w-3xl text-center">
              <p className={KICKER_CLASS}>Real example</p>
              <h2 id="showcase-heading" className={H2_CLASS}>
                From an ordinary photo to{' '}
                <span className="gradient-text">this style</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Drag the handle to compare. This pair was generated with the same free tool you
                can use below — no stock trickery.
              </p>
            </div>
            <div className="mt-8">
              <BeforeAfterExample showcase={config.showcase} />
            </div>
          </Reveal>
        </section>
      )}

      {/* c. Features grid */}
      <section className={SECTION_CLASS} aria-labelledby="features-heading">
        <Reveal className={CONTAINER_CLASS}>
          <p className={KICKER_CLASS}>Features</p>
          <h2 id="features-heading" className={H2_CLASS}>
            What you can do
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {config.features.map((feature) => (
              <article key={feature.title} className={CARD_CLASS}>
                <span className="icon-tile flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <ConfigIcon name={feature.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* d. Steps */}
      <section className={SECTION_CLASS} aria-labelledby="steps-heading">
        <Reveal className={CONTAINER_CLASS}>
          <p className={KICKER_CLASS}>How it works</p>
          <h2 id="steps-heading" className={H2_CLASS}>
            From photo to finished avatar
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {config.steps.map((step, index) => (
              <li key={step.title} className="h-full">
                <article className={`${CARD_CLASS} h-full`}>
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-sm font-bold text-white"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-semibold">
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </article>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* e. Example avatars in this style family (fictional people, AI-generated) */}
      {examples.length > 0 && (
        <section className={SECTION_CLASS} aria-labelledby="examples-heading">
          <Reveal className={CONTAINER_CLASS}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={KICKER_CLASS}>Style examples</p>
                <h2 id="examples-heading" className={H2_CLASS}>
                  Avatars in this style family
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  A taste of what this family looks like. All examples show fictional,
                  AI-generated people — your avatar will be based on your own photo.
                </p>
              </div>
              <Link
                href={galleryHref}
                className="group inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View full gallery
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {examples.map((example) => (
                <Link
                  key={example.src}
                  href={galleryHref}
                  className="group block"
                  aria-label={`Open the gallery — ${example.label}`}
                >
                  <figure className="card-hover overflow-hidden rounded-2xl border bg-card shadow-sm">
                    <div className="aspect-square overflow-hidden bg-accent/40">
                      <img
                        src={example.src}
                        alt={example.alt}
                        width={1024}
                        height={1024}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    </div>
                    <figcaption className="p-3.5">
                      <p className="truncate text-sm font-semibold">{example.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{example.category} family</p>
                    </figcaption>
                  </figure>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* f. Use cases + tips */}
      <section className={SECTION_CLASS} aria-label="Use cases and tips">
        <div className={CONTAINER_CLASS}>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <article className={`${CARD_CLASS} h-full sm:p-8`}>
              <h2 className="text-2xl font-extrabold tracking-tight">Use cases</h2>
              <ul className="mt-5 space-y-3">
                {config.useCases.map((useCase) => (
                  <li key={useCase} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-sm leading-relaxed text-muted-foreground">{useCase}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className={`${CARD_CLASS} h-full sm:p-8`}>
              <h2 className="text-2xl font-extrabold tracking-tight">Tips for best results</h2>
              <ul className="mt-5 space-y-5">
                {config.tips.map((tip) => (
                  <li key={tip.title} className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <h3 className="text-sm font-semibold">{tip.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tip.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* g. FAQ */}
      <section className={SECTION_CLASS} aria-labelledby="faq-heading">
        <div className={CONTAINER_CLASS}>
          <div className="max-w-3xl">
            <p className={KICKER_CLASS}>FAQ</p>
            <h2 id="faq-heading" className={H2_CLASS}>
              Frequently asked questions
            </h2>
            <Accordion
              type="single"
              collapsible
              className="mt-6"
              value={openFaq}
              onValueChange={setOpenFaq}
            >
              {config.faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  id={`faq-${index}`}
                  className={cn('scroll-mt-28', deepFaq === index && 'border-primary/40 bg-accent/40 px-3 sm:px-4')}
                >
                  <div className="relative">
                    <AccordionTrigger className="pr-9 text-left text-base font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <button
                      type="button"
                      onClick={() => copyFaqLink(index)}
                      aria-label={`Copy a link to this question: ${faq.question}`}
                      title="Copy a link to this answer"
                      className="absolute right-0 top-1 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {copiedFaq === index ? (
                        <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      ) : (
                        <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* h. Related tools */}
      <section className={SECTION_CLASS} aria-labelledby="related-heading">
        <Reveal className={CONTAINER_CLASS}>
          <p className={KICKER_CLASS}>Keep exploring</p>
          <h2 id="related-heading" className={H2_CLASS}>
            Related tools
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {config.related.map((related) => (
              <Link key={related.href} href={related.href} className="group block h-full">
                <article className={`${CARD_CLASS} flex h-full flex-col`}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-snug">{related.title}</h3>
                    <ArrowUpRight
                      className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{related.description}</p>
                </article>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* i. Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      {/* j. CTA banner */}
      <CTABanner
        title={config.ctaTitle}
        text={config.ctaText}
        primaryLabel="Create Your AI Avatar"
        primaryHref={generatorHref}
        secondaryLabel="Explore all tools"
        secondaryHref="/tools"
      />
    </>
  );
}
