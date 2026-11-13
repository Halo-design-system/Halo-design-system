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
  | { type: 'place'; slug: string; index: number; mode?: Mode }
  | { type: 'data'; slug: string; index: number; data: Snapshot; placed: boolean; mode?: Mode }
  | { type: 'open'; url: string }
  | { type: 'mode'; mode: Mode }
  | { type: 'hello' };

// One builder for the whole time the plugin is open, so repeat clicks don't search the file again.
const builder = new Builder({ collections: [], styles: { text: [], effect: [], paint: [] }, components: {}, images: {} });
let preparing: Promise<void> | null = null;
const ready = () => (preparing ??= builder.prepare());

figma.showUI(__html__, { width: 360, height: 600, themeColors: true });

// The colour mode chosen in the window, remembered for next time. Every click also carries the mode the
// window shows, so what gets placed always matches what the person sees selected.
type Mode = 'light' | 'dark';
let mode: Mode = 'light';
const savedMode = figma.clientStorage
  .getAsync('mode')
  .then((saved) => {
    if (saved === 'light' || saved === 'dark') mode = saved;
  })
  .catch(() => undefined);

/** Pins the instance to the chosen mode of Halo's Semantic colours, whatever its frame or page uses. */
async function applyMode(instance: InstanceNode) {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const semantic = collections.find((c) => c.name === 'Semantic' && c.modes.some((m) => m.name.toLowerCase() === 'dark'));
  const target = semantic?.modes.find((m) => m.name.toLowerCase() === mode);
  if (semantic && target) {
    instance.setExplicitVariableModeForCollection(semantic, target.modeId);
  } else if (mode === 'dark') {
    figma.ui.postMessage({ type: 'note', title: 'Placed in light', message: 'This file has no dark mode for Halo’s colours, which can happen on Figma’s free plan.' });
  }
}

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
async function place(instance: InstanceNode) {
  await applyMode(instance);
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

// Components someone clicked, newest first. Only these get all their variants in the background.
const wanted: string[] = [];
function want(key: string) {
  const at = wanted.indexOf(key);
  if (at >= 0) wanted.splice(at, 1);
  wanted.unshift(key);
}

async function placeOrAskForData(part: Part, slug: string, index: number) {
  await ready();
  const node = (await findLocal(part)) ?? builder.find(part.key) ?? (await importByKey(part));
  if (node) {
    await place(newInstance(node));
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
  want(part.key);
  await builder.ensureTokens();
  if (!placed) {
    await place((await builder.firstComponent(part.key)).createInstance());
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
    while (await enqueue(() => builder.completeNext(wanted))) await new Promise((resolve) => setTimeout(resolve, 0));
  } catch (error) {
    figma.ui.postMessage({ type: 'failed', name: 'every variant', message: String((error as Error)?.message ?? error) });
  } finally {
    finishing = false;
    figma.ui.postMessage({ type: 'background', busy: false });
  }
}

figma.ui.onmessage = async (msg: FromUi) => {
  // Only the website link in the footer, so a message can't open anything else.
  // The window asks once it is listening, so the saved choice can't arrive before it is ready.
  if (msg.type === 'hello') {
    await savedMode;
    figma.ui.postMessage({ type: 'mode', mode });
    return;
  }
  if ((msg.type === 'place' || msg.type === 'data') && (msg.mode === 'light' || msg.mode === 'dark')) mode = msg.mode;
  if (msg.type === 'mode') {
    mode = msg.mode === 'dark' ? 'dark' : 'light';
    await figma.clientStorage.setAsync('mode', mode);
    return;
  }
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

// A component left half built when the plugin last closed gets finished, without anyone clicking it again.
void enqueue(async () => {
  await ready();
  for (const [slug, list] of Object.entries(parts)) {
    list.forEach((part, index) => {
      if (builder.incomplete(part.key)) figma.ui.postMessage({ type: 'need', slug, index, key: part.key, placed: true });
    });
  }
});
