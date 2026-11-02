// Builds CSS variables + JS from Figma's native variable export.
//
// Input:  figma/<Collection>/<Mode>.tokens.json   (Figma → Local variables → Export modes)
// Output: dist/tokens.css, dist/tokens.json, dist/index.js, dist/index.d.ts
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'figma');
const DIST = path.join(ROOT, 'dist');
const PREFIX = 'halo';

const FONT_WEIGHTS = { thin: 100, light: 300, regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 };
const FONT_FALLBACK = 'system-ui, -apple-system, "Segoe UI", sans-serif';

// ---------- read ----------

/** @type {Map<string, {modes: string[], tokens: Map<string, any>}>} */
const collections = new Map();

for (const dir of fs.readdirSync(SRC, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const collection = dir.name.trim();
  const files = fs.readdirSync(path.join(SRC, dir.name)).filter((f) => f.endsWith('.tokens.json'));
  const modes = files.map((f) => f.replace('.tokens.json', ''));
  // The light/default mode always comes first.
  modes.sort((a, b) => rank(a) - rank(b));
  const tokens = new Map();
  for (const mode of modes) {
    const json = JSON.parse(fs.readFileSync(path.join(SRC, dir.name, `${mode}.tokens.json`), 'utf8'));
    walk(json, [], (name, tok) => {
      if (!tokens.has(name)) tokens.set(name, { collection, name, type: tok.$type, byMode: {} });
      tokens.get(name).byMode[mode] = parseValue(collection, tok);
    });
  }
  // Breakpoint collections (e.g. Layout): modes are screen sizes, ordered by min-width.
  const bp = tokens.get('breakpoint/min-width');
  let breakpoints = null;
  if (bp) {
    breakpoints = Object.fromEntries(modes.map((m) => [m, bp.byMode[m].raw]));
    modes.sort((a, b) => breakpoints[a] - breakpoints[b]);
  }
  collections.set(collection, { modes, tokens, breakpoints });
}

function rank(mode) {
  const m = mode.toLowerCase();
  return m === 'light' || m === 'default' || m === 'mode 1' ? 0 : 1;
}

function walk(node, trail, fn) {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (child && typeof child === 'object' && '$type' in child) fn([...trail, key].join('/'), child);
    else if (child && typeof child === 'object') walk(child, [...trail, key], fn);
  }
}

function parseValue(collection, tok) {
  const v = tok.$value;
  const aliasData = tok.$extensions?.['com.figma.aliasData'];
  const alpha = typeof v === 'object' && v !== null && typeof v.alpha === 'number' ? v.alpha : 1;
  if (typeof v === 'string' && /^\{.+\}$/.test(v)) {
    return { alias: { collection, name: v.slice(1, -1).split('.').join('/') }, alpha: 1 };
  }
  if (aliasData) {
    return { alias: { collection: aliasData.targetVariableSetName.trim(), name: aliasData.targetVariableName }, alpha };
  }
  if (tok.$type === 'color') return { raw: v.hex.slice(0, 7).toUpperCase(), alpha };
  return { raw: v, alpha: 1 };
}

// ---------- naming ----------

function cssName(collection, name) {
  let parts = name.split('/').map((p) => p.trim().toLowerCase().replace(/\s+/g, '-'));
  if (collection === 'Typography' && ['family', 'weight', 'size'].includes(parts[0])) parts[0] = `font-${parts[0]}`;
  if (parts[0] === 'colours' || parts[0] === 'colors') parts[0] = 'color';
  // "spacing/spacing-sm" → "spacing-sm"
  parts = parts.filter((p, i) => !(parts[i + 1] && parts[i + 1].startsWith(`${p}-`)));
  return parts.join('-');
}

const cssVar = (t) => `--${PREFIX}-${cssName(t.collection, t.name)}`;

function lookup(ref) {
  const t = collections.get(ref.collection)?.tokens.get(ref.name);
  if (!t) throw new Error(`Unresolved alias → ${ref.collection}/${ref.name}`);
  return t;
}

// ---------- values ----------

function cssValue(t, mode) {
  const v = t.byMode[mode] ?? Object.values(t.byMode)[0];
  if (v.alias) {
    const ref = `var(${cssVar(lookup(v.alias))})`;
    return v.alpha < 1 ? `color-mix(in srgb, ${ref} ${round(v.alpha * 100)}%, transparent)` : ref;
  }
  return formatRaw(t, v.raw, v.alpha);
}

function formatRaw(t, raw, alpha) {
  if (t.type === 'color') return alpha < 1 ? hexAlpha(raw, alpha) : raw;
  if (t.type === 'number') {
    if (raw === 0) return '0';
    if (/(^|\/)columns$/.test(t.name)) return String(raw);
    const typographic = t.collection === 'Typography' && /^(size|line-height)\//.test(t.name);
    return typographic ? `${round(raw / 16)}rem` : `${raw}px`;
  }
  if (t.collection === 'Typography' && t.name.startsWith('weight/')) {
    return String(FONT_WEIGHTS[String(raw).toLowerCase().replace(/[\s-]/g, '')] ?? raw);
  }
  if (t.collection === 'Typography' && t.name.startsWith('family/')) return `"${raw}", ${FONT_FALLBACK}`;
  return JSON.stringify(raw);
}

