'use client';

import { useEffect, useState } from 'react';
import { Download, Rss, ShieldCheck, Smartphone, Sparkles, Zap } from 'lucide-react';
import { Link } from '@/lib/router';
import { site } from '@/lib/site';
import { INSTALL_REQUEST_EVENT, STANDALONE_MEDIA } from '@/components/shared/PwaRuntime';

const TRUST_CHIPS = [
  { icon: Zap, label: 'Free forever' },
  { icon: ShieldCheck, label: 'Privacy-first' },
  { icon: Smartphone, label: 'Works on mobile' },
];

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Tools',
    links: [
      { label: 'AI Avatar Generator', href: '/ai-avatar-generator' },
      { label: 'AI PFP Generator', href: '/ai-pfp-generator' },
      { label: 'AI Headshot Generator', href: '/ai-headshot-generator' },
      { label: 'AI Portrait Generator', href: '/ai-portrait-generator' },
      { label: 'AI Gaming Avatar', href: '/ai-gaming-avatar-generator' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Blog', href: '/blog' },
      { label: 'Style Finder', href: '/style-finder' },
      { label: 'Categories', href: '/categories' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'My Avatars', href: '/my-avatars' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
    ],
  },
];

export default function Footer() {
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(STANDALONE_MEDIA);
    const update = () => setStandalone(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  return (
    <footer className="footer-gradient-top mt-auto bg-card/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="AvatarForge home"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground shadow-md shadow-primary/25">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                Avatar<span className="gradient-text">Forge</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.tagline} — create AI avatars, profile pictures, PFPs, portraits and
              professional headshots from your photo. No signup required.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Why AvatarForge">
              {TRUST_CHIPS.map((chip) => (
                <li
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  <chip.icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {chip.label}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              All example portraits on this site depict fictional, AI-generated people.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={`${col.title} links`}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block rounded-sm text-sm text-muted-foreground transition-all hover:translate-x-0.5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {!standalone && (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent(INSTALL_REQUEST_EVENT))}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Install AvatarForge as an app"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Install app
              </button>
            )}
            <a
              href="/feed.xml"
              type="application/rss+xml"
              className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Subscribe to the AvatarForge blog RSS feed"
            >
              <Rss className="h-3.5 w-3.5" aria-hidden="true" />
              RSS
            </a>
            <p className="text-xs text-muted-foreground">
              Powered by AI · Built for creators · Respect the{' '}
              <Link href="/terms" className="underline underline-offset-2 hover:text-primary">
                Terms
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
