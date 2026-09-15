import type { Metadata } from 'next';
import StyleLandingPage from '@/components/pages/StyleLandingPage';
import { buildMetadata } from '@/lib/metadata';
import { getLandingConfig } from '@/lib/landing-pages';

const config = getLandingConfig('ai-anime-avatar-generator')!;

export const metadata: Metadata = buildMetadata({
  title: config.metaTitle,
  description: config.metaDescription,
  path: '/ai-anime-avatar-generator',
});

export default function Page() {
  return <StyleLandingPage slug="ai-anime-avatar-generator" />;
}
