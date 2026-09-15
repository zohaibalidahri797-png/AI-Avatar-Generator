import type { Metadata } from 'next';
import GalleryPage from '@/components/pages/GalleryPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'AI Avatar Gallery — Example Avatars in Every Style | AvatarForge',
  description:
    'Browse example AI avatars created with AvatarForge: realistic, professional, anime, cartoon, gaming, 3D, business and social media styles.',
  path: '/gallery',
});

export default function Page() {
  return <GalleryPage />;
}
