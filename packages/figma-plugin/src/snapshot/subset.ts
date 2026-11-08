// Unpacks the component data in the plugin window, and picks out what one click needs.
import { libraryData } from '../halo-library';
import type { Snapshot } from './types';

let loaded: Promise<Snapshot> | null = null;

export function loadLibrary() {
  loaded ??= (async () => {
    if (!libraryData) throw new Error('The component data is missing from this build.');
    const bytes = Uint8Array.from(atob(libraryData), (ch) => ch.charCodeAt(0));
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return JSON.parse(await new Response(stream).text()) as Snapshot;
  })();
  return loaded;
}

/** The component, everything it depends on, its images, and the file-wide variables and styles. */
export function subset(library: Snapshot, key: string): Snapshot {
  const components: Snapshot['components'] = {};
  const visit = (current: string) => {
    if (components[current]) return;
    const component = library.components[current];
    if (!component) return;
    components[current] = component;
    component.deps.forEach(visit);
  };
  visit(key);

  const images: Snapshot['images'] = {};
  const text = JSON.stringify([components, library.styles.paint]);
  for (const [, hash] of text.matchAll(/"imageHash":"(\w+)"/g)) {
    const bytes = library.images[hash!];
    if (bytes) images[hash!] = bytes;
  }
  return { collections: library.collections, styles: library.styles, components, images };
}
