import type { ComponentType } from 'react';

export { all, groups } from './catalog';
export type { Entry } from './catalog';


const modules = import.meta.glob<{ default: ComponentType }>('./examples/*.tsx', { eager: true });
const sources = import.meta.glob<string>('./examples/*.tsx', { eager: true, query: '?raw', import: 'default' });

/** The live example and its source for a component, if one exists yet. */
export function exampleFor(slug: string) {
  const path = `./examples/${slug}.tsx`;
  const mod = modules[path];
  return mod ? { Example: mod.default, code: sources[path]!.trimEnd() } : null;
}

export interface Demo {
  id: string;
  title: string;
  description: string;
  Demo: ComponentType;
  code: string;
}

const demoModules = import.meta.glob<{ default: ComponentType }>('./demos/*/*.tsx', { eager: true });
const demoSources = import.meta.glob<string>('./demos/*/*.tsx', { eager: true, query: '?raw', import: 'default' });

/** The labelled variant demos for a component, in file order. Each file starts with a comment: title, then description. */
export function demosFor(slug: string): Demo[] {
  return Object.keys(demoModules)
    .filter((path) => path.startsWith(`./demos/${slug}/`))
    .sort()
    .map((path) => {
      const raw = demoSources[path]!;
      const head = raw.match(/^\/\*\*([\s\S]*?)\*\/\r?\n/);
      const lines = (head?.[1] ?? '').split('\n').map((l) => l.replace(/^\s*\* ?/, '').trim()).filter(Boolean);
      return {
        id: path.split('/').pop()!.replace(/^\d+-|\.tsx$/g, ''),
        title: lines[0] ?? '',
        description: lines.slice(1).join(' '),
        Demo: demoModules[path]!.default,
        code: raw.slice(head?.[0].length ?? 0).trimEnd(),
      };
    });
}

const thumbModules = import.meta.glob<{ default: ComponentType }>('./thumbs/*.tsx', { eager: true });

/** What the overview card shows: a still "open" view for overlays, otherwise the main example. */
export function thumbFor(slug: string): ComponentType | null {
  return thumbModules[`./thumbs/${slug}.tsx`]?.default ?? exampleFor(slug)?.Example ?? null;
}
