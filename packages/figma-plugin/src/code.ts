// The plugin's main thread: finds a Halo component and places an instance of it.
// A component is looked for in three places, in this order:
//   1. this file, when it is Halo itself or a copy of it (a page with the component's page name);
//   2. the person's own copy of Halo: opening the plugin in a copy saves its keys (in clientStorage),
//      so once they publish that copy, other files place components from it;
//   3. the published Halo library, by its original key.
import { parts } from './library';
import type { Part } from './library';

const STORAGE = 'halo-copy';

/** A copy of Halo the person published in their own team: original key -> key in their copy. */
interface Copy {
  name: string;
  keys: Record<string, string>;
}

type FromUi = { type: 'place'; slug: string; index: number } | { type: 'open'; url: string };

figma.showUI(__html__, { width: 360, height: 600, themeColors: true });

const pageFor = (name: string) => figma.root.children.find((p) => p.name.trim() === name);

/** True when this file has Halo's component pages, so components can come from here. */
const isHaloFile = () => Boolean(pageFor('Button') && pageFor('Tree') && pageFor('Input field'));

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

async function importByKey(part: Part, key: string) {
  try {
    return part.set ? await figma.importComponentSetByKeyAsync(key) : await figma.importComponentByKeyAsync(key);
  } catch {
    return null;
  }
}

async function getCopy(): Promise<Copy | null> {
  return ((await figma.clientStorage.getAsync(STORAGE)) as Copy | undefined) ?? null;
}

async function resolve(part: Part) {
  const local = await findLocal(part);
  if (local) return local;
  const copy = await getCopy();
  const copied = copy?.keys[part.key];
  if (copied) {
    const node = await importByKey(part, copied);
    if (node) return node;
  }
  return importByKey(part, part.key);
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

/** In a copy of Halo, saves where each component is, so other files can place them from the published copy. */
async function remember() {
  if (!isHaloFile()) return;
  const keys: Record<string, string> = {};
  for (const list of Object.values(parts)) {
    for (const part of list) {
      if (keys[part.key]) continue;
      const node = await findLocal(part);
      if (node) keys[part.key] = node.key;
    }
  }
  const copy: Copy = { name: figma.root.name, keys };
  await figma.clientStorage.setAsync(STORAGE, copy);
}

figma.ui.onmessage = async (msg: FromUi) => {
  // Only the website link in the footer, so a message can't open anything else.
  if (msg.type === 'open') {
    if (msg.url.startsWith('https://halo-design-system.github.io/')) figma.openExternal(msg.url);
    return;
  }
  const part = parts[msg.slug]?.[msg.index];
  if (!part) return;
  const node = await resolve(part);
  if (!node) {
    figma.ui.postMessage({ type: 'missing', name: part.name });
    return;
  }
  const component = node.type === 'COMPONENT_SET' ? node.defaultVariant : node;
  place(component.createInstance());
};

remember();
