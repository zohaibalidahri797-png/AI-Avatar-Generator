/**
 * Saved style combinations ("combos") for the batch/compare workflow.
 * Stored in localStorage only — never uploaded anywhere.
 */

export interface StylePresetSelection {
  groupId: string;
  substyle: string;
}

export interface StylePreset {
  id: string;
  selections: StylePresetSelection[];
  createdAt: number;
}

const KEY = 'avatarforge-style-presets';
const MAX_PRESETS = 6;

export function loadStylePresets(): StylePreset[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (p): p is StylePreset =>
          Boolean(p) &&
          typeof (p as StylePreset).id === 'string' &&
          Array.isArray((p as StylePreset).selections) &&
          (p as StylePreset).selections.length > 0
      )
      .slice(0, MAX_PRESETS);
  } catch {
    return [];
  }
}

export function persistStylePresets(presets: StylePreset[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(presets.slice(0, MAX_PRESETS)));
  } catch {
    /* storage unavailable — presets stay in memory for this session */
  }
}

/** Stable signature used to de-duplicate identical selections. */
export function presetSignature(selections: StylePresetSelection[]): string {
  return selections
    .map((s) => `${s.groupId}::${s.substyle}`)
    .sort()
    .join('|');
}

/** Human label for a combo, e.g. "Comic Avatar + Anime Avatar". */
export function presetLabel(selections: StylePresetSelection[]): string {
  return selections.map((s) => s.substyle).join(' + ');
}

export const STYLE_PRESET_LIMIT = MAX_PRESETS;
