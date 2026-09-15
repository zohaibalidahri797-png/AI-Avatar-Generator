import { BLOG_POSTS } from '@/lib/blog-data';
import { site } from '@/lib/site';

/**
 * RSS 2.0 feed for the blog, generated at build time from the single
 * source of truth (BLOG_POSTS). All links use real crawlable URLs on the
 * configured production domain — never hash fragments.
 */

export const dynamic = 'force-static';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET(): Response {
  const sorted = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

  const items = sorted
    .map((post) => {
      const postUrl = `${site.url}/blog/${post.slug}/`;
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${postUrl}</link>`,
        `      <guid isPermaLink="false">${post.slug}</guid>`,
        `      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>`,
        `      <category>${escapeXml(post.category)}</category>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const lastBuildDate = sorted[0]
    ? new Date(`${sorted[0].date}T00:00:00Z`).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AvatarForge Blog — AI Avatar Guides &amp; Tips</title>
    <link>${site.url}/blog/</link>
    <description>Guides, tips and tutorials for creating AI avatars, profile pictures, PFPs and professional headshots with AvatarForge.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
    <generator>AvatarForge</generator>
    <image>
      <url>${site.url}/images/og-image.png</url>
      <title>AvatarForge Blog</title>
      <link>${site.url}/blog/</link>
    </image>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
