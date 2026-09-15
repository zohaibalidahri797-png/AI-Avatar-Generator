'use client';

import { ArrowRight, Home, Search, SearchX, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/router';
import { useSeo } from '@/lib/seo';

const QUICK_LINKS: { label: string; href: string }[] = [
  { label: 'All tools', href: '/tools' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
];

export default function NotFoundPage() {
  useSeo({
    title: 'Page Not Found (404) | AvatarForge',
    description:
      'The page you are looking for does not exist or has moved. Head back home or open the free AI avatar generator instead.',
    path: '/404',
  });

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border bg-accent text-primary shadow-sm"
            aria-hidden="true"
          >
            <SearchX className="h-8 w-8" />
          </span>

          <p
            aria-hidden="true"
            className="gradient-text mt-8 text-7xl font-extrabold tracking-tight sm:text-8xl"
          >
            404
          </p>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            This page took a different style
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            The page you&apos;re looking for doesn&apos;t exist or moved. The good news: the
            avatar studio is only one click away.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="w-full gap-2 bg-gradient-to-r from-primary to-fuchsia-500 text-white shadow-lg shadow-primary/25 hover:opacity-90 sm:w-auto"
            >
              <Link href="/ai-avatar-generator">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Open the AI Avatar Generator
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full gap-2 sm:w-auto">
              <Link href="/">
                <Home className="h-4 w-4" aria-hidden="true" />
                Go to homepage
              </Link>
            </Button>
          </div>

          <nav aria-label="Popular destinations" className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Popular destinations
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {QUICK_LINKS.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.dispatchEvent(new CustomEvent('avatarforge:open-search'))}
              className="mt-4 gap-1.5 text-muted-foreground"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Or search the whole site
              <kbd className="kbd ml-1">Ctrl K</kbd>
            </Button>
          </nav>
        </div>
      </div>
    </section>
  );
}
