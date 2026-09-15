import { BLOG_POSTS } from './blog-data';
import { FAQ_GROUPS } from './faq-data';
import { GALLERY_CATEGORY_PAGES } from './gallery-data';
import { LANDING_PAGES } from './landing-pages';
import { STYLE_GROUPS } from './avatar-styles';

/**
 * Site-wide search index for the Ctrl/⌘+K palette.
 *
 * Built entirely from the existing data sources, so any page, generator,
 * gallery category, guide or FAQ added later is picked up automatically.
 */

export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  group: SearchGroup;
  keywords?: string;
}

export type SearchGroup = 'Pages' | 'Generators' | 'Style families' | 'Gallery' | 'Guides' | 'FAQ';

const MAIN_PAGES: SearchEntry[] = [
  {
    id: 'page-home',
    title: 'Home — Free AI Avatar Generator',
    description: 'Overview of the free AI avatar generator, styles and workflow.',
    href: '/',
    group: 'Pages',
  },
  {
    id: 'page-tool',
    title: 'AI Avatar Generator',
    description: 'Upload a photo, pick one of 31 styles, customize and download your avatar.',
    href: '/ai-avatar-generator',
    group: 'Pages',
    keywords: 'studio generator create pfp headshot upload',
  },
  {
    id: 'page-photo-editor',
    title: 'AI Avatar Photo Editor',
    description: 'Crop, rotate, adjust brightness and prepare photos for avatar generation.',
    href: '/ai-avatar-photo-editor',
    group: 'Pages',
    keywords: 'crop resize brightness contrast circle pfp export',
  },
  {
    id: 'page-my-avatars',
    title: 'My Avatars',
    description: 'Your private collection — saved avatars stay in this browser only.',
    href: '/my-avatars',
    group: 'Pages',
    keywords: 'collection saved download reorder private',
  },
  {
    id: 'page-style-finder',
    title: 'Style Finder quiz',
    description: 'Answer three quick questions and get an honest style recommendation.',
    href: '/style-finder',
    group: 'Pages',
    keywords: 'quiz which style recommend pick choose finder',
  },
  {
    id: 'page-tools',
    title: 'All tools',
    description: 'Every free generator and helper in one place.',
    href: '/tools',
    group: 'Pages',
  },
  {
    id: 'page-categories',
    title: 'Categories',
    description: 'Browse avatar styles by family and use case.',
    href: '/categories',
    group: 'Pages',
  },
  {
    id: 'page-how-it-works',
    title: 'How It Works',
    description: 'The four steps from photo to finished avatar.',
    href: '/how-it-works',
    group: 'Pages',
  },
  {
    id: 'page-about',
    title: 'About',
    description: 'What AvatarForge is and the principles behind it.',
    href: '/about',
    group: 'Pages',
  },
  {
    id: 'page-contact',
    title: 'Contact',
    description: 'Questions, feedback or support.',
    href: '/contact',
    group: 'Pages',
  },
];

const GENERATOR_PAGES: SearchEntry[] = Object.values(LANDING_PAGES).map((p) => ({
  id: `landing-${p.slug}`,
  title: p.h1,
  description: p.metaDescription,
  href: `/${p.slug}`,
  group: 'Generators',
  keywords: `${p.badge} ${p.preset.styleGroup} ${p.preset.substyle}`,
}));

const STYLE_FAMILY_ENTRIES: SearchEntry[] = STYLE_GROUPS.map((g) => ({
  id: `family-${g.id}`,
  title: `${g.label} avatar styles`,
  description: `${g.tagline} — ${g.substyles.length} styles: ${g.substyles.map((s) => s.name).join(', ')}.`,
  href: g.landingHref,
  group: 'Style families',
  keywords: g.substyles.map((s) => s.name).join(' '),
}));

const GALLERY_ENTRIES: SearchEntry[] = [
  {
    id: 'gallery-hub',
    title: 'Avatar gallery',
    description: 'Browse example avatars in every style family.',
    href: '/gallery',
    group: 'Gallery',
  },
  ...GALLERY_CATEGORY_PAGES.map((c) => ({
    id: `gallery-${c.slug}`,
    title: `${c.label} avatar examples`,
    description: c.metaDescription,
    href: `/gallery/${c.slug}`,
    group: 'Gallery' as const,
  })),
];

const BLOG_ENTRIES: SearchEntry[] = BLOG_POSTS.map((p) => ({
  id: `blog-${p.slug}`,
  title: p.title,
  description: p.excerpt,
  href: `/blog/${p.slug}`,
  group: 'Guides',
  keywords: p.category,
}));

const FAQ_ENTRIES: SearchEntry[] = FAQ_GROUPS.flatMap((g, gi) =>
  g.questions.map((item, qi) => ({
    id: `faq-${gi}-${qi}`,
    title: item.question,
    description: item.answer.slice(0, 140).trim() + (item.answer.length > 140 ? '…' : ''),
    href: `/faq?g=${gi}&q=${qi}`,
    group: 'FAQ' as const,
  }))
);

export const SEARCH_ENTRIES: SearchEntry[] = [
  ...MAIN_PAGES,
  ...GENERATOR_PAGES,
  ...STYLE_FAMILY_ENTRIES,
  ...GALLERY_ENTRIES,
  ...BLOG_ENTRIES,
  ...FAQ_ENTRIES,
];

export const SEARCH_GROUPS: SearchGroup[] = [
  'Pages',
  'Generators',
  'Style families',
  'Gallery',
  'Guides',
  'FAQ',
];

/** Case-insensitive substring match across title, description and keywords. */
export function filterSearchEntries(query: string, limit = 24): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return SEARCH_ENTRIES.filter((e) => {
    const haystack = `${e.title} ${e.description} ${e.keywords ?? ''}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  }).slice(0, limit);
}
