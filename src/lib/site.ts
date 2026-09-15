/**
 * Central site configuration.
 *
 * Production values are injected through environment variables so the same
 * build can be deployed to any domain without code changes:
 *
 *   NEXT_PUBLIC_SITE_URL        e.g. https://avatarforge.com  (no trailing slash)
 *   NEXT_PUBLIC_SUPPORT_EMAIL   e.g. support@avatarforge.com  (optional)
 *
 * No placeholder domain or email is hard-coded: when the support email is not
 * configured the UI falls back to honest "use the contact page" copy instead
 * of inventing an address.
 */

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const rawEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();

export const site = {
  name: 'AvatarForge',
  fullName: 'AvatarForge AI',
  /** Canonical origin, always without a trailing slash. */
  url: (rawUrl && rawUrl.length > 0 ? rawUrl : 'http://localhost:3000').replace(/\/+$/, ''),
  tagline: 'Free AI Avatar Generator',
  description:
    'Create unique AI avatars, profile pictures, PFPs, portraits and professional headshots from your photo. Free online AI avatar generator — no signup required.',
  /** Undefined when NEXT_PUBLIC_SUPPORT_EMAIL is not configured — consumers must handle this. */
  contactEmail: rawEmail && rawEmail.length > 0 ? rawEmail : undefined,
  keywords: [
    'Free AI Avatar Generator',
    'AI Avatar Maker',
    'AI Avatar Creator',
    'AI Profile Picture Generator',
    'AI PFP Generator',
    'AI Headshot Generator',
    'AI Avatar Generator from Photo',
    'Anime Avatar Generator',
    'Cartoon Avatar Generator',
    '3D Avatar Generator',
    'Gaming Avatar Generator',
  ],
} as const;
