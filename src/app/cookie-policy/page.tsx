import type { Metadata } from 'next';
import LegalPage from '@/components/pages/LegalPage';
import { buildMetadata } from '@/lib/metadata';
import { LEGAL_DOCS } from '@/lib/legal-data';

const docData = LEGAL_DOCS['cookie-policy'];

export const metadata: Metadata = buildMetadata({
  title: `${docData.metaTitle} | AvatarForge`,
  description: docData.metaDescription,
  path: '/cookie-policy',
});

export default function Page() {
  return <LegalPage doc="cookie-policy" />;
}
