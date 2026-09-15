'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Briefcase,
  CalendarDays,
  Camera,
  Compass,
  Gamepad2,
  Palette,
  Search,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Wand2,
  Zap,
} from 'lucide-react';

import {
  BACKGROUND_OPTIONS,
  EXPRESSION_OPTIONS,
  FRAMING_OPTIONS,
  LIGHTING_OPTIONS,
  STYLE_GROUPS,
} from '@/lib/avatar-styles';
import { GALLERY_IMAGES } from '@/lib/gallery-data';
import { BLOG_POSTS } from '@/lib/blog-data';
import { Link } from '@/lib/router';
import { useSeo } from '@/lib/seo';
import { site } from '@/lib/site';
import CTABanner from '@/components/shared/CTABanner';
import CountUp from '@/components/shared/CountUp';
import Reveal from '@/components/shared/Reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

/* ------------------------------- icon registry ------------------------------- */

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  camera: Camera,
  briefcase: Briefcase,
  palette: Palette,
  boxes: Boxes,
  'gamepad-2': Gamepad2,
  'share-2': Share2,
};

function StyleIcon({ iconKey, className }: { iconKey: string; className?: string }) {
  const Icon = ICONS[iconKey] ?? Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}

/* ---------------------------------- data ------------------------------------- */

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: 'Privacy-focused' },
  { icon: Zap, label: 'Fast & free' },
  { icon: Smartphone, label: 'Mobile friendly' },
];

/** Real product numbers, derived from the data itself so they can never drift. */
const STATS: { value: number; suffix?: string; label: string }[] = [
  {
    value: STYLE_GROUPS.reduce((n, g) => n + g.substyles.length, 0),
    suffix: '+',
    label: 'avatar styles',
  },
  { value: STYLE_GROUPS.length, label: 'style families' },
  {
    value:
      BACKGROUND_OPTIONS.length +
      LIGHTING_OPTIONS.length +
      EXPRESSION_OPTIONS.length +
      FRAMING_OPTIONS.length,
    label: 'customization options',
  },
  { value: 0, label: 'signups or watermarks' },
];

const COLLAGE = [
  {
    src: '/images/avatars/realistic.png',
    alt: 'AI-generated realistic studio portrait avatar of a fictional woman',
    rotate: 'rotate-2',
  },
  {
    src: '/images/avatars/anime.png',
    alt: 'AI-generated anime style avatar of a fictional character',
    rotate: '-rotate-3',
  },
  {
    src: '/images/avatars/gaming.png',
    alt: 'AI-generated gaming avatar with neon purple lighting',
    rotate: '-rotate-2',
  },
  {
    src: '/images/avatars/three-d.png',
    alt: 'AI-generated stylized 3D character avatar render',
    rotate: 'rotate-3',
  },
  {
    src: '/images/avatars/cartoon.png',
    alt: 'AI-generated cartoon avatar illustration of a friendly fictional man',
    rotate: '-rotate-2',
  },
  {
    src: '/images/avatars/professional.png',
    alt: 'AI-generated professional headshot avatar of a fictional man in a blazer',
    rotate: 'rotate-2',
  },
];

const FLOATING_CHIPS = [
  { label: 'Anime', className: 'left-0 top-6 -rotate-6' },
  { label: '3D', className: 'right-2 top-1/3 rotate-6' },
  { label: 'Gaming', className: 'bottom-10 left-8 rotate-3' },
];

const MARQUEE_ITEMS = [
  'Realistic Portraits',
  'Professional Headshots',
  'Business Avatars',
  'Cartoon Avatars',
  'Anime PFPs',
  '3D Characters',
  'Gaming Avatars',
  'Social Media PFPs',
  'AI Portraits',
  'LinkedIn Headshots',
];

const STEPS = [
  {
    title: 'Upload',
    description: 'Upload a photo or selfie — JPG, PNG or WebP.',
  },
  {
    title: 'Choose a style',
    description:
      'Pick from realistic, professional, cartoon, anime, 3D, gaming and social styles.',
  },
  {
    title: 'Customize',
    description: 'Adjust background, lighting, expression and framing.',
  },
  {
    title: 'Generate & download',
    description: 'Preview your avatar and download it in profile-picture-ready sizes.',
  },
];

