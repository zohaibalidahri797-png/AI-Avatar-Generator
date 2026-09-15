import type { Metadata } from 'next';
import BlogIndexPage from '@/components/pages/BlogIndexPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'AI Avatar Blog — Guides, Tips & Tutorials | AvatarForge',
  description:
    'Practical, honest guides for creating better AI avatars, PFPs and professional headshots — from the AvatarForge team.',
  path: '/blog',
});

export default function Page() {
  return <BlogIndexPage />;
}
