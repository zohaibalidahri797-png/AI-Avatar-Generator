import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";
import { cdnAdapter } from "@vinext/cloudflare/cache/cdn-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import path from "node:path";

// Directory of this config file (ESM-safe replacement for __dirname).
const configDir = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [
    vinext({
      cache: { data: kvDataAdapter(), cdn: cdnAdapter() },
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
  resolve: {
    alias: [
      // `sharp` is a native Node dependency — not available in Cloudflare
      // Workers. Nothing in src/ imports it (verified); the alias keeps any
      // transitive reference out of the Workers bundle.
      {
        find: "sharp",
        replacement: path.resolve(configDir, "empty-stub.js"),
      },
      // `z-ai-web-dev-sdk` loads credentials from a file on disk
      // (.z-ai-config) using fs/os/path — impossible in Workers. For the
      // Workers build only, alias it to a fetch-based shim that reads the
      // same wire contract from Worker secrets (ZAI_API_KEY / ZAI_BASE_URL).
      // The Next.js (Node) build keeps using the real SDK.
      {
        find: "z-ai-web-dev-sdk",
        replacement: path.resolve(configDir, "src/lib/zai-workers.ts"),
      },
    ],
  },
});
