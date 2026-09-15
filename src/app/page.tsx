import type { Metadata } from 'next';
import HomePage from '@/components/pages/HomePage';
import { buildMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Free AI Avatar Generator — Create AI Avatars, PFPs & Headshots | AvatarForge',
  description: site.description,
  path: '/',
});

export default function Page() {
  return <HomePage />;
}
