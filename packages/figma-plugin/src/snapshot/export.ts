// A small development plugin, run in the Halo Figma file or a copy of it, that saves the component data Halo UI carries.
import { parts } from '../library';
import type { Part } from '../library';
import { readSnapshot } from './serialize';

figma.showUI(__html__, { width: 320, height: 200, themeColors: true });

// A copy of Halo has new keys, so fall back to the component's page and name.
function find(part: Part, byKey: Map<string, ComponentNode | ComponentSetNode>) {
  const exact = byKey.get(part.key);
  if (exact) return exact;
  const page = figma.root.children.find((p) => p.name.trim() === part.page);
  const matches = page?.findAllWithCriteria({ types: [part.set ? 'COMPONENT_SET' : 'COMPONENT'] }) ?? [];
  return matches.find((node) => node.name === part.name && node.parent?.type !== 'COMPONENT_SET') ?? null;
}

async function run() {
  await figma.loadAllPagesAsync();
  // Overrides inside hidden instances are part of a component too.
  figma.skipInvisibleInstanceChildren = false;
  const byKey = new Map(figma.root.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] }).map((node) => [node.key, node]));
  const owners: (ComponentNode | ComponentSetNode)[] = [];
  const renamed = new Map<string, string>();
  const missing: string[] = [];
  const all = Object.values(parts).flat();
  for (const part of all) {
    const node = find(part, byKey);
    if (!node) {
      missing.push(part.name);
      continue;
    }
    owners.push(node);
    if (node.key !== part.key) renamed.set(node.key, part.key);
  }
  if (missing.length === all.length) throw new Error(`"${figma.root.name}" has no Halo components. Open your Halo file, then run this again.`);
  if (missing.length) throw new Error(`These aren't in "${figma.root.name}": ${missing.slice(0, 5).join(', ')}`);

  const snapshot = await readSnapshot(owners, (done, total) => figma.ui.postMessage({ type: 'progress', done, total }));
  // Halo UI looks components up by the original file's keys.
  let json = JSON.stringify(snapshot);
  for (const [from, to] of renamed) json = json.split(from).join(to);
  figma.ui.postMessage({ type: 'done', json, components: Object.keys(snapshot.components).length });
}

run().catch((error) => figma.ui.postMessage({ type: 'failed', message: String(error?.message ?? error) }));
