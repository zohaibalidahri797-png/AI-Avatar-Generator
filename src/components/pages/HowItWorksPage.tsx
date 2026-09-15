'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Camera,
  Check,
  Download,
  ImagePlus,
  Info,
  Lightbulb,
  Ruler,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

import { Link } from '@/lib/router';
import { site } from '@/lib/site';
import PageHero from '@/components/shared/PageHero';
import CTABanner from '@/components/shared/CTABanner';
import { Button } from '@/components/ui/button';
import { useSeo } from '@/lib/seo';

/* ---------------------------------- data ------------------------------------- */

interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
  tips: string[];
  chips: string[];
}

const STEPS: Step[] = [
  {
    title: 'Upload your photo',
    description:
      'Start by uploading a photo or selfie straight from your device. The generator accepts JPG, PNG and WebP files up to 10 MB, and photos taken on your phone work just as well as studio shots. Your image is used only to create your avatar.',
    icon: ImagePlus,
    chips: ['JPG', 'PNG', 'WebP', 'Up to 10 MB', 'Phone selfies welcome'],
    tips: [
      'Shoot in good, even lighting — avoid harsh shadows on your face.',
      'Make sure your face is fully visible, centered and looking at the camera.',
      'Skip sunglasses, hats and heavy filters for the cleanest results.',
    ],
  },
  {
    title: 'Choose a style',
    description:
      'Pick one of 31 substyles across 7 style families: realistic portraits, professional headshots, cartoon, anime, 3D characters, gaming PFPs and social media looks. Each family has its own dedicated landing page if you want to go deeper on one style.',
    icon: Sparkles,
    chips: ['7 style families', '31 substyles', 'Preset styles available'],
    tips: [
      'Going on LinkedIn or a company site? Choose a Professional or Headshot style.',
      'For Discord, Twitch or gaming communities, try the Anime or Gaming families.',
      'Not sure yet? You can regenerate the same photo in a different style at any time.',
    ],
  },
  {
    title: 'Customize the details',
    description:
      'Before generating, fine-tune the result with the customization options: set the background (studio, office, gradient, gaming, nature, city and more), choose the lighting mood, adjust the expression, and preview how it all fits your style.',
    icon: SlidersHorizontal,
    chips: ['Background', 'Lighting', 'Expression', 'Framing preview'],
    tips: [
      'Keep the background simple for profile pictures that stay readable at small sizes.',
      'Cinematic lighting pairs well with gaming and fantasy styles.',
      'A friendly or confident expression suits most professional and social profiles.',
    ],
  },
  {
    title: 'Generate & download',
    description:
      'Hit generate and the AI renders your avatar in seconds. Preview the result, then download it — the framing you picked (square, portrait, circle or rounded) is applied to the final file, which saves with a descriptive name like ai-avatar.png.',
    icon: Download,
    chips: ['PNG download', 'Square / circle / rounded framing', 'Profile-picture-ready sizes'],
    tips: [
      'Generate a couple of variations and keep the one that feels most like you.',
      'Circle framing is ideal for platforms that crop avatars into a circle.',
      'Downloaded files use clear names like ai-avatar.png, so they are easy to find.',
    ],
  },
];

const PHOTO_TIPS = [
  'Use a recent, front-facing photo where your whole head and shoulders are visible.',
  'Choose soft, even light — facing a window works better than backlighting.',
  'Keep the background plain or uncluttered so the AI can focus on you.',
  'Avoid sunglasses, masks, heavy filters and anything covering your face.',
  'Higher resolution and sharp focus lead to cleaner, more detailed avatars.',
];

const PLATFORM_SIZES = [
  { platform: 'YouTube', size: '800×800', note: 'Recommended size for channel avatars' },
  { platform: 'Discord', size: '512×512', note: 'Minimum recommended' },
  { platform: 'TikTok', size: '200×200', note: 'Minimum recommended · 1:1' },
  { platform: 'Instagram', size: '320×320', note: 'Minimum recommended · 1:1' },
  { platform: 'LinkedIn', size: '400×400', note: 'Minimum recommended · square' },
  { platform: 'X (Twitter)', size: '400×400', note: 'Recommended for profile photos' },
];

/* --------------------------------- component --------------------------------- */

