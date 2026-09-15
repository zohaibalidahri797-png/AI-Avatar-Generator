import type { Metadata } from 'next';
import ToolsPage from '@/components/pages/ToolsPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'AI Avatar Tools — All Free Generators in One Place | AvatarForge',
  description:
    'Explore every free AI avatar tool: avatar generator, PFP maker, headshot generator, portrait, cartoon, anime, 3D, gaming, face and background generators.',
  path: '/tools',
});

export default function Page() {
  return <ToolsPage />;
}
