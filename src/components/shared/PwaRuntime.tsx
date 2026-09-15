'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';

/**
 * PWA runtime:
 *  1. Registers the service worker (offline shell + asset caching).
 *  2. Listens for `beforeinstallprompt` and shows a dismissible install
 *     banner on browsers that support installation.
 *  3. Exposes the shared `avatarforge:install-requested` CustomEvent so the
 *     footer "Install app" button can trigger the same native prompt.
 *
 * Everything degrades honestly: if the browser cannot install (e.g. iOS
 * Safari before `beforeinstallprompt` exists), the banner never appears and
 * the footer button explains the manual route instead of pretending. iOS
 * Safari users instead get a dismissible hint that explains the real
 * "Share → Add to Home Screen" steps — it never fakes an install.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'avatarforge-pwa-banner-dismissed';
const IOS_HINT_KEY = 'avatarforge-ios-hint-dismissed';

export const STANDALONE_MEDIA = '(display-mode: standalone)';

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(STANDALONE_MEDIA).matches;
}

export const INSTALL_REQUEST_EVENT = 'avatarforge:install-requested';

export default function PwaRuntime() {
  const { toast } = useToast();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [iosHintVisible, setIosHintVisible] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* SW is a progressive enhancement — ignore failures silently */
      });
    };
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      setDeferred(promptEvent);
      let dismissed = false;
      try {
        dismissed = sessionStorage.getItem(DISMISS_KEY) === '1';
      } catch {
        /* private mode — treat as not dismissed */
      }
      if (!dismissed) {
        // Wait a beat so the banner never competes with first-paint content.
        window.setTimeout(() => setBannerVisible(true), 4000);
      }
    };

    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
      setBannerVisible(false);
      try {
        sessionStorage.setItem(DISMISS_KEY, '1');
      } catch {
        /* ignore */
      }
      toast({
        title: 'AvatarForge installed',
        description: 'Find it in your app list — it now opens like a native app.',
      });
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [toast]);

  const promptInstall = useCallback(async (): Promise<'prompted' | 'manual' | 'installed'> => {
    if (installed || isStandalone()) return 'installed';
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      setDeferred(null);
      setBannerVisible(false);
      return choice.outcome === 'accepted' ? 'installed' : 'manual';
    }
    return 'manual';
  }, [deferred, installed]);

  useEffect(() => {
    const onRequest = () => {
      void promptInstall().then((result) => {
        if (result === 'installed') {
          toast({ title: 'Enjoy the app!', description: 'AvatarForge is installing in the background.' });
        } else if (result === 'manual') {
          toast({
            title: 'Install from your browser menu',
            description:
              'Chrome/Edge: menu → “Install AvatarForge”. Safari (iPhone/iPad): Share → “Add to Home Screen”.',
          });
        }
      });
    };
    window.addEventListener(INSTALL_REQUEST_EVENT, onRequest);
    return () => window.removeEventListener(INSTALL_REQUEST_EVENT, onRequest);
  }, [promptInstall, toast]);

  /**
   * iOS Safari hint: `beforeinstallprompt` never fires on iOS, so the install
   * banner above can never appear there. Instead, detect iOS Safari (not
   * already installed) and, after a quiet delay, show honest manual steps.
   * Dismissal is stored in localStorage so the hint never nags again.
   */
  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS 13+
    if (!isIOS) return;
    const nav = navigator as Navigator & { standalone?: boolean };
    if (isStandalone() || nav.standalone === true) return;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(IOS_HINT_KEY) === '1';
    } catch {
      /* private mode — treat as not dismissed */
    }
    if (dismissed) return;
    const t = window.setTimeout(() => setIosHintVisible(true), 9000);
    return () => window.clearTimeout(t);
  }, []);

  const dismissIosHint = useCallback(() => {
    setIosHintVisible(false);
    try {
      localStorage.setItem(IOS_HINT_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  if (bannerVisible) {
    return (
      <div
        role="dialog"
        aria-label="Install AvatarForge"
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm animate-in slide-in-from-bottom-4 fade-in sm:left-4 sm:right-auto"
      >
        <div className="gradient-ring overflow-hidden rounded-2xl border bg-card/95 p-4 shadow-xl shadow-primary/10 backdrop-blur">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground shadow-md shadow-primary/25">
              <Download className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Install AvatarForge</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Add it to your home screen — loads instantly and works offline for browsing.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  className="btn-sheen inline-flex items-center rounded-lg bg-gradient-to-r from-primary to-fuchsia-600 px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-transform active:scale-[0.97]"
                  onClick={() =>
                    void promptInstall().then((result) => {
                      if (result === 'manual') {
                        toast({
                          title: 'Install from your browser menu',
                          description:
                            'Chrome/Edge: menu → “Install AvatarForge”. Safari (iPhone/iPad): Share → “Add to Home Screen”.',
                        });
                      }
                    })
                  }
                >
                  Install
                </button>
                <button
                  type="button"
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => {
                    setBannerVisible(false);
                    try {
                      sessionStorage.setItem(DISMISS_KEY, '1');
                    } catch {
                      /* ignore */
                    }
                  }}
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              type="button"
              aria-label="Dismiss install suggestion"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => {
                setBannerVisible(false);
                try {
                  sessionStorage.setItem(DISMISS_KEY, '1');
                } catch {
                  /* ignore */
                }
              }}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (iosHintVisible && !installed) {
    return (
      <div
        role="status"
        aria-label="How to add AvatarForge to your home screen"
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm animate-in slide-in-from-bottom-4 fade-in sm:left-4 sm:right-auto"
      >
        <div className="gradient-ring overflow-hidden rounded-2xl border bg-card/95 p-4 shadow-xl shadow-primary/10 backdrop-blur">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
              <Share className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Add AvatarForge to your Home Screen</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                In Safari, tap the <span className="font-semibold text-foreground">Share</span> button, then choose{' '}
                <span className="font-semibold text-foreground">“Add to Home Screen”</span> — it opens full-screen
                from your home screen.
              </p>
              <div className="mt-3">
                <button
                  type="button"
                  className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={dismissIosHint}
                >
                  Got it
                </button>
              </div>
            </div>
            <button
              type="button"
              aria-label="Dismiss the home screen hint"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={dismissIosHint}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
