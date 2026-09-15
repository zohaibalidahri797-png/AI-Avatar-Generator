/**
 * Gallery favorites — a small, honest, browser-only feature.
 *
 * Favorited gallery examples are stored in localStorage so visitors can
 * shortlist the styles they like while comparing. Nothing is uploaded and
 * no server is involved. A custom event keeps every mounted component in
 * sync when the set changes.
 */

const STORAGE_KEY = 'avatarforge-gallery-favorites';
const CHANGE_EVENT = 'avatarforge:favorites-changed';

/** Read the current favorite image srcs (newest first). */
export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

/** True when the given image src is currently favorited. */
export function isFavorite(src: string): boolean {
  return getFavorites().includes(src);
}

/** Toggle a favorite; returns the new favorited state for that item. */
export function toggleFavorite(src: string): boolean {
  const current = getFavorites();
  const next = current.includes(src)
    ? current.filter((s) => s !== src)
    : [src, ...current];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { count: next.length } }));
  } catch {
    /* storage unavailable — favorites simply won't persist this visit */
  }
  return next.includes(src);
}

/** Subscribe to favorite changes. Returns an unsubscribe function. */
export function subscribeFavorites(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}
