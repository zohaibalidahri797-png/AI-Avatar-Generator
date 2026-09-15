import type { Metadata } from 'next';
import LegalPage from '@/components/pages/LegalPage';
import { buildMetadata } from '@/lib/metadata';
import { LEGAL_DOCS } from '@/lib/legal-data';

const docData = LEGAL_DOCS['disclaimer'];

export const metadata: Metadata = buildMetadata({
  title: `${docData.metaTitle} | AvatarForge`,
  description: docData.metaDescription,
  path: '/disclaimer',
});

export default function Page() {
  return <LegalPage doc="disclaimer" />;
}