export default function HowItWorksPage() {
  useSeo({
    title: 'How It Works — Create an AI Avatar in 4 Simple Steps | AvatarForge',
    description:
      'Learn how the free AI avatar generator works: upload your photo, choose a style, customize background and lighting, then generate and download your avatar.',
    path: '/how-it-works',
  });

  // Honest HowTo structured data mirroring the four steps on this page.
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to create an AI avatar from a photo',
    description:
      'Turn a photo into a free AI avatar in four steps: upload your photo, choose one of 31 avatar styles, customize the background, lighting and framing, then generate and download your avatar as a PNG.',
    totalTime: 'PT1M',
    step: STEPS.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.description,
      url: `${site.url}/how-it-works/`,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <PageHero
        badge="How it works"
        title="Create an AI avatar in four simple steps"
        description="From upload to download in about a minute — no design skills required."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'How It Works' },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/ai-avatar-generator" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="h-11 w-full gap-2 bg-gradient-to-r from-primary to-fuchsia-500 shadow-lg shadow-primary/25 hover:opacity-90 sm:w-auto"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Start now — it&apos;s free
            </Button>
          </Link>
          <Link href="/gallery" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="h-11 w-full sm:w-auto">
              See example avatars
            </Button>
          </Link>
        </div>
      </PageHero>

      {/* --------------------------------- Steps --------------------------------- */}
      <section className="py-14 sm:py-20" aria-label="The four steps">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ol className="flex flex-col gap-10 lg:gap-16">
            {STEPS.map((step, i) => {
              const reversed = i % 2 === 1;
              return (
                <li key={step.title} id={`step-${i + 1}`} className="scroll-mt-24">
                  <article
                    className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                      reversed ? 'lg:[&>*:first-child]:order-2' : ''
                    }`}
                  >
                    {/* Text side */}
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-lg font-bold text-white shadow-lg shadow-primary/25">
                          {i + 1}
                        </span>
                        <step.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Step {i + 1}: {step.title}
                      </h2>
                      <p className="mt-3 leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>

                      <ul className="mt-4 flex flex-wrap gap-2">
                        {step.chips.map((chip) => (
                          <li
                            key={chip}
                            className="rounded-full border bg-accent px-3 py-1 text-xs font-medium text-primary"
                          >
                            {chip}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 rounded-2xl border bg-card p-5 shadow-sm">
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <Lightbulb className="h-4 w-4 text-primary" aria-hidden="true" />
                          Tips
                        </p>
                        <ul className="mt-3 space-y-2">
                          {step.tips.map((tip) => (
                            <li key={tip} className="flex gap-2.5 text-sm text-muted-foreground">
                              <Check
                                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                                aria-hidden="true"
                              />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Visual side */}
                    <div className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
                      <div className="bg-dots absolute inset-0 opacity-60" aria-hidden="true" />
                      <div className="relative">
                        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-primary">
                          <step.icon className="h-8 w-8" aria-hidden="true" />
                        </span>
                        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Step {i + 1} of 4
                        </p>
                        <p className="mt-1 text-lg font-bold tracking-tight">{step.title}</p>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                          {step.chips.map((chip) => (
                            <div
                              key={chip}
                              className="rounded-xl border bg-background px-3.5 py-2.5 text-xs font-medium text-muted-foreground sm:text-sm"
                            >
                              {chip}
                            </div>
                          ))}
                        </div>
                        <div
                          className="mt-5 h-2 rounded-full bg-gradient-to-r from-primary to-fuchsia-500"
                          style={{ width: `${((i + 1) / 4) * 100}%` }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ---------------------- Good source photo + cheat sheet ---------------------- */}
      <section className="py-14 sm:py-20" aria-label="Photo tips and platform sizes">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          {/* What makes a good source photo */}
          <article className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                <Camera className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                What makes a good source photo
              </h2>
            </div>
            <ul className="mt-6 space-y-3">
              {PHOTO_TIPS.map((tip) => (
                <li key={tip} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Platform size cheat sheet */}
          <article className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                <Ruler className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                Platform size cheat sheet
              </h2>
            </div>
            <ul className="mt-6 divide-y rounded-xl border">
              {PLATFORM_SIZES.map((row) => (
                <li
                  key={row.platform}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3"
                >
                  <span className="text-sm font-semibold sm:text-base">{row.platform}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground sm:text-sm">{row.note}</span>
                    <span className="rounded-md bg-accent px-2 py-1 text-xs font-bold text-primary">
                      {row.size}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Sizes are recommended minimums based on public platform guidelines — check each
              platform for its current specifications.
            </p>
          </article>
        </div>

        <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold">
            <Link
              href="/faq"
              className="inline-flex min-h-11 items-center gap-1.5 text-primary hover:underline"
            >
              Questions? Read the FAQ
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex min-h-11 items-center gap-1.5 text-primary hover:underline"
            >
              Browse all avatar tools
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------- CTA --------------------------------- */}
      <CTABanner
        title="Try it yourself — it takes about a minute"
        text="Upload a photo, pick a style and download your first AI avatar. Free, no signup."
        primaryLabel="Create Your AI Avatar"
        primaryHref="/ai-avatar-generator"
        secondaryLabel="Explore all tools"
        secondaryHref="/tools"
      />
    </main>
  );
}
