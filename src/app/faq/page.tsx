import type { Metadata } from 'next';
import FAQPage from '@/components/pages/FAQPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'AI Avatar Generator FAQ — Questions & Answers | AvatarForge',
  description:
    'Answers to common questions about the free AI avatar generator: photo requirements, styles, downloads, formats, privacy, accounts and tips for better results.',
  path: '/faq',
});

export default function Page() {
  return <FAQPage />;
}
