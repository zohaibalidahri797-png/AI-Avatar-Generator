import type { Metadata } from 'next';
import AboutPage from '@/components/pages/AboutPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'About AvatarForge — Our Mission & Approach | AvatarForge',
  description:
    'Why we built a free AI avatar generator, how it works, who it is for, our privacy and technology approach, and the limitations we are honest about.',
  path: '/about',
});

export default function Page() {
  return <AboutPage />;
}
