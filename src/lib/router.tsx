'use client';

import LinkNext from 'next/link';
import { usePathname as useNextPathname, useRouter as useNextRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Client-side navigation built on the Next.js App Router.
 *
 * The exported API (RouterProvider, useRouter, Link) mirrors the previous
 * hash router so existing call sites keep working, but paths are now real,
 * crawlable URLs (`/ai-avatar-generator/`) instead of hash fragments
 * (`#/ai-avatar-generator`). Internal hrefs are normalized to carry a
 * trailing slash, matching the canonical URL convention and the sitemap.
 */

export interface RouteState {
  path: string;
  query: URLSearchParams;
}

/** Custom event fired after every programmatic navigation (same-path query changes included). */
export const NAV_EVENT = 'af:navigated';

/** Collapse a pathname to its no-trailing-slash form ('/gallery/anime' from '/gallery/anime/'). */
export function normalizePath(path: string): string {
  if (!path.startsWith('/')) return '/';
  const clean = path.replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}

/**
 * Normalize an internal href so the canonical URL carries a trailing slash:
 * '/ai-avatar-generator' -> '/ai-avatar-generator/', '/gallery?fav=1' ->
 * '/gallery/?fav=1'. External URLs, mailto:, tel: and #anchor strings are
 * returned untouched; paths that end in a file extension (/feed.xml) keep
 * their exact shape.
 */
export function normalizeHref(href: string): string {
  if (!href.startsWith('/')) return href;
  const splitAt = [href.indexOf('?'), href.indexOf('#')]
    .filter((i) => i > -1)
    .sort((a, b) => a - b)[0];
  const rawPath = splitAt === undefined ? href : href.slice(0, splitAt);
  const rest = splitAt === undefined ? '' : href.slice(splitAt);
  const trimmed = rawPath.replace(/\/+$/, '');
  if (trimmed === '' || trimmed === '/') return `/${rest}`;
  const lastSegment = trimmed.slice(trimmed.lastIndexOf('/') + 1);
  if (/\.[a-z0-9]+$/i.test(lastSegment)) return `${trimmed}${rest}`;
  return `${trimmed}/${rest}`;
}

function parseLocation(): RouteState {
  if (typeof window === 'undefined') {
    return { path: '/', query: new URLSearchParams() };
  }
  return {
    path: normalizePath(window.location.pathname),
    query: new URLSearchParams(window.location.search),
  };
}

function parseTarget(target: string): RouteState {
  const beforeHash = target.split('#')[0] ?? target;
  const [path, qs] = beforeHash.split('?');
  return {
    path: normalizePath(path || '/'),
    query: new URLSearchParams(qs || ''),
  };
}

interface RouterContextValue extends RouteState {
  navigate: (to: string) => void;
  /** Replace the current URL without adding a history entry. */
  replace: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue>({
  path: '/',
  query: new URLSearchParams(),
  navigate: () => {},
  replace: () => {},
});

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const nextPathname = useNextPathname();
  const nextRouter = useNextRouter();

  // Hydration-stable initial state: Next's usePathname() returns the same
  // value during SSR and hydration. The query starts empty (like the old
  // hash router) and syncs from the address bar after mount.
  const [state, setState] = useState<RouteState>(() => ({
    path: normalizePath(nextPathname ?? '/'),
    query: new URLSearchParams(),
  }));

  useEffect(() => {
    const read = () => setState(parseLocation());
    read();
    // Back/forward buttons keep working through popstate…
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);

  // …and every route change re-syncs the query from the address bar. The
  // delayed settle pass covers transitions where history updates land just
  // after the pathname commit (e.g. HashRedirect, deep links).
  useEffect(() => {
    const read = () => setState(parseLocation());
    read();
    const timer = window.setTimeout(read, 120);
    return () => window.clearTimeout(timer);
  }, [nextPathname]);

  // Announce programmatic navigations so listeners outside the router
  // (e.g. the search palette) can react even when the pathname is unchanged.
  useEffect(() => {
    window.dispatchEvent(new Event(NAV_EVENT));
  }, [nextPathname]);

  const go = useCallback(
    (to: string, method: 'push' | 'replace') => {
      if (/^(https?:)?\/\//.test(to) || to.startsWith('mailto:')) {
        window.open(to, '_blank', 'noopener,noreferrer');
        return;
      }
      const target = normalizeHref(to);
      // Optimistic state update — the UI switches immediately, then the
      // pathname-driven effects above reconcile with the address bar.
      setState(parseTarget(target));
      if (method === 'replace') {
        nextRouter.replace(target);
      } else {
        nextRouter.push(target);
      }
      window.dispatchEvent(new Event(NAV_EVENT));
    },
    [nextRouter]
  );

  const navigate = useCallback((to: string) => go(to, 'push'), [go]);
  const replace = useCallback((to: string) => go(to, 'replace'), [go]);

  const value = useMemo(() => ({ ...state, navigate, replace }), [state, navigate, replace]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  return useContext(RouterContext);
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

/** Internal link that renders a real crawlable anchor (works with middle-click, SEO crawlers). */
export function Link({ href, children, onClick, ...rest }: LinkProps) {
  const isExternal = /^(https?:)?\/\//.test(href) || href.startsWith('mailto:');

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <LinkNext href={normalizeHref(href)} onClick={onClick} {...rest}>
      {children}
    </LinkNext>
  );
}
