// Rebuilds Halo's variables, styles and components in the open file from the data the plugin carries.
// Only what a click needs gets built, on a "Halo components" page, and it is reused on later clicks.
import type { SChild, SComponent, SInstance, SNode, SOverride, Snapshot, SStyle, SVariant } from './types';

const PAGE_NAME = 'Halo components';
const TAG = 'halo';
const TOTAL = 'haloTotal';

const AUTO_LAYOUT_ORDER = [
  'layoutMode', 'layoutWrap', 'clipsContent', 'primaryAxisAlignItems', 'counterAxisAlignItems', 'counterAxisAlignContent', 'paddingLeft', 'paddingRight',
  'paddingTop', 'paddingBottom', 'itemSpacing', 'counterAxisSpacing', 'itemReverseZIndex', 'strokesIncludedInLayout',
];
const SIMPLE = [
  'visible', 'opacity', 'blendMode', 'isMask', 'maskType', 'locked', 'strokeAlign', 'strokeCap', 'strokeJoin', 'strokeMiterLimit', 'dashPattern', 'strokeWeight',
  'strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight', 'cornerRadius', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius',
  'bottomRightRadius', 'cornerSmoothing', 'arcData', 'pointCount', 'innerRadius', 'vectorPaths', 'textAlignHorizontal', 'textAlignVertical', 'textTruncation', 'maxLines',
  'paragraphIndent', 'paragraphSpacing', 'constraints',
];
const LAYOUT_CHILD = ['layoutPositioning', 'layoutAlign', 'layoutGrow'];
const SIZE_LIMITS = ['minWidth', 'maxWidth', 'minHeight', 'maxHeight'];

type Alias = { type: 'VARIABLE_ALIAS'; id: string };
type Owner = ComponentNode | ComponentSetNode;
type Holder = PageNode | SectionNode;
type Parent = BaseNode & ChildrenMixin;
type Writable = Record<string, unknown>;

const isAlias = (value: unknown): value is Alias => typeof value === 'object' && value !== null && (value as Alias).type === 'VARIABLE_ALIAS';
const baseName = (prop: string) => prop.split('#')[0]!;
const fontId = (font: FontName) => `${font.family}/${font.style}`;

export interface BuildOptions {
  /** Use the file's own variables and styles by id. Only for checking a rebuild inside the Halo file. */
  sameFile?: boolean;
  /** Where to build instead of the Halo components page. */
  holder?: Holder;
}

export class Builder {
  private variables = new Map<string, Variable>();
  private collections = new Map<string, VariableCollection>();
  private modes = new Map<string, string>();
  private styles = new Map<string, string>();
  private images = new Map<string, string>();
  private components = new Map<string, ComponentNode>();
  private owners = new Map<string, Owner>();
  private building = new Set<string>();
  private unfinished = new Set<string>();
  private definitions = new Map<string, SComponent>();
  private propNames = new Map<string, Map<string, string>>();
  private fontsLoaded = new Set<string>();
  private tokensReady = false;
  private fonts = new Map<string, FontName>();
  private holder: Holder | null = null;
  private nextX = 0;

  constructor(
    private data: Snapshot,
    private options: BuildOptions = {},
  ) {}

  private tag(node: { setPluginData(key: string, value: string): void }, value: string) {
    if (!this.options.sameFile) node.setPluginData(TAG, value);
  }

