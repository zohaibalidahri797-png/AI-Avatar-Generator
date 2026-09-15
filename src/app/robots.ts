import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/**
 * robots.txt for the configured production domain:
 *   User-agent: *
 *   Allow: /
 *   Sitemap: <site.url>/sitemap.xml
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
