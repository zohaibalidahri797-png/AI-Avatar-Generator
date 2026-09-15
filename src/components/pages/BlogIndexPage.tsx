'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ArrowRight, CalendarDays, Clock, LayoutGrid, Rss, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageHero from '@/components/shared/PageHero';
import CTABanner from '@/components/shared/CTABanner';
import AdSlot from '@/components/shared/AdSlot';
import { Link } from '@/lib/router';
import { useSeo } from '@/lib/seo';
import { site } from '@/lib/site';
import { BLOG_POSTS } from '@/lib/blog-data';
import type { BlogPost } from '@/lib/types';
import { cn } from '@/lib/utils';

const formatDate = (iso: string) => {
  const parsed = new Date(`${iso}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? iso : format(parsed, 'MMMM d, yyyy');
};

function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge
      variant="secondary"
      className="border border-primary/20 bg-accent text-primary hover:bg-accent"
    >
      {category}
    </Badge>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <article className="card-hover group overflow-hidden rounded-2xl border bg-card shadow-sm md:grid md:grid-cols-5">
      <Link
        href={`/blog/${post.slug}`}
        className="block overflow-hidden md:col-span-2"
        aria-label={`Read article: ${post.title}`}
      >
        <img
          src={post.cover}
          alt={post.coverAlt}
          width={1344}
          height={768}
          loading="lazy"
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] md:h-full md:min-h-[280px]"
        />
      </Link>
      <div className="flex flex-col p-6 md:col-span-3 md:justify-center md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={post.category} />
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-fuchsia-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Featured
          </span>
        </div>
        <h2 className="mt-4 text-xl font-extrabold tracking-tight sm:text-2xl">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {post.excerpt}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {post.readTime}
          </span>
          <span className="hidden sm:inline">by {post.author}</span>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Read article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <article className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
      <Link
        href={`/blog/${post.slug}`}
        className="block overflow-hidden"
        aria-label={`Read article: ${post.title}`}
      >
        <div className="aspect-video overflow-hidden bg-accent/40">
          <img
            src={post.cover}
            alt={post.coverAlt}
            width={1344}
            height={768}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <CategoryBadge category={post.category} />
        <h3 className="mt-3 text-base font-bold leading-snug tracking-tight sm:text-lg">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {post.readTime}
          </span>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-dashed bg-card/60 p-10 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
        <LayoutGrid className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-bold tracking-tight">No articles yet</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
        We are busy writing guides about AI avatars, PFPs and professional headshots.
        Check back soon — or start creating in the meantime.
      </p>
      <Link href="/ai-avatar-generator" className="mt-6 inline-block">
        <Button className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500 text-white shadow-md">
          Open the avatar generator
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </Link>
    </div>
  );
}

export default function BlogIndexPage() {
  useSeo({
    title: 'AI Avatar Blog — Guides, Tips & Tutorials | AvatarForge',
    description:
      'Practical, honest guides for creating better AI avatars, PFPs and professional headshots — from the AvatarForge team.',
    path: '/blog',
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))],
    []
  );

  const featured = useMemo(() => BLOG_POSTS.filter((p) => p.featured), []);
  const visiblePosts = useMemo(
    () =>
      activeCategory === 'All'
        ? BLOG_POSTS
        : BLOG_POSTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  return (
    <>
      <PageHero
        badge="Blog"
        title="AI avatar guides & tutorials"
        description="Practical, honest guides for creating better AI avatars, PFPs and professional headshots."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog' },
        ]}
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {BLOG_POSTS.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Category filter chips */}
              <div
                className="flex flex-wrap items-center gap-2"
                role="group"
                aria-label="Filter articles by category"
              >
                {categories.map((category) => {
                  const isActive = category === activeCategory;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      aria-pressed={isActive}
                      className={cn(
                        'min-h-[36px] rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isActive
                          ? 'border-transparent bg-gradient-to-r from-primary to-fuchsia-500 text-white shadow-md'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary'
                      )}
                    >
                      {category}
                    </button>
                  );
                })}
                <a
                  href="/feed.xml"
                  type="application/rss+xml"
                  className="ml-auto inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Subscribe to the AvatarForge blog RSS feed"
                >
                  <Rss className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  RSS feed
                </a>
              </div>

              {/* Featured articles */}
              {activeCategory === 'All' && featured.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                    Featured <span className="gradient-text">guides</span>
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    The reads we recommend starting with — comprehensive, current and battle-tested
                    against real avatar generations.
                  </p>
                  <div className="mt-6 space-y-6">
                    {featured.map((post) => (
                      <FeaturedCard key={post.slug} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* All articles */}
              <div className="mt-14">
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {activeCategory === 'All' ? 'All articles' : `${activeCategory} articles`}
                  <span className="gradient-text"> ({visiblePosts.length})</span>
                </h2>
                {visiblePosts.length === 0 ? (
                  <p className="mt-6 rounded-2xl border border-dashed bg-card/60 p-8 text-center text-sm text-muted-foreground">
                    No articles in this category yet — new guides are added regularly.
                  </p>
                ) : (
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visiblePosts.map((post) => (
                      <ArticleCard key={post.slug} post={post} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Reserved ad space (PRD §46) — non-intrusive, clearly labeled */}
          {BLOG_POSTS.length > 0 && (
            <div className="mt-14">
              <AdSlot slot="blog-index-bottom" format="horizontal" />
            </div>
          )}
        </div>
      </section>

      <CTABanner
        title={`Ready to create your own avatar?`}
        text={`Put the guides into practice — generate an AI avatar from your photo in seconds with ${site.name}. Free, no signup, no watermarks.`}
        primaryLabel="Open the AI avatar generator"
        primaryHref="/ai-avatar-generator"
        secondaryLabel="Browse all tools"
        secondaryHref="/tools"
      />
    </>
  );
}
