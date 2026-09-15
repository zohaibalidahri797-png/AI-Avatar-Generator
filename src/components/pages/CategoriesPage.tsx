'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  Boxes,
  Brush,
  Building2,
  Gamepad2,
  Image,
  ImagePlus,
  Instagram,
  MessageCircle,
  Music2,
  Palette,
  Sparkles,
  User,
  Users,
  Wand2,
  Youtube,
} from 'lucide-react';

import { Link } from '@/lib/router';
import { useSeo } from '@/lib/seo';
import PageHero from '@/components/shared/PageHero';
import CTABanner from '@/components/shared/CTABanner';

/* ---------------------------------- data ------------------------------------- */

interface CategoryItem {
  name: string;
  href: string;
  description: string;
  icon: LucideIcon;
}

interface CategoryGroup {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  items: CategoryItem[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'styles',
    title: 'Avatar Styles',
    description: 'Illustrated and stylized looks, from true-to-life portraits to game-ready characters.',
    icon: Palette,
    items: [
      {
        name: 'Realistic',
        href: '/ai-portrait-generator',
        description: 'True-to-life AI portraits with natural skin texture and studio-quality detail.',
        icon: Sparkles,
      },
      {
        name: 'Cartoon',
        href: '/ai-cartoon-avatar-generator',
        description: 'Fun illustrated avatars with bold outlines, flat colors and playful proportions.',
        icon: Brush,
      },
      {
        name: 'Anime',
        href: '/ai-anime-avatar-generator',
        description: 'Manga-inspired portraits with expressive eyes, cel shading and vibrant colors.',
        icon: Wand2,
      },
      {
        name: '3D',
        href: '/ai-3d-avatar-generator',
        description: 'Stylized 3D character renders with smooth shading and a polished toy-like finish.',
        icon: Boxes,
      },
      {
        name: 'Gaming',
        href: '/ai-gaming-avatar-generator',
        description: 'Esports-ready PFPs with dramatic lighting, neon accents and bold digital art.',
        icon: Gamepad2,
      },
      {
        name: 'Character',
        href: '/ai-character-avatar-generator',
        description: 'Original fantasy characters, heroes and personas built from your photo.',
        icon: User,
      },
    ],
  },
  {
    id: 'professional',
    title: 'Professional',
    description: 'Business-ready headshots for resumes, company pages and networking profiles.',
    icon: Building2,
    items: [
      {
        name: 'Headshot',
        href: '/ai-headshot-generator',
        description: 'Clean, recruiting-ready headshots with neutral backgrounds and formal lighting.',
        icon: Image,
      },
      {
        name: 'LinkedIn & Business',
        href: '/professional-ai-avatar',
        description: 'Polished professional avatars styled for LinkedIn and business profiles.',
        icon: Building2,
      },
      {
        name: 'Corporate portraits',
        href: '/ai-headshot-generator',
        description: 'Formal corporate looks with smart attire — ideal for team and about pages.',
        icon: Users,
      },
    ],
  },
  {
    id: 'social',
    title: 'Social Media',
    description: 'Platform-perfect profile pictures that stay crisp and readable at any size.',
    icon: Users,
    items: [
      {
        name: 'YouTube',
        href: '/social-media-avatar-generator',
        description: 'Bright, clickable channel avatars that read clearly at small sizes.',
        icon: Youtube,
      },
      {
        name: 'TikTok',
        href: '/social-media-avatar-generator',
        description: 'Trendy, energetic avatars with Gen-Z styling and punchy colors.',
        icon: Music2,
      },
      {
        name: 'Discord',
        href: '/social-media-avatar-generator',
        description: 'Discord-ready avatars that stay recognizable even at 32 pixel sizes.',
        icon: MessageCircle,
      },
      {
        name: 'Instagram',
        href: '/social-media-avatar-generator',
        description: 'Aesthetic PFPs with stylish colors and a polished, on-trend look.',
        icon: Instagram,
      },
      {
        name: 'Influencer',
        href: '/social-media-avatar-generator',
        description: 'Vibrant gradient backgrounds and fashion-forward styling for creator brands.',
        icon: Sparkles,
      },
      {
        name: 'PFP focus',
        href: '/ai-pfp-generator',
        description: 'Purpose-built profile pictures for every platform in one quick workflow.',
        icon: Image,
      },
    ],
  },
  {
    id: 'photo-tools',
    title: 'Photo Tools',
    description: 'Utility generators for turning existing photos into polished profile assets.',
    icon: ImagePlus,
    items: [
      {
        name: 'Photo to Avatar',
        href: '/ai-avatar-from-photo',
        description: 'Turn any selfie or portrait photo into a stylized AI avatar.',
        icon: ImagePlus,
      },
      {
        name: 'Background generator',
        href: '/ai-avatar-background-generator',
        description: 'Replace dull photo backgrounds with studio, gradient or themed scenes.',
        icon: Image,
      },
      {
        name: 'Photo editor',
        href: '/ai-avatar-photo-editor',
        description: 'Touch up lighting, color and framing on your avatar-ready photos.',
        icon: Wand2,
      },
      {
        name: 'PFP generator',
        href: '/ai-pfp-generator',
        description: 'Quick, platform-sized profile pictures from a single uploaded photo.',
        icon: User,
      },
    ],
  },
];

/* --------------------------------- component --------------------------------- */

export default function CategoriesPage() {
  useSeo({
    title: 'AI Avatar Categories — Browse Styles & Use Cases | AvatarForge',
    description:
      'Browse AI avatar styles by category: realistic, cartoon, anime, 3D, gaming and character avatars, professional headshots, social media PFPs and photo tools.',
    path: '/categories',
  });

  return (
    <main>
      <PageHero
        badge="Categories"
        title="Browse AI avatars by category"
        description="Four groups covering every use case — pick a category that matches your goal and jump straight into the right generator."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Categories' },
        ]}
      />

      {CATEGORY_GROUPS.map((group) => (
        <section key={group.id} className="py-10 sm:py-14" aria-labelledby={`group-${group.id}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <group.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2
                  id={`group-${group.id}`}
                  className="text-2xl font-extrabold tracking-tight sm:text-3xl"
                >
                  {group.title}
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
                  {group.description}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {group.items.map((item) => (
                <Link
                  key={`${group.id}-${item.name}`}
                  href={item.href}
                  className="group flex flex-col rounded-2xl border bg-card p-6 shadow-sm card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="icon-tile flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-bold tracking-tight">{item.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <CTABanner
        title="Not sure which category fits? Just start generating"
        text="Open the main generator, upload a photo and switch between all styles until one feels right."
        primaryLabel="Create Your AI Avatar"
        primaryHref="/ai-avatar-generator"
        secondaryLabel="See example avatars"
        secondaryHref="/gallery"
      />
    </main>
  );
}
