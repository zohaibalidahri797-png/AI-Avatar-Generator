/**
 * Creates real before/after example pairs for the landing pages.
 * Runs the actual production API (z-ai-web-dev-sdk) so the examples are
 * genuine transformations, not mockups.
 *
 * Usage: bun scripts/generate-before-after.ts
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const API = 'http://localhost:3000/api/generate-avatar';

const JOBS: { before: string; style: string; background?: string; out: string }[] = [
  { before: 'before-1', style: 'Realistic Portrait', background: 'Studio', out: 'after-realistic.png' },
  { before: 'before-1', style: 'Professional Headshot', background: 'Office', out: 'after-professional.png' },
  { before: 'before-1', style: '3D Character', background: 'Gradient', out: 'after-3d.png' },
  { before: 'before-2', style: 'Anime Avatar', background: 'Gradient', out: 'after-anime.png' },
  { before: 'before-2', style: 'Cartoon Avatar', background: 'Solid Color', out: 'after-cartoon.png' },
  { before: 'before-2', style: 'Esports Avatar', background: 'Gaming', out: 'after-gaming.png' },
  // Round: showcases for the remaining AI landing pages
  { before: 'before-3', style: 'Discord Avatar', background: 'Gradient', out: 'after-pfp.png' },
  { before: 'before-3', style: 'Professional Headshot', background: 'Office', out: 'after-headshot.png' },
  { before: 'before-3', style: 'Realistic Portrait', background: 'Studio', out: 'after-face.png' },
  { before: 'before-1', style: 'Cinematic Portrait', background: 'City', out: 'after-portrait.png' },
  { before: 'before-2', style: 'Fantasy Gaming', background: 'Abstract', out: 'after-character.png' },
  { before: 'before-2', style: 'Professional Avatar', background: 'Nature', out: 'after-background.png' },
  { before: 'before-1', style: 'Instagram PFP', background: 'Gradient', out: 'after-social.png' },
];

async function run() {
  for (const job of JOBS) {
    const outPath = `public/images/before-after/${job.out}`;
    if (existsSync(outPath)) {
      console.log('skip', job.out);
      continue;
    }
    const buf = readFileSync(`public/images/before-after/${job.before}.png`);
    const dataUrl = `data:image/png;base64,${buf.toString('base64')}`;
    process.stdout.write(`generating ${job.out} (${job.style}) ... `);
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: dataUrl,
        style: job.style,
        background: job.background,
      }),
    });
    if (!res.ok) {
      console.log('FAIL', res.status, (await res.text()).slice(0, 120));
      continue;
    }
    const json = (await res.json()) as { image?: string };
    if (!json.image) {
      console.log('FAIL empty');
      continue;
    }
    const base64 = json.image.split(',')[1];
    writeFileSync(outPath, Buffer.from(base64, 'base64'));
    console.log('done');
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
