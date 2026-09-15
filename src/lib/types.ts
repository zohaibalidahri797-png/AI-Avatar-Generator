/** Shared type definitions used across pages, data files and components. */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedTool {
  title: string;
  href: string;
  description: string;
}

/* ---------------------------------- Landing pages --------------------------------- */

export interface LandingFeature {
  title: string;
  description: string;
  icon: string; // lucide icon key, resolved by the landing template
}

export interface LandingStep {
  title: string;
  description: string;
}

export interface LandingConfig {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  breadcrumbLabel: string;
  badge: string;
  icon: string; // lucide icon key, resolved by the landing template
  intro: string[];
  highlights: { stat: string; label: string }[];
  preset: { styleGroup: string; substyle: string };
  features: LandingFeature[];
  steps: LandingStep[];
  useCases: string[];
  tips: { title: string; description: string }[];
  faqs: FaqItem[];
  related: RelatedTool[];
  ctaTitle: string;
  ctaText: string;
  /** Optional real before/after example (AI-generated fictional person). */
  showcase?: {
    before: string;
    after: string;
    beforeAlt: string;
    afterAlt: string;
    caption: string;
  };
}

/* -------------------------------------- Blog -------------------------------------- */

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'steps'; items: string[] }
  | { type: 'tip'; title: string; text: string }
  | { type: 'quote'; text: string }
  | { type: 'cta'; text: string; label: string; href: string };

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  date: string; // ISO date string
  readTime: string;
  author: string;
  authorRole: string;
  cover: string; // e.g. /images/avatars/anime.png
  coverAlt: string;
  featured?: boolean;
  content: BlogBlock[];
}

/* ------------------------------------- Legal -------------------------------------- */

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDoc {
  slug: 'privacy-policy' | 'terms' | 'disclaimer' | 'cookie-policy';
  title: string;
  metaTitle: string;
  metaDescription: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

/* ------------------------------------ Gallery ------------------------------------- */

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
  label: string;
}

/* ------------------------------------- Tools -------------------------------------- */

export interface ToolCard {
  title: string;
  href: string;
  description: string;
  icon: string; // lucide icon key, resolved by consumer
  badge?: string;
}
