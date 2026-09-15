/**
 * Cloudflare Workers replacement for `z-ai-web-dev-sdk`.
 *
 * The real SDK reads credentials from a `.z-ai-config` file on disk via
 * fs/os/path — impossible in the Workers runtime. This shim speaks the exact
 * same wire protocol using plain `fetch` (verified against
 * node_modules/z-ai-web-dev-sdk/dist/index.js):
 *
 *   POST {baseUrl}/images/generations/edit
 *   Authorization: Bearer <apiKey>
 *   X-Z-AI-From: Z
 *   { prompt, images: [{ url }], size }
 *   → { data: [{ base64 | url }] }
 *
 * Credentials come ONLY from server-side environment bindings — never from
 * the client bundle:
 *   ZAI_API_KEY   (secret)
 *   ZAI_BASE_URL  (secret/vars)
 *   ZAI_TOKEN     (optional secret — sent as X-Token when present)
 *   ZAI_CHAT_ID   (optional secret — sent as X-Chat-Id when present)
 *   ZAI_USER_ID   (optional secret — sent as X-User-Id when present)
 *
 * In local preview (`bun run start:vinext`) they are provided by `.dev.vars`;
 * in production with `npx wrangler secret put ZAI_API_KEY` / `ZAI_BASE_URL`.
 * The vite config aliases `z-ai-web-dev-sdk` to this file for Workers builds
 * only — the Next.js/Node build keeps using the real SDK.
 */

const EDIT_TIMEOUT_MS = 120_000;

interface EditImageItem {
  url: string;
}

interface EditResponseBody {
  data?: Array<{ base64?: string; url?: string; format?: string }>;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function downloadAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`image-download-${res.status}`);
  }
  return bytesToBase64(new Uint8Array(await res.arrayBuffer()));
}

class ZAI {
  private baseUrl: string;
  private apiKey: string;
  private token?: string;
  private chatId?: string;
  private userId?: string;

  constructor(config: {
    baseUrl: string;
    apiKey: string;
    token?: string;
    chatId?: string;
    userId?: string;
  }) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
    this.token = config.token;
    this.chatId = config.chatId;
    this.userId = config.userId;
    this.images = {
      generations: {
        create: async () => {
          throw new Error('zai-workers: images.generations.create is not used by this app');
        },
        edit: this.edit.bind(this),
      },
    };
  }

  images: {
    generations: {
      create: (body: unknown) => Promise<never>;
      edit: (body: {
        prompt: string;
        images: EditImageItem[];
        size?: string;
      }) => Promise<EditResponseBody>;
    };
  };

  static async create(): Promise<ZAI> {
    // `process.env` in the Workers runtime is populated from the Worker's
    // vars/secrets by the Cloudflare Vite plugin (and from .dev.vars locally).
    const baseUrl = process.env.ZAI_BASE_URL?.trim();
    const apiKey = process.env.ZAI_API_KEY?.trim();
    if (!baseUrl || !apiKey) {
      throw new Error(
        'zai-workers: missing ZAI_BASE_URL / ZAI_API_KEY environment bindings'
      );
    }
    return new ZAI({
      baseUrl,
      apiKey,
      token: process.env.ZAI_TOKEN?.trim() || undefined,
      chatId: process.env.ZAI_CHAT_ID?.trim() || undefined,
      userId: process.env.ZAI_USER_ID?.trim() || undefined,
    });
  }

  private async edit(body: {
    prompt: string;
    images: EditImageItem[];
    size?: string;
  }): Promise<EditResponseBody> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), EDIT_TIMEOUT_MS);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'X-Z-AI-From': 'Z',
      };
      if (this.chatId) headers['X-Chat-Id'] = this.chatId;
      if (this.userId) headers['X-User-Id'] = this.userId;
      if (this.token) headers['X-Token'] = this.token;

      const res = await fetch(`${this.baseUrl}/images/generations/edit`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        // Consume the body for logging context but never surface provider
        // error text, keys or internals to callers — the API route maps all
        // failures to one safe generic message.
        await res.text().catch(() => '');
        throw new Error(`provider-${res.status}`);
      }

      const result = (await res.json()) as EditResponseBody;
      const items = result?.data ?? [];
      // Mirror the real SDK: items may arrive as base64 or as a URL to fetch.
      const normalized = await Promise.all(
        items.map(async (item) => {
          if (item?.url) {
            const base64 = await downloadAsBase64(item.url);
            return { base64, format: 'png' };
          }
          return item;
        })
      );
      return { ...result, data: normalized };
    } finally {
      clearTimeout(timer);
    }
  }
}

export default ZAI;
export { ZAI };
