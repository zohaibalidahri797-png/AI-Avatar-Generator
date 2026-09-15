import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogArticlePage from '@/components/pages/BlogArticlePage';
import { buildMetadata } from '@/lib/metadata';
import { BLOG_POSTS, getBlogPost } from '@/lib/blog-data';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const post = getBlogPost(decoded);
  if (!post) {
    return buildMetadata({
      title: 'Article not found | AvatarForge',
      description:
        'This AvatarForge blog article could not be found. Browse all AI avatar guides instead.',
      path: '/blog',
      noindex: true,
    });
  }
  return buildMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    image: post.cover,
    ogType: 'article',
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  if (!getBlogPost(decoded)) notFound();
  return <BlogArticlePage slug={decoded} />;
}
