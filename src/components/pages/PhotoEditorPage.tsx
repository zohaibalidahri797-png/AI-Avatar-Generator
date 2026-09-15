'use client';

import { Link } from '@/lib/router';
import { useSeo } from '@/lib/seo';
import PageHero from '@/components/shared/PageHero';
import CTABanner from '@/components/shared/CTABanner';
import PhotoEditor from '@/components/tool/PhotoEditor';
import { Button } from '@/components/ui/button';

const CAPABILITIES = [
  {
    title: 'Crop to profile shapes',
    description: 'Center-crop to square or 4:5, or export a circular PFP with transparent PNG corners.',
  },
  {
    title: 'Resize for every platform',
    description: 'Export at 512, 1024 or 2048 pixels wide so your picture stays crisp anywhere.',
  },
  {
    title: 'Light & color controls',
    description: 'Fine-tune brightness, contrast and saturation with instant live preview.',
  },
  {
    title: 'Rotate, flip & convert',
    description: 'Straighten photos, mirror them, and convert between PNG, JPEG and WebP.',
  },
];

const RELATED = [
  { title: 'AI Avatar Generator', href: '/ai-avatar-generator', description: 'Generate styled avatars from your photo.' },
  { title: 'AI Avatar Background Generator', href: '/ai-avatar-background-generator', description: 'Replace backgrounds with AI styles.' },
  { title: 'AI PFP Generator', href: '/ai-pfp-generator', description: 'Square PFPs sized for every platform.' },
];

export default function PhotoEditorPage() {
  useSeo({
    title: 'AI Avatar Photo Editor — Crop, Resize & Adjust Photos Free',
    description:
      'Lightweight free photo editor for avatars and PFPs: crop, resize, rotate, adjust brightness and contrast, convert formats and download — right in your browser.',
    path: '/ai-avatar-photo-editor',
  });

  return (
    <div>
      <PageHero
        badge="Free browser tool"
        title="AI Avatar Photo Editor"
        description="A lightweight editor for perfecting avatars and profile pictures: crop, resize, rotate, adjust light and color, convert formats and download — no upload to a gallery, no watermark, no signup."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'AI Avatar Photo Editor' }]}
      />

      <section aria-label="Photo editor tool" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <PhotoEditor />
      </section>

      <section aria-labelledby="editor-features" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">What it does</p>
        <h2 id="editor-features" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Practical editing, zero bloat
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="font-bold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Everything runs locally in your browser using the canvas API — your image never leaves your device while
          editing. Want AI styling instead? Pair this editor with the{' '}
          <Link href="/ai-avatar-generator" className="font-medium text-primary underline underline-offset-2">
            AI Avatar Generator
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="editor-related" className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <h2 id="editor-related" className="text-xl font-extrabold tracking-tight sm:text-2xl">
          Related tools
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {RELATED.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-2xl border bg-card p-6 shadow-sm card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <h3 className="font-bold">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/tools">Browse all tools</Link>
          </Button>
        </div>
      </section>

      <CTABanner
        title="Edit it, then make it an avatar"
        text="Clean up your photo here, then transform it into any of 31+ AI avatar styles for free."
        primaryLabel="Create Your AI Avatar"
        primaryHref="/ai-avatar-generator"
        secondaryLabel="Explore avatar styles"
        secondaryHref="/categories"
      />
    </div>
  );
}
