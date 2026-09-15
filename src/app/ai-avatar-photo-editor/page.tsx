import type { Metadata } from 'next';
import PhotoEditorPage from '@/components/pages/PhotoEditorPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'AI Avatar Photo Editor — Crop, Resize & Adjust Photos Free',
  description:
    'Lightweight free photo editor for avatars and PFPs: crop, resize, rotate, adjust brightness and contrast, convert formats and download — right in your browser.',
  path: '/ai-avatar-photo-editor',
});

export default function Page() {
  return <PhotoEditorPage />;
}
