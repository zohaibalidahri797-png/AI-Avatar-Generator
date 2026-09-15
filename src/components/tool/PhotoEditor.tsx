'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Contrast,
  Download,
  FlipHorizontal2,
  ImagePlus,
  RotateCcw,
  RotateCw,
  Sun,
  Palette,
  Trash2,
  Circle,
  Type,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from '@/lib/router';
import { stashHandoff, takeHandoff } from '@/lib/handoff';
import { cn } from '@/lib/utils';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;

/** Swatches for the text overlay — no blue/indigo, matching the site palette. */
const TEXT_COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Ink', value: '#221f26' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Amber', value: '#f59e0b' },
] as const;

type TextPosition = 'top' | 'center' | 'bottom';

interface EditorImage {
  el: HTMLImageElement;
  name: string;
}

type Format = 'image/png' | 'image/jpeg' | 'image/webp';

const EXT: Record<Format, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

export default function PhotoEditor() {
  const { toast } = useToast();
  const { navigate } = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [image, setImage] = useState<EditorImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [rotation, setRotation] = useState(0); // 0 | 90 | 180 | 270
  const [flipX, setFlipX] = useState(false);
  const [aspect, setAspect] = useState<'original' | '1:1' | '4:5'>('original');
  const [circleMask, setCircleMask] = useState(false);
  const [outWidth, setOutWidth] = useState('1024');
  const [format, setFormat] = useState<Format>('image/png');
  const [quality, setQuality] = useState(92);

  // Text overlay
  const [text, setText] = useState('');
  const [textSize, setTextSize] = useState(6); // % of canvas height
  const [textColor, setTextColor] = useState<string>(TEXT_COLORS[0].value);
  const [textPos, setTextPos] = useState<TextPosition>('bottom');

  const handleFile = useCallback(async (file: File | undefined | null) => {
    if (!file) return;
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('That image is too large. Please choose one under 10 MB.');
      return;
    }
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('read-error'));
        reader.readAsDataURL(file);
      });
      const el = new Image();
      await new Promise<void>((resolve, reject) => {
        el.onload = () => resolve();
        el.onerror = () => reject(new Error('load-error'));
        el.src = dataUrl;
      });
      setImage({ el, name: file.name });
    } catch {
      setError('We could not read that image. Please try a different file.');
    }
  }, []);

  const ratio = aspect === '1:1' || circleMask ? 1 : aspect === '4:5' ? 0.8 : null;

  /** Renders the current edit state onto a canvas of the given width. */
  const renderTo = useCallback(
    (canvas: HTMLCanvasElement, targetWidth: number) => {
      if (!image) return;
      const img = image.el;
      const rot = ((rotation % 360) + 360) % 360;
      const rw = rot % 180 === 0 ? img.width : img.height;
      const rh = rot % 180 === 0 ? img.height : img.width;

      let cropW = rw;
      let cropH = rh;
      if (ratio) {
        if (rw / rh > ratio) cropW = rh * ratio;
        else cropH = rw / ratio;
      }

      const w = Math.max(1, Math.min(targetWidth, Math.round(cropW)));
      const scale = w / cropW;
      const h = Math.max(1, Math.round(cropH * scale));

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      if (circleMask) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      }

      ctx.filter = `brightness(${1 + brightness / 100}) contrast(${1 + contrast / 100}) saturate(${1 + saturation / 100})`;
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(flipX ? -scale : scale, scale);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      // Text overlay — drawn last in final canvas space so it stays horizontal
      // no matter the rotation, and stays inside the circle mask when enabled.
      const clean = text.trim().slice(0, 60);
      if (clean) {
        const fontSize = Math.max(12, Math.round((textSize / 100) * h));
        ctx.save();
        ctx.font = `700 ${fontSize}px system-ui, -apple-system, 'Segoe UI', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        try {
          (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${Math.round(
            fontSize * 0.06
          )}px`;
        } catch {
          /* letterSpacing unsupported — default spacing is fine */
        }
        const pad = h * 0.07;
        const y = textPos === 'top' ? pad + fontSize / 2 : textPos === 'center' ? h / 2 : h - pad - fontSize / 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = Math.max(4, fontSize * 0.22);
        ctx.shadowOffsetY = Math.max(1, fontSize * 0.04);
        ctx.fillStyle = textColor;
        ctx.fillText(clean, w / 2, y, w * 0.9);
        ctx.restore();
      }
    },
    [image, rotation, flipX, ratio, brightness, contrast, saturation, circleMask, text, textSize, textColor, textPos]
  );

  // Live preview
  useEffect(() => {
    if (!image || !previewCanvasRef.current) return;
    renderTo(previewCanvasRef.current, 640);
  }, [image, renderTo]);

  // One-time image hand-off from the AI Avatar Generator (or a previous editor session)
  useEffect(() => {
    const handoff = takeHandoff();
    if (!handoff || !handoff.startsWith('data:image/')) return;
    const el = new Image();
    el.onload = () => {
      setImage({ el, name: 'edited-image' });
      toast({ title: 'Image loaded from the generator', description: 'Fine-tune it, then download or send it back.' });
    };
    el.onerror = () => {
      /* corrupt hand-off — ignore */
    };
    el.src = handoff;
  }, []);

  const continueInGenerator = () => {
    if (!image) return;
    try {
      const canvas = document.createElement('canvas');
      renderTo(canvas, 768);
      const dataUrl = canvas.toDataURL('image/png');
      if (!dataUrl.startsWith('data:image/')) throw new Error('bad-handoff');
      stashHandoff(dataUrl);
      toast({ title: 'Taking your edit to the generator', description: 'Pick a style and forge your avatar.' });
      navigate('/ai-avatar-generator');
    } catch {
      toast({ title: 'Could not transfer the image', description: 'Please try again.' });
    }
  };

  const reset = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setRotation(0);
    setFlipX(false);
    setAspect('original');
    setCircleMask(false);
    setOutWidth('1024');
    setFormat('image/png');
    setQuality(92);
    setText('');
    setTextSize(6);
    setTextColor(TEXT_COLORS[0].value);
    setTextPos('bottom');
  };

  const removeImage = () => {
    setImage(null);
    reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const download = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    renderTo(canvas, Number(outWidth));
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast({ title: 'Export failed', description: 'Please try a different format or size.' });
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edited-photo.${EXT[format]}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast({ title: 'Image downloaded', description: `Saved as edited-photo.${EXT[format]}` });
      },
      format,
      format === 'image/png' ? undefined : quality / 100
    );
  };

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* Preview / upload */}
      <section aria-label="Editor canvas" className="min-w-0 rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
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
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              void handleFile(e.dataTransfer.files?.[0]);
            }}
            className="flex min-h-80 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/40 p-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-medium">Drag &amp; drop a photo to start editing</p>
              <p className="mt-1 text-sm text-muted-foreground">JPG, PNG or WebP — everything runs in your browser</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center rounded-xl bg-muted/50 p-4">
              <canvas
                ref={previewCanvasRef}
                aria-label="Photo editing preview"
                className={cn('max-h-[480px] w-auto max-w-full rounded-lg shadow-md', circleMask && 'rounded-full')}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <ImagePlus className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Replace
              </Button>
              <Button size="sm" variant="outline" onClick={removeImage}>
                <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Remove
              </Button>
              <Button size="sm" variant="outline" onClick={reset}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Reset edits
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-label="Upload photo to edit"
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />

        {error && (
          <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </section>

      {/* Controls */}
      <section aria-label="Editing controls" className="min-w-0 rounded-2xl border bg-card p-5 shadow-sm sm:p-6 lg:sticky lg:top-24 lg:self-start">
        <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <Palette className="h-5 w-5 text-primary" aria-hidden="true" />
          Adjustments
        </h2>

        <div className={cn('mt-5 space-y-6', !image && 'pointer-events-none opacity-40')} aria-disabled={!image}>
          <SliderControl
            icon={<Sun className="h-4 w-4" aria-hidden="true" />}
            label="Brightness"
            value={brightness}
            onChange={setBrightness}
          />
          <SliderControl
            icon={<Contrast className="h-4 w-4" aria-hidden="true" />}
            label="Contrast"
            value={contrast}
            onChange={setContrast}
          />
          <SliderControl
            icon={<Palette className="h-4 w-4" aria-hidden="true" />}
            label="Saturation"
            value={saturation}
            onChange={setSaturation}
          />

          <div>
            <p className="text-sm font-semibold">Rotate &amp; flip</p>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setRotation((r) => (((r - 90) % 360) + 360) % 360)} aria-label="Rotate left">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setRotation((r) => (r + 90) % 360)} aria-label="Rotate right">
                <RotateCw className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant={flipX ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFlipX((f) => !f)}
                aria-pressed={flipX}
              >
                <FlipHorizontal2 className="mr-1.5 h-4 w-4" aria-hidden="true" /> Flip
              </Button>
            </div>
          </div>

          {/* Text overlay */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="overlay-text" className="flex items-center gap-1.5 text-sm font-semibold">
                <Type className="h-4 w-4" aria-hidden="true" />
                Text overlay
              </Label>
              {text.trim() && (
                <button
                  type="button"
                  onClick={() => setText('')}
                  className="rounded-sm text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Clear
                </button>
              )}
            </div>
            <Input
              id="overlay-text"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 60))}
              placeholder="Add a name or tagline…"
              maxLength={60}
              className="mt-2"
            />
            {text.trim() && (
              <>
                <div className="mt-3 flex items-center justify-between">
                  <Label className="text-sm font-semibold">Size</Label>
                  <span className="text-sm tabular-nums text-muted-foreground">{textSize}%</span>
                </div>
                <Slider
                  className="mt-2"
                  value={[textSize]}
                  min={3}
                  max={14}
                  step={1}
                  onValueChange={([v]) => setTextSize(v)}
                  aria-label="Text overlay size"
                />
                <Label className="mt-3 block text-sm font-semibold">Color</Label>
                <div className="mt-2 flex gap-2" role="group" aria-label="Text overlay color">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setTextColor(c.value)}
                      aria-pressed={textColor === c.value}
                      aria-label={`Text color: ${c.name}`}
                      title={c.name}
                      className={cn(
                        'h-7 w-7 shrink-0 rounded-full border-2 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        textColor === c.value ? 'scale-110 border-primary' : 'border-border/60 hover:scale-105'
                      )}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
                <Label className="mt-3 block text-sm font-semibold">Position</Label>
                <div className="mt-2 flex gap-2">
                  {(['top', 'center', 'bottom'] as const).map((p) => (
                    <Button
                      key={p}
                      variant={textPos === p ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTextPos(p)}
                      aria-pressed={textPos === p}
                      className="flex-1 capitalize"
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <Label htmlFor="aspect-select" className="text-sm font-semibold">
              Crop shape
            </Label>
            <Select value={circleMask ? '1:1' : aspect} onValueChange={(v) => setAspect(v as typeof aspect)}>
              <SelectTrigger id="aspect-select" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">Original</SelectItem>
                <SelectItem value="1:1">Square (1:1)</SelectItem>
                <SelectItem value="4:5">Portrait (4:5)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={circleMask ? 'default' : 'outline'}
              size="sm"
              className="mt-3 w-full"
              onClick={() => setCircleMask((c) => !c)}
              aria-pressed={circleMask}
            >
              <Circle className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Circle PFP export (transparent corners)
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="width-select" className="text-sm font-semibold">
                Output width
              </Label>
              <Select value={outWidth} onValueChange={setOutWidth}>
                <SelectTrigger id="width-select" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512">512 px</SelectItem>
                  <SelectItem value="1024">1024 px</SelectItem>
                  <SelectItem value="2048">2048 px</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="format-select" className="text-sm font-semibold">
                Format
              </Label>
              <Select
                value={format}
                onValueChange={(v) => {
                  const f = v as Format;
                  setFormat(f);
                  if (f === 'image/png') setCircleMask(circleMask); // PNG keeps transparency
                }}
              >
                <SelectTrigger id="format-select" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image/png">PNG</SelectItem>
                  <SelectItem value="image/jpeg">JPEG</SelectItem>
                  <SelectItem value="image/webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {format !== 'image/png' && (
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Quality</Label>
                <span className="text-sm text-muted-foreground">{quality}%</span>
              </div>
              <Slider
                className="mt-2"
                value={[quality]}
                min={50}
                max={100}
                step={1}
                onValueChange={([v]) => setQuality(v)}
                aria-label="Export quality"
              />
            </div>
          )}

          <Button
            className="w-full gap-2 bg-gradient-to-r from-primary to-fuchsia-500 shadow-md shadow-primary/25"
            onClick={download}
            disabled={!image}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download image
          </Button>
          <Button variant="outline" className="mt-2 w-full gap-2" onClick={continueInGenerator} disabled={!image}>
            <Wand2 className="h-4 w-4" aria-hidden="true" />
            Continue in AI Avatar Generator
          </Button>
        </div>

        {!image && <p className="mt-4 text-sm text-muted-foreground">Upload an image to enable the controls.</p>}
      </section>
    </div>
  );
}

function SliderControl({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-sm font-semibold">
          {icon}
          {label}
        </Label>
        <span className="text-sm tabular-nums text-muted-foreground">{value > 0 ? `+${value}` : value}</span>
      </div>
      <Slider
        className="mt-2"
        value={[value]}
        min={-100}
        max={100}
        step={1}
        onValueChange={([v]) => onChange(v)}
        aria-label={label}
      />
    </div>
  );
}