function resolved(t, mode) {
  const v = t.byMode[mode] ?? Object.values(t.byMode)[0];
  if (!v.alias) return v.alpha < 1 ? hexAlpha(v.raw, v.alpha) : v.raw;
  const target = lookup(v.alias);
  const sameCollection = target.collection === t.collection;
  const out = resolved(target, sameCollection ? mode : undefined);
  return v.alpha < 1 && typeof out === 'string' ? hexAlpha(out, v.alpha) : out;
}

const hexAlpha = (hex, a) => hex.slice(0, 7) + Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase();
const round = (n) => Math.round(n * 10000) / 10000;

// ---------- write ----------

const all = [...collections.values()].flatMap((c) => [...c.tokens.values()]);
const block = (selector, lines) => `${selector} {\n${lines.map((l) => `  ${l}`).join('\n')}\n}\n`;

const rootLines = ['color-scheme: light;'];
const themed = []; // [modeName, lines]
const responsive = []; // [minWidth, lines]
for (const [, c] of collections) {
  const [base, ...others] = c.modes;
  for (const t of c.tokens.values()) rootLines.push(`${cssVar(t)}: ${cssValue(t, base)};`);
  let prev = base;
  for (const mode of others) {
    // Breakpoints build on the previous (smaller) one; themes build on the base mode.
    const from = c.breakpoints ? prev : base;
    // A token that points at another themed token, like button-secondary at surface-primary, is repeated
    // even when its text is the same, so it resolves again inside a dark section of a light page.
    const pointsAtThemed = (t) => {
      const alias = (t.byMode[mode] ?? Object.values(t.byMode)[0]).alias;
      return !c.breakpoints && alias && lookup(alias).collection === t.collection;
    };
    const lines = [...c.tokens.values()]
      .filter((t) => cssValue(t, mode) !== cssValue(t, from) || pointsAtThemed(t))
      .map((t) => `${cssVar(t)}: ${cssValue(t, mode)};`);
    if (c.breakpoints) responsive.push([c.breakpoints[mode], lines]);
    else themed.push([mode.toLowerCase(), lines]);
    prev = mode;
  }
}

let css = `/* Generated by @halo-ds/tokens. Do not edit. Source: figma/*.tokens.json */\n\n`;
css += block(':root,\n[data-theme="light"]', rootLines);
for (const [mode, lines] of themed) {
  const scheme = mode === 'dark' ? ['color-scheme: dark;'] : [];
  css += '\n' + block(`[data-theme="${mode}"]`, [...scheme, ...lines]);
  if (mode === 'dark') {
    const inner = block('[data-theme="system"]', [...scheme, ...lines]).replace(/^/gm, '  ').trimEnd();
    css += `\n@media (prefers-color-scheme: dark) {\n${inner}\n}\n`;
  }
}
for (const [minWidth, lines] of responsive) {
  const inner = block(':root', lines).replace(/^/gm, '  ').trimEnd();
  css += `\n@media (min-width: ${minWidth}px) {\n${inner}\n}\n`;
}

const modesOf = (t) => collections.get(t.collection).modes;
const json = all.map((t) => ({
  name: t.name,
  collection: t.collection,
  type: t.type,
  cssVar: cssVar(t),
  values: Object.fromEntries(modesOf(t).map((m) => [m.toLowerCase(), resolved(t, m)])),
  alias: Object.fromEntries(
    modesOf(t).map((m) => {
      const v = t.byMode[m] ?? Object.values(t.byMode)[0];
      return [m.toLowerCase(), v.alias ? `${v.alias.collection}/${v.alias.name}` : null];
    }),
  ),
}));

const vars = Object.fromEntries(all.map((t) => [cssName(t.collection, t.name), `var(${cssVar(t)})`]));

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, 'tokens.css'), css);
fs.writeFileSync(path.join(DIST, 'tokens.json'), JSON.stringify(json, null, 2) + '\n');
fs.writeFileSync(
  path.join(DIST, 'index.js'),
  `export const vars = ${JSON.stringify(vars, null, 2)};\n\nexport const tokens = ${JSON.stringify(json)};\n`,
);
fs.writeFileSync(
  path.join(DIST, 'index.d.ts'),
  `/** CSS custom property references, e.g. vars['surface-primary'] → "var(--${PREFIX}-surface-primary)" */\n` +
    `export declare const vars: ${JSON.stringify(vars, null, 2)};\n\n` +
    `export type TokenName = keyof typeof vars;\n\n` +
    `export interface Token {\n  name: string;\n  collection: string;\n  type: 'color' | 'number' | 'string' | 'boolean';\n  cssVar: string;\n  values: Record<string, string | number>;\n  alias: Record<string, string | null>;\n}\n\n` +
    `export declare const tokens: Token[];\n`,
);

console.log(
  `@halo-ds/tokens: ${all.length} tokens from ${collections.size} collections ` +
    `(${[...collections].map(([n, c]) => `${n}: ${c.modes.join('/')}`).join(', ')})`,
);