  /** Finds what an earlier click already built in this file. */
  async prepare() {
    if (this.options.sameFile) {
      for (const variable of await figma.variables.getLocalVariablesAsync()) this.variables.set(variable.id, variable);
      for (const style of [...(await figma.getLocalTextStylesAsync()), ...(await figma.getLocalEffectStylesAsync()), ...(await figma.getLocalPaintStylesAsync())]) this.styles.set(style.id, style.id);
      this.holder = this.options.holder ?? null;
      return;
    }
    for (const collection of await figma.variables.getLocalVariableCollectionsAsync()) {
      const saved = collection.getPluginData(TAG);
      if (!saved) continue;
      const { id, modes, done } = JSON.parse(saved) as { id: string; modes: Record<string, string>; done?: boolean };
      this.collections.set(id, collection);
      if (!done) this.unfinished.add(id);
      for (const [from, to] of Object.entries(modes)) this.modes.set(from, to);
    }
    for (const variable of await figma.variables.getLocalVariablesAsync()) {
      const id = variable.getPluginData(TAG);
      if (id) this.variables.set(id, variable);
    }
    for (const style of [...(await figma.getLocalTextStylesAsync()), ...(await figma.getLocalEffectStylesAsync()), ...(await figma.getLocalPaintStylesAsync())]) {
      const id = style.getPluginData(TAG);
      if (id) this.styles.set(id, style.id);
    }
    const page = figma.root.children.find((p) => p.name === PAGE_NAME);
    if (page) {
      await page.loadAsync();
      this.holder = page;
      this.index(page);
    }
  }