const FEATURES: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'Multiple Avatar Styles',
    description:
      'Realistic portraits, business headshots, cartoon and anime looks, 3D characters and gaming PFPs — all from one generator.',
    icon: Palette,
  },
  {
    title: 'Easy Workflow',
    description:
      'Upload a photo, choose a style and generate. The whole flow is designed to finish in under a minute.',
    icon: Wand2,
  },
  {
    title: 'Mobile Friendly',
    description:
      'The generator runs fully in your browser and works on phones and tablets, so you can create avatars anywhere.',
    icon: Smartphone,
  },
  {
    title: 'Social Media Ready',
    description:
      'Downloads come in square, profile-picture-ready sizes that work for YouTube, Discord, Instagram, TikTok and more.',
    icon: Share2,
  },
  {
    title: 'Professional Options',
    description:
      'Dedicated headshot and business styles with office backdrops and formal lighting for LinkedIn, resumes and team pages.',
    icon: Briefcase,
  },
  {
    title: 'Customizable Results',
    description:
      'Fine-tune the background, lighting, expression and framing before you generate, so the result matches your intent.',
    icon: SlidersHorizontal,
  },
  {
    title: 'Fast User Experience',
    description:
      'Generated straight from your browser — most avatars are ready in under a minute, with no signup required.',
    icon: Zap,
  },
  {
    title: 'Privacy-Focused Design',
    description:
      'No account required and no photo library stored on our side — your picture is processed to create your avatar, nothing more.',
    icon: ShieldCheck,
  },
];

const FAQS = [
  {
    question: 'What is an AI avatar generator?',
    answer:
      'An AI avatar generator turns an ordinary photo into a stylized portrait — realistic, cartoon, anime, 3D, professional and more. AvatarForge works entirely in your browser: you upload a photo, pick a style, and the AI renders a new avatar you can download instantly.',
  },
  {
    question: 'Do I need an account?',
    answer:
      'No. AvatarForge is free to use with no signup, no email and no password. Open the generator, upload a photo and create your avatar right away.',
  },
  {
    question: 'Which photo works best?',
    answer:
      'A clear, front-facing photo with your whole head visible and even lighting gives the best results. Avoid sunglasses, heavy shadows and busy backgrounds; a simple selfie from your phone usually works well.',
  },
  {
    question: 'Can I use avatars for LinkedIn or Discord?',
    answer:
      'Yes. Choose the Professional or Headshot styles for LinkedIn and business profiles, and the gaming or social styles for Discord, Twitch and other platforms. Downloads are square and sized for profile-picture slots.',
  },
  {
    question: 'Which formats can I download?',
    answer:
      'Avatars are downloaded as PNG files in profile-picture-ready sizes, with square, circle, rounded and portrait framing options. The framing you pick is applied to the downloaded file.',
  },
  {
    question: 'Is it really free?',
    answer:
      'Yes — AvatarForge is a free AI avatar generator. There is no paywall, no signup step and no watermark on your downloads.',
  },
];

/* --------------------------------- component --------------------------------- */

