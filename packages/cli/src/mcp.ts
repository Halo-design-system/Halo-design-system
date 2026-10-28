// `halo-ds mcp`: a Model Context Protocol server over stdio, so AI assistants (Claude Code, Cursor,
// VS Code, Windsurf...) can look up Halo components while they write code. Written by hand on
// JSON-RPC, so the CLI stays free of dependencies. Only protocol messages go to stdout.
import { createInterface } from 'node:readline';
import { all, groups } from '../../../apps/site/src/catalog';
import type { Entry } from '../../../apps/site/src/catalog';
import { guides } from '../../../apps/site/src/guide';
import data from './generated/data.json';

declare const __VERSION__: string;

const SITE = 'https://chidindu06f.github.io/Halo-design-system';
const VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];

interface Prop { name: string; type: string; required: boolean; description: string }
interface Data {
  props: Record<string, Prop[]>;
  examples: Record<string, { title: string; description: string; code: string }[]>;
  tokens: { name: string; cssVar: string; group: string; values: Record<string, string | number> }[];
}
// The JSON is made by scripts/data.mjs at build time; this is its shape
const { props, examples, tokens } = data as unknown as Data;

const shared: Record<string, string> = { 'event-calendar': 'calendar', 'tree-select': 'tree' };
const guideFor = (slug: string) => guides[slug] ?? guides[shared[slug] ?? ''];

// ---------- What the tools return ----------

export const RULES = `# Using Halo

## Setup
- Install: \`npm install @halo-ds/react\`. That is all: styles, design tokens and the Geist font load by themselves. Do not add CSS or font imports.
- Mode: set \`data-theme\` on the html element to \`light\`, \`dark\` or \`system\`.
- Brand colour: run \`npx halo-ds theme "#2F6BFF"\`, or set the \`--halo-*\` brand variables in any CSS file (yours always win).
- Toasts: wrap the app once in \`<ToastProvider>\`, then call \`useToast().toast({...})\`.
- Next.js: components work in server components; they are client components inside.

## Rules
- Use Halo components for buttons, fields, menus, dialogs, tables and so on. Don't rebuild them from plain HTML or add another UI library alongside.
- Use design tokens (\`var(--halo-...)\`) for colour, spacing and radius. Never hard-code hex colours or pixel spacing; look them up with the tokens tool.
- One primary Button per screen, for the main action. Secondary for the alternative, Ghost for quiet actions, Destructive for deleting.
- Premium buttons are only for upgrades and paid features: at most one per screen, never next to a primary Button.
- Clickable icons are CompactButton (or Button with iconOnly), never a bare icon, and always need an aria-label. Add a Tooltip with the same words.
- In forms, use the Field versions (InputField, SelectField, TextareaField, ...) so labels, hints and errors are built in. Wrap them in Form to check required fields.
- Purple is for the main action only. Keep charts, stats and decorative tiles neutral.
- No drop shadows on panels, cards, dialogs or drawers; Halo uses borders and an Overlay instead.
- To restyle a part inside a component, use its \`classNames\` and \`styles\` props, or target \`[data-halo="..."] [data-part="..."]\` in CSS.
- The examples use Phosphor icons (\`@phosphor-icons/react\`); any React icon works.

Docs: ${SITE}/docs`;

function listComponents() {
  return groups
    .map((g) => `## ${g.name}\n${g.items.map((e) => `- **${e.name}** (\`${e.slug}\`): ${e.description}`).join('\n')}`)
    .join('\n\n') + '\n\nGet one with the get_component tool.';
}

function findEntry(name: string): Entry | undefined {
  const q = name.trim().toLowerCase().replace(/\s+/g, '-');
  return (
    all.find((e) => e.slug === q || e.name.toLowerCase() === name.trim().toLowerCase() || e.exports.some((x) => x.toLowerCase() === name.trim().toLowerCase())) ??
    all.find((e) => e.slug.includes(q) || q.includes(e.slug))
  );
}

function propsTable(exportName: string) {
  const list = props[exportName];
  if (!list?.length) return '';
  const rows = list.map((p) => `| \`${p.name}\`${p.required ? ' (required)' : ''} | \`${p.type.replace(/\|/g, '\\|')}\` | ${p.description || ''} |`);
  return `### ${exportName} props\n| Prop | Type | What it does |\n| --- | --- | --- |\n${rows.join('\n')}\nIt also takes the usual HTML attributes for its element.`;
}