  private index(root: ChildrenMixin) {
    for (const node of root.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })) {
      const key = node.getPluginData(TAG);
      if (!key) continue;
      if (node.type === 'COMPONENT') this.components.set(key, node);
      if (node.parent?.type !== 'COMPONENT_SET') this.owners.set(key, node);
      this.nextX = Math.max(this.nextX, node.parent?.type === 'COMPONENT_SET' ? 0 : node.x + node.width + 200);
    }
  }

  find(key: string) {
    const owner = this.owners.get(key);
    if (owner?.removed) {
      this.owners.delete(key);
      return null;
    }
    return owner ?? null;
  }

  private async getHolder() {
    if (this.holder && !this.holder.removed) return this.holder;
    try {
      const page = figma.createPage();
      page.name = PAGE_NAME;
      this.holder = page;
    } catch {
      // The free plan limits pages, so fall back to a section beside the design.
      const section = figma.createSection();
      section.name = PAGE_NAME;
      section.x = figma.viewport.bounds.x - 8000;
      section.y = figma.viewport.bounds.y;
      section.resizeWithoutConstraints(4000, 4000);
      this.holder = section;
    }
    return this.holder;
  }

  private async loadFonts(fonts: FontName[]) {
    for (const font of fonts) {
      const id = fontId(font);
      if (this.fonts.has(id)) continue;
      try {
        await figma.loadFontAsync(font);
        this.fonts.set(id, font);
      } catch {
        const fallback = { family: 'Inter', style: 'Regular' };
        await figma.loadFontAsync(fallback);
        this.fonts.set(id, fallback);
      }
    }
  }

  private font(font: FontName) {
    return this.fonts.get(fontId(font)) ?? font;
  }

  private collectFonts(value: unknown, into: Map<string, FontName>) {
    if (Array.isArray(value)) {
      for (const item of value) this.collectFonts(item, into);
    } else if (typeof value === 'object' && value !== null) {
      for (const [key, item] of Object.entries(value)) {
        if (key === 'fontName' && item && typeof (item as FontName).family === 'string') into.set(fontId(item as FontName), item as FontName);
        else this.collectFonts(item, into);
      }
    }
  }

  /** Creates Halo's variables once per file. A plan with too few modes keeps the default mode only. */
  async ensureVariables() {
    if (this.options.sameFile) return;
    const pending: Snapshot['collections'] = [];
    for (const source of this.data.collections) {
      let collection = this.collections.get(source.id);
      if (!collection) {
        collection = figma.variables.createVariableCollection(source.name);
        const first = collection.modes[0]!.modeId;
        const main = source.modes.find((mode) => mode.id === source.defaultModeId) ?? source.modes[0]!;
        collection.renameMode(first, main.name);
        const modes: Record<string, string> = { [main.id]: first };
        for (const mode of source.modes) {
          if (mode.id === main.id) continue;
          try {
            modes[mode.id] = collection.addMode(mode.name);
          } catch {
            modes[mode.id] = first;
          }
        }
        for (const [from, to] of Object.entries(modes)) this.modes.set(from, to);
        collection.setPluginData(TAG, JSON.stringify({ id: source.id, modes }));
        this.collections.set(source.id, collection);
        pending.push(source);
      } else if (this.unfinished.has(source.id)) {
        pending.push(source);
      }
      for (const item of source.variables) {
        if (this.variables.has(item.id)) continue;
        const variable = figma.variables.createVariable(item.name, collection, item.type);
        variable.scopes = item.scopes;
        for (const [platform, syntax] of Object.entries(item.codeSyntax)) variable.setVariableCodeSyntax(platform as CodeSyntaxPlatform, syntax);
        variable.setPluginData(TAG, item.id);
        this.variables.set(item.id, variable);
      }
    }
    // Marked done only afterwards, so a run that is cut off gets finished by the next one.
    for (const source of pending) {
      this.setValues(source);
      const modes = Object.fromEntries(source.modes.map((mode) => [mode.id, this.modes.get(mode.id)!]));
      this.collections.get(source.id)!.setPluginData(TAG, JSON.stringify({ id: source.id, modes, done: true }));
    }
  }

  private setValues(source: Snapshot['collections'][number]) {
    const main = source.modes.find((mode) => mode.id === source.defaultModeId) ?? source.modes[0]!;
    const written = new Set<string>();
    for (const mode of [main, ...source.modes.filter((other) => other !== main)]) {
      const target = this.modes.get(mode.id);
      // A mode the plan couldn't add shares the default mode, which already has its values.
      if (!target || written.has(target)) continue;
      written.add(target);
      for (const item of source.variables) {
        const value = this.variableValue(item.values[mode.id]);
        if (value === undefined) continue;
        try {
          this.variables.get(item.id)!.setValueForMode(target, value);
        } catch {
          // One value Figma refuses shouldn't leave the rest of the tokens empty.
        }
      }
    }
  }

  /** Points references at this file's variables, including a colour reference with its own opacity. */
  private variableValue(value: VariableValue | undefined): VariableValue | undefined {
    if (value === undefined) return undefined;
    const alias = (reference: unknown) => {
      const target = this.variable(reference);
      return target && figma.variables.createVariableAlias(target);
    };
    if (isAlias(value)) return alias(value);
    const composed = value as { color?: unknown };
    if (typeof value === 'object' && isAlias(composed.color)) {
      const color = alias(composed.color);
      return color && ({ ...(value as object), color } as VariableValue);
    }
    return value;
  }

  private variable(alias: unknown) {
    return isAlias(alias) ? this.variables.get(alias.id) : undefined;
  }

  async ensureStyles() {
    if (this.options.sameFile) return;
    const { text, effect, paint } = this.data.styles;
    const fonts = new Map<string, FontName>();
    this.collectFonts(text, fonts);
    await this.loadFonts([...fonts.values()]);
    for (const source of text) await this.textStyle(source);
    for (const source of effect) {
      if (this.styles.has(source.id)) continue;
      const style = figma.createEffectStyle();
      style.name = source.name;
      style.description = source.description;
      style.effects = this.effects(source.effects as Effect[]);
      this.tag(style, source.id);
      this.styles.set(source.id, style.id);
    }
    for (const source of paint) {
      if (this.styles.has(source.id)) continue;
      const style = figma.createPaintStyle();
      style.name = source.name;
      style.description = source.description;
      style.paints = await this.paints(source.paints as Paint[]);
      this.tag(style, source.id);
      this.styles.set(source.id, style.id);
    }
  }

  private async textStyle(source: SStyle) {
    if (this.styles.has(source.id)) return;
    const style = figma.createTextStyle();
    style.name = source.name;
    style.description = source.description;
    style.fontName = this.font(source.fontName as FontName);
    style.fontSize = source.fontSize as number;
    style.letterSpacing = source.letterSpacing as LetterSpacing;
    style.lineHeight = source.lineHeight as LineHeight;
    style.textCase = source.textCase as TextCase;
    style.textDecoration = source.textDecoration as TextDecoration;
    style.paragraphIndent = source.paragraphIndent as number;
    style.paragraphSpacing = source.paragraphSpacing as number;
    for (const [field, alias] of Object.entries((source.bound ?? {}) as Record<string, unknown>)) {
      const variable = this.variable(alias);
      if (!variable) continue;
      try {
        style.setBoundVariable(field as VariableBindableTextField, variable);
      } catch {
        // The value set above stays when a binding can't be made, like a missing font.
      }
    }
    this.tag(style, source.id);
    this.styles.set(source.id, style.id);
  }

  private async paints(list: Paint[]) {
    const result: Paint[] = [];
    for (const source of list) {
      const { boundVariables, ...rest } = source as Paint & { boundVariables?: Record<string, unknown> };
      let paint = rest as Paint;
      if (paint.type === 'IMAGE' && paint.imageHash) {
        const hash = this.image(paint.imageHash);
        if (!hash) continue;
        paint = { ...paint, imageHash: hash };
      }
      const color = this.variable(boundVariables?.color);
      if (color && paint.type === 'SOLID') paint = figma.variables.setBoundVariableForPaint(paint, 'color', color);
      result.push(paint);
    }
    return result;
  }

  private image(hash: string) {
    if (this.options.sameFile) return hash;
    const known = this.images.get(hash);
    if (known) return known;
    const bytes = this.data.images[hash];
    if (!bytes) return null;
    const created = figma.createImage(figma.base64Decode(bytes)).hash;
    this.images.set(hash, created);
    return created;
  }

  private effects(list: Effect[]) {
    return list.map((source) => {
      const { boundVariables, ...rest } = source as Effect & { boundVariables?: Record<string, unknown> };
      let effect = rest as Effect;
      for (const [field, alias] of Object.entries(boundVariables ?? {})) {
        const variable = this.variable(alias);
        if (variable) effect = figma.variables.setBoundVariableForEffect(effect, field as VariableBindableEffectField, variable);
      }
      return effect;
    });
  }

  private async styleId(setter: (id: string) => Promise<void>, id: unknown) {
    const mapped = typeof id === 'string' && id ? this.styles.get(id) : undefined;
    if (mapped) await setter(mapped);
  }

  /** Applies whichever fields are present. Used for new layers and for overrides on instances. */
  private async apply(node: SceneNode, s: Writable) {
    const target = node as unknown as Writable;
    const set = (field: string) => {
      if (!(field in s)) return;
      try {
        target[field] = s[field];
      } catch {
        // A field that doesn't apply to this layer type or state is safe to leave.
      }
    };
    if ('name' in s) node.name = s.name as string;
    AUTO_LAYOUT_ORDER.forEach(set);
    if (typeof s.w === 'number' && typeof s.h === 'number' && 'resizeWithoutConstraints' in node) {
      const height = node.type === 'LINE' ? 0 : Math.max(s.h, 0.01);
      try {
        node.resizeWithoutConstraints(Math.max(s.w, 0.01), height);
      } catch {
        // Instances with sizes set by their own layout refuse a resize.
      }
    }
    SIMPLE.forEach(set);
    if (s.fills) (node as GeometryMixin).fills = await this.paints(s.fills as Paint[]);
    if (s.strokes) (node as GeometryMixin).strokes = await this.paints(s.strokes as Paint[]);
    if (s.effects) (node as BlendMixin).effects = this.effects(s.effects as Effect[]);
    if (s.fillStyleId) await this.styleId((id) => (node as MinimalFillsMixin).setFillStyleIdAsync(id), s.fillStyleId);
    if (s.strokeStyleId) await this.styleId((id) => (node as MinimalStrokesMixin).setStrokeStyleIdAsync(id), s.strokeStyleId);
    if (s.effectStyleId) await this.styleId((id) => (node as BlendMixin).setEffectStyleIdAsync(id), s.effectStyleId);
    LAYOUT_CHILD.forEach(set);
    if (s.transform) (node as LayoutMixin).relativeTransform = s.transform as Transform;
    if (typeof s.x === 'number') node.x = s.x;
    if (typeof s.y === 'number') node.y = s.y;
    if (s.modes) this.applyModes(node, s.modes as Record<string, string>);
  }

  private applyModes(node: SceneNode, modes: Record<string, string>) {
    for (const [collection, mode] of Object.entries(modes)) {
      const target = this.options.sameFile ? null : this.collections.get(collection);
      const modeId = this.modes.get(mode);
      if (target && modeId) node.setExplicitVariableModeForCollection(target, modeId);
    }
  }

  /** Sizing that depends on the layer's children, set once they exist. */
  private finish(node: SceneNode, s: Writable) {
    const target = node as unknown as Writable;
    const assign = (fields: string[]) => {
      for (const field of fields) {
        if (!(field in s)) continue;
        try {
          target[field] = s[field];
        } catch {
          // See apply.
        }
      }
    };
    // Auto layout hugs its children while they are added. A fixed frame needs its mode set before its size.
    if (typeof s.w === 'number' && typeof s.h === 'number' && node.type !== 'INSTANCE' && 'layoutMode' in node && node.layoutMode !== 'NONE') {
      assign(['primaryAxisSizingMode', 'counterAxisSizingMode']);
      node.resizeWithoutConstraints(Math.max(s.w, 0.01), Math.max(s.h, 0.01));
    }
    assign(['primaryAxisSizingMode', 'counterAxisSizingMode', 'layoutSizingHorizontal', 'layoutSizingVertical', ...SIZE_LIMITS]);
    for (const [field, alias] of Object.entries((s.bound ?? {}) as Record<string, unknown>)) {
      const variable = this.variable(alias);
      if (!variable) continue;
      try {
        (node as SceneNode & { setBoundVariable(f: VariableBindableNodeField, v: Variable): void }).setBoundVariable(field as VariableBindableNodeField, variable);
      } catch {
        // The plain value applied earlier stays.
      }
    }
  }

  private async text(node: TextNode, s: Writable) {
    const segments = (s.segments ?? []) as (Writable & { start: number; end: number })[];
    const first = segments.find((segment) => segment.fontName)?.fontName as FontName | undefined;
    if (first) node.fontName = this.font(first);
    if (typeof s.characters === 'string') node.characters = s.characters;
    if (s.textAutoResize) node.textAutoResize = s.textAutoResize as TextNode['textAutoResize'];
    for (const segment of segments) {
      const { start, end } = segment;
      if (end > node.characters.length) continue;
      if (segment.textStyleId) {
        const style = this.styles.get(segment.textStyleId as string);
        if (style) await node.setRangeTextStyleIdAsync(start, end, style);
      } else {
        if (segment.fontName) node.setRangeFontName(start, end, this.font(segment.fontName as FontName));
        if (segment.fontSize) node.setRangeFontSize(start, end, segment.fontSize as number);
        if (segment.textCase) node.setRangeTextCase(start, end, segment.textCase as TextCase);
        if (segment.textDecoration) node.setRangeTextDecoration(start, end, segment.textDecoration as TextDecoration);
        if (segment.letterSpacing) node.setRangeLetterSpacing(start, end, segment.letterSpacing as LetterSpacing);
        if (segment.lineHeight) node.setRangeLineHeight(start, end, segment.lineHeight as LineHeight);
      }
      if (segment.fills) node.setRangeFills(start, end, await this.paints(segment.fills as Paint[]));
      if (segment.fillStyleId) {
        const style = this.styles.get(segment.fillStyleId as string);
        if (style) await node.setRangeFillStyleIdAsync(start, end, style);
      }
      if (segment.hyperlink) node.setRangeHyperlink(start, end, segment.hyperlink as HyperlinkTarget);
      for (const [field, alias] of Object.entries((segment.boundVariables ?? {}) as Record<string, unknown>)) {
        const variable = this.variable(alias);
        if (!variable) continue;
        try {
          node.setRangeBoundVariable(start, end, field as VariableBindableTextField, variable);
        } catch {
          // The plain value set above stays.
        }
      }
    }
  }

  private create(type: string): SceneNode {
    switch (type) {
      // A slot starts as a frame; linking it to its property in link() makes it a slot.
      case 'FRAME': case 'SLOT': return figma.createFrame();
      case 'RECTANGLE': return figma.createRectangle();
      case 'ELLIPSE': return figma.createEllipse();
      case 'LINE': return figma.createLine();
      case 'POLYGON': return figma.createPolygon();
      case 'STAR': return figma.createStar();
      case 'VECTOR': return figma.createVector();
      case 'TEXT': return figma.createText();
      default: throw new Error(`Can't build a layer of type ${type}`);
    }
  }

  private async layer(s: SChild, parent: Parent): Promise<SceneNode> {
    if (s.type === 'INSTANCE') return this.instance(s as SInstance, parent);
    if (s.type === 'GROUP' || s.type === 'BOOLEAN_OPERATION') return this.combined(s, parent);
    const node = this.create(s.type);
    if ('fills' in node) (node as GeometryMixin).fills = [];
    parent.appendChild(node);
    await this.fill(node, s);
    return node;
  }

  private async fill(node: SceneNode, s: SNode) {
    await this.apply(node, s);
    if (node.type === 'TEXT') await this.text(node, s);
    for (const child of s.children ?? []) await this.layer(child, node as unknown as Parent);
    this.finish(node, s);
  }

  // Groups and boolean shapes are made from finished children, built off to the side first.
  private async combined(s: SNode, parent: Parent) {
    const scratch = figma.createFrame();
    (await this.getHolder()).appendChild(scratch);
    const made: SceneNode[] = [];
    for (const child of s.children ?? []) made.push(await this.layer(child, scratch));
    const operations: Record<string, (nodes: SceneNode[], p: BaseNode & ChildrenMixin) => BooleanOperationNode> = {
      UNION: figma.union, SUBTRACT: figma.subtract, INTERSECT: figma.intersect, EXCLUDE: figma.exclude,
    };
    const node = s.type === 'GROUP' ? figma.group(made, scratch) : operations[s.booleanOperation as string]!(made, scratch);
    parent.appendChild(node);
    scratch.remove();
    await this.apply(node, { ...s, w: undefined, h: undefined });
    this.finish(node, s);
    return node;
  }

  private setProps(node: InstanceNode, props: Record<string, string | boolean>) {
    const current = Object.keys(node.componentProperties);
    const values: Record<string, string | boolean> = {};
    for (const [name, value] of Object.entries(props)) {
      const target = current.find((candidate) => baseName(candidate) === baseName(name));
      if (!target) continue;
      const swap = node.componentProperties[target]!.type === 'INSTANCE_SWAP';
      if (swap) {
        const component = this.components.get(value as string);
        if (component) values[target] = component.id;
      } else {
        values[target] = value;
      }
    }
    if (Object.keys(values).length) node.setProperties(values);
  }

  private walk(root: SceneNode, path: number[]) {
    let node: SceneNode | undefined = root;
    for (const index of path) node = node && 'children' in node ? node.children[index] : undefined;
    return node;
  }

  private async overrides(root: InstanceNode, list: SOverride[]) {
    const ordered = [...list].sort((a, b) => a.path.length - b.path.length);
    for (const override of ordered) {
      const node = this.walk(root, override.path);
      if (!node) continue;
      if (node.type === 'INSTANCE' && override.swap) {
        const component = this.components.get(override.swap);
        if (component) node.swapComponent(component);
      }
      if (node.type === 'INSTANCE' && override.props) this.setProps(node, override.props);
      const { path, swap, props, ...fields } = override;
      await this.apply(node, fields);
      if (node.type === 'TEXT' && 'characters' in fields) await this.text(node, fields);
      this.finish(node, fields);
    }
  }

  private async instance(s: SInstance, parent: Parent) {
    const main = this.components.get(s.main);
    if (!main) throw new Error(`Missing a part needed by "${s.name as string}"`);
    const node = main.createInstance();
    parent.appendChild(node);
    if (s.props) this.setProps(node, s.props);
    await this.apply(node, s);
    if (s.overrides) await this.overrides(node, s.overrides);
    this.finish(node, s);
    return node;
  }

  // Connects layers to the properties that drive them, once those properties exist.
  private link(s: SChild, node: SceneNode, names: Map<string, string>) {
    const refs = s.refs as Record<string, string> | undefined;
    if (refs) {
      const mapped: Record<string, string> = {};
      for (const [field, name] of Object.entries(refs)) {
        const target = names.get(name);
        if (target) mapped[field] = target;
      }
      if (Object.keys(mapped).length) node.componentPropertyReferences = mapped;
    }
    if (s.type === 'INSTANCE') {
      if ((s as SInstance).exposed) (node as InstanceNode).isExposedInstance = true;
      return;
    }
    if (!s.children || !('children' in node)) return;
    s.children.forEach((child, index) => {
      const built = node.children[index];
      if (built) this.link(child, built, names);
    });
  }

  private addProps(owner: Owner, def: SComponent) {
    const names = new Map<string, string>();
    for (const prop of def.props ?? []) {
      if (prop.type === 'SLOT') {
        names.set(prop.name, owner.addComponentProperty(baseName(prop.name), 'SLOT', '', prop.slot));
        continue;
      }
      const value = prop.type === 'INSTANCE_SWAP' ? this.components.get(prop.value as string)?.id : prop.value;
      if (value === undefined) continue;
      names.set(prop.name, owner.addComponentProperty(baseName(prop.name), prop.type, value));
    }
    return names;
  }

  /** Takes in the data for a click. It adds to what earlier clicks brought. */
  absorb(data: Snapshot) {
    Object.assign(this.data.components, data.components);
    Object.assign(this.data.images, data.images);
    this.data.collections = data.collections;
    this.data.styles = data.styles;
    for (const def of Object.values(data.components)) {
      this.definitions.set(def.key, def);
      for (const variant of def.variants) this.definitions.set(variant.key, def);
    }
  }

  /** Creates Halo's variables and styles, once per file. */
  async ensureTokens() {
    if (this.tokensReady) return;
    await this.ensureVariables();
    await this.ensureStyles();
    this.tokensReady = true;
  }

  /** True while a set in this file is still missing some of its variants. */
  incomplete(key: string) {
    const owner = this.find(key);
    return owner?.type === 'COMPONENT_SET' && owner.children.length < Number(owner.getPluginData(TOTAL) || 0);
  }

  private built(key: string) {
    const node = this.components.get(key);
    if (node?.removed) {
      this.components.delete(key);
      return undefined;
    }
    return node;
  }

  private keysIn(props: Record<string, string | boolean> | undefined, into: Set<string>) {
    for (const value of Object.values(props ?? {})) if (typeof value === 'string' && this.definitions.has(value)) into.add(value);
  }

  // Every variant or component a layer points at, so only those get built first.
  private needs(s: SChild, into = new Set<string>()) {
    if (s.type === 'INSTANCE') {
      const instance = s as SInstance;
      into.add(instance.main);
      this.keysIn(instance.props, into);
      for (const override of instance.overrides ?? []) {
        if (override.swap) into.add(override.swap);
        this.keysIn(override.props, into);
      }
    }
    for (const child of s.children ?? []) this.needs(child, into);
    return into;
  }

  private async loadFontsFor(def: SComponent) {
    if (this.fontsLoaded.has(def.key)) return;
    const fonts = new Map<string, FontName>();
    this.collectFonts(def, fonts);
    // Every new text layer starts in Inter Regular, and can't be edited until that font is loaded.
    await this.loadFonts([{ family: 'Inter', style: 'Regular' }, ...fonts.values()]);
    this.fontsLoaded.add(def.key);
  }

  /** Builds one variant or plain component, and only the variants it points at. */
  private async need(key: string) {
    if (this.built(key) || this.building.has(key)) return;
    const def = this.definitions.get(key);
    if (!def) throw new Error('This component is missing from the plugin data.');
    const s = def.variants.find((variant) => variant.key === key) ?? def.root;
    this.building.add(key);
    try {
      for (const dep of this.needs(s)) await this.need(dep);
      for (const prop of def.props ?? []) if (prop.type === 'INSTANCE_SWAP') await this.need(prop.value as string);
      await this.loadFontsFor(def);
      const holder = await this.getHolder();
      const made: ComponentNode[] = [];
      try {
        if (def.variants.length) await this.addVariant(def, s as SVariant, holder, made);
        else await this.buildSingle(def, holder, made);
      } catch (error) {
        for (const node of made) if (!node.removed) node.remove();
        throw error;
      }
    } finally {
      this.building.delete(key);
    }
  }

  /** Builds only what a click needs to place: the default look of the component. */
  async firstComponent(key: string) {
    const def = this.definitions.get(key);
    if (!def) throw new Error('This component is missing from the plugin data.');
    // The default variant is the top-left one, as in Figma.
    const first = [...def.variants].sort((a, b) => (a.y as number) - (b.y as number) || (a.x as number) - (b.x as number))[0];
    const target = first?.key ?? key;
    await this.need(target);
    return this.built(target)!;
  }

  /** Builds one more missing variant, newest component first. Returns false when none are left. */
  async completeNext() {
    for (const [key, owner] of [...this.owners].reverse()) {
      const def = this.data.components[key];
      if (!def?.variants.length || owner.removed) continue;
      const next = def.variants.find((variant) => !this.built(variant.key));
      if (next) {
        await this.need(next.key);
        return true;
      }
    }
    return false;
  }

  private async variant(s: SVariant | SNode, key: string, holder: Holder, made: ComponentNode[]) {
    const component = figma.createComponent();
    made.push(component);
    holder.appendChild(component);
    component.fills = [];
    await this.fill(component, s);
    this.tag(component, key);
    this.components.set(key, component);
    return component;
  }

  private position(owner: Owner) {
    owner.x = this.nextX;
    owner.y = 0;
    this.nextX = owner.x + owner.width + 200;
  }

  private async buildSingle(def: SComponent, holder: Holder, made: ComponentNode[]) {
    const component = await this.variant(def.root, def.key, holder, made);
    component.name = def.name;
    component.description = def.description;
    const names = this.addProps(component, def);
    for (const [index, child] of (def.root.children ?? []).entries()) this.link(child, component.children[index]!, names);
    this.position(component);
    this.owners.set(def.key, component);
  }

  // A set starts with one variant, so it can be placed straight away, and grows from there.
  private async createSet(def: SComponent, first: ComponentNode, holder: Holder) {
    const set = figma.combineAsVariants([first], holder);
    set.name = def.name;
    set.description = def.description;
    const { x, y, ...root } = def.root;
    set.fills = [];
    await this.apply(set as unknown as SceneNode, root);
    this.finish(set as unknown as SceneNode, root);
    this.tag(set, def.key);
    if (!this.options.sameFile) set.setPluginData(TOTAL, String(def.variants.length));
    this.position(set);
    this.owners.set(def.key, set);
    this.propNames.set(def.key, this.addProps(set, def));
    return set;
  }

  private namesOf(owner: Owner, def: SComponent) {
    let names = this.propNames.get(def.key);
    if (names) return names;
    names = new Map<string, string>();
    const definitions = owner.componentPropertyDefinitions;
    for (const prop of def.props ?? []) {
      const match = Object.keys(definitions).find((name) => baseName(name) === baseName(prop.name) && definitions[name]!.type === prop.type);
      if (match) names.set(prop.name, match);
    }
    this.propNames.set(def.key, names);
    return names;
  }

  private async addVariant(def: SComponent, variant: SVariant, holder: Holder, made: ComponentNode[]) {
    const component = await this.variant(variant, variant.key, holder, made);
    let owner = this.owners.get(def.key);
    if (owner?.removed) owner = undefined;
    if (owner) (owner as ComponentSetNode).appendChild(component);
    else owner = await this.createSet(def, component, holder);
    component.x = variant.x as number;
    component.y = variant.y as number;
    const names = this.namesOf(owner, def);
    (variant.children ?? []).forEach((child, index) => this.link(child, component.children[index]!, names));
  }
}

/** The instance a click places: a set's default variant, or the component itself. */
export function newInstance(owner: Owner) {
  return (owner.type === 'COMPONENT_SET' ? owner.defaultVariant : owner).createInstance();
}
