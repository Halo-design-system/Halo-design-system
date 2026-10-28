// Reads the app the CLI runs in: which framework, which package manager, and where the files are.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

export type Framework = 'next' | 'vite' | 'react';
export type Manager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface Project {
  dir: string;
  framework: Framework;
  manager: Manager;
  hasHalo: boolean;
  /** The file that sets the html element: app/layout.tsx in Next.js, index.html in Vite. */
  htmlFile: string | null;
  /** Where the theme file is imported: the root layout in Next.js, src/main.tsx in Vite. */
  entryFile: string | null;
}

const first = (dir: string, files: string[]) => files.map((f) => join(dir, f)).find((f) => existsSync(f)) ?? null;

export function readProject(dir: string): Project | null {
  const pkgPath = join(dir, 'package.json');
  if (!existsSync(pkgPath)) return null;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const framework: Framework = deps.next ? 'next' : deps.vite ? 'vite' : 'react';

  const agent = process.env.npm_config_user_agent ?? '';
  const manager: Manager =
    existsSync(join(dir, 'pnpm-lock.yaml')) || agent.startsWith('pnpm') ? 'pnpm'
    : existsSync(join(dir, 'yarn.lock')) || agent.startsWith('yarn') ? 'yarn'
    : existsSync(join(dir, 'bun.lockb')) || existsSync(join(dir, 'bun.lock')) || agent.startsWith('bun') ? 'bun'
    : 'npm';

  const layout = first(dir, ['app/layout.tsx', 'src/app/layout.tsx', 'app/layout.jsx', 'src/app/layout.jsx']);
  const htmlFile = framework === 'next' ? layout : first(dir, ['index.html']);
  const entryFile = framework === 'next' ? layout : first(dir, ['src/main.tsx', 'src/main.jsx', 'src/index.tsx', 'src/index.jsx']);

  return { dir, framework, manager, hasHalo: Boolean(deps['@halo-ds/react']), htmlFile, entryFile };
}

export const installCommand = (m: Manager, pkg: string) => (m === 'npm' ? `npm install ${pkg}` : `${m} add ${pkg}`);

export const rel = (p: Project, file: string) => relative(p.dir, file).replace(/\\/g, '/');

/** Sets data-theme on the html element. Returns false when it can't find the tag or the theme is already set. */
export function setTheme(file: string, theme: string): 'set' | 'updated' | 'not-found' {
  const src = readFileSync(file, 'utf8');
  const tag = src.match(/<html\b[^>]*>/);
  if (!tag) return 'not-found';
  const current = tag[0];
  const next = /data-theme=/.test(current)
    ? current.replace(/data-theme=(["'])[^"']*\1/, `data-theme="${theme}"`)
    : current.replace(/<html\b/, `<html data-theme="${theme}"`);
  writeFileSync(file, src.replace(current, next));
  return /data-theme=/.test(current) ? 'updated' : 'set';
}

/** Adds `import '<spec>';` after the last import in the file, unless it is already there. */
export function addImport(file: string, spec: string): 'added' | 'exists' {
  const src = readFileSync(file, 'utf8');
  if (src.includes(`'${spec}'`) || src.includes(`"${spec}"`)) return 'exists';
  const lines = src.split('\n');
  let last = -1;
  lines.forEach((l, i) => {
    // A single-line import, or the closing line of one that spans several lines
    if (/^import\s/.test(l) || /^\}?\s*from\s/.test(l)) last = i;
  });
  // Match the file's style: quotes and whether lines end with a semicolon
  const sample = last >= 0 ? lines[last]!.trimEnd() : `import '';`;
  const quote = /"[^"]*"\s*;?$/.test(sample) ? '"' : "'";
  const semi = sample.endsWith(';') ? ';' : '';
  lines.splice(last + 1, 0, `import ${quote}${spec}${quote}${semi}`);
  writeFileSync(file, lines.join('\n'));
  return 'added';
}
