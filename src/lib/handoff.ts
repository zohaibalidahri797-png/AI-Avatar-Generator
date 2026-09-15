/**
 * One-time image hand-off between tools (Photo Editor ⇄ AI Avatar Generator).
 * The image stays in the user's browser (sessionStorage) and is consumed once.
 */

export const HANDOFF_KEY = 'avatarforge-image-handoff';

export function stashHandoff(dataUrl: string): void {
  try {
    window.sessionStorage.setItem(HANDOFF_KEY, dataUrl);
  } catch {
    /* storage full or unavailable — hand-off silently skipped */
  }
}

export function takeHandoff(): string | null {
  try {
    const value = window.sessionStorage.getItem(HANDOFF_KEY);
    if (value) window.sessionStorage.removeItem(HANDOFF_KEY);
    return value;
  } catch {
    return null;
  }
}
