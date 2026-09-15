'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  ImageIcon,
  Info,
  LayoutGrid,
  X,
} from 'lucide-react';

import { GALLERY_CATEGORIES, GALLERY_IMAGES, categorySlug } from '@/lib/gallery-data';
import { getFavorites, isFavorite, subscribeFavorites, toggleFavorite } from '@/lib/favorites';
import type { GalleryImage } from '@/lib/types';
import { useSeo } from '@/lib/seo';
import { Link, useRouter } from '@/lib/router';
import PageHero from '@/components/shared/PageHero';
import CTABanner from '@/components/shared/CTABanner';
import { cn } from '@/lib/utils';

const FAVORITES_FILTER = '__favorites';

/** Small round heart toggle used on cards and in the lightbox. */
function FavoriteButton({
  src,
  label,
  variant = 'card',
}: {
  src: string;
  label: string;
  variant?: 'card' | 'lightbox';
}) {
  const [fav, setFav] = useState(() => isFavorite(src));

  useEffect(() => {
    const sync = () => setFav(isFavorite(src));
    sync();
    return subscribeFavorites(sync);
  }, [src]);

  return (
    <button
      type="button"
      aria-pressed={fav}
      aria-label={fav ? `Remove ${label} from favorites` : `Save ${label} to favorites`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setFav(toggleFavorite(src));
      }}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        variant === 'card' && 'absolute right-2 top-2 z-10',
        fav
          ? 'border-transparent bg-white/95 text-rose-500 shadow-md'
          : variant === 'card'
            ? 'border-transparent bg-black/35 text-white/90 hover:bg-white/95 hover:text-rose-500'
            : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
      )}
    >
      <Heart key={String(fav)} className={cn('h-4.5 w-4.5 heart-pop', fav && 'fill-current')} aria-hidden="true" />
    </button>
  );
}

