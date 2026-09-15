'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Briefcase,
  Camera,
  Compass,
  Crown,
  Gamepad2,
  Image,
  Palette,
  SlidersHorizontal,
  Smile,
  Sparkles,
  User,
  Wand2,
} from 'lucide-react';

import { Link } from '@/lib/router';
import { useSeo } from '@/lib/seo';
import type { ToolCard } from '@/lib/types';
import PageHero from '@/components/shared/PageHero';
import CTABanner from '@/components/shared/CTABanner';

/* ------------------------------- icon registry ------------------------------- */

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  user: User,
  briefcase: Briefcase,
  camera: Camera,
  palette: Palette,
  'wand-2': Wand2,
  boxes: Boxes,
  'gamepad-2': Gamepad2,
  smile: Smile,
  crown: Crown,
  image: Image,
  'sliders-horizontal': SlidersHorizontal,
};

function ToolIcon({ iconKey, className }: { iconKey: string; className?: string }) {
  const Icon = ICONS[iconKey] ?? Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}

/* ---------------------------------- data ------------------------------------- */

const TOOLS: ToolCard[] = [
  {
    title: 'AI Avatar Generator',
    href: '/ai-avatar-generator',
    description:
      'The all-in-one generator: upload a photo and create avatars in every style, from realistic to anime.',
    icon: 'sparkles',
    badge: 'Main tool',
  },
  {
    title: 'AI PFP Generator',
    href: '/ai-pfp-generator',
    description:
      'Purpose-built profile pictures sized and framed for every platform, ready to upload in seconds.',
    icon: 'user',
  },
  {
    title: 'AI Headshot Generator',
    href: '/ai-headshot-generator',
    description:
      'Turn a selfie into a clean, recruiting-ready headshot with formal attire and neutral backgrounds.',
    icon: 'briefcase',
  },
  {
    title: 'AI Portrait Generator',
    href: '/ai-portrait-generator',
    description:
      'True-to-life AI portraits with natural detail, studio lighting and cinematic looks.',
    icon: 'camera',
  },
  {
    title: 'AI Cartoon Avatar Generator',
    href: '/ai-cartoon-avatar-generator',
    description:
      'Illustrated cartoon avatars with bold outlines, flat colors and playful character styling.',
    icon: 'palette',
  },
  {
    title: 'AI Anime Avatar Generator',
    href: '/ai-anime-avatar-generator',
    description:
      'Manga-inspired portraits with expressive eyes, cel shading and vibrant anime color palettes.',
    icon: 'wand-2',
  },
  {
    title: 'AI 3D Avatar Generator',
    href: '/ai-3d-avatar-generator',
    description:
      'Stylized 3D character renders with smooth shading, soft lighting and a polished finish.',
    icon: 'boxes',
  },
  {
    title: 'AI Gaming Avatar Generator',
    href: '/ai-gaming-avatar-generator',
    description:
      'Esports-ready gaming PFPs with dramatic rim lighting, neon accents and bold digital art.',
    icon: 'gamepad-2',
  },
  {
    title: 'AI Face Generator',
    href: '/ai-face-generator',
    description:
      'Create realistic fictional faces that do not belong to any real person — great for placeholders.',
    icon: 'smile',
  },
  {
    title: 'AI Character Avatar Generator',
    href: '/ai-character-avatar-generator',
    description:
      'Original fantasy characters, heroes and personas built from a photo or a text description.',
    icon: 'crown',
  },
  {
    title: 'AI Avatar Background Generator',
    href: '/ai-avatar-background-generator',
    description:
      'Replace dull photo backgrounds with studio backdrops, gradients or themed scenes.',
    icon: 'image',
  },
  {
    title: 'AI Avatar Photo Editor',
    href: '/ai-avatar-photo-editor',
    description:
      'Touch up lighting, color and framing on your photos before turning them into avatars.',
    icon: 'sliders-horizontal',
  },
];

