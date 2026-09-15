import type { Metadata } from 'next';
import LegalPage from '@/components/pages/LegalPage';
import { buildMetadata } from '@/lib/metadata';
import { LEGAL_DOCS } from '@/lib/legal-data';

const docData = LEGAL_DOCS['terms'];

export const metadata: Metadata = buildMetadata({
  title: `${docData.metaTitle} | AvatarForge`,
  description: docData.metaDescription,
  path: '/terms',
});

export default function Page() {
  return <LegalPage doc="terms" />;
}
