'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  BookmarkCheck,
  BookmarkPlus,
  Check,
  ChevronsLeftRight,
  ChevronDown,
  Copy,
  Dices,
  Download,
  Eye,
  FileDown,
  FileUp,
  History,
  ImagePlus,
  Images,
  Layers,
  Loader2,
  Palette,
  Play,
  RefreshCw,
  RotateCcw,
  Save,
  Share2,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  X,
} from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { takeHandoff, stashHandoff } from '@/lib/handoff';
import {
  loadStylePresets,
  persistStylePresets,
  presetLabel,
  presetSignature,
  STYLE_PRESET_LIMIT,
  type StylePreset,
} from '@/lib/style-presets';
import {
  getCollection,
  saveToCollection as persistToCollection,
  type SavedAvatar,
} from '@/lib/collection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  BACKGROUND_OPTIONS,
  EXPRESSION_OPTIONS,
  FRAMING_OPTIONS,
  LIGHTING_OPTIONS,
  STYLE_GROUPS,
  suggestedFilename,
  type Framing,
} from '@/lib/avatar-styles';

/* ---------------------------------- helpers ---------------------------------- */

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

/** One-click export sizes for popular platforms (PRD §45 download options). */
interface ExportPreset {
  platform: string;
  size: number;
  framing: Framing;
  note: string;
}

const EXPORT_PRESETS: ExportPreset[] = [
  { platform: 'YouTube', size: 800, framing: 'Square', note: 'Channel avatar' },
  { platform: 'Discord', size: 512, framing: 'Circle', note: 'User PFP' },
  { platform: 'Instagram', size: 1080, framing: 'Square', note: 'Profile photo' },
  { platform: 'X / Twitter', size: 400, framing: 'Square', note: 'Profile photo' },
  { platform: 'WhatsApp', size: 640, framing: 'Square', note: 'Profile photo' },
  { platform: 'LinkedIn', size: 800, framing: 'Square', note: 'Profile photo' },
];

const MAX_BATCH = 3;

interface UploadedImage {
  dataUrl: string; // downscaled working copy sent to the API
  previewUrl: string; // full data URL for preview
  name: string;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('load-error'));
    img.src = src;
  });
}

/** Downscale huge uploads client-side so generation stays fast and private. */
async function prepareImage(file: File): Promise<UploadedImage> {
  const previewUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('read-error'));
    reader.readAsDataURL(file);
  });
  const img = await loadImage(previewUrl);
  const max = 1024;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  if (scale >= 1) {
    return { dataUrl: previewUrl, previewUrl, name: file.name };
  }
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return { dataUrl: previewUrl, previewUrl, name: file.name };
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return { dataUrl: canvas.toDataURL('image/jpeg', 0.92), previewUrl, name: file.name };
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Apply the chosen framing (square / portrait / circle / rounded) to the generated avatar. */
async function renderFramed(
  dataUrl: string,
  framing: Framing,
  opts: { target?: number; mime?: 'image/png' | 'image/jpeg'; quality?: number } = {}
): Promise<{ blob: Blob; url: string }> {
  const { target = 1024, mime = 'image/png', quality } = opts;
  const img = await loadImage(dataUrl);
  const scaleOut = target / 1024;
  const w = Math.round((framing === 'Portrait' ? 864 : 1024) * scaleOut);
  const h = Math.round((framing === 'Portrait' ? 1152 : 1024) * scaleOut);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas-error');
  ctx.clearRect(0, 0, w, h);

  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;

  if (framing === 'Circle') {
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  } else if (framing === 'Rounded') {
    ctx.save();
    roundRectPath(ctx, 0, 0, w, h, Math.round(64 * scaleOut));
    ctx.clip();
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('blob-error'))), mime, quality)
  );
  return { blob, url: canvas.toDataURL(mime) };
}

/* --------------------------------- component --------------------------------- */

interface AvatarStudioProps {
  initialStyleGroup?: string;
  initialSubstyle?: string;
}

interface HistoryEntry {
  id: string;
  raw: string; // raw generated image data URL
  url: string; // framed preview data URL
  blob: Blob; // framed PNG blob at 1024
  label: string;
  groupId: string; // style family the label belongs to (keeps names/labels right on restore)
  framing: Framing;
}

interface BatchSelection {
  groupId: string;
  substyle: string;
}

interface BatchItem {
  key: string;
  groupId: string;
  groupLabel: string;
  substyle: string;
  raw: string | null;
  url: string | null;
  blob: Blob | null;
  framing: Framing;
  state: 'pending' | 'done' | 'error';
}

const STATUS_STAGES = [
  'Analyzing your photo…',
  'Applying your chosen style…',
  'Rendering details…',
  'Finishing your avatar…',
];

/** Cheap, stable fingerprint of a generated image (used to mark saved avatars). */
function signature(raw: string): string {
  return `${raw.length}:${raw.slice(-48)}`;
}

