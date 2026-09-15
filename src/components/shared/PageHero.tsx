'use client';

import { ChevronRight } from 'lucide-react';
import { Link } from '@/lib/router';
import { site } from '@/lib/site';
import type { BreadcrumbItem } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  badge?: string;
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  align?: 'left' | 'center';
  children?: React.ReactNode;
}

/** Standard page header: breadcrumbs, badge, H1 and lede text. */
export default function PageHero({
  badge,
  title,
  description,
  breadcrumbs,
  align = 'left',
  children,
}: PageHeroProps) {
  const centered = align === 'center';
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href
        ? { item: `${site.url}${crumb.href === '/' ? '/' : `/${crumb.href.replace(/^\/+|\/+$/g, '')}/`}` }
        : {}),
    })),
  };

  return (
    <div className="relative overflow-hidden">
      <div className="hero-glow" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
        <nav aria-label="Breadcrumb">
          <ol
            className={cn(
              'flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground',
              centered && 'justify-center'
            )}
          >
            {breadcrumbs.map((crumb, i) => (
              <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-foreground">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className={cn('mt-6', centered && 'mx-auto max-w-3xl text-center')}>
          {badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-accent px-3 py-1 text-xs font-semibold text-primary">
              {badge}
            </span>
          )}
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      </div>
    </div>
  );
}