export default function HomePage() {
  useSeo({
    title: 'Free AI Avatar Generator — Create AI Avatars, PFPs & Headshots | AvatarForge',
    description:
      'Create unique AI avatars, profile pictures, PFPs, portraits and professional headshots from your photo. Free online AI avatar generator — no signup required.',
    path: '/',
  });

  return (
    <main>
      {/* ------------------------------- Hero ------------------------------- */}
      <section className="relative overflow-hidden" aria-labelledby="home-hero-title">
        <div className="hero-glow" aria-hidden="true" />
        <div className="bg-dots pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="animate-orb pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="animate-orb-alt pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-2 lg:gap-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-accent px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Free · No signup required
            </span>
            <h1
              id="home-hero-title"
              className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Free <span className="gradient-text">AI Avatar Generator</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Create unique AI avatars, profile pictures, PFPs, portraits and professional
              headshots from your photo — in seconds, right from your browser.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/ai-avatar-generator" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="btn-sheen h-12 w-full gap-2 bg-gradient-to-r from-primary to-fuchsia-500 text-base shadow-lg shadow-primary/25 hover:opacity-90 sm:w-auto"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Create Your AI Avatar
                </Button>
              </Link>
              <Link href="/categories" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-12 w-full text-base sm:w-auto">
                  Explore Avatar Styles
                </Button>
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {TRUST_ITEMS.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Avatar collage */}
          <div className="relative hidden sm:block lg:block" aria-hidden="true">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {COLLAGE.map((item, i) => (
                <div
                  key={item.src}
                  className={`overflow-hidden rounded-2xl border bg-card shadow-md ${item.rotate} ${
                    i % 2 === 1 ? 'translate-y-6' : ''
                  } ${i % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}
                >
                  <img
                    src={item.src}
                    alt=""
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            {FLOATING_CHIPS.map((chip, i) => (
              <span
                key={chip.label}
                className={`animate-float absolute rounded-full border bg-background/90 px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur ${chip.className} ${
                  i % 2 === 1 ? 'animate-float-delayed' : ''
                }`}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- Style marquee ---------------------------- */}
      <section
        aria-label="Popular avatar styles"
        className="marquee-hover-pause overflow-hidden border-y border-border/70 bg-card/50 py-4 marquee-mask"
      >
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dup) => (
            <ul
              key={dup}
              aria-hidden={dup === 1 ? true : undefined}
              className="flex shrink-0 items-center gap-10 pr-10"
            >
              {MARQUEE_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-10 whitespace-nowrap text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
                >
                  {item}
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary/50" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* ------------------------------ Stats band ------------------------------ */}
      <section aria-label="AvatarForge in numbers" className="border-b border-border/70 bg-gradient-to-b from-accent/40 to-transparent">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 sm:px-6 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="gradient-text text-3xl font-extrabold tracking-tight sm:text-4xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------- Styles showcase --------------------------- */}
      <section className="py-14 sm:py-20" aria-labelledby="styles-title">
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="eyebrow text-xs font-semibold uppercase tracking-wider text-primary">
              Avatar styles
            </p>
            <h2 id="styles-title" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Every style you need for every platform
            </h2>
            <p className="mt-3 text-muted-foreground">
              Seven style families with {STYLE_GROUPS.reduce((n, g) => n + g.substyles.length, 0)}{' '}
              substyles in total — pick a family to see its dedicated generator.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
            {STYLE_GROUPS.map((group) => (
              <Link
                key={group.id}
                href={group.landingHref}
                className="group rounded-2xl border bg-card p-6 shadow-sm card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="icon-tile flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                  <StyleIcon iconKey={group.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold tracking-tight">{group.label}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{group.tagline}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-primary">
                    {group.substyles.length} substyles
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}

            {/* Extra CTA card */}
            <Link
              href="/ai-avatar-generator"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-fuchsia-500 p-6 text-white shadow-sm card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <Wand2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold tracking-tight">Can&apos;t decide?</h3>
                <p className="mt-1.5 text-sm text-white/85">
                  Open the generator and try every style on your own photo.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
                Open the generator
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ----------------------------- How it works ----------------------------- */}
      <section className="py-14 sm:py-20" aria-labelledby="how-title">
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="eyebrow text-xs font-semibold uppercase tracking-wider text-primary">
              How it works
            </p>
            <h2 id="how-title" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              From photo to avatar in four steps
            </h2>
          </div>

          <div className="relative mt-10">
            <div
              className="step-connector absolute left-[10%] right-[10%] top-11 hidden h-0.5 rounded-full lg:block"
              aria-hidden="true"
            />
            <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="card-glow relative rounded-2xl border bg-card p-6 shadow-sm card-hover"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-bold tracking-tight">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
            </ol>
          </div>

          <div className="mt-8">
            <Link
              href="/how-it-works"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              See how it works in detail
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ----------------------------- Style finder promo ----------------------------- */}
      <section className="py-14 sm:py-20" aria-labelledby="finder-title">
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="gradient-ring relative overflow-hidden rounded-3xl border bg-gradient-to-br from-accent via-card to-accent/60 p-6 shadow-sm sm:p-10">
            <div
              className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div className="max-w-2xl">
                <p className="eyebrow text-xs font-semibold uppercase tracking-wider text-primary">
                  Not sure where to start?
                </p>
                <h2
                  id="finder-title"
                  className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl"
                >
                  Take the 30-second <span className="gradient-text">Style Finder</span> quiz
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Answer three quick questions about where you&apos;ll use your avatar and which
                  look feels right — we&apos;ll point you to the style family that genuinely fits,
                  with a direct link to generate it. No photo, no signup, nothing stored.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  asChild
                  size="lg"
                  className="btn-sheen gap-2 bg-gradient-to-r from-primary to-fuchsia-500 text-white shadow-lg shadow-primary/25 hover:opacity-95"
                >
                  <Link href="/style-finder">
                    <Compass className="h-4 w-4" aria-hidden="true" />
                    Find my style
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.dispatchEvent(new CustomEvent('avatarforge:open-search'))}
                  className="gap-2"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Or search everything
                  <kbd className="kbd">Ctrl K</kbd>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ----------------------------- Why choose us ----------------------------- */}
      <section className="py-14 sm:py-20" aria-labelledby="why-title">
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="eyebrow text-xs font-semibold uppercase tracking-wider text-primary">
              Why {site.name}
            </p>
            <h2 id="why-title" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Built for real profiles, not just demos
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="card-glow group relative rounded-2xl border bg-card p-6 shadow-sm card-hover"
              >
                <span className="icon-tile flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                  <feature.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold tracking-tight">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------------------------- Gallery preview ---------------------------- */}
      <section className="py-14 sm:py-20" aria-labelledby="gallery-title">
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="eyebrow text-xs font-semibold uppercase tracking-wider text-primary">
                Avatar gallery
              </p>
              <h2
                id="gallery-title"
                className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl"
              >
                Examples in every style
              </h2>
            </div>
            <Link href="/gallery" className="hidden sm:block">
              <Button variant="outline" className="min-h-11 gap-2">
                View the full gallery
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {GALLERY_IMAGES.slice(0, 6).map((image) => (
              <Link
                key={image.src}
                href="/gallery"
                className="group relative block aspect-square overflow-hidden rounded-2xl border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`${image.label} — view in gallery`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-x-2 bottom-2 rounded-lg bg-background/85 px-2.5 py-1.5 text-xs font-semibold backdrop-blur">
                  {image.label}
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            All examples are AI-generated fictional people.
          </p>

          <div className="mt-6 sm:hidden">
            <Link href="/gallery">
              <Button variant="outline" className="min-h-11 w-full gap-2">
                View the full gallery
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------ Latest guides ------------------------------ */}
      <section
        className="border-y border-border/70 bg-gradient-to-b from-accent/30 via-transparent to-transparent py-14 sm:py-20"
        aria-labelledby="latest-guides-title"
      >
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="eyebrow text-xs font-semibold uppercase tracking-wider text-primary">
                From the blog
              </p>
              <h2
                id="latest-guides-title"
                className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl"
              >
                Latest guides &amp; tips
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Practical, jargon-free walkthroughs for getting a better avatar — written by the
                same people who built the generator.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/feed.xml"
                className="hidden sm:inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Subscribe via RSS"
              >
                RSS
                <span className="rounded-md border bg-accent px-1.5 py-0.5 font-mono text-[10px] font-semibold">
                  XML
                </span>
              </a>
              <Link href="/blog" className="hidden sm:block">
                <Button variant="outline" className="min-h-11 gap-2">
                  All 15 guides
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...BLOG_POSTS]
              .sort((a, b) => (a.date < b.date ? 1 : -1))
              .slice(0, 3)
              .map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Read guide: ${post.title}`}
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-accent/40">
                    <img
                      src={post.cover}
                      alt={post.coverAlt}
                      width={1344}
                      height={768}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3 top-3 rounded-full border border-border/60 bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-foreground/90 backdrop-blur">
                      {post.category}
                    </span>
                    <ArrowUpRight
                      className="absolute bottom-3 right-3 h-5 w-5 rounded-full border border-border/60 bg-background/90 p-1 text-primary opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold leading-snug tracking-tight transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex flex-1 items-end justify-between gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        <time dateTime={post.date}>
                          {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </span>
                      <span className="font-medium text-primary/80">{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/blog">
              <Button variant="outline" className="min-h-11 w-full gap-2">
                All 15 guides
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------- FAQ preview ------------------------------- */}
      <section className="py-14 sm:py-20" aria-labelledby="faq-title">
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">
            <div>
              <p className="eyebrow text-xs font-semibold uppercase tracking-wider text-primary">FAQ</p>
              <h2
                id="faq-title"
                className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl"
              >
                Common questions
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Everything you need to know about creating an AI avatar with {site.name}. Looking
                for something else?
              </p>
              <Link
                href="/faq"
                className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Read all FAQs
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="lg:col-span-2">
              <Accordion type="single" collapsible className="rounded-2xl border bg-card px-6 shadow-sm">
                {FAQS.map((faq, i) => (
                  <AccordionItem key={faq.question} value={`faq-${i}`}>
                    <AccordionTrigger className="text-sm font-semibold sm:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </Reveal>
      </section>

      {/* --------------------------------- CTA --------------------------------- */}
      <CTABanner
        title="Ready to forge your AI avatar?"
        text="Upload a photo and generate your first AI avatar in under a minute — free, no signup."
        primaryLabel="Create Your AI Avatar"
        primaryHref="/ai-avatar-generator"
        secondaryLabel="Browse all tools"
        secondaryHref="/tools"
      />
    </main>
  );
}
