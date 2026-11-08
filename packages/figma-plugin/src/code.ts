// The plugin's main thread: finds a Halo component and places an instance of it.
// A component is looked for in this order, and the first three keep the file tidy:
//   1. this file, when it is Halo itself or a copy of it (a page with the component's page name);
//   2. the "Halo components" page, from an earlier click in this file;
//   3. a published Halo library the person can reach, by key, which stays linked to it;
//   4. otherwise it is built from the data the plugin carries, so any file works.
import { parts } from './library';
import type { Part } from './library';
import { Builder, newInstance } from './snapshot/build';
import type { Snapshot } from './snapshot/types';

type FromUi =
  | { type: 'place'; slug: string; index: number }
  | { type: 'data'; slug: string; index: number; data: Snapshot; placed: boolean }
  | { type: 'open'; url: string };

// One builder for the whole time the plugin is open, so repeat clicks don't search the file again.
const builder = new Builder({ collections: [], styles: { text: [], effect: [], paint: [] }, components: {}, images: {} });
let preparing: Promise<void> | null = null;
const ready = () => (preparing ??= builder.prepare());

figma.showUI(__html__, { width: 360, height: 600, themeColors: true });

const pageFor = (name: string) => figma.root.children.find((p) => p.name.trim() === name);

async function findLocal(part: Part): Promise<ComponentNode | ComponentSetNode | null> {
  const page = pageFor(part.page);
  if (!page) return null;
  await page.loadAsync();
  const found = page.findAllWithCriteria({ types: [part.set ? 'COMPONENT_SET' : 'COMPONENT'] });
  for (const node of found) {
    if (node.name !== part.name) continue;
    if (node.type === 'COMPONENT' && node.parent?.type === 'COMPONENT_SET') continue;
    return node;
  }
  return null;
}

// Asking for a library nobody can reach is slow, so stop after the first miss.
let libraryReachable = true;
async function importByKey(part: Part) {
  if (!libraryReachable) return null;
  try {
    return part.set ? await figma.importComponentSetByKeyAsync(part.key) : await figma.importComponentByKeyAsync(part.key);
  } catch {
    libraryReachable = false;
    return null;
  }
}

/** Puts the instance inside the selected frame when there is one, otherwise in the middle of the view. */
function place(instance: InstanceNode) {
  const [selected] = figma.currentPage.selection;
  let target: (FrameNode | SectionNode) | null = null;
  if (figma.currentPage.selection.length === 1 && selected && (selected.type === 'FRAME' || selected.type === 'SECTION')) {
    let inInstance = false;
    for (let p = selected.parent; p && p.type !== 'PAGE'; p = p.parent) if (p.type === 'INSTANCE') inInstance = true;
    if (!inInstance) target = selected;
  }

  if (target) {
    target.appendChild(instance);
    if (target.type === 'SECTION' || target.layoutMode === 'NONE') {
      instance.x = Math.round((target.width - instance.width) / 2);
      instance.y = Math.round((target.height - instance.height) / 2);
    }
  } else {
    figma.currentPage.appendChild(instance);
    const { x, y } = figma.viewport.center;
    instance.x = Math.round(x - instance.width / 2);
    instance.y = Math.round(y - instance.height / 2);
  }
  figma.currentPage.selection = [instance];
}

// Everything that touches the builder runs one at a time, so a click can't collide with background work.
let tail: Promise<unknown> = Promise.resolve();
function enqueue<T>(job: () => Promise<T>) {
  const result = tail.then(job);
  tail = result.catch(() => undefined);
  return result;
}

async function placeOrAskForData(part: Part, slug: string, index: number) {
  await ready();
  const node = (await findLocal(part)) ?? builder.find(part.key) ?? (await importByKey(part));
  if (node) {
    place(newInstance(node));
    figma.ui.postMessage({ type: 'done', slug });
    // Closing the plugin early can leave a set unfinished, so pick it back up.
    if (builder.incomplete(part.key)) figma.ui.postMessage({ type: 'need', slug, index, key: part.key, placed: true });
  } else {
    figma.ui.postMessage({ type: 'need', slug, index, key: part.key, placed: false });
  }
}

async function buildAndPlace(part: Part, slug: string, data: Snapshot, placed: boolean) {
  await ready();
  builder.absorb(data);
  await builder.ensureTokens();
  if (!placed) {
    place((await builder.firstComponent(part.key)).createInstance());
    figma.ui.postMessage({ type: 'done', slug });
  }
}

// Places first, then builds the other variants a step at a time, leaving room for clicks and for Figma.
let finishing = false;
async function finishInBackground() {
  if (finishing) return;
  finishing = true;
  figma.ui.postMessage({ type: 'background', busy: true });
  try {
    while (await enqueue(() => builder.completeNext())) await new Promise((resolve) => setTimeout(resolve, 0));
  } catch (error) {
    figma.ui.postMessage({ type: 'failed', name: 'every variant', message: String((error as Error)?.message ?? error) });
  } finally {
    finishing = false;
    figma.ui.postMessage({ type: 'background', busy: false });
  }
}

figma.ui.onmessage = async (msg: FromUi) => {
  // Only the website link in the footer, so a message can't open anything else.
  if (msg.type === 'open') {
    if (msg.url.startsWith('https://halo-design-system.github.io/')) figma.openExternal(msg.url);
    return;
  }
  const part = parts[msg.slug]?.[msg.index];
  if (!part) return;
  try {
    if (msg.type === 'place') {
      await enqueue(() => placeOrAskForData(part, msg.slug, msg.index));
    } else {
      await enqueue(() => buildAndPlace(part, msg.slug, msg.data, msg.placed));
      void finishInBackground();
    }
  } catch (error) {
    figma.ui.postMessage({ type: 'failed', slug: msg.slug, name: part.name, message: String((error as Error)?.message ?? error) });
  }
};
