import type { Metadata } from 'next';
import CollectionPage from '@/components/pages/CollectionPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'My Avatars — Your Private Collection | AvatarForge',
  description:
    'Avatars you saved while generating, kept privately in this browser only. Download, edit or remove them any time.',
  path: '/my-avatars',
  noindex: true,
});

export default function Page() {
  return <CollectionPage />;
}
