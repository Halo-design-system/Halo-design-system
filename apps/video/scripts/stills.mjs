// Renders single frames to out/stills, to check scenes without rendering the whole video.
// Usage: node scripts/stills.mjs 70 220 520
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: fileURLToPath(new URL('../src/index.ts', import.meta.url)) });
const composition = await selectComposition({ serveUrl, id: 'Launch' });
mkdirSync('out/stills', { recursive: true });
for (const frame of frames) {
  await renderStill({ serveUrl, composition, frame, output: `out/stills/${frame}.png` });
  console.log(`out/stills/${frame}.png`);
}
