'use client';

import { ThemeProvider } from 'next-themes';
import { RouterProvider } from '@/lib/router';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieNotice from '@/components/layout/CookieNotice';

import BackToTop from '@/components/shared/BackToTop';
import SearchPalette from '@/components/shared/SearchPalette';
import RouteProgress from '@/components/shared/RouteProgress';
import PwaRuntime from '@/components/shared/PwaRuntime';
import HashRedirect from '@/components/shared/HashRedirect';

/**
 * Site-wide chrome shared by every real App Router route.
 *
 * Each page under src/app renders as its own server component (with its own
 * server metadata) inside this shell — replacing the previous single-route
 * hash-router SPA wrapper while preserving the exact layout structure:
 * skip link, route progress, header, search palette, main content, footer,
 * back-to-top, PWA runtime and the cookie notice.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <RouterProvider>
        <div className="flex min-h-screen flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to main content
          </a>
          <RouteProgress />
          <HashRedirect />
          <Header />
          <SearchPalette />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <BackToTop />
          <PwaRuntime />
          <CookieNotice />
        </div>
      </RouterProvider>
    </ThemeProvider>
  );
}
