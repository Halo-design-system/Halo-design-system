// Gathers what the MCP server and `docs` need, at build time, into src/generated/data.json:
// each component's props (read from the React source with the TypeScript compiler), the code of
// every example on the website, and the design tokens. Nothing here runs on users' machines.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const reactSrc = join(root, 'packages/react/src');
const site = join(root, 'apps/site/src');

// ---------- Props, from the TypeScript types ----------

function readProps() {
  const config = ts.readConfigFile(join(root, 'packages/react/tsconfig.json'), ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, join(root, 'packages/react'));
  const program = ts.createProgram([join(reactSrc, 'index.ts')], { ...parsed.options, noEmit: true });
  const checker = program.getTypeChecker();
  const index = program.getSourceFile(join(reactSrc, 'index.ts'));
  const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(index));
  const ours = (decl) => decl.getSourceFile().fileName.replace(/\\/g, '/').startsWith(reactSrc.replace(/\\/g, '/'));

  const out = {};
  for (const sym of exports) {
    if (!sym.name.endsWith('Props')) continue;
    const target = sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym;
    const decl = target.declarations?.[0];
    if (!decl) continue;
    const type = checker.getDeclaredTypeOfSymbol(target);
    // A union (like Button with or without a label) has props in each part, so gather them all
    const parts = type.isUnion() ? type.types : [type];
    const props = new Map();
    const requiredIn = new Map();
    for (const part of parts) {
      for (const p of checker.getPropertiesOfType(part)) {
        const d = p.declarations?.[0];
        if (!d || !ours(d)) continue;
        if (!(p.flags & ts.SymbolFlags.Optional)) requiredIn.set(p.name, (requiredIn.get(p.name) ?? 0) + 1);
        if (props.has(p.name)) continue;
        const t = checker.typeToString(checker.getTypeOfSymbolAtLocation(p, d), undefined, ts.TypeFormatFlags.NoTruncation);
        props.set(p.name, {
          name: p.name,
          type: t.length > 160 ? `${t.slice(0, 157)}...` : t,
          required: false,
          description: ts.displayPartsToString(p.getDocumentationComment(checker)).replace(/\s+/g, ' ').trim(),
        });
      }
    }
    // Required only when every form of the props needs it (Button's label and aria-label are either/or)
    for (const p of props.values()) p.required = requiredIn.get(p.name) === parts.length;
    out[sym.name.replace(/Props$/, '')] = [...props.values()];
  }
  return out;
}

// ---------- Examples, from the website ----------

function readDemo(file) {
  const raw = readFileSync(file, 'utf8');
  const head = raw.match(/^\/\*\*([\s\S]*?)\*\/\r?\n/);
  const lines = (head?.[1] ?? '').split('\n').map((l) => l.replace(/^\s*\* ?/, '').trim()).filter(Boolean);
  return { title: lines[0] ?? 'Example', description: lines.slice(1).join(' '), code: raw.slice(head?.[0].length ?? 0).trim() };
}

function readExamples() {
  const out = {};
  for (const f of readdirSync(join(site, 'examples'))) {
    const slug = f.replace(/\.tsx$/, '');
    out[slug] = [{ title: 'Overview', description: '', code: readFileSync(join(site, 'examples', f), 'utf8').trim() }];
  }
  for (const slug of readdirSync(join(site, 'demos'))) {
    const dir = join(site, 'demos', slug);
    for (const f of readdirSync(dir).sort()) (out[slug] ??= []).push(readDemo(join(dir, f)));
  }
  return out;
}

// ---------- Tokens ----------

function readTokens() {
  const all = JSON.parse(readFileSync(join(root, 'packages/tokens/dist/tokens.json'), 'utf8'));
  // Primitives are the raw palette; people should use the semantic names, so leave them out
  return all
    .filter((t) => t.collection !== 'Primitives')
    .map((t) => ({ name: t.name, cssVar: t.cssVar, group: t.collection, values: t.values }));
}

const data = { props: readProps(), examples: readExamples(), tokens: readTokens() };
const outDir = join(dirname(fileURLToPath(import.meta.url)), '../src/generated');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'data.json'), JSON.stringify(data));
console.log(`data: props for ${Object.keys(data.props).length} components, examples for ${Object.keys(data.examples).length}, ${data.tokens.length} tokens`);
