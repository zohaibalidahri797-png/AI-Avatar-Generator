import type { Metadata } from 'next';
import CategoriesPage from '@/components/pages/CategoriesPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'AI Avatar Categories — Browse Styles & Use Cases | AvatarForge',
  description:
    'Browse AI avatar styles by category: realistic, cartoon, anime, 3D, gaming and character avatars, professional headshots, social media PFPs and photo tools.',
  path: '/categories',
});

export default function Page() {
  return <CategoriesPage />;
}