export default function GalleryPage() {
  useSeo({
    title: 'AI Avatar Gallery — Example Avatars in Every Style | AvatarForge',
    description:
      'Browse example AI avatars created with AvatarForge: realistic, professional, anime, cartoon, gaming, 3D, business and social media styles.',
    path: '/gallery',
  });

  const { query, replace } = useRouter();
  // Deep-link support: #/gallery?fav=1 opens straight into the favorites view.
  // Covers both cases: mounting directly on a fav=1 URL (lazy init) and
  // navigating to it while already on /gallery (render-time adjustment).
  const wantsFavoritesFromUrl = query.get('fav') === '1';
  const [activeCategory, setActiveCategory] = useState<string>(() =>
    wantsFavoritesFromUrl ? FAVORITES_FILTER : 'All'
  );
  const [favFromUrl, setFavFromUrl] = useState(wantsFavoritesFromUrl);
  if (wantsFavoritesFromUrl !== favFromUrl) {
    setFavFromUrl(wantsFavoritesFromUrl);
    setActiveCategory((cur) =>
      wantsFavoritesFromUrl
        ? FAVORITES_FILTER
        : cur === FAVORITES_FILTER
          ? 'All'
          : cur
    );
  }
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  /** Switch filter and keep the URL shareable (#/gallery?fav=1 for favorites). */
  const applyCategory = useCallback(
    (cat: string) => {
      setActiveCategory(cat);
      setLightboxIndex(null);
      replace(cat === FAVORITES_FILTER ? '/gallery?fav=1' : '/gallery');
    },
    [replace]
  );

  useEffect(() => {
    const sync = () => setFavoriteCount(getFavorites().length);
    sync();
    return subscribeFavorites(sync);
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === FAVORITES_FILTER) {
      const favs = getFavorites();
      return GALLERY_IMAGES.filter((image) => favs.includes(image.src));
    }
    return activeCategory === 'All'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((image) => image.category === activeCategory);
    // favoriteCount keeps the favorites view in sync when hearts change
  }, [activeCategory, favoriteCount]);

  const isOpen = lightboxIndex !== null && filtered.length > 0;
  const current: GalleryImage | null = isOpen ? filtered[lightboxIndex] : null;

  const close = useCallback(() => setLightboxIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightboxIndex((idx) => {
        if (idx === null || filtered.length === 0) return idx;
        return (idx + dir + filtered.length) % filtered.length;
      });
    },
    [filtered.length]
  );

  // Keyboard navigation + scroll lock while the lightbox is open
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

  return (
    <main>
      <PageHero
        badge="Gallery"
        title="AI avatar gallery"
        description="Real examples of every avatar style, generated with AvatarForge."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Gallery' },
        ]}
      />

      {/* ------------------------------- Filter chips ------------------------------- */}
      <section className="py-10 sm:py-14" aria-label="Avatar gallery">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter avatars by category"
          >
            {GALLERY_CATEGORIES.map((category) => {
              const active = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => applyCategory(category)}
                  aria-pressed={active}
                  className={`min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? 'border-transparent bg-primary text-primary-foreground shadow-sm'
                      : 'bg-card text-muted-foreground hover:bg-accent hover:text-primary'
                  }`}
                >
                  {category}
                </button>
              );
            })}
            {favoriteCount > 0 && (
              <button
                type="button"
                onClick={() => applyCategory(FAVORITES_FILTER)}
                aria-pressed={activeCategory === FAVORITES_FILTER}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  activeCategory === FAVORITES_FILTER
                    ? 'border-transparent bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card text-muted-foreground hover:bg-accent hover:text-primary'
                }`}
              >
                <Heart
                  className={cn(
                    'h-4 w-4',
                    activeCategory === FAVORITES_FILTER ? 'fill-current' : 'text-rose-500'
                  )}
                  aria-hidden="true"
                />
                Favorites ({favoriteCount})
              </button>
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
            Showing {filtered.length} {filtered.length === 1 ? 'avatar' : 'avatars'}
            {activeCategory === FAVORITES_FILTER
              ? ' from your favorites.'
              : activeCategory !== 'All'
                ? ` in ${activeCategory}`
                : ' across all categories.'}
          </p>

          {/* ------------------------------- Gallery grid ------------------------------- */}
          {filtered.length > 0 ? (
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((image, index) => (
                <li key={image.src}>
                  <figure className="group">
                    <div className="relative">
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
                      <FavoriteButton src={image.src} label={image.label} />
                    </div>
                    <figcaption className="mt-2.5 px-1">
                      <p className="truncate text-sm font-semibold" title={image.label}>
                        {image.label}
                      </p>
                      <span className="mt-1 inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-primary">
                        {image.category}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border bg-card p-10 text-center shadow-sm">
              {activeCategory === FAVORITES_FILTER ? (
                <>
                  <Heart className="h-8 w-8 text-rose-400" aria-hidden="true" />
                  <p className="text-sm font-semibold">
                    {favoriteCount > 0 ? 'No favorites left in this view.' : 'No favorites yet.'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tap the heart on any avatar to shortlist it here — favorites stay in this
                    browser only.
                  </p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm font-semibold">No avatars in this category yet.</p>
                  <p className="text-sm text-muted-foreground">
                    Try another filter, or create an avatar in this style yourself.
                  </p>
                </>
              )}
            </div>
          )}

          {/* -------------------------------- Disclaimer -------------------------------- */}
          <div className="mt-10 flex items-start gap-3 rounded-2xl border bg-card p-5 shadow-sm">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every portrait in this gallery shows a fictional, AI-generated person — not a real
              user or customer. Style availability depends on the options in the generator.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------- Category collection pages ------------------------- */}
      <section className="py-10 sm:py-14" aria-labelledby="gallery-cats-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 id="gallery-cats-title" className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Browse by category
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Each category has its own page with every example in that style, plus tips for getting
            the best result from the generator.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {GALLERY_CATEGORIES.filter((c) => c !== 'All').map((category) => {
              const count = GALLERY_IMAGES.filter((i) => i.category === category).length;
              return (
                <li key={category}>
                  <Link
                    href={`/gallery/${categorySlug(category)}`}
                    className="group flex min-h-11 items-center justify-between gap-2 rounded-xl border bg-card px-4 py-3 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold group-hover:text-primary">
                        {category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {count} {count === 1 ? 'example' : 'examples'}
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* --------------------------------- CTA --------------------------------- */}
      <CTABanner
        title="Create your own AI avatar"
        text="Pick a style you like here, then upload a photo and generate your own version — free, no signup."
        primaryLabel="Create Your AI Avatar"
        primaryHref="/ai-avatar-generator"
        secondaryLabel="Browse all tools"
        secondaryHref="/tools"
      />

      {/* ------------------------------- Lightbox ------------------------------- */}
      {isOpen && current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${current.label} — enlarged avatar view`}
          className="fixed inset-0 z-[70] flex flex-col bg-black/85 p-4 backdrop-blur-sm animate-in fade-in duration-200 sm:p-6"
          onClick={close}
        >
          <div className="flex items-center justify-between">
            <p className="truncate text-sm font-semibold text-white/90">
              {current.label}{' '}
              <span className="ml-1 font-normal text-white/60">
                {lightboxIndex! + 1} / {filtered.length}
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
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl animate-in zoom-in-95 fade-in duration-300"
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
            <div className="flex items-center gap-2">
              <FavoriteButton src={current.src} label={current.label} variant="lightbox" />
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
        </div>
      )}
    </main>
  );
}
