'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Download, ImageIcon, Info, Lightbulb, X } from 'lucide-react';

import {
  GALLERY_CATEGORY_PAGES,
  GALLERY_IMAGES,
  categorySlug,
  getGalleryCategoryPage,
} from '@/lib/gallery-data';
import { site } from '@/lib/site';
import type { GalleryImage } from '@/lib/types';
import { useSeo } from '@/lib/seo';
import { Link } from '@/lib/router';
import PageHero from '@/components/shared/PageHero';
import CTABanner from '@/components/shared/CTABanner';
import NotFoundPage from '@/components/pages/NotFoundPage';

const OTHER_SLUGS = GALLERY_CATEGORY_PAGES.map((c) => c.slug);

export default function GalleryCategoryPage({ slug }: { slug: string }) {
  const meta = getGalleryCategoryPage(slug);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [prevSlug, setPrevSlug] = useState(slug);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Reset the lightbox when navigating between category pages
  // (React's recommended "adjust state when a prop changes" render-time pattern).
  if (prevSlug !== slug) {
    setPrevSlug(slug);
    setLightboxIndex(null);
  }

  const images: GalleryImage[] = useMemo(
    () => (meta ? GALLERY_IMAGES.filter((image) => categorySlug(image.category) === slug) : []),
    [meta, slug]
  );

  useSeo(
    meta
      ? {
          title: meta.metaTitle,
          description: meta.metaDescription,
          path: `/gallery/${meta.slug}`,
          image: images[0]?.src,
        }
      : { title: 'Page Not Found (404) | AvatarForge', description: 'This gallery page could not be found.', path: `/gallery/${slug}` }
  );

  const close = useCallback(() => setLightboxIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightboxIndex((idx) => {
        if (idx === null || images.length === 0) return idx;
        return (idx + dir + images.length) % images.length;
      });
    },
    [images.length]
  );

  // Keyboard navigation + scroll lock while the lightbox is open
  const isOpen = lightboxIndex !== null && images.length > 0;
  const current = isOpen ? images[lightboxIndex] : null;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, step]);

  if (!meta) return <NotFoundPage />;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${meta.label} AI avatar examples`,
    itemListElement: images.map((image, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: image.label,
      item: `${site.url}/gallery/${meta.slug}/`,
    })),
  };

  return (
    <main>
      <PageHero
        badge="Gallery"
        title={`${meta.label} AI avatar examples`}
        description={meta.intro[0]}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Gallery', href: '/gallery' },
          { label: meta.label },
        ]}
      />

      {/* ------------------------------- Examples ------------------------------- */}
      <section className="py-10 sm:py-14" aria-label={`${meta.label} avatar examples`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {images.length > 0 ? (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((image, index) => (
                <li key={image.src}>
                  <figure className="group">
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`Open ${image.label} in a larger view`}
                      className="relative block aspect-square w-full overflow-hidden rounded-2xl border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        width={1024}
                        height={1024}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span
                        className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/40 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        aria-hidden="true"
                      >
                        <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-neutral-800">
                          View
                        </span>
                      </span>
                    </button>
                    <figcaption className="mt-2.5 px-1">
                      <p className="truncate text-sm font-semibold" title={image.label}>
                        {image.label}
                      </p>
                      <span className="mt-1 inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-primary">
                        {image.category} · fictional person
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-10 text-center shadow-sm">
              <ImageIcon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm font-semibold">No examples in this category yet.</p>
              <Link
                href="/gallery"
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Browse the full gallery
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}

          {/* Honest disclaimer */}
          <div className="mt-10 flex items-start gap-3 rounded-2xl border bg-card p-5 shadow-sm">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every portrait on this page shows a fictional, AI-generated person — not a real user
              or customer. Your own avatar will be generated from the photo you upload.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------ What to know ------------------------------ */}
      <section className="py-6 sm:py-10" aria-labelledby="cat-tips-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* About this family */}
            <article className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 id="cat-tips-title" className="text-lg font-bold tracking-tight">
                About the {meta.label.toLowerCase()} family
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {meta.intro[1] ?? meta.intro[0]}
              </p>
              <Link
                href={meta.generatorHref}
                className="group mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                {meta.generatorLabel}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </article>

            {/* Tips */}
            <article className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
                <Lightbulb className="h-5 w-5 text-primary" aria-hidden="true" />
                Tips for this style
              </h2>
              <ul className="mt-4 space-y-3">
                {meta.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {tip}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ---------------------------- Other categories ---------------------------- */}
      <section className="py-6 sm:py-10" aria-labelledby="other-cats-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 id="other-cats-title" className="text-lg font-bold tracking-tight">
            Browse other gallery categories
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {OTHER_SLUGS.filter((s) => s !== meta.slug).map((other) => {
              const otherMeta = getGalleryCategoryPage(other);
              if (!otherMeta) return null;
              return (
                <Link
                  key={other}
                  href={`/gallery/${other}`}
                  className="inline-flex min-h-11 items-center rounded-full border bg-card px-5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {otherMeta.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------- CTA --------------------------------- */}
      <CTABanner
        title={`Create your own ${meta.label.toLowerCase()} AI avatar`}
        text="Upload a photo, pick a style and generate your own version of these examples — free, no signup."
        primaryLabel={meta.generatorLabel}
        primaryHref={meta.generatorHref}
        secondaryLabel="Browse all tools"
        secondaryHref="/tools"
      />

      {/* ------------------------------- Lightbox ------------------------------- */}
      {isOpen && current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${current.label} — enlarged avatar view`}
          className="fixed inset-0 z-[70] flex flex-col bg-black/85 p-4 backdrop-blur-sm sm:p-6"
          onClick={close}
        >
          <div className="flex items-center justify-between">
            <p className="truncate text-sm font-semibold text-white/90">
              {current.label}{' '}
              <span className="ml-1 font-normal text-white/60">
                {lightboxIndex! + 1} / {images.length}
              </span>
            </p>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={close}
              aria-label="Close gallery view"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div
            className="flex min-h-0 flex-1 items-center justify-center gap-2 sm:gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous avatar"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
              key={current.src}
            />
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next avatar"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div
            className="mt-3 flex flex-col items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
              {current.category} · fictional AI-generated person
            </span>
            <a
              href={current.src}
              download={`avatarforge-${current.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download example
            </a>
          </div>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </main>
  );
}
