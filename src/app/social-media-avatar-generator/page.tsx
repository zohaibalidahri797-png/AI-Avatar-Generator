import type { Metadata } from 'next';
import StyleLandingPage from '@/components/pages/StyleLandingPage';
import { buildMetadata } from '@/lib/metadata';
import { getLandingConfig } from '@/lib/landing-pages';

const config = getLandingConfig('social-media-avatar-generator')!;

export const metadata: Metadata = buildMetadata({
  title: config.metaTitle,
  description: config.metaDescription,
  path: '/social-media-avatar-generator',
});

export default function Page() {
  return <StyleLandingPage slug="social-media-avatar-generator" />;
}
