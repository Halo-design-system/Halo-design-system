// Starter templates ship their own page colours, which fight Halo's light and dark mode.
// This finds those files, so `init` can offer to clear the ones that hold nothing else.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Project } from './project';

const read = (file: string) => (existsSync(file) ? readFileSync(file, 'utf8') : '');

/** Vite's starter holds only demo styles, so it is safe to clear. Next.js keeps real setup in globals.css, so that one is only mentioned. */
export function findStarterStyles(p: Project): { clearable: string[]; mentions: string[] } {
  const clearable: string[] = [];
  const mentions: string[] = [];
  if (p.framework === 'vite') {
    const index = join(p.dir, 'src/index.css');
    const app = join(p.dir, 'src/App.css');
    // The starter's index.css sets page colours on :root and lays out #root; its App.css styles the demo counter
    if (/color-scheme:\s*light dark/.test(read(index)) && /#root\s*\{/.test(read(index))) clearable.push(index);
    if (/\.counter\s*\{|\.logo\b/.test(read(app))) clearable.push(app);
  }
  if (p.framework === 'next') {
    const globals = [join(p.dir, 'app/globals.css'), join(p.dir, 'src/app/globals.css')].find((f) => existsSync(f));
    if (globals && /--background\s*:/.test(read(globals))) mentions.push(globals);
  }
  return { clearable, mentions };
}

export function clearStarterStyles(files: string[]) {
  for (const file of files) writeFileSync(file, '/* Your own styles go here. */\n');
}
