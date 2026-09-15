'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Lightbulb,
  ListChecks,
  ListTree,
  PenLine,
  Quote,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageHero from '@/components/shared/PageHero';
import CTABanner from '@/components/shared/CTABanner';
import AdSlot from '@/components/shared/AdSlot';
import { Link } from '@/lib/router';
import { useSeo } from '@/lib/seo';
import { site } from '@/lib/site';
import { getAdjacentPosts, getBlogPost, getRelatedPosts } from '@/lib/blog-data';
import type { BlogBlock, BlogPost } from '@/lib/types';
import { cn } from '@/lib/utils';

const formatDate = (iso: string) => {
  const parsed = new Date(`${iso}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? iso : format(parsed, 'MMMM d, yyyy');
};

/* ---------------------------- Reading progress ----------------------------- */

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, window.scrollY / total) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[55] h-0.5">
      <div
        className="h-full bg-gradient-to-r from-primary to-fuchsia-500 transition-[width] duration-150 ease-out"
        style={{ width: `${Math.round(progress * 100)}%` }}
      />
    </div>
  );
}

/* ------------------------------ Block renderer ------------------------------ */

function BlockRenderer({ block, index }: { block: BlogBlock; index: number }) {
  switch (block.type) {
    case 'p':
      return (
        <p
          className={cn(
            'leading-relaxed text-foreground/90',
            index === 0 && 'text-base text-muted-foreground sm:text-lg'
          )}
        >
          {block.text}
        </p>
      );
    case 'h2':
      return (
        <h2
          id={`section-${index}`}
          className="mt-10 scroll-mt-24 text-2xl font-bold tracking-tight sm:text-[1.7rem]"
        >
          {block.text}
        </h2>
      );
    case 'h3':
      return <h3 className="mt-8 text-xl font-semibold">{block.text}</h3>;
    case 'list':
      return (
        <ul className="list-disc space-y-2 pl-5 marker:text-primary">
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed text-foreground/90">
              {item}
            </li>
          ))}
        </ul>
      );
    case 'steps':
      return (
        <ol className="space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-sm">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-fuchsia-500 text-xs font-bold text-white"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed text-foreground/90">{item}</span>
            </li>
          ))}
        </ol>
      );
    case 'tip':
      return (
        <aside
          aria-label="Tip"
          className="rounded-2xl border border-border/70 border-l-4 border-l-primary bg-accent/60 p-4"
        >
          <p className="flex items-center gap-2 text-sm font-bold">
            <Lightbulb className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {block.title}
          </p>
          <p className="mt-1.5 pl-6 text-sm leading-relaxed text-foreground/85">{block.text}</p>
        </aside>
      );
    case 'quote':
      return (
        <blockquote className="quote-card flex gap-3 border-primary/40 pl-4 italic text-muted-foreground">
          <Quote className="h-5 w-5 shrink-0 rotate-180 text-primary/60" aria-hidden="true" />
          <p className="leading-relaxed">{block.text}</p>
        </blockquote>
      );
    case 'cta':
      return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-fuchsia-500 p-6 text-center shadow-lg shadow-primary/20 sm:p-8">
          <p className="text-sm font-medium leading-relaxed text-white/90 sm:text-base">
            {block.text}
          </p>
          <Link href={block.href} className="mt-4 inline-block">
            <Button className="gap-2 bg-white text-primary shadow-md hover:bg-white/90">
              {block.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      );
    default:
      return null;
  }
}

/* ------------------------------ Not found view ------------------------------ */

function ArticleNotFound() {
  return (
    <>
      <PageHero
        badge="Blog"
        title="Article not found"
        description="The article you are looking for may have been moved, renamed, or does not exist yet."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: 'Not found' }]}
      />
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Browse the blog index for every published guide about AI avatars, PFPs and
            professional headshots.
          </p>
          <Link href="/blog" className="mt-6 inline-block">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to all articles
            </Button>
          </Link>
        </div>
      </section>
      <CTABanner
        title="Make an avatar while you are here"
        text={`Jump into the generator and create an AI avatar from your photo in seconds — free, no signup.`}
        primaryLabel="Open the avatar generator"
        primaryHref="/ai-avatar-generator"
      />
    </>
  );
}

/* ------------------------------ Related card ------------------------------- */

function AdjacentCard({ post, direction }: { post: BlogPost; direction: 'prev' | 'next' }) {
  const isNext = direction === 'next';
  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-label={isNext ? `Next article: ${post.title}` : `Previous article: ${post.title}`}
      className={cn(
        'card-hover group flex h-full items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/10',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isNext && 'sm:text-right'
      )}
    >
      <div
        className={cn(
          'aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-accent/40 sm:w-24',
          isNext && 'sm:order-2'
        )}
      >
        <img
          src={post.cover}
          alt=""
          width={1344}
          height={768}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className={cn('min-w-0 flex-1', isNext && 'sm:order-1')}>
        <p
          className={cn(
            'flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary',
            isNext && 'sm:justify-end'
          )}
        >
          {!isNext && <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />}
          {isNext ? 'Next article' : 'Previous article'}
          {isNext && <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
        </p>
        <p className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug tracking-tight transition-colors group-hover:text-primary sm:text-base">
          {post.title}
        </p>
      </div>
    </Link>
  );
}

function RelatedCard({ post }: { post: BlogPost }) {
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
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <Badge
          variant="secondary"
          className="w-fit border border-primary/20 bg-accent text-primary hover:bg-accent"
        >
          {post.category}
        </Badge>
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

/* --------------------------------- Page ------------------------------------ */

export default function BlogArticlePage({ slug }: { slug: string }) {
  const post = getBlogPost(slug);

  useSeo({
    title: post ? post.metaTitle : 'Article not found | AvatarForge',
    description: post
      ? post.metaDescription
      : 'This AvatarForge blog article could not be found. Browse all AI avatar guides instead.',
    path: post ? `/blog/${post.slug}` : '/blog',
    image: post?.cover,
    ogType: post ? 'article' : 'website',
  });

  if (!post) {
    return <ArticleNotFound />;
  }

  const related = getRelatedPosts(post.slug, post.category, 3);
  const adjacent = getAdjacentPosts(post.slug);
  const headings = post.content
    .map((block, i) => (block.type === 'h2' ? { text: block.text, id: `section-${i}` } : null))
    .filter((h): h is { text: string; id: string } => h !== null);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: `${site.url}${post.cover}`,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'en',
    author: { '@type': 'Organization', name: post.author, url: site.url },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: site.url,
      logo: { '@type': 'ImageObject', url: `${site.url}/icon-512.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.url}/blog/${post.slug}/` },
    articleSection: post.category,
    keywords: `AI avatar, ${post.category.toLowerCase()}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <ReadingProgress />
      <PageHero
        badge={post.category}
        title={post.title}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
      />

      <article className="py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Article header */}
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="border border-primary/20 bg-accent text-primary hover:bg-accent"
              >
                {post.category}
              </Badge>
              {post.featured && (
                <Badge className="bg-gradient-to-r from-primary to-fuchsia-500 text-white hover:from-primary hover:to-fuchsia-500">
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <PenLine className="h-4 w-4 text-primary" aria-hidden="true" />
                {post.author}
              </span>
              <span aria-hidden="true" className="text-border">
                |
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </span>
              <span aria-hidden="true" className="text-border">
                |
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {post.readTime}
              </span>
            </div>
            <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground/80">
              {post.authorRole} · {site.name}
            </p>
          </header>

          {/* Cover image */}
          <figure className="mt-8">
            <img
              src={post.cover}
              alt={post.coverAlt}
              width={1344}
              height={768}
              loading="eager"
              className="aspect-video w-full rounded-3xl border object-cover shadow-md"
            />
            <figcaption className="mt-3 text-center text-xs text-muted-foreground">
              {post.coverAlt} — generated with {site.name}
            </figcaption>
          </figure>

          {/* Table of contents */}
          {headings.length > 2 && (
            <nav aria-label="On this page" className="mt-8 rounded-2xl border bg-card p-5 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-bold">
                <ListTree className="h-4 w-4 text-primary" aria-hidden="true" />
                On this page
              </p>
              <ul className="mt-3 space-y-1">
                {headings.map((h) => (
                  <li key={h.id}>
                    <button
                      onClick={() => {
                        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        document
                          .getElementById(h.id)
                          ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                      }}
                      className="w-full rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {h.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Article body */}
          <div className="mt-10 space-y-6">
            {post.content.map((block, i) => (
              <BlockRenderer key={`${post.slug}-${i}`} block={block} index={i} />
            ))}
          </div>

          {/* Article footer */}
          <footer className="mt-12 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-fuchsia-500 text-white"
                aria-hidden="true"
              >
                <ListChecks className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold tracking-tight">Written by {post.author}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {post.authorRole}. We test every workflow on our own photos before publishing —
                  no hype, no invented numbers, just what actually works.
                </p>
                <Link
                  href="/contact"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Suggest a topic or share feedback
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </article>

      {/* Previous / next article navigation */}
      {(adjacent.prev || adjacent.next) && (
        <nav
          aria-label="More articles"
          className="mx-auto mt-10 grid max-w-3xl gap-4 px-4 sm:grid-cols-2 sm:px-6"
        >
          {adjacent.prev ? (
            <AdjacentCard post={adjacent.prev} direction="prev" />
          ) : (
            <span aria-hidden="true" />
          )}
          {adjacent.next && <AdjacentCard post={adjacent.next} direction="next" />}
        </nav>
      )}

      {/* Reserved ad space (PRD §46) — non-intrusive, clearly labeled */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <AdSlot slot="blog-article-bottom" format="horizontal" />
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="py-14 sm:py-16" aria-labelledby="related-articles">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 id="related-articles" className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Related <span className="gradient-text">articles</span>
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <RelatedCard key={rel.slug} post={rel} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/blog">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  View all articles
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <CTABanner
        title="Create your own AI avatar"
        text="Reading is the first step — generating is the fun one. Turn your photo into a custom AI avatar in seconds, free and without signup."
        primaryLabel="Open the avatar generator"
        primaryHref="/ai-avatar-generator"
        secondaryLabel="Explore all tools"
        secondaryHref="/tools"
      />
    </>
  );
}
