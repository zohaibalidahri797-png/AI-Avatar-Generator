import type { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/blog-data';
import { GALLERY_CATEGORY_PAGES } from '@/lib/gallery-data';
import { LANDING_PAGES } from '@/lib/landing-pages';
import { site } from '@/lib/site';

/**
 * XML sitemap containing only real, crawlable URLs on the configured
 * production domain. Personal-state pages (e.g. /my-avatars) and query-based
 * views are intentionally excluded.
 */

type Entry = MetadataRoute.Sitemap[number];

function url(path: string): string {
  const clean = `/${path.replace(/^\/+|\/+$/g, '')}`;
  return `${site.url}${clean === '/' ? '/' : `${clean}/`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const main: Array<[string, number, MetadataRoute.Sitemap[number]['changeFrequency']]> = [
    ['/', 1, 'weekly'],
    ['/ai-avatar-generator', 0.9, 'weekly'],
    ['/tools', 0.8, 'monthly'],
    ['/categories', 0.7, 'monthly'],
    ['/gallery', 0.7, 'weekly'],
    ['/how-it-works', 0.7, 'monthly'],
    ['/style-finder', 0.7, 'monthly'],
    ['/faq', 0.7, 'monthly'],
    ['/blog', 0.8, 'weekly'],
    ['/about', 0.5, 'yearly'],
    ['/contact', 0.5, 'yearly'],
    ['/privacy-policy', 0.3, 'yearly'],
    ['/terms', 0.3, 'yearly'],
    ['/disclaimer', 0.3, 'yearly'],
    ['/cookie-policy', 0.3, 'yearly'],
  ];

  const entries: Entry[] = main.map(([path, priority, changeFrequency]) => ({
    url: url(path),
    lastModified,
    changeFrequency,
    priority,
  }));

  // AI landing pages (one per generator / style family)
  for (const slug of Object.keys(LANDING_PAGES)) {
    entries.push({ url: url(slug), lastModified, changeFrequency: 'monthly', priority: 0.8 });
  }

  // Gallery category pages
  for (const category of GALLERY_CATEGORY_PAGES) {
    entries.push({ url: url(`gallery/${category.slug}`), lastModified, changeFrequency: 'monthly', priority: 0.6 });
  }

  // Published blog articles
  for (const post of BLOG_POSTS) {
    entries.push({ url: url(`blog/${post.slug}`), lastModified, changeFrequency: 'monthly', priority: 0.6 });
  }

  return entries;
}
