import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GalleryCategoryPage from '@/components/pages/GalleryCategoryPage';
import { buildMetadata } from '@/lib/metadata';
import {
  GALLERY_CATEGORY_PAGES,
  GALLERY_IMAGES,
  categorySlug,
  getGalleryCategoryPage,
} from '@/lib/gallery-data';

export function generateStaticParams() {
  return GALLERY_CATEGORY_PAGES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const meta = getGalleryCategoryPage(decoded);
  if (!meta) {
    return buildMetadata({
      title: 'Page Not Found (404) | AvatarForge',
      description: 'This gallery page could not be found.',
      path: `/gallery/${decoded}`,
      noindex: true,
    });
  }
  const firstImage = GALLERY_IMAGES.find((img) => categorySlug(img.category) === meta.slug);
  return buildMetadata({
    title: meta.metaTitle,
    description: meta.metaDescription,
    path: `/gallery/${meta.slug}`,
    image: firstImage?.src,
  });
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  if (!getGalleryCategoryPage(decoded)) notFound();
  return <GalleryCategoryPage slug={decoded} />;
}