export default function AvatarStudio({ initialStyleGroup, initialSubstyle }: AvatarStudioProps) {
  const { toast } = useToast();
  const { navigate } = useRouter();

  // Step 1 — upload
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const comboImportInputRef = useRef<HTMLInputElement>(null);

  // Step 2 — style
  const [groupId, setGroupId] = useState(initialStyleGroup || 'realistic');
  const [substyle, setSubstyle] = useState<string | null>(initialSubstyle || null);

  // Step 3 — customization
  const [background, setBackground] = useState('Studio');
  const [lighting, setLighting] = useState('Studio');
  const [expression, setExpression] = useState('Friendly');
  const [framing, setFraming] = useState<Framing>('Square');

  // Step 4 — generation
  const [status, setStatus] = useState<'idle' | 'generating' | 'done' | 'error'>('idle');
  const [statusStage, setStatusStage] = useState(0);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [resultRaw, setResultRaw] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number>(1024);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Batch style exploration (compare up to 3 styles in one run)
  const [compareMode, setCompareMode] = useState(false);
  const [batch, setBatch] = useState<BatchSelection[]>([]);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [stylePresets, setStylePresets] = useState<StylePreset[]>([]);
  const [canShare, setCanShare] = useState(false);
  const [previewMode, setPreviewMode] = useState<'result' | 'compare'>('result');
  const [savedSignatures, setSavedSignatures] = useState<Set<string>>(new Set());
  const [collectionCount, setCollectionCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const stageTimerRef = useRef<number | null>(null);
  const previewRef = useRef<HTMLElement | null>(null);
  const tryGenerateRef = useRef<() => void>(() => {});

  // Apply preset from landing pages when it arrives
  useEffect(() => {
    if (initialStyleGroup) setGroupId(initialStyleGroup);
    if (initialSubstyle) setSubstyle(initialSubstyle);
  }, [initialStyleGroup, initialSubstyle]);

  // Web Share availability (client-only)
  useEffect(() => {
    setCanShare('share' in navigator && 'canShare' in navigator);
    setStylePresets(loadStylePresets());
  }, []);

  // Load saved-avatar fingerprints + collection size (client-only)
  useEffect(() => {
    getCollection().then((items) => {
      setSavedSignatures(new Set(items.map((a) => signature(a.rawUrl))));
      setCollectionCount(items.length);
    });
  }, []);

  // One-time image hand-off from the Photo Editor
  useEffect(() => {
    const handoff = takeHandoff();
    if (!handoff || !handoff.startsWith('data:image/')) return;
    loadImage(handoff)
      .then(() => {
        setImage({ dataUrl: handoff, previewUrl: handoff, name: 'edited-image' });
        toast({ title: 'Image loaded from the Photo Editor', description: 'Pick a style and generate your avatar.' });
      })
      .catch(() => {
        /* corrupt hand-off — ignore */
      });
  }, []);

  // Keep the framed preview in sync when framing changes after generation
  useEffect(() => {
    if (!resultRaw) return;
    let cancelled = false;
    renderFramed(resultRaw, framing)
      .then((framed) => {
        if (!cancelled) setResult(framed);
      })
      .catch(() => {
        /* keep previous preview */
      });
    return () => {
      cancelled = true;
    };
  }, [resultRaw, framing]);

  const group = useMemo(() => STYLE_GROUPS.find((g) => g.id === groupId) ?? STYLE_GROUPS[0], [groupId]);

  const handleFile = useCallback(
    async (file: File | undefined | null) => {
      if (!file) return;
      setUploadError(null);
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError('Please upload a JPG, PNG, or WebP image.');
        return;
      }
      if (file.size > MAX_SIZE) {
        setUploadError('That image is too large. Please choose a smaller image.');
        return;
      }
      try {
        const prepared = await prepareImage(file);
        setImage(prepared);
        setResult(null);
        setStatus('idle');
      } catch {
        setUploadError('We could not read that image. Please try a different file.');
      }
    },
    []
  );

  const removeImage = () => {
    setImage(null);
    setResult(null);
    setResultRaw(null);
    setStatus('idle');
    setGenerateError(null);
    setBatch([]);
    setBatchItems([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startStageTicker = () => {
    setStatusStage(0);
    if (stageTimerRef.current) window.clearInterval(stageTimerRef.current);
    stageTimerRef.current = window.setInterval(() => {
      setStatusStage((s) => (s + 1) % STATUS_STAGES.length);
    }, 5000);
  };

  const stopStageTicker = () => {
    if (stageTimerRef.current) {
      window.clearInterval(stageTimerRef.current);
      stageTimerRef.current = null;
    }
  };

  useEffect(() => stopStageTicker, []);

  const generate = useCallback(async () => {
    if (!image) {
      setUploadError('Please upload an image to continue.');
      return;
    }
    if (!substyle) return;

    setStatus('generating');
    setGenerateError(null);
    setResult(null);
    startStageTicker();

    const bg = BACKGROUND_OPTIONS.find((o) => o.name === background)?.prompt ?? '';
    const light = LIGHTING_OPTIONS.find((o) => o.name === lighting)?.prompt ?? '';
    const expr = EXPRESSION_OPTIONS.find((o) => o.name === expression)?.prompt ?? '';

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: image.dataUrl,
          group: group.label,
          style: substyle,
          background: bg,
          lighting: light,
          expression: expr,
        }),
        signal: controller.signal,
      });
      const data = (await res.json()) as { image?: string; error?: string };
      if (!res.ok || !data.image) {
        throw new Error(data.error || 'Something went wrong while creating your avatar. Please try again.');
      }
      const framed = await renderFramed(data.image, framing);
      setResult(framed);
      setResultRaw(data.image);
      setHistory((prev) =>
        [
          {
            id: `${Date.now()}`,
            raw: data.image as string,
            url: framed.url,
            blob: framed.blob,
            label: substyle ?? 'avatar',
            groupId: groupId,
            framing,
          },
          ...prev,
        ].slice(0, 6)
      );
      setStatus('done');
      toast({ title: 'Your avatar is ready.', description: 'Download it or generate another style.' });
      // On mobile the preview sits below the steps — bring the fresh result into view.
      try {
        if (window.matchMedia('(max-width: 1023px)').matches) {
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          previewRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        }
      } catch {
        /* matchMedia unavailable — skip the nicety */
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setStatus('idle');
      } else {
        setStatus('error');
        setGenerateError('Something went wrong while creating your avatar. Please try again.');
      }
    } finally {
      stopStageTicker();
      abortRef.current = null;
    }
  }, [image, substyle, background, lighting, expression, framing, groupId, group.label, toast]);

  const cancel = () => {
    abortRef.current?.abort();
  };

  /** Make a finished batch item the active single result (all actions work on it). */
  const activateBatchItem = (item: BatchItem) => {
    if (!item.raw || !item.url || !item.blob) return;
    // Adopt the item's style so downloads, saves and labels name it correctly.
    setGroupId(item.groupId);
    setSubstyle(item.substyle);
    setResultRaw(item.raw);
    setFraming(item.framing);
    setResult({ blob: item.blob, url: item.url });
    setStatus('done');
    setGenerateError(null);
  };

  /** Generate every style in the batch queue sequentially, then compare. */
  const generateBatch = useCallback(async (overrideBatch?: BatchSelection[]) => {
    const queueSource = overrideBatch ?? batch;
    if (!image || queueSource.length === 0) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setBatchRunning(true);

    const bg = BACKGROUND_OPTIONS.find((o) => o.name === background)?.prompt ?? '';
    const light = LIGHTING_OPTIONS.find((o) => o.name === lighting)?.prompt ?? '';
    const expr = EXPRESSION_OPTIONS.find((o) => o.name === expression)?.prompt ?? '';

    const queue: BatchItem[] = queueSource.map((b) => {
      const g = STYLE_GROUPS.find((x) => x.id === b.groupId);
      return {
        key: `${b.groupId}:${b.substyle}`,
        groupId: b.groupId,
        groupLabel: g?.label ?? b.groupId,
        substyle: b.substyle,
        raw: null,
        url: null,
        blob: null,
        framing,
        state: 'pending',
      };
    });
    setBatchItems(queue);

    let succeeded = 0;
    for (const item of queue) {
      if (controller.signal.aborted) break;
      try {
        const res = await fetch('/api/generate-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: image.dataUrl,
            group: item.groupLabel,
            style: item.substyle,
            background: bg,
            lighting: light,
            expression: expr,
          }),
          signal: controller.signal,
        });
        const data = (await res.json()) as { image?: string; error?: string };
        if (!res.ok || !data.image) {
          throw new Error(data.error || 'generation-failed');
        }
        const framed = await renderFramed(data.image, item.framing);
        const doneItem: BatchItem = {
          ...item,
          raw: data.image,
          url: framed.url,
          blob: framed.blob,
          state: 'done',
        };
        setBatchItems((prev) => prev.map((p) => (p.key === item.key ? doneItem : p)));
        setHistory((prev) =>
          [
            {
              id: `${Date.now()}-${item.key}`,
              raw: data.image as string,
              url: framed.url,
              blob: framed.blob,
              label: item.substyle,
              groupId: item.groupId,
              framing: item.framing,
            },
            ...prev,
          ].slice(0, 6)
        );
        succeeded += 1;
        activateBatchItem(doneItem);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') break;
        setBatchItems((prev) =>
          prev.map((p) => (p.key === item.key ? { ...p, state: 'error' } : p))
        );
      }
    }

    setBatchRunning(false);
    abortRef.current = null;
    if (!controller.signal.aborted) {
      const failed = queue.length - succeeded;
      if (succeeded > 0 && failed === 0) {
        toast({
          title: `${succeeded} ${succeeded === 1 ? 'style' : 'styles'} ready`,
          description: 'Tap a result below to compare, then download your favorite.',
        });
      } else if (succeeded > 0 && failed > 0) {
        toast({
          title: `${succeeded} ready, ${failed} failed`,
          description: 'Styles that failed can be retried individually.',
        });
      } else {
        toast({ title: 'Generation failed', description: 'Something went wrong while creating your avatar. Please try again.' });
      }
    }
  }, [image, batch, background, lighting, expression, framing, toast]);

  const toggleCompareMode = () => {
    setCompareMode((on) => {
      if (on) {
        setBatch([]);
        setBatchItems([]);
      }
      return !on;
    });
  };

  const toggleBatchStyle = (groupId: string, substyle: string) => {
    setBatch((prev) => {
      const exists = prev.some((b) => b.groupId === groupId && b.substyle === substyle);
      if (exists) return prev.filter((b) => !(b.groupId === groupId && b.substyle === substyle));
      if (prev.length >= MAX_BATCH) {
        toast({
          title: `Compare up to ${MAX_BATCH} styles`,
          description: 'Remove a selected style first, then add another.',
        });
        return prev;
      }
      return [...prev, { groupId, substyle }];
    });
  };

  /* ---------------------- saved style combos (localStorage) ---------------------- */

  const updatePresets = (next: StylePreset[]) => {
    setStylePresets(next);
    persistStylePresets(next);
  };

  const saveBatchPreset = () => {
    if (batch.length === 0) return;
    const sig = presetSignature(batch);
    if (stylePresets.some((p) => presetSignature(p.selections) === sig)) {
      toast({
        title: 'Combo already saved',
        description: 'This style combination is already in your saved list.',
      });
      return;
    }
    const entry: StylePreset = {
      id: `preset-${Date.now()}`,
      selections: batch.map((s) => ({ ...s })),
      createdAt: Date.now(),
    };
    updatePresets([entry, ...stylePresets].slice(0, STYLE_PRESET_LIMIT));
    toast({
      title: 'Combo saved',
      description: 'Find it under Saved combos — kept in this browser only.',
    });
  };

  const applyPreset = (preset: StylePreset) => {
    if (batchRunning) return;
    setCompareMode(true);
    setBatch(preset.selections.map((s) => ({ ...s })));
    setBatchItems([]);
    toast({
      title: `Combo loaded: ${presetLabel(preset.selections)}`,
      description: `Press Generate to create ${preset.selections.length === 1 ? 'it' : 'all of them'}.`,
    });
  };

  /** One click: load a saved combo AND immediately run the batch (needs a photo). */
  const runPreset = (preset: StylePreset) => {
    if (batchRunning || status === 'generating') return;
    const selections = preset.selections.map((s) => ({ ...s }));
    if (!image) {
      setCompareMode(true);
      setBatch(selections);
      setBatchItems([]);
      toast({
        title: 'Upload a photo first',
        description: 'The combo is loaded — add your photo, then press Generate.',
      });
      return;
    }
    setCompareMode(true);
    setBatch(selections);
    setBatchItems([]);
    toast({
      title: `Running combo: ${presetLabel(selections)}`,
      description: `Generating ${selections.length === 1 ? '1 style' : `${selections.length} styles`} one by one.`,
    });
    void generateBatch(selections);
  };

  /**
   * Every selection across all saved combos, de-duplicated and in saved order.
   * Powers the "Run all" button — one sequential run through everything saved.
   */
  const allComboSelections = useMemo(() => {
    const seen = new Set<string>();
    const queue: BatchSelection[] = [];
    for (const preset of stylePresets) {
      for (const sel of preset.selections) {
        const key = `${sel.groupId}:${sel.substyle}`;
        if (!seen.has(key)) {
          seen.add(key);
          queue.push({ ...sel });
        }
      }
    }
    return queue;
  }, [stylePresets]);

  /** Two-step confirmation for long runs — honest about the ~15 s per style cost. */
  const [confirmRunAll, setConfirmRunAll] = useState(false);
  useEffect(() => {
    if (!confirmRunAll) return;
    const t = window.setTimeout(() => setConfirmRunAll(false), 6000);
    return () => window.clearTimeout(t);
  }, [confirmRunAll]);

  const runAllPresets = () => {
    if (batchRunning || status === 'generating' || allComboSelections.length === 0) return;
    if (allComboSelections.length > 6 && !confirmRunAll) {
      setConfirmRunAll(true);
      return;
    }
    setConfirmRunAll(false);
    if (!image) {
      setCompareMode(true);
      setBatch(allComboSelections);
      setBatchItems([]);
      toast({
        title: 'Upload a photo first',
        description: 'All your combos are loaded — add a photo, then press Run all again.',
      });
      return;
    }
    const minutes = Math.max(1, Math.round((allComboSelections.length * 15) / 60));
    setCompareMode(true);
    setBatch(allComboSelections);
    setBatchItems([]);
    toast({
      title: `Running all ${stylePresets.length} ${stylePresets.length === 1 ? 'combo' : 'combos'}`,
      description: `Generating ${allComboSelections.length} styles one by one — roughly ${minutes} min. Cancel any time.`,
    });
    void generateBatch(allComboSelections);
  };

  const deletePreset = (id: string) => {
    updatePresets(stylePresets.filter((p) => p.id !== id));
  };

  /* ------------------- combo export / import (JSON file) ------------------- */

  const exportCombos = () => {
    if (stylePresets.length === 0) {
      toast({ title: 'No combos to export yet', description: 'Save a style combination first.' });
      return;
    }
    const payload = {
      format: 'avatarforge-combos',
      version: 1,
      exportedAt: new Date().toISOString(),
      combos: stylePresets.map((p) => ({
        id: p.id,
        selections: p.selections,
        createdAt: p.createdAt,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'avatarforge-combos.json';
    anchor.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Combos exported',
      description: `${stylePresets.length} ${stylePresets.length === 1 ? 'combo' : 'combos'} saved to avatarforge-combos.json.`,
    });
  };

  const isValidSelection = (value: unknown): boolean => {
    if (!value || typeof value !== 'object') return false;
    const sel = value as { groupId?: unknown; substyle?: unknown };
    if (typeof sel.groupId !== 'string' || typeof sel.substyle !== 'string') return false;
    return STYLE_GROUPS.some(
      (g) => g.id === sel.groupId && g.substyles.some((s) => s.name === sel.substyle)
    );
  };

  const importCombos = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text) as unknown;
      const incoming = Array.isArray(data)
        ? data
        : (data as { combos?: unknown[] })?.combos;
      if (!Array.isArray(incoming)) throw new Error('bad-shape');

      const valid = incoming.filter(
        (p): p is StylePreset =>
          Boolean(p) &&
          typeof (p as StylePreset).id === 'string' &&
          Array.isArray((p as StylePreset).selections) &&
          (p as StylePreset).selections.length > 0 &&
          (p as StylePreset).selections.every(isValidSelection)
      );
      if (valid.length === 0) {
        toast({
          title: 'No valid combos found',
          description: 'That file does not contain AvatarForge style combinations.',
        });
        return;
      }

      const existing = new Set(stylePresets.map((p) => presetSignature(p.selections)));
      const merged = [...stylePresets];
      let added = 0;
      for (const preset of valid) {
        const sig = presetSignature(preset.selections);
        if (existing.has(sig)) continue;
        existing.add(sig);
        merged.push({
          id: `preset-${preset.createdAt || Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          selections: preset.selections.map((s) => ({ ...s })),
          createdAt: preset.createdAt || Date.now(),
        });
        added += 1;
        if (merged.length >= STYLE_PRESET_LIMIT) break;
      }
      updatePresets(merged.slice(0, STYLE_PRESET_LIMIT));
      const skipped = valid.length - added;
      toast({
        title: `${added} ${added === 1 ? 'combo' : 'combos'} imported`,
        description: added === 0
          ? 'They were all already in your saved list.'
          : skipped > 0
            ? `${skipped} duplicate${skipped === 1 ? '' : 's'} skipped.`
            : 'Ready to run from Saved combos.',
      });
    } catch {
      toast({
        title: 'Import failed',
        description: 'That file could not be read. Use a file exported from AvatarForge.',
      });
    }
  };

  const openImportPicker = () => comboImportInputRef.current?.click();

  const surpriseMe = () => {
    const g = STYLE_GROUPS[Math.floor(Math.random() * STYLE_GROUPS.length)];
    const s = g.substyles[Math.floor(Math.random() * g.substyles.length)];
    setGroupId(g.id);
    setSubstyle(s.name);
    if (compareMode) toggleCompareMode();
    toast({
      title: `Surprise style: ${s.name}`,
      description: `From the ${g.label} family — press Generate when you're ready.`,
    });
  };

  const applyExportPreset = (preset: ExportPreset) => {
    setOutputSize(preset.size);
    setFraming(preset.framing);
    setActivePreset(preset.platform);
  };

  const download = async () => {
    if (!resultRaw) return;
    try {
      const { blob } = await renderFramed(resultRaw, framing, { target: outputSize });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedFilename(groupId, substyle ?? 'avatar').replace(
        /\.png$/,
        `-${outputSize}px.png`
      );
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: 'Download failed', description: 'Please try again.' });
    }
  };

  const shareResult = async () => {
    if (!result) return;
    const filename = suggestedFilename(groupId, substyle ?? 'avatar');
    const file = new File([result.blob], filename, { type: 'image/png' });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My AI avatar',
          text: 'Created with AvatarForge — free AI avatar generator.',
        });
      } else {
        await copyResult();
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        toast({ title: 'Sharing canceled', description: 'The image was not shared.' });
      }
    }
  };

  const openInEditor = () => {
    if (!resultRaw) return;
    renderFramed(resultRaw, framing, { target: 512 })
      .then((framed) => {
        stashHandoff(framed.url);
        navigate('/ai-avatar-photo-editor');
      })
      .catch(() => {
        toast({ title: 'Could not open the editor', description: 'Please try again.' });
      });
  };

  const restoreHistory = (entry: HistoryEntry) => {
    setGroupId(entry.groupId);
    setSubstyle(entry.label);
    setResultRaw(entry.raw);
    setFraming(entry.framing);
    setResult({ blob: entry.blob, url: entry.url });
    setStatus('done');
    setGenerateError(null);
  };

  const saveCurrent = async () => {
    if (!result || !resultRaw) return;
    const entry: SavedAvatar = {
      id: `av-${Date.now()}`,
      dataUrl: result.url,
      rawUrl: resultRaw,
      styleGroupLabel: group.label,
      substyle: substyle ?? 'avatar',
      framing,
      createdAt: Date.now(),
      sortOrder: Date.now(), // new saves land at the top of My Avatars
    };
    try {
      await persistToCollection(entry);
      setSavedSignatures((prev) => new Set(prev).add(signature(resultRaw)));
      setCollectionCount((c) => Math.min(c + 1, 24));
      toast({
        title: 'Saved to My Avatars',
        description: 'Kept privately in this browser — find it any time from the generator.',
      });
    } catch {
      toast({ title: 'Could not save', description: 'Local storage is unavailable. Try downloading instead.' });
    }
  };

  const currentSaved = Boolean(resultRaw && savedSignatures.has(signature(resultRaw)));

  const copyResult = async () => {
    if (!result) return;
    try {
      const item = new ClipboardItem({ 'image/png': result.blob });
      await navigator.clipboard.write([item]);
      toast({ title: 'Copied to clipboard', description: 'Paste your avatar anywhere you like.' });
    } catch {
      toast({ title: 'Copy not supported', description: 'Your browser blocked clipboard access. Use Download instead.' });
    }
  };

  const startOver = () => {
    removeImage();
    setSubstyle(null);
    setBackground('Studio');
    setLighting('Studio');
    setExpression('Friendly');
    setFraming('Square');
  };

  const canGenerate =
    Boolean(image && (compareMode ? batch.length > 0 : substyle)) &&
    status !== 'generating' &&
    !batchRunning;

  const showBatchGrid = batchRunning || (compareMode && batchItems.length > 0);

  /**
   * The exact instruction the server will send to the AI for the current
   * selections — kept in sync with buildPrompt() in the generate-avatar API
   * so the transparency panel never shows something different from reality.
   */
  const promptPreview = useMemo(() => {
    const optPrompt = (list: typeof BACKGROUND_OPTIONS, name: string) =>
      list.find((o) => o.name === name)?.prompt ?? '';
    const build = (styleName: string) =>
      [
        `Transform this photo into a ${styleName}: an AI avatar portrait of the same person`,
        optPrompt(BACKGROUND_OPTIONS, background),
        optPrompt(LIGHTING_OPTIONS, lighting),
        optPrompt(EXPRESSION_OPTIONS, expression),
        'head-and-shoulders composition, centered profile-picture framing',
        'keep the person clearly recognizable, natural result, high quality, detailed',
      ]
        .filter(Boolean)
        .join(', ');
    return compareMode
      ? batch.map((b) => build(b.substyle))
      : [build(substyle ?? '')];
  }, [background, lighting, expression, compareMode, batch, substyle]);

  // Keep a ref to the latest trigger so the keyboard shortcut always uses fresh state.
  tryGenerateRef.current = () => {
    if (!canGenerate) return;
    void (compareMode ? generateBatch() : generate());
  };

  // Ctrl/Cmd + Enter generates from anywhere inside the studio.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        tryGenerateRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  /* --------------------------------- render --------------------------------- */

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* Left: steps */}
      <div className="min-w-0 space-y-6">
        {/* Hidden input for importing saved combos (JSON) — always mounted so both the empty-state link and the combos card can open it */}
        <input
          ref={comboImportInputRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void importCombos(file);
            e.target.value = '';
          }}
        />
        {/* Step 1 — Upload */}
        <section aria-labelledby="step-1" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-sm font-bold text-white">
              1
            </span>
            <h2 id="step-1" className="text-lg font-bold tracking-tight">
              Upload your photo
            </h2>
          </div>

          {!image ? (
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload an image — click or drag and drop"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                void handleFile(e.dataTransfer.files?.[0]);
              }}
              className={cn(
                'mt-4 flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/40 p-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                dragOver && 'dropzone-active bg-accent'
              )}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
                <ImagePlus className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-medium">Drag &amp; drop your photo here</p>
                <p className="mt-1 text-sm text-muted-foreground">or click to browse — JPG, PNG or WebP, up to 10 MB</p>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-4 rounded-xl border bg-muted/40 p-4">
              <img
                src={image.previewUrl}
                alt="Uploaded photo preview"
                className="h-20 w-20 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{image.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Ready for generation</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Replace
                  </Button>
                  <Button size="sm" variant="outline" onClick={removeImage}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Remove
                  </Button>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-label="Upload photo file"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />

          {uploadError && (
            <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {uploadError}
            </p>
          )}
        </section>

        {/* Step 2 — Style */}
        <section aria-labelledby="step-2" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-sm font-bold text-white">
              2
            </span>
            <h2 id="step-2" className="text-lg font-bold tracking-tight">
              Choose an avatar style
            </h2>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={toggleCompareMode}
                aria-pressed={compareMode}
                title="Queue up to 3 styles and generate them one after another"
                className={cn(
                  'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  compareMode
                    ? 'border-primary bg-accent text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                )}
              >
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                Compare styles
              </button>
              <button
                type="button"
                onClick={surpriseMe}
                title="Pick a random style for me"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Dices className="h-3.5 w-3.5" aria-hidden="true" />
                Surprise me
              </button>
            </div>
          </div>
          {compareMode && (
            <p className="mt-3 rounded-lg border border-primary/25 bg-accent/60 px-3 py-2 text-xs leading-relaxed text-primary">
              <span className="font-semibold">Compare mode:</span> tap up to {MAX_BATCH} styles — they get a number
              badge. Generate runs them one by one so you can pick the best result.
            </p>
          )}
          {compareMode && batch.length > 0 && !batchRunning && (
            <button
              type="button"
              onClick={saveBatchPreset}
              className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save this combo
            </button>
          )}
          {compareMode && batch.length > 0 && !batchRunning && stylePresets.length === 0 && (
            <button
              type="button"
              onClick={openImportPicker}
              className="mt-1.5 inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
              Have combos from another device? Import a saved file
            </button>
          )}
          {stylePresets.length > 0 && (
            <div className="mt-3 rounded-xl border bg-muted/40 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Save className="h-3.5 w-3.5" aria-hidden="true" />
                  Saved combos
                </p>
                <div className="flex items-center gap-1">
                  <span className="mr-1 text-[11px] text-muted-foreground">Stored in this browser</span>
                  <button
                    type="button"
                    onClick={runAllPresets}
                    disabled={batchRunning || status === 'generating' || allComboSelections.length === 0}
                    title={`Run every saved combo now — generates ${allComboSelections.length} ${
                      allComboSelections.length === 1 ? 'style' : 'styles'
                    } in sequence`}
                    aria-label={`Run all saved combos now (${allComboSelections.length} styles in sequence)`}
                    className={cn(
                      'mr-1 inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40',
                      confirmRunAll
                        ? 'bg-primary text-primary-foreground'
                        : 'text-primary hover:bg-background'
                    )}
                  >
                    <Play className="h-3 w-3" aria-hidden="true" />
                    {confirmRunAll
                      ? `Confirm ${allComboSelections.length} styles?`
                      : `Run all (${allComboSelections.length})`}
                  </button>
                  <button
                    type="button"
                    onClick={exportCombos}
                    title="Export saved combos as a JSON file"
                    aria-label="Export saved combos as a JSON file"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={openImportPicker}
                    title="Import combos from an exported JSON file"
                    aria-label="Import combos from an exported JSON file"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {stylePresets.map((preset) => (
                  <span
                    key={preset.id}
                    className="inline-flex items-center overflow-hidden rounded-full border bg-background transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring"
                  >
                    <button
                      type="button"
                      onClick={() => applyPreset(preset)}
                      title={`Load combo: ${presetLabel(preset.selections)}`}
                      className="max-w-[180px] truncate px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:text-primary sm:max-w-[240px]"
                    >
                      {presetLabel(preset.selections)}
                    </button>
                    <button
                      type="button"
                      onClick={() => runPreset(preset)}
                      disabled={batchRunning || status === 'generating'}
                      title={`Run this combo now — generates ${
                        preset.selections.length === 1 ? 'it' : 'all of them'
                      } in sequence`}
                      aria-label={`Run combo now: ${presetLabel(preset.selections)}`}
                      className="flex h-8 w-7 shrink-0 items-center justify-center border-l border-border text-primary transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Play className="h-3 w-3" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePreset(preset.id)}
                      aria-label={`Delete combo: ${presetLabel(preset.selections)}`}
                      className="h-8 w-8 shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <X className="mx-auto h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                Click a name to load it, or press <Play aria-hidden="true" className="inline h-2.5 w-2.5" /> to
                generate the whole combo right away (your photo must be uploaded first).{' '}
                <strong className="font-semibold text-foreground">Run all</strong> queues every saved combo in one
                go.
              </p>
            </div>
          )}

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Avatar style families">
            {STYLE_GROUPS.map((g) => (
              <button
                key={g.id}
                role="tab"
                aria-selected={groupId === g.id}
                onClick={() => {
                  setGroupId(g.id);
                  setSubstyle(null);
                }}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  groupId === g.id
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {group.substyles.map((s) => {
              const batchIndex = batch.findIndex((b) => b.groupId === group.id && b.substyle === s.name);
              const inBatch = compareMode && batchIndex >= 0;
              return (
                <button
                  key={s.name}
                  onClick={() => {
                    if (compareMode) {
                      toggleBatchStyle(group.id, s.name);
                    } else {
                      setSubstyle(s.name);
                    }
                  }}
                  aria-pressed={compareMode ? inBatch : substyle === s.name}
                  className={cn(
                    'flex min-h-11 items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    (compareMode ? inBatch : substyle === s.name)
                      ? 'border-primary bg-accent text-primary shadow-sm'
                      : 'border-border bg-background hover:border-primary/40 hover:bg-accent/50'
                  )}
                >
                  <span className="truncate">{s.name}</span>
                  {inBatch ? (
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                      aria-label={`Queued ${batchIndex + 1} of ${MAX_BATCH}`}
                    >
                      {batchIndex + 1}
                    </span>
                  ) : (
                    !compareMode &&
                    substyle === s.name && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 3 — Customize */}
        <section aria-labelledby="step-3" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-sm font-bold text-white">
              3
            </span>
            <h2 id="step-3" className="text-lg font-bold tracking-tight">
              Customize your avatar
            </h2>
          </div>

          <div className="mt-4 space-y-5">
            <OptionRow label="Background" options={BACKGROUND_OPTIONS.map((o) => o.name)} value={background} onChange={setBackground} />
            <OptionRow label="Lighting" options={LIGHTING_OPTIONS.map((o) => o.name)} value={lighting} onChange={setLighting} />
            <OptionRow label="Expression" options={EXPRESSION_OPTIONS.map((o) => o.name)} value={expression} onChange={setExpression} />
            <OptionRow
              label="Framing"
              options={[...FRAMING_OPTIONS]}
              value={framing}
              onChange={(v) => setFraming(v as Framing)}
            />
          </div>
        </section>

        {/* Generate */}
        <div className="rounded-2xl border bg-gradient-to-br from-accent to-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              disabled={!canGenerate}
              onClick={() => void (compareMode ? generateBatch() : generate())}
              className="w-full gap-2 bg-gradient-to-r from-primary to-fuchsia-500 text-base shadow-lg shadow-primary/25 hover:opacity-95 sm:w-auto"
            >
              {status === 'generating' || batchRunning ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  {batchRunning
                    ? `Generating ${batchItems.filter((i) => i.state === 'done').length + 1}/${batchItems.length}…`
                    : 'Generating…'}
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" aria-hidden="true" />
                  {compareMode
                    ? `Generate ${batch.length} ${batch.length === 1 ? 'style' : 'styles'}`
                    : 'Generate AI Avatar'}
                </>
              )}
            </Button>
            {status === 'generating' || batchRunning ? (
              <Button variant="outline" size="lg" onClick={cancel}>
                Cancel
              </Button>
            ) : (
              <Button variant="outline" size="lg" onClick={startOver}>
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                Start over
              </Button>
            )}
          </div>

          {!image && (
            <p className="mt-3 text-sm text-muted-foreground">Please upload an image to continue.</p>
          )}
          {image && !compareMode && !substyle && (
            <p className="mt-3 text-sm text-muted-foreground">Pick an avatar style to continue.</p>
          )}
          {image && compareMode && batch.length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              Pick at least one style to compare.
            </p>
          )}
          <p className="mt-2 hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
            <span>Power tip:</span>
            <kbd className="kbd">Ctrl</kbd>
            <span>+</span>
            <kbd className="kbd">Enter</kbd>
            <span>generates from anywhere on the page.</span>
          </p>
          {generateError && (
            <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {generateError}
            </p>
          )}
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Your photo is used only to generate your avatar and is never added to a public gallery. Generation usually
            takes 20–60 seconds.
          </p>

          {/* Transparency: show the exact instruction sent to the AI */}
          <Collapsible className="mt-4">
            <CollapsibleTrigger className="group flex w-full items-center gap-2 rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-left text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Eye className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="flex-1">See the exact instruction we send to the AI</span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                aria-hidden="true"
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {promptPreview.map((prompt, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/60 bg-background/80 p-3"
                >
                  {compareMode && (
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {batch[i]?.substyle ?? `Style ${i + 1}`}
                    </p>
                  )}
                  <p className="break-words font-mono text-xs leading-relaxed text-muted-foreground">
                    {prompt}
                  </p>
                </div>
              ))}
              <p className="text-xs leading-relaxed text-muted-foreground">
                Nothing hidden — this is exactly what your photo and the options above produce.
                Change a style or option and the instruction updates instantly.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Right: preview */}
      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <section
          ref={previewRef}
          aria-label="Avatar preview"
          className="scroll-mt-24 rounded-2xl border bg-card p-5 shadow-sm sm:p-6"
        >
          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Preview</h2>
            <div className="flex items-center gap-2">
              {result && image && (
                <div className="flex rounded-lg border border-border p-0.5" role="group" aria-label="Preview mode">
                  <button
                    onClick={() => setPreviewMode('result')}
                    aria-pressed={previewMode === 'result'}
                    className={cn(
                      'min-h-7 rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      previewMode === 'result'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Result
                  </button>
                  <button
                    onClick={() => setPreviewMode('compare')}
                    aria-pressed={previewMode === 'compare'}
                    className={cn(
                      'inline-flex min-h-7 items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      previewMode === 'compare'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <ChevronsLeftRight className="h-3 w-3" aria-hidden="true" />
                    Compare
                  </button>
                </div>
              )}
              {framing !== 'Portrait' ? (
                <Badge variant="secondary">1:1 · PNG</Badge>
              ) : (
                <Badge variant="secondary">4:5 · PNG</Badge>
              )}
            </div>
          </div>

          <div className="mt-4">
            {showBatchGrid ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Batch style results">
                {batchItems.map((item, idx) => (
                  <button
                    key={item.key}
                    onClick={() => item.state === 'done' && activateBatchItem(item)}
                    disabled={item.state !== 'done'}
                    aria-label={
                      item.state === 'done'
                        ? `Show ${item.substyle} result`
                        : item.state === 'error'
                          ? `${item.substyle} failed`
                          : `${item.substyle} generating`
                    }
                    className={cn(
                      'group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      item.state === 'done' && resultRaw &&
                        signature(item.raw ?? '') === signature(resultRaw)
                        ? 'border-primary shadow-md shadow-primary/20'
                        : 'border-border',
                      item.state === 'done' && 'cursor-pointer hover:border-primary/60'
                    )}
                  >
                    {item.state === 'done' && item.url ? (
                      <img
                        src={item.url}
                        alt={`${item.substyle} AI avatar result`}
                        className="h-full w-full object-cover"
                      />
                    ) : item.state === 'error' ? (
                      <>
                        <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
                        <span className="mt-2 px-2 text-center text-[11px] font-medium text-destructive">
                          Failed — retry in normal mode
                        </span>
                      </>
                    ) : (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
                        <span className="mt-2 px-2 text-center text-[11px] font-medium text-muted-foreground">
                          {idx === 0 || batchItems[idx - 1]?.state === 'done'
                            ? 'Generating…'
                            : 'Queued'}
                        </span>
                      </>
                    )}
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {idx + 1} · {item.substyle}
                    </span>
                    {item.state === 'done' && (
                      <span className="absolute inset-x-1.5 bottom-1.5 rounded-md bg-black/65 py-1 text-center text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Use this result
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : status === 'generating' ? (
              <div className="flex aspect-square flex-col items-center justify-center gap-4 rounded-2xl border bg-muted/40">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="px-6 text-center">
                  <p className="text-sm font-medium">{STATUS_STAGES[statusStage]}</p>
                  <p className="mt-1 text-xs text-muted-foreground">This usually takes 20–60 seconds</p>
                </div>
              </div>
            ) : result ? (
              previewMode === 'compare' && image ? (
                <CompareSlider
                  before={image.previewUrl}
                  after={result.url}
                  alt={`Generated ${substyle} AI avatar compared with the original photo`}
                />
              ) : (
                <img
                  key={resultRaw ?? 'result'}
                  src={result.url}
                  alt={`Generated ${substyle} AI avatar preview`}
                  className={cn(
                    'result-glow mx-auto aspect-square w-full rounded-2xl border object-cover',
                    framing === 'Circle' && 'rounded-full',
                    framing === 'Rounded' && 'rounded-[48px]'
                  )}
                />
              )
            ) : (
              <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-muted/30 p-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Sparkles className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="text-sm text-muted-foreground">
                  Your generated avatar will appear here — pick a style and press Generate.
                </p>
              </div>
            )}

            {/* Honest live progress for batch/combo runs (no fake percentages — real item states) */}
            {batchRunning && batchItems.length > 0 && (
              <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
                Generating{' '}
                <span className="font-semibold text-foreground">
                  {Math.min(batchItems.filter((i) => i.state === 'done').length + 1, batchItems.length)} of{' '}
                  {batchItems.length}
                </span>
                {batchItems.find((i) => i.state === 'pending')
                  ? ` — ${batchItems.find((i) => i.state === 'pending')!.substyle}`
                  : ''}
                . Results appear as they finish.
              </p>
            )}
          </div>

          {result && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">Download size</span>
                <div className="flex rounded-lg border border-border p-0.5" role="group" aria-label="Download size">
                  {([512, 1024] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setOutputSize(s);
                        setActivePreset(null);
                      }}
                      aria-pressed={outputSize === s && !activePreset}
                      className={cn(
                        'min-h-7 rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        outputSize === s && !activePreset
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {s}px
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Platform presets</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {EXPORT_PRESETS.map((p) => {
                    const active = activePreset === p.platform;
                    return (
                      <button
                        key={p.platform}
                        onClick={() => applyExportPreset(p)}
                        aria-pressed={active}
                        title={`${p.note} — ${p.size}×${p.size}px, ${p.framing.toLowerCase()} crop`}
                        className={cn(
                          'min-h-8 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                        )}
                      >
                        {p.platform}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {activePreset
                    ? `${activePreset}: ${outputSize}×${outputSize}px, ${framing.toLowerCase()} crop`
                    : 'One-click sizes for popular platforms, or use the sizes above.'}
                </p>
              </div>
              <Button
                className="btn-sheen w-full gap-2 bg-gradient-to-r from-primary to-fuchsia-500 shadow-md shadow-primary/25"
                onClick={() => void download()}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download avatar ({outputSize}px)
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => void copyResult()}>
                  <Copy className="mr-1.5 h-4 w-4" aria-hidden="true" /> Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void saveCurrent()}
                  aria-label={currentSaved ? 'Saved — save another copy' : 'Save to My Avatars'}
                  className={cn(currentSaved && 'border-primary/50 bg-accent text-primary hover:bg-accent')}
                >
                  {currentSaved ? (
                    <BookmarkCheck className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  ) : (
                    <BookmarkPlus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  )}
                  {currentSaved ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void (compareMode && batch.length > 0 ? generateBatch() : generate())}
                  disabled={status === 'generating' || batchRunning}
                >
                  <RefreshCw className="mr-1.5 h-4 w-4" aria-hidden="true" /> Again
                </Button>
                <Button variant="outline" onClick={openInEditor}>
                  <Palette className="mr-1.5 h-4 w-4" aria-hidden="true" /> Edit
                </Button>
                {canShare && (
                  <Button variant="outline" className="col-span-2" onClick={() => void shareResult()}>
                    <Share2 className="mr-1.5 h-4 w-4" aria-hidden="true" /> Share
                  </Button>
                )}
              </div>
              <p className="pt-1 text-center text-xs text-muted-foreground">
                Saved as <span className="font-mono">{suggestedFilename(groupId, substyle ?? 'avatar')}</span>
              </p>
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-5 border-t border-border/70 pt-4">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <History className="h-4 w-4 text-primary" aria-hidden="true" />
                  This session
                </p>
                <button
                  onClick={() => setHistory([])}
                  className="rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Clear
                </button>
              </div>
              <div className="mt-3 grid grid-cols-6 gap-2">
                {history.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => restoreHistory(h)}
                    title={`Restore ${h.label}`}
                    aria-label={`Restore ${h.label} avatar`}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <img
                      src={h.url}
                      alt={`${h.label} AI avatar`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-0.5 py-0.5 text-[8px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {h.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                Kept in memory for this session only — never uploaded anywhere.
              </p>
            </div>
          )}

          {(history.length > 0 || collectionCount > 0) && (
            <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
              <Link
                href="/my-avatars"
                className="inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Images className="h-4 w-4" aria-hidden="true" />
                My Avatars
                {collectionCount > 0 && (
                  <Badge variant="secondary" className="ml-0.5">
                    {collectionCount}
                  </Badge>
                )}
              </Link>
              <span className="text-[11px] text-muted-foreground">Saved in this browser</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* -------------------------------- subcomponents ------------------------------- */

/** Draggable before/after comparison view (original photo vs generated avatar). */
function CompareSlider({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(97, Math.max(3, pct)));
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border"
      onPointerDown={(e) => {
        draggingRef.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        draggingRef.current = false;
      }}
      onPointerCancel={() => {
        draggingRef.current = false;
      }}
    >
      {/* Generated avatar (full layer) */}
      <img src={after} alt={alt} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      {/* Original photo clipped to the left of the handle */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} aria-hidden="true">
        <img src={before} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      </div>

      {/* Divider + handle */}
      <div
        className="absolute inset-y-0 w-0.5 bg-white/90"
        style={{ left: `${pos}%` }}
        aria-hidden="true"
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Compare original photo and generated avatar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setPos((p) => Math.max(3, p - 4));
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            setPos((p) => Math.min(97, p + 4));
          } else if (e.key === 'Home') {
            e.preventDefault();
            setPos(3);
          } else if (e.key === 'End') {
            e.preventDefault();
            setPos(97);
          }
        }}
        className="compare-handle absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ left: `${pos}%` }}
      >
        <ChevronsLeftRight className="h-5 w-5" aria-hidden="true" />
      </div>

      {/* Corner labels */}
      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white">
        Before
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white">
        After
      </span>
    </div>
  );
}

function OptionRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={cn(
              'min-h-9 rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              value === opt
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
