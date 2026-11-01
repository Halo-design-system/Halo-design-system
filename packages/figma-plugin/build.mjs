// Builds the plugin into dist/: code.js for Figma's main thread, and ui.html with its script inlined
// (Figma loads the window from one HTML string). The component list comes from the website's catalog.
// Fails if a catalog entry has no Figma component in src/library.ts, so the two stay in step.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { build, context } from 'esbuild';

const watch = process.argv.includes('--watch');
mkdirSync('dist', { recursive: true });

async function check() {
  const out = await build({
    stdin: {
      contents: `import { all } from '../../apps/site/src/catalog'; import { parts } from './src/library';
        export const missing = all.filter((e) => !parts[e.slug]?.length).map((e) => e.slug);
        export const extra = Object.keys(parts).filter((slug) => !all.some((e) => e.slug === slug));`,
      resolveDir: '.',
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
  });
  const url = 'data:text/javascript;base64,' + Buffer.from(out.outputFiles[0].text).toString('base64');
  const { missing, extra } = await import(url);
  if (missing.length) throw new Error(`No Figma component in src/library.ts for: ${missing.join(', ')}`);
  if (extra.length) throw new Error(`src/library.ts has entries the catalog doesn't: ${extra.join(', ')}`);
}

const code = {
  entryPoints: ['src/code.ts'],
  outfile: 'dist/code.js',
  bundle: true,
  target: 'es2017',
  format: 'iife',
};

// Inlines the bundled UI script into ui.html after every build.
const inline = {
  name: 'inline-ui',
  setup(b) {
    b.onEnd((result) => {
      if (result.errors.length) return;
      const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
      const html = readFileSync('src/ui.html', 'utf8').replace('/*__UI_SCRIPT__*/', () => js);
      writeFileSync('dist/ui.html', html);
    });
  },
};

const ui = {
  entryPoints: ['src/ui.ts'],
  bundle: true,
  target: 'es2017',
  format: 'iife',
  write: false,
  plugins: [inline],
};

await check();

if (watch) {
  await (await context(code)).watch();
  await (await context(ui)).watch();
  console.log('Watching for changes…');
} else {
  await build(code);
  await build(ui);
}
