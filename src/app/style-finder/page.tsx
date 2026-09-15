import type { Metadata } from 'next';
import StyleFinderPage from '@/components/pages/StyleFinderPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Avatar Style Finder — Which AI Avatar Style Fits You? | AvatarForge',
  description:
    'Answer three quick questions and get an honest AI avatar style recommendation — realistic, professional, cartoon, anime, 3D, gaming or social media, with direct links to generate it free.',
  path: '/style-finder',
});

export default function Page() {
  return <StyleFinderPage />;
}
