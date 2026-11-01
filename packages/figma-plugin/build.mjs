// Builds the plugin into dist/: code.js for Figma's main thread, and ui.html with its script, styles,
// fonts and component pictures inlined (Figma loads the window from one HTML string).
// The component list comes from the website's catalog. The build fails if a catalog entry has no
// Figma component in src/library.ts or no picture in previews/, so they stay in step.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { build, context } from 'esbuild';

const watch = process.argv.includes('--watch');
mkdirSync('dist', { recursive: true });

async function check() {
  const out = await build({
    stdin: {
      contents: `import { all } from '../../apps/site/src/catalog'; import { parts } from './src/library';
        export const missing = all.filter((e) => !parts[e.slug]?.length).map((e) => e.slug);
        export const extra = Object.keys(parts).filter((slug) => !all.some((e) => e.slug === slug));
        export const slugs = all.map((e) => e.slug);`,
      resolveDir: '.',
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
  });
  const url = 'data:text/javascript;base64,' + Buffer.from(out.outputFiles[0].text).toString('base64');
  const { missing, extra, slugs } = await import(url);
  if (missing.length) throw new Error(`No Figma component in src/library.ts for: ${missing.join(', ')}`);
  if (extra.length) throw new Error(`src/library.ts has entries the catalog doesn't: ${extra.join(', ')}`);
  for (const dir of ['previews', 'previews/dark']) {
    const noPicture = slugs.filter((slug) => !existsSync(`${dir}/${slug}.png`));
    if (noPicture.length) throw new Error(`No picture in ${dir}/ for: ${noPicture.join(', ')}`);
  }
}

const code = {
  entryPoints: ['src/code.ts'],
  outfile: 'dist/code.js',
  bundle: true,
  target: 'es2017',
  format: 'iife',
};

// previews/<slug>.png and previews/dark/<slug>.png as data URLs, imported by the window as './previews'.
function pictures(dir) {
  const map = {};
  for (const file of readdirSync(dir)) {
    if (file.endsWith('.png')) map[file.slice(0, -4)] = 'data:image/png;base64,' + readFileSync(join(dir, file)).toString('base64');
  }
  return map;
}

const previews = {
  name: 'previews',
  setup(b) {
    b.onResolve({ filter: /^\.\/previews$/ }, () => ({ path: 'previews', namespace: 'previews' }));
    b.onLoad({ filter: /.*/, namespace: 'previews' }, () => ({
      contents: `export const previews = ${JSON.stringify(pictures('previews'))};
        export const previewsDark = ${JSON.stringify(pictures('previews/dark'))};`,
      loader: 'js',
    }));
  },
};

// Halo loads every Geist font file; the window only needs Latin at the three weights it uses.
const require = createRequire(join(process.cwd(), '../react/package.json'));
const geist = dirname(require.resolve('@fontsource/geist/package.json'));
const fonts = {
  name: 'fonts',
  setup(b) {
    b.onResolve({ filter: /^@fontsource\/geist\/\d+\.css$/ }, (args) => ({ path: args.path, namespace: 'fonts' }));
    b.onLoad({ filter: /.*/, namespace: 'fonts' }, (args) => {
      const weight = args.path.match(/(\d+)\.css$/)[1];
      return {
        contents: `@font-face { font-family: 'Geist'; font-style: normal; font-display: swap; font-weight: ${weight};
          src: url('./files/geist-latin-${weight}-normal.woff2') format('woff2'); }`,
        loader: 'css',
        resolveDir: geist,
      };
    });
  },
};

// Writes ui.html with the bundled script and styles inlined, after every build.
const inline = {
  name: 'inline-ui',
  setup(b) {
    b.onEnd((result) => {
      if (result.errors.length) return;
      const js = result.outputFiles.find((f) => f.path.endsWith('.js')).text.replace(/<\/script/gi, '<\\/script');
      const css = result.outputFiles.find((f) => f.path.endsWith('.css'))?.text ?? '';
      const html = readFileSync('src/ui.html', 'utf8')
        .replace('/*__UI_STYLE__*/', () => css.replace(/<\/style/gi, '<\\/style'))
        .replace('/*__UI_SCRIPT__*/', () => js);
      writeFileSync('dist/ui.html', html);
    });
  },
};

const ui = {
  entryPoints: ['src/ui.tsx'],
  outdir: 'dist/ui',
  bundle: true,
  minify: true,
  target: 'es2020',
  format: 'iife',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  loader: { '.woff2': 'dataurl' },
  write: false,
  plugins: [previews, fonts, inline],
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
