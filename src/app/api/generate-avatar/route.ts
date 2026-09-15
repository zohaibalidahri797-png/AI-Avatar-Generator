import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import type { CreateImageEditBody } from 'z-ai-web-dev-sdk';
import ZaiWorkersClient from '@/lib/zai-workers';

export const maxDuration = 300;

const MAX_IMAGE_CHARS = 8_000_000; // ~6 MB base64 — uploads are downscaled client-side

interface GenerateBody {
  image?: string;
  group?: string;
  style?: string;
  background?: string;
  lighting?: string;
  expression?: string;
}

function buildPrompt(body: GenerateBody): string {
  const style = (body.style ?? 'Realistic Avatar').slice(0, 80);
  const parts = [
    `Transform this photo into a ${style}: an AI avatar portrait of the same person`,
    body.background ? body.background : '',
    body.lighting ? body.lighting : '',
    body.expression ? body.expression : '',
    'head-and-shoulders composition, centered profile-picture framing',
    'keep the person clearly recognizable, natural result, high quality, detailed',
  ];
  return parts.filter(Boolean).join(', ');
}

/** Minimal structural type both client implementations satisfy. */
interface ImageEditResult {
  data?: Array<{ base64?: string }>;
}

interface ImageEditClient {
  images: {
    generations: {
      edit: (body: CreateImageEditBody) => Promise<ImageEditResult>;
    };
  };
}

/**
 * Resolve the AI client.
 *
 * 1. When ZAI_API_KEY + ZAI_BASE_URL server-side environment bindings exist
 *    (Cloudflare Workers secrets, `.dev.vars`, or a self-hosted Node env), a
 *    fetch-based client is used — this is the deployment path for Workers.
 * 2. Otherwise the z-ai-web-dev-sdk is used, which reads its credentials from
 *    a local `.z-ai-config` file (Node development / self-hosted Node).
 *
 * In Workers builds `z-ai-web-dev-sdk` is aliased (vite.config.ts) to the
 * fetch-based shim in `src/lib/zai-workers.ts`, so the Node-only config-file
 * loader is never bundled for Workers.
 */
async function resolveClient(): Promise<ImageEditClient> {
  if (process.env.ZAI_API_KEY?.trim() && process.env.ZAI_BASE_URL?.trim()) {
    return (await ZaiWorkersClient.create()) as unknown as ImageEditClient;
  }
  return (await ZAI.create()) as unknown as ImageEditClient;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateBody;

    // Accept only the formats the client actually produces (JPEG/PNG/WebP data URLs).
    const upload = typeof body.image === 'string' ? body.image : '';
    const isValidImage = /^data:image\/(jpeg|png|webp);/i.test(upload);
    if (!isValidImage) {
      return NextResponse.json({ error: 'Please upload a JPG, PNG, or WebP image.' }, { status: 400 });
    }
    if (upload.length > MAX_IMAGE_CHARS) {
      return NextResponse.json(
        { error: 'That image is too large. Please choose a smaller image.' },
        { status: 413 }
      );
    }

    const client = await resolveClient();
    // The backend accepts the multipart-style `images` array form; the SDK's
    // TS interface only declares `image`, so we adapt the verified runtime
    // shape to the declared type here.
    const editBody = {
      prompt: buildPrompt(body),
      images: [{ url: body.image }],
      size: '1024x1024',
    } as unknown as CreateImageEditBody;
    const response = await client.images.generations.edit(editBody);

    const base64 = response?.data?.[0]?.base64;
    if (!base64) {
      throw new Error('empty-generation');
    }

    return NextResponse.json({ image: `data:image/png;base64,${base64}` });
  } catch (error) {
    // Log internally, never expose technical details or credentials to users.
    console.error('[generate-avatar] generation failed:', error);
    return NextResponse.json(
      { error: 'Something went wrong while creating your avatar. Please try again.' },
      { status: 500 }
    );
  }
}
