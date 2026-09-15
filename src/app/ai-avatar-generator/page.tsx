import type { Metadata } from 'next';
import ToolPage from '@/components/pages/ToolPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Free AI Avatar Generator — Create Your AI Avatar Online',
  description:
    'Upload a photo, choose from 31+ avatar styles and generate custom AI avatars, PFPs and portraits online for free. No signup required.',
  path: '/ai-avatar-generator',
});

export default function Page() {
  return <ToolPage />;
}