const DECISION_GUIDE = [
  {
    situation: 'If you need a polished photo for work, LinkedIn or a resume…',
    recommendation: 'AI Headshot Generator',
    href: '/ai-headshot-generator',
    reason: 'Formal attire, neutral backgrounds and professional lighting.',
  },
  {
    situation: 'If you want a fun profile picture for Discord, TikTok or Twitch…',
    recommendation: 'AI PFP Generator',
    href: '/ai-pfp-generator',
    reason: 'Platform-sized PFPs with social and gaming styles.',
  },
  {
    situation: 'If you want a stylized illustration of yourself…',
    recommendation: 'AI Cartoon or AI Anime Avatar Generator',
    href: '/ai-anime-avatar-generator',
    reason: 'Bold illustrated looks with expressive character styling.',
  },
  {
    situation: 'If you already have a photo but dislike the background…',
    recommendation: 'AI Avatar Background Generator',
    href: '/ai-avatar-background-generator',
    reason: 'Swap in studio, gradient or themed backgrounds in one click.',
  },
];

/* --------------------------------- component --------------------------------- */

export default function ToolsPage() {
  useSeo({
    title: 'AI Avatar Tools — All Free Generators in One Place | AvatarForge',
    description:
      'Explore every free AI avatar tool: avatar generator, PFP maker, headshot generator, portrait, cartoon, anime, 3D, gaming, face and background generators.',
    path: '/tools',
  });

  return (
    <main>
      <PageHero
        badge="All tools"
        title="Every AI avatar tool in one place"
        description="Twelve focused generators and editors — pick the one that matches your goal."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools' },
        ]}
      />

      {/* ------------------------------- Tools grid ------------------------------- */}
      <section className="py-14 sm:py-20" aria-label="All avatar tools">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col rounded-2xl border bg-card p-6 shadow-sm card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="icon-tile flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                    <ToolIcon iconKey={tool.icon} className="h-5 w-5" />
                  </span>
                  {tool.badge && (
                    <span className="rounded-full bg-gradient-to-r from-primary to-fuchsia-500 px-2.5 py-1 text-xs font-semibold text-white">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h2 className="mt-4 text-base font-bold tracking-tight">{tool.title}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Open tool
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------- Style finder helper card ------------------------- */}
      <section aria-label="Style finder helper" className="pb-4 sm:pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/style-finder"
            className="group flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/25 bg-gradient-to-r from-accent via-card to-accent p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-white shadow-md shadow-primary/25">
                <Compass className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-base font-bold tracking-tight">
                  Not sure which tool? Take the Style Finder quiz
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Three questions, one honest recommendation with a direct link to the right
                  generator.
                </p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary">
              Start the quiz
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>
      </section>

      {/* ---------------------------- Decision guide ---------------------------- */}
      <section className="py-14 sm:py-20" aria-labelledby="decision-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Quick guide
            </p>
            <h2
              id="decision-title"
              className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl"
            >
              Which tool should I use?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Four common goals, matched to the right generator.
            </p>
          </div>

          <ul className="mt-10 space-y-4">
            {DECISION_GUIDE.map((row) => (
              <li key={row.situation}>
                <div className="grid items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm card-hover lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
                  <p className="text-sm font-medium sm:text-base">{row.situation}</p>
                  <ArrowRight
                    className="hidden h-5 w-5 text-muted-foreground lg:block"
                    aria-hidden="true"
                  />
                  <div className="rounded-xl bg-accent px-4 py-3">
                    <Link
                      href={row.href}
                      className="inline-flex min-h-6 items-center gap-1.5 text-sm font-bold text-primary hover:underline sm:text-base"
                    >
                      {row.recommendation}
                      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{row.reason}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTABanner
        title="Still deciding? Start with the main generator"
        text="The AI Avatar Generator includes every style — you can always switch to a focused tool later."
        primaryLabel="Create Your AI Avatar"
        primaryHref="/ai-avatar-generator"
        secondaryLabel="Browse by category"
        secondaryHref="/categories"
      />
    </main>
  );
}
