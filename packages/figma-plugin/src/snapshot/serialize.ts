// Reads Halo's components, variables and styles out of the Figma file as plain data.
// The plugin carries that data, so it can rebuild a component in any file (see build.ts).
// Nested instances stay references to their component, which keeps the data small.
import type { SChild, SComponent, SCollection, SInstance, SOverride, SNode, Snapshot, SStyle } from './types';

const VISUAL = ['name', 'visible', 'opacity', 'blendMode', 'isMask', 'maskType', 'locked'];
const CHILD_LAYOUT = ['layoutAlign', 'layoutGrow', 'layoutPositioning', 'constraints', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight'];
const STROKES = ['strokeAlign', 'strokeCap', 'strokeJoin', 'strokeMiterLimit', 'dashPattern', 'strokeWeight', 'strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight'];
const CORNERS = ['cornerRadius', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius', 'cornerSmoothing'];
const AUTO_LAYOUT = [
  'clipsContent', 'layoutMode', 'layoutWrap', 'primaryAxisSizingMode', 'counterAxisSizingMode', 'primaryAxisAlignItems', 'counterAxisAlignItems',
  'counterAxisAlignContent', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'itemSpacing', 'counterAxisSpacing', 'itemReverseZIndex', 'strokesIncludedInLayout',
];
const SHAPE = ['arcData', 'pointCount', 'innerRadius', 'booleanOperation', 'vectorPaths'];
const TEXT = ['textAlignHorizontal', 'textAlignVertical', 'textAutoResize', 'textTruncation', 'maxLines', 'paragraphIndent', 'paragraphSpacing'];
const PAINTED = ['fills', 'strokes'];
const STYLE_IDS = ['fillStyleId', 'strokeStyleId', 'effectStyleId'];
const SEGMENT_FIELDS = ['fontName', 'fontSize', 'textCase', 'textDecoration', 'letterSpacing', 'lineHeight', 'fills', 'textStyleId', 'fillStyleId', 'boundVariables', 'hyperlink'] as const;
const TEXT_OVERRIDES = ['characters', 'fontName', 'fontSize', 'textCase', 'textDecoration', 'letterSpacing', 'lineHeight', 'textStyleId', 'hyperlink'];

// The value a new node already has, so it needn't be stored.
const DEFAULTS: Record<string, unknown> = {
  visible: true, opacity: 1, blendMode: 'PASS_THROUGH', isMask: false, maskType: 'ALPHA', locked: false, layoutAlign: 'INHERIT', layoutGrow: 0,
  layoutPositioning: 'AUTO', minWidth: null, maxWidth: null, minHeight: null, maxHeight: null, cornerSmoothing: 0, itemReverseZIndex: false,
  strokesIncludedInLayout: false, layoutWrap: 'NO_WRAP', counterAxisAlignContent: 'AUTO', counterAxisSpacing: 0, strokeMiterLimit: 4,
  strokeCap: 'NONE', strokeJoin: 'MITER', paragraphIndent: 0, paragraphSpacing: 0, textTruncation: 'DISABLED', maxLines: null,
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const same = (a: unknown, b: unknown) => a === b || JSON.stringify(a) === JSON.stringify(b);

export class Reader {
  components: Record<string, SComponent> = {};
  images: Record<string, string> = {};
  private imageHashes = new Set<string>();
  private queue: (ComponentNode | ComponentSetNode)[] = [];
  private queued = new Set<string>();
  private deps = new Set<string>();

  private owner(component: ComponentNode): ComponentNode | ComponentSetNode {
    return component.parent?.type === 'COMPONENT_SET' ? component.parent : component;
  }

  private need(component: ComponentNode) {
    const owner = this.owner(component);
    this.deps.add(owner.key);
    this.add(owner);
  }

  add(owner: ComponentNode | ComponentSetNode) {
    if (this.queued.has(owner.key)) return;
    this.queued.add(owner.key);
    this.queue.push(owner);
  }

  private put(out: Record<string, unknown>, node: SceneNode, fields: readonly string[]) {
    const source = node as unknown as Record<string, unknown>;
    for (const field of fields) {
      let value: unknown;
      try {
        if (!(field in node)) continue;
        value = source[field];
      } catch {
        continue;
      }
      if (typeof value === 'symbol' || value === undefined) continue;
      if (field in DEFAULTS && same(value, DEFAULTS[field])) continue;
      out[field] = clone(value);
    }
  }

  private paints(out: Record<string, unknown>) {
    for (const field of PAINTED) {
      const paints = out[field] as Paint[] | undefined;
      for (const paint of paints ?? []) if (paint.type === 'IMAGE' && paint.imageHash) this.imageHashes.add(paint.imageHash);
    }
  }

  private async geometry(out: Record<string, unknown>, node: SceneNode) {
    this.put(out, node, [...PAINTED, ...STROKES, ...CORNERS, ...STYLE_IDS, 'effects']);
    this.paints(out);
    if ('boundVariables' in node && node.boundVariables) {
      const { fills, strokes, effects, layoutGrids, componentProperties, ...plain } = node.boundVariables as Record<string, unknown>;
      if (Object.keys(plain).length) out.bound = clone(plain);
    }
    if ('explicitVariableModes' in node && Object.keys(node.explicitVariableModes).length) out.modes = clone(node.explicitVariableModes);
  }

  private text(out: Record<string, unknown>, node: TextNode) {
    out.characters = node.characters;
    const segments = node.getStyledTextSegments([...SEGMENT_FIELDS]);
    out.segments = segments.map((segment) => {
      const copy = clone(segment) as unknown as Record<string, unknown>;
      if (copy.textStyleId) for (const field of ['fontName', 'fontSize', 'textCase', 'textDecoration', 'letterSpacing', 'lineHeight']) delete copy[field];
      if (!copy.hyperlink) delete copy.hyperlink;
      if (!copy.fillStyleId) delete copy.fillStyleId;
      if (copy.boundVariables && !Object.keys(copy.boundVariables).length) delete copy.boundVariables;
      this.paints(copy);
      return copy;
    });
  }

  private place(out: Record<string, unknown>, node: SceneNode) {
    const [[a, b, x], [c, d, y]] = node.relativeTransform;
    if (a === 1 && b === 0 && c === 0 && d === 1) {
      out.x = x;
      out.y = y;
    } else {
      out.transform = clone(node.relativeTransform);
    }
    out.w = node.width;
    out.h = node.height;
    this.put(out, node, CHILD_LAYOUT);
    const parent = node.parent;
    const inAutoLayout = parent && 'layoutMode' in parent && parent.layoutMode !== 'NONE';
    if (inAutoLayout || ('layoutMode' in node && node.layoutMode !== 'NONE')) this.put(out, node, ['layoutSizingHorizontal', 'layoutSizingVertical']);
    if ('componentPropertyReferences' in node && node.componentPropertyReferences) out.refs = clone(node.componentPropertyReferences);
  }

  private async instance(node: InstanceNode): Promise<SInstance> {
    const main = await node.getMainComponentAsync();
    if (!main) throw new Error(`"${node.name}" has no main component`);
    this.need(main);
    const out = { type: 'INSTANCE', main: main.key } as unknown as SInstance & Record<string, unknown>;
    this.put(out, node, VISUAL);
    this.place(out, node);
    if (node.isExposedInstance) out.exposed = true;
    if ('explicitVariableModes' in node && Object.keys(node.explicitVariableModes).length) out.modes = clone(node.explicitVariableModes);
    const props = await this.instanceProps(node);
    if (props) out.props = props;
    const overrides = await this.overrides(node);
    if (overrides.length) out.overrides = overrides;
    return out;
  }

  private async instanceProps(node: InstanceNode) {
    const props: Record<string, string | boolean> = {};
    for (const [name, prop] of Object.entries(node.componentProperties)) {
      if (prop.type === 'VARIANT' || prop.type === 'SLOT') continue;
      if (prop.type === 'INSTANCE_SWAP') {
        const target = await figma.getNodeByIdAsync(String(prop.value));
        if (target?.type !== 'COMPONENT') continue;
        this.need(target);
        props[name] = target.key;
      } else {
        props[name] = prop.value as string | boolean;
      }
    }
    return Object.keys(props).length ? props : null;
  }

  // Every change made to the layers inside an instance, addressed by child positions.
  private async overrides(root: InstanceNode): Promise<SOverride[]> {
    const paths = new Map<string, number[]>([[root.id, []]]);
    const nodes = new Map<string, SceneNode>([[root.id, root]]);
    const walk = (node: SceneNode, path: number[]) => {
      if (!('children' in node)) return;
      node.children.forEach((child, index) => {
        paths.set(child.id, [...path, index]);
        nodes.set(child.id, child);
        walk(child, [...path, index]);
      });
    };
    walk(root, []);

    const result: SOverride[] = [];
    for (const { id, overriddenFields } of root.overrides) {
      const node = nodes.get(id);
      const path = paths.get(id);
      if (!node || !path) continue;
      const out = { path } as SOverride & Record<string, unknown>;
      const fields = overriddenFields as string[];
      const plain = fields.filter((f) => [...VISUAL, ...PAINTED, ...STROKES, ...CORNERS, ...STYLE_IDS, ...AUTO_LAYOUT, 'effects', 'layoutSizingHorizontal', 'layoutSizingVertical'].includes(f));
      // A paint whose only change is its variable is reported as boundVariables, not fills.
      this.putExact(out, node, fields.includes('boundVariables') ? [...new Set([...plain, ...PAINTED, 'effects'])] : plain);
      this.paints(out);
      if (fields.includes('width') || fields.includes('height')) {
        out.w = node.width;
        out.h = node.height;
      }
      if (node.type === 'TEXT' && fields.some((f) => TEXT_OVERRIDES.includes(f) || f === 'fills')) this.text(out, node);
      if ('boundVariables' in node && fields.includes('boundVariables') && node.boundVariables) {
        const { fills, strokes, effects, layoutGrids, componentProperties, ...plainBound } = node.boundVariables as Record<string, unknown>;
        if (Object.keys(plainBound).length) out.bound = clone(plainBound);
      }
      if (node.type === 'INSTANCE') {
        // Figma doesn't always report a nested instance moved to another variant, so always record its target.
        if (path.length) {
          const main = await node.getMainComponentAsync();
          if (main) {
            this.need(main);
            out.swap = main.key;
          }
        }
        if (fields.includes('componentProperties')) {
          const props = await this.instanceProps(node);
          if (props) out.props = props;
        }
      }
      if (Object.keys(out).length > 1) result.push(out);
    }
    return result;
  }

  // Like put, but keeps values equal to the default: an override can set a value back to it.
  private putExact(out: Record<string, unknown>, node: SceneNode, fields: readonly string[]) {
    const source = node as unknown as Record<string, unknown>;
    for (const field of fields) {
      try {
        if (field in node && typeof source[field] !== 'symbol') out[field] = clone(source[field]);
      } catch {
        continue;
      }
    }
  }

  private async node(node: SceneNode): Promise<SChild> {
    if (node.type === 'INSTANCE') return this.instance(node);
    const out = { type: node.type } as SNode & Record<string, unknown>;
    this.put(out, node, VISUAL);
    this.place(out, node);
    await this.geometry(out, node);
    this.put(out, node, [...AUTO_LAYOUT, ...SHAPE]);
    if (node.type === 'TEXT') {
      this.put(out, node, TEXT);
      this.text(out, node);
    }
    if ('children' in node) out.children = await this.children(node.children);
    return out;
  }

  private async children(children: readonly SceneNode[]) {
    const result: SChild[] = [];
    for (const child of children) result.push(await this.node(child));
    return result;
  }

  private async definitions(owner: ComponentNode | ComponentSetNode) {
    if (owner.type === 'COMPONENT' && owner.parent?.type === 'COMPONENT_SET') return undefined;
    const out: SComponent['props'] = [];
    for (const [name, def] of Object.entries(owner.componentPropertyDefinitions)) {
      if (def.type === 'VARIANT') continue;
      if (def.type === 'SLOT') {
        out.push({ name, type: def.type, value: '', slot: { description: def.description ?? '', slotSettings: clone(def.slotSettings ?? {}) } });
        continue;
      }
      let value: string | boolean = def.defaultValue as string | boolean;
      if (def.type === 'INSTANCE_SWAP') {
        const target = await figma.getNodeByIdAsync(String(value));
        if (target?.type !== 'COMPONENT') continue;
        this.need(target);
        value = target.key;
      }
      out.push({ name, type: def.type, value });
    }
    return out.length ? out : undefined;
  }

  private async component(owner: ComponentNode | ComponentSetNode) {
    this.deps = new Set();
    const root = { type: owner.type } as SNode & Record<string, unknown>;
    this.put(root, owner, VISUAL);
    this.place(root, owner);
    await this.geometry(root, owner);
    this.put(root, owner, AUTO_LAYOUT);
    const variants: SComponent['variants'] = [];
    if (owner.type === 'COMPONENT_SET') {
      for (const variant of owner.children) {
        const out = (await this.node(variant)) as SNode & Record<string, unknown>;
        out.key = (variant as ComponentNode).key;
        variants.push(out as never);
      }
    } else {
      root.children = await this.children(owner.children);
    }
    const props = await this.definitions(owner);
    this.deps.delete(owner.key);
    const result: SComponent = { key: owner.key, name: owner.name, description: owner.description, root, variants, deps: [...this.deps] };
    if (props) result.props = props;
    this.components[owner.key] = result;
  }

  /** Reads everything queued, and every component those need. */
  async run(onProgress?: (done: number, total: number) => void) {
    for (let i = 0; i < this.queue.length; i++) {
      await this.component(this.queue[i]!);
      onProgress?.(i + 1, this.queue.length);
    }
    for (const hash of this.imageHashes) {
      const bytes = await figma.getImageByHash(hash)?.getBytesAsync();
      if (bytes) this.images[hash] = figma.base64Encode(bytes);
    }
  }
}

export async function readVariables(): Promise<SCollection[]> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const variables = await figma.variables.getLocalVariablesAsync();
  return collections.map((collection) => ({
    id: collection.id,
    name: collection.name,
    defaultModeId: collection.defaultModeId,
    modes: collection.modes.map((mode) => ({ id: mode.modeId, name: mode.name })),
    variables: variables
      .filter((variable) => variable.variableCollectionId === collection.id)
      .map((variable) => ({
        id: variable.id,
        name: variable.name,
        type: variable.resolvedType,
        scopes: variable.scopes,
        codeSyntax: variable.codeSyntax,
        values: clone(variable.valuesByMode),
      })),
  }));
}

export async function readStyles(): Promise<{ text: SStyle[]; effect: SStyle[]; paint: SStyle[] }> {
  const [text, effect, paint] = await Promise.all([figma.getLocalTextStylesAsync(), figma.getLocalEffectStylesAsync(), figma.getLocalPaintStylesAsync()]);
  return {
    text: text.map((s) => ({
      id: s.id, name: s.name, description: s.description, fontName: s.fontName, fontSize: s.fontSize, letterSpacing: s.letterSpacing, lineHeight: s.lineHeight,
      textCase: s.textCase, textDecoration: s.textDecoration, paragraphIndent: s.paragraphIndent, paragraphSpacing: s.paragraphSpacing, bound: clone(s.boundVariables ?? {}),
    })),
    effect: effect.map((s) => ({ id: s.id, name: s.name, description: s.description, effects: clone(s.effects) })),
    paint: paint.map((s) => ({ id: s.id, name: s.name, description: s.description, paints: clone(s.paints) })),
  };
}

export async function readSnapshot(owners: (ComponentNode | ComponentSetNode)[], onProgress?: (done: number, total: number) => void): Promise<Snapshot> {
  const reader = new Reader();
  owners.forEach((owner) => reader.add(owner));
  await reader.run(onProgress);
  const [collections, styles] = await Promise.all([readVariables(), readStyles()]);
  return { collections, styles, components: reader.components, images: reader.images };
}
