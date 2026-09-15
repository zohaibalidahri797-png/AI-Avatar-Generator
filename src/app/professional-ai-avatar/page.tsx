import type { Metadata } from 'next';
import StyleLandingPage from '@/components/pages/StyleLandingPage';
import { buildMetadata } from '@/lib/metadata';
import { getLandingConfig } from '@/lib/landing-pages';

const config = getLandingConfig('professional-ai-avatar')!;

export const metadata: Metadata = buildMetadata({
  title: config.metaTitle,
  description: config.metaDescription,
  path: '/professional-ai-avatar',
});

export default function Page() {
  return <StyleLandingPage slug="professional-ai-avatar" />;
}
