// Bundles the CLI into one file with no runtime dependencies, so `npx halo-ds` starts fast.
// The component list and usage guidance come from the website's data, so both stay in step.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

// Props, examples and tokens for the MCP server, gathered fresh from the source
execFileSync(process.execPath, ['scripts/data.mjs'], { stdio: 'inherit' });

const { version } = JSON.parse(readFileSync('package.json', 'utf8'));

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  banner: { js: '#!/usr/bin/env node' },
  define: { __VERSION__: JSON.stringify(version) },
});

// The plain-text docs export, run by the website build. Kept out of the published package.
await build({
  entryPoints: ['src/export.ts'],
  outfile: 'build/export.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  define: { __VERSION__: JSON.stringify(version) },
});
