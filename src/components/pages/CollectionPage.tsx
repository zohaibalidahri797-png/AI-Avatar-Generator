'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import {
  ArrowDown,
  ArrowUp,
  Download,
  GripVertical,
  Images,
  Info,
  Loader2,
  Palette,
  Trash2,
  Wand2,
} from 'lucide-react';

import {
  clearCollection,
  getCollection,
  reorderCollection,
  removeFromCollection,
  type SavedAvatar,
} from '@/lib/collection';
import { stashHandoff } from '@/lib/handoff';
import { Link, useRouter } from '@/lib/router';
import { useSeo } from '@/lib/seo';
import { cn } from '@/lib/utils';
import CTABanner from '@/components/shared/CTABanner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

function formatDate(ms: number): string {
  try {
    return format(new Date(ms), 'MMM d, yyyy');
  } catch {
    return '';
  }
}

export default function CollectionPage() {
  useSeo({
    title: 'My Avatars — Your Private Collection | AvatarForge',
    description:
      'Avatars you saved while generating, kept privately in this browser only. Download, edit or remove them any time.',
    path: '/my-avatars',
    noindex: true,
  });

  const { toast } = useToast();
  const { navigate } = useRouter();
  const [items, setItems] = useState<SavedAvatar[] | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const downloadAllAborted = useRef(false);

  const refresh = useCallback(() => {
    getCollection().then(setItems);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const triggerDownload = (item: SavedAvatar) => {
    // Convert the stored data URL back to a blob for a clean file download.
    fetch(item.dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-avatar-${item.substyle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${item.id}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
  };

  const download = (item: SavedAvatar) => {
    try {
      triggerDownload(item);
    } catch {
      toast({ title: 'Download failed', description: 'Please try again.' });
    }
  };

  /** Download every saved avatar with a small stagger so browsers don't block the batch. */
  const downloadAll = async () => {
    if (!items || items.length === 0 || downloadingAll) return;
    setDownloadingAll(true);
    downloadAllAborted.current = false;
    toast({
      title: `Downloading ${items.length} ${items.length === 1 ? 'avatar' : 'avatars'}…`,
      description: 'Your browser may ask to allow multiple downloads — choose allow.',
    });
    for (const item of items) {
      if (downloadAllAborted.current) break;
      try {
        triggerDownload(item);
      } catch {
        /* keep going — one failure shouldn't stop the rest */
      }
      await new Promise((r) => setTimeout(r, 450));
    }
    setDownloadingAll(false);
  };

  const openInEditor = (item: SavedAvatar) => {
    stashHandoff(item.dataUrl);
    navigate('/ai-avatar-photo-editor');
  };

  const remix = (item: SavedAvatar) => {
    stashHandoff(item.rawUrl);
    navigate('/ai-avatar-generator');
    toast({
      title: 'Avatar loaded in the generator',
      description: 'It is set as your source image — pick a new style to remix it.',
    });
  };

  const remove = async (id: string) => {
    try {
      await removeFromCollection(id);
      setItems((prev) => prev?.filter((a) => a.id !== id) ?? null);
      toast({ title: 'Avatar removed', description: 'It was deleted from this browser.' });
    } catch {
      toast({ title: 'Could not remove', description: 'Please try again.' });
    }
  };

  const clearAll = async () => {
    try {
      await clearCollection();
      setItems([]);
      setConfirmClear(false);
      toast({ title: 'Collection cleared', description: 'All saved avatars were deleted from this browser.' });
    } catch {
      toast({ title: 'Could not clear', description: 'Please try again.' });
    }
  };

  /* --------------------------- manual ordering (drag) --------------------------- */

  const persistOrder = useCallback((ordered: SavedAvatar[]) => {
    reorderCollection(ordered.map((a) => a.id)).catch(() => {
      toast({ title: 'Could not save the new order', description: 'Please try again.' });
    });
  }, [toast]);

  const moveItem = (id: string, direction: -1 | 1) => {
    if (!items) return;
    const index = items.findIndex((a) => a.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setItems(next);
    persistOrder(next);
  };

  const reorderTo = (sourceId: string, targetId: string) => {
    if (!items || sourceId === targetId) return;
    const from = items.findIndex((a) => a.id === sourceId);
    const to = items.findIndex((a) => a.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    persistOrder(next);
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-glow" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-20">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="rounded-sm transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/ai-avatar-generator" className="rounded-sm transition-colors hover:text-primary">
                  AI Avatar Generator
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-foreground">
                My Avatars
              </li>
            </ol>
          </nav>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-semibold text-primary">
                <Images className="h-3.5 w-3.5" aria-hidden="true" />
                Private collection
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                My <span className="gradient-text">Avatars</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Avatars you saved from the generator — kept in this browser only, never uploaded to a server.
              </p>
            </div>
            {items && items.length > 0 && (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void downloadAll()}
                  disabled={downloadingAll}
                  title="Download every saved avatar"
                >
                  {downloadingAll ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  Download all
                </Button>
                {confirmClear ? (
                  <>
                    <Button variant="destructive" size="sm" onClick={() => void clearAll()}>
                      Yes, delete all
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setConfirmClear(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setConfirmClear(true)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Clear all
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Collection grid */}
      <section className="pb-16" aria-label="Saved avatars">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {items === null ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full rounded-2xl" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border bg-card p-10 text-center shadow-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                <Images className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-lg font-bold">No saved avatars yet</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Generate an avatar and press <strong>Save</strong> — it will appear here, stored only in this
                  browser.
                </p>
              </div>
              <Button
                className="btn-sheen gap-2 bg-gradient-to-r from-primary to-fuchsia-500 shadow-md shadow-primary/25"
                onClick={() => navigate('/ai-avatar-generator')}
              >
                <Wand2 className="h-4 w-4" aria-hidden="true" />
                Create your first avatar
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {items.length} saved {items.length === 1 ? 'avatar' : 'avatars'} · drag cards or use the arrows to
                rearrange
              </p>
              <ul
                className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                aria-label="Saved avatar list"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragId && dropTargetId) reorderTo(dragId, dropTargetId);
                  setDragId(null);
                  setDropTargetId(null);
                }}
              >
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    draggable
                    onDragStart={(e) => {
                      setDragId(item.id);
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', item.id);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      if (dragId && dragId !== item.id) setDropTargetId(item.id);
                    }}
                    onDragLeave={() => setDropTargetId((cur) => (cur === item.id ? null : cur))}
                    onDragEnd={() => {
                      setDragId(null);
                      setDropTargetId(null);
                    }}
                    className={cn(
                      'rounded-2xl transition-opacity focus-within:outline-none',
                      dragId === item.id && 'opacity-40',
                      dropTargetId === item.id && dragId !== item.id && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    )}
                  >
                    <figure className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm card-hover">
                      {/* Drag affordance */}
                      <span
                        aria-hidden="true"
                        className="absolute left-2 top-2 z-10 flex h-7 w-7 cursor-grab items-center justify-center rounded-lg bg-black/45 text-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 active:cursor-grabbing"
                      >
                        <GripVertical className="h-4 w-4" />
                      </span>
                      <div className="relative aspect-square overflow-hidden bg-muted/40">
                        <img
                          src={item.dataUrl}
                          alt={`Saved ${item.substyle} AI avatar`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5 bg-gradient-to-t from-black/70 to-transparent p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                          <button
                            onClick={() => download(item)}
                            aria-label={`Download ${item.substyle} avatar`}
                            title="Download"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-neutral-800 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Download className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => openInEditor(item)}
                            aria-label={`Edit ${item.substyle} avatar in the photo editor`}
                            title="Edit"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-neutral-800 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Palette className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => remix(item)}
                            aria-label={`Use ${item.substyle} avatar as source in the generator`}
                            title="Remix in generator"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-neutral-800 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Wand2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => void remove(item.id)}
                            aria-label={`Delete ${item.substyle} avatar`}
                            title="Delete"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-red-600 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <figcaption className="p-3">
                        <p className="truncate text-sm font-semibold" title={item.substyle}>
                          {item.substyle}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                          <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                          <div className="ml-auto flex items-center gap-1">
                            <span className="sr-only" id={`pos-${item.id}`}>
                              Position {index + 1} of {items.length}
                            </span>
                            <button
                              onClick={() => moveItem(item.id, -1)}
                              disabled={index === 0}
                              aria-label={`Move ${item.substyle} avatar earlier`}
                              aria-describedby={`pos-${item.id}`}
                              title="Move earlier"
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => moveItem(item.id, 1)}
                              disabled={index === items.length - 1}
                              aria-label={`Move ${item.substyle} avatar later`}
                              aria-describedby={`pos-${item.id}`}
                              title="Move later"
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <Badge variant="secondary" className="max-w-[64px] truncate">
                              {item.styleGroupLabel}
                            </Badge>
                          </div>
                        </div>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div
            className={cn(
              'mt-10 flex items-start gap-3 rounded-2xl border bg-card p-5 shadow-sm',
              items !== null && items.length === 0 && 'hidden'
            )}
          >
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Saved avatars are stored only in this browser (IndexedDB) — nothing is uploaded to a server and we
              never see them. Clearing your browser data for this site removes them, and they will not appear in
              other browsers or devices.
            </p>
          </div>
        </div>
      </section>

      <CTABanner
        title="Need a new look?"
        text="Head back to the generator to create another avatar style, or fine-tune an existing one in the photo editor."
        primaryLabel="Open the generator"
        primaryHref="/ai-avatar-generator"
        secondaryLabel="Photo editor"
        secondaryHref="/ai-avatar-photo-editor"
      />
    </main>
  );
}
