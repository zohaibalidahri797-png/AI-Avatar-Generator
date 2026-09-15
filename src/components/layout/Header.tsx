'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Menu, Moon, Search, Sparkles, Sun, X } from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'AI Avatar Generator', href: '/ai-avatar-generator' },
  { label: 'Tools', href: '/tools' },
  { label: 'Categories', href: '/categories' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const { path } = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return path === '/';
    return path === href || path.startsWith(`${href}/`);
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-border/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="AvatarForge — Free AI Avatar Generator home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground shadow-md shadow-primary/25">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Avatar<span className="gradient-text">Forge</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive(item.href) ? 'text-primary' : 'text-muted-foreground'
              )}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Search (opens the global palette) */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search AvatarForge"
            onClick={() => window.dispatchEvent(new CustomEvent('avatarforge:open-search'))}
            className="hidden sm:inline-flex"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hidden sm:inline-flex"
          >
            <Sun className="h-4 w-4 dark:hidden" aria-hidden="true" />
            <Moon className="hidden h-4 w-4 dark:block" aria-hidden="true" />
          </Button>

          {/* CTA */}
          <Link href="/ai-avatar-generator" className="hidden sm:block">
            <Button size="sm" className="gap-1.5 bg-gradient-to-r from-primary to-fuchsia-500 shadow-md shadow-primary/25 hover:opacity-95">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Create Avatar
            </Button>
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-border/70 bg-background/95 backdrop-blur lg:hidden"
        >
          <ul className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            <li>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(new CustomEvent('avatarforge:open-search'));
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Search
                <kbd className="ml-auto rounded-md border bg-accent px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                  Ctrl K
                </kbd>
              </button>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive(item.href) ? 'bg-accent text-primary' : 'text-foreground'
                  )}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start px-3"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="mr-2 h-4 w-4 dark:hidden" aria-hidden="true" />
                <Moon className="mr-2 hidden h-4 w-4 dark:block" aria-hidden="true" />
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </Button>
            </li>
            <li className="pt-1">
              <Link href="/ai-avatar-generator" onClick={() => setMobileOpen(false)} className="block">
                <Button className="w-full gap-1.5 bg-gradient-to-r from-primary to-fuchsia-500 shadow-md shadow-primary/25">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Create Avatar
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
