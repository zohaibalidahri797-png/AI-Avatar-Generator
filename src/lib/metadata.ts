import type { Metadata } from 'next';
import { site } from './site';

/**
 * Server-side per-route metadata builder — the canonical SEO source of truth
 * for every public page. Produces a unique title, description, canonical URL,
 * Open Graph, Twitter card and robots directives for each route, all derived
 * from the configured production domain (site.url).
 *
 * Client components additionally call useSeo() with the same values, which
 * updates the server-rendered tags in place after hydration.
 */

const DEFAULT_OG = '/images/og-image.png';
const DEFAULT_OG_WIDTH = 1344;
const DEFAULT_OG_HEIGHT = 768;

/** Canonical form of a root-relative path: '/ai-avatar-generator' -> '/ai-avatar-generator/'. */
export function canonicalPath(path: string): string {
  const clean = `/${path.replace(/^\/+|\/+$/g, '')}`;
  return clean === '/' ? '/' : `${clean}/`;
}

export function buildMetadata(opts: {
  title: string;
  description: string;
  /** Root-relative path of this page ('/', '/ai-avatar-generator', '/blog/my-post'). */
  path: string;
  /** Root-relative or absolute social image; falls back to the site OG image. */
  image?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
}): Metadata {
  const canonical = canonicalPath(opts.path);
  const url = `${site.url}${canonical}`;
  const imagePath = opts.image ?? DEFAULT_OG;
  const imageUrl = imagePath.startsWith('http') ? imagePath : `${site.url}${imagePath}`;
  const isDefault = imagePath === DEFAULT_OG;
  const images = [
    {
      url: imageUrl,
      alt: opts.title,
      ...(isDefault ? { width: DEFAULT_OG_WIDTH, height: DEFAULT_OG_HEIGHT } : {}),
    },
  ];

  return {
    title: { absolute: opts.title },
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: site.fullName,
      type: opts.ogType ?? 'website',
      images,
      ...(opts.ogType === 'article' ? { section: 'Blog' } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [imageUrl],
    },
    robots: opts.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  };
}
