import type { Metadata } from 'next';
import ContactPage from '@/components/pages/ContactPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us — AvatarForge Support & Feedback | AvatarForge',
  description:
    'Contact the AvatarForge team for general questions, technical support, feedback, feature requests or privacy requests.',
  path: '/contact',
});

export default function Page() {
  return <ContactPage />;
}