function getComponent(name: string, withExamples: boolean) {
  const e = findEntry(name);
  if (!e) return `No component called "${name}". Use list_components to see them all.`;
  const g = guideFor(e.slug);
  const out = [`# ${e.name}`, guides[e.slug]?.callout ?? e.description, `\`\`\`tsx\nimport { ${e.exports.join(', ')} } from '@halo-ds/react';\n\`\`\``];
  if (g) {
    out.push(`## When to use it\n${g.about.join('\n\n')}`);
    out.push(`## Do\n${g.dos.map((d) => `- ${d}`).join('\n')}\n\n## Don't\n${g.donts.map((d) => `- ${d}`).join('\n')}`);
    for (const c of g.compare) out.push(`## ${c.title}\n${c.intro}\n${c.options.map((o) => `- **${o.title}**: ${o.points.join(' ')}`).join('\n')}`);
  }
  const tables = e.exports.map(propsTable).filter(Boolean);
  if (tables.length) out.push(`## Props\n${tables.join('\n\n')}`);
  if (withExamples) {
    const ex = examples[e.slug] ?? [];
    if (ex.length) out.push(`## Examples\n${ex.map((x) => `### ${x.title}\n${x.description ? `${x.description}\n` : ''}\`\`\`tsx\n${x.code}\n\`\`\``).join('\n\n')}`);
  }
  out.push(`More: ${SITE}/components/${e.slug}`);
  return out.join('\n\n');
}

function findComponent(need: string) {
  const words = need.toLowerCase().match(/[a-z0-9]+/g)?.filter((w) => w.length > 2) ?? [];
  if (!words.length) return 'Describe what you need, for example "pick a date range" or "confirm before deleting".';
  const scored = all
    .map((e) => {
      const g = guideFor(e.slug);
      const name = `${e.name} ${e.slug} ${e.exports.join(' ')}`.toLowerCase();
      const text = `${e.description} ${g?.callout ?? ''} ${g?.about.join(' ') ?? ''}`.toLowerCase();
      const score = words.reduce((s, w) => s + (name.includes(w) ? 5 : 0) + (text.includes(w) ? 1 : 0), 0);
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  if (!scored.length) return `Nothing matched "${need}". Use list_components to browse.`;
  return `Best matches for "${need}":\n${scored.map(({ e }) => `- **${e.name}** (\`${e.slug}\`): ${guides[e.slug]?.callout ?? e.description}`).join('\n')}\n\nCheck which fits with get_component; its "When to use it" and comparisons say when to pick another.`;
}

function getTokens(search?: string) {
  const q = search?.trim().toLowerCase();
  const list = q ? tokens.filter((t) => t.name.toLowerCase().includes(q) || t.cssVar.includes(q)) : tokens;
  if (!list.length) return `No token matches "${search}". Try "text", "surface", "border", "spacing" or "radius".`;
  const rows = list.map((t) => `| \`${t.cssVar}\` | ${Object.entries(t.values).map(([k, v]) => `${k}: ${v}`).join(', ')} |`);
  return `Use these as \`var(--halo-...)\` in CSS or inline styles.\n\n| Variable | Values |\n| --- | --- |\n${rows.join('\n')}`;
}

// ---------- Tools ----------

const tools = [
  {
    name: 'get_setup_and_rules',
    description: 'How to install and set up Halo, and the rules for using its components well. Read this first when building UI with Halo.',
    inputSchema: { type: 'object', properties: {} },
    run: () => RULES,
  },
  {
    name: 'list_components',
    description: 'Every Halo component, grouped, with a one-line description of each.',
    inputSchema: { type: 'object', properties: {} },
    run: () => listComponents(),
  },
  {
    name: 'find_component',
    description: 'Find the right Halo component for a need, like "pick a date range", "confirm before deleting" or "show a status".',
    inputSchema: { type: 'object', properties: { need: { type: 'string', description: 'What the UI needs to do' } }, required: ['need'] },
    run: (a: Record<string, unknown>) => findComponent(String(a.need ?? '')),
  },
  {
    name: 'get_component',
    description: "Everything about one Halo component: import line, when to use it, do's and don'ts, how it compares with similar components, every prop, and working code examples.",
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The component, like "Button", "date-picker" or "DataTable"' },
        examples: { type: 'boolean', description: 'Include code examples (default true)' },
      },
      required: ['name'],
    },
    run: (a: Record<string, unknown>) => getComponent(String(a.name ?? ''), a.examples !== false),
  },
  {
    name: 'get_tokens',
    description: 'Halo design tokens (CSS variables) for colour, spacing, radius, type and layout, with light and dark values. Use them instead of hard-coded values.',
    inputSchema: { type: 'object', properties: { search: { type: 'string', description: 'Part of a name, like "text", "surface", "spacing" or "radius"' } } },
    run: (a: Record<string, unknown>) => getTokens(a.search as string | undefined),
  },
];

// ---------- JSON-RPC over stdio ----------

type Message = { jsonrpc: '2.0'; id?: string | number | null; method?: string; params?: Record<string, unknown> };

const send = (msg: object) => process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', ...msg })}\n`);

function handle(msg: Message) {
  const { id, method, params = {} } = msg;
  const reply = (result: object) => id !== undefined && id !== null && send({ id, result });
  const error = (code: number, message: string) => id !== undefined && id !== null && send({ id, error: { code, message } });

  switch (method) {
    case 'initialize': {
      const asked = String(params.protocolVersion ?? '');
      return reply({
        protocolVersion: VERSIONS.includes(asked) ? asked : VERSIONS[0],
        capabilities: { tools: {} },
        serverInfo: { name: 'halo', title: 'Halo design system', version: __VERSION__ },
        instructions: 'Halo is a React design system (@halo-ds/react). Before building UI with it, call get_setup_and_rules. Use find_component to pick components and get_component for props and examples; never guess prop names.',
      });
    }
    case 'ping':
      return reply({});
    case 'tools/list':
      return reply({ tools: tools.map(({ run: _run, ...t }) => t) });
    case 'tools/call': {
      const tool = tools.find((t) => t.name === params.name);
      if (!tool) return error(-32602, `Unknown tool: ${String(params.name)}`);
      try {
        return reply({ content: [{ type: 'text', text: tool.run((params.arguments ?? {}) as Record<string, unknown>) }] });
      } catch (err) {
        return reply({ content: [{ type: 'text', text: `Error: ${(err as Error).message}` }], isError: true });
      }
    }
    default:
      // Notifications (no id) need no answer; unknown requests get "method not found"
      if (method?.startsWith('notifications/')) return;
      return error(-32601, `Method not found: ${method}`);
  }
}

export function runMcp() {
  const rl = createInterface({ input: process.stdin });
  rl.on('line', (line) => {
    if (!line.trim()) return;
    let msg: Message;
    try {
      msg = JSON.parse(line);
    } catch {
      return send({ id: null, error: { code: -32700, message: 'Parse error' } });
    }
    handle(msg);
  });
}
