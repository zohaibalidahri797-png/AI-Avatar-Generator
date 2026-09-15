import type { Metadata } from 'next';
import HowItWorksPage from '@/components/pages/HowItWorksPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'How It Works — Create an AI Avatar in 4 Simple Steps | AvatarForge',
  description:
    'Learn how the free AI avatar generator works: upload your photo, choose a style, customize background and lighting, then generate and download your avatar.',
  path: '/how-it-works',
});

export default function Page() {
  return <HowItWorksPage />;
}
