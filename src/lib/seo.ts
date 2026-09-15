'use client';

import { useEffect } from 'react';
import { site } from './site';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Canonical form of a root-relative path: '/ai-avatar-generator' -> '/ai-avatar-generator/'. */
function canonicalPath(path: string): string {
  const clean = `/${path.replace(/^\/+|\/+$/g, '')}`;
  return clean === '/' ? '/' : `${clean}/`;
}

/**
 * Client-side SEO sync. The canonical source of truth is the per-route
 * server metadata (src/lib/metadata.ts); this hook keeps document.title and
 * the social tags aligned client-side (updates tags in place — it never
 * duplicates the server-rendered ones).
 */
export function useSeo(opts: {
  title: string;
  description: string;
  path?: string;
  /** Set true for private/user-specific views that must stay out of search indexes. */
  noindex?: boolean;
  /** Absolute or root-relative image URL used as og:image / twitter:image for this page. */
  image?: string;
  /** Open Graph object type — defaults to website; use article for blog posts. */
  ogType?: 'website' | 'article';
}) {
  const { title, description, path = '/', noindex = false, image, ogType = 'website' } = opts;

  useEffect(() => {
    const canonical = canonicalPath(path);
    const pageUrl = `${site.url}${canonical}`;

    const apply = () => {
      document.title = title;
      setMeta('name', 'description', description);
      setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
      setMeta('property', 'og:title', title);
      setMeta('property', 'og:description', description);
      setMeta('property', 'og:url', pageUrl);
      setMeta('property', 'og:type', ogType);
      if (ogType === 'article') setMeta('property', 'article:section', 'Blog');
      const imageUrl = image?.startsWith('http') ? image : image ? `${site.url}${image}` : undefined;
      if (imageUrl) {
        setMeta('property', 'og:image', imageUrl);
        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:image', imageUrl);
      }
      setMeta('name', 'twitter:title', title);
      setMeta('name', 'twitter:description', description);

      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = pageUrl;
    };

    // Apply immediately, then again after React's head commits settle —
    // React 19 manages a hoisted <title> that can revert direct writes
    // during the hydration/navigation commit.
    apply();
    const raf = requestAnimationFrame(apply);
    const timer = window.setTimeout(apply, 150);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [title, description, path, noindex, image, ogType]);
}
