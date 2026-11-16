// Every page's title and description, for search results, link previews and AI assistants.
// Plain data only, so the halo-ds CLI build can use it to write a real HTML page per address.
import { all, foundations } from './catalog';
import { guides } from './guide';

export const SITE = 'https://halodesignsystem.dev';
export const NAME = 'Halo Design System';
const SUFFIX = ` · ${NAME}`;

export const HOME_DESCRIPTION =
  'Halo is a free, open-source React design system: 56 accessible components, a matching Figma library, design tokens, a CLI and an MCP server so AI assistants build with it correctly.';

export const docsPages = [
  { slug: '', title: 'Introduction', description: 'What Halo is, what comes with it, and where to start: the React components, the Figma library, the CLI and the MCP server.' },
  { slug: 'installation', title: 'Installation', description: 'Add Halo to a Vite or Next.js app in one command, or install the package yourself. The styles, tokens and font load by themselves.' },
  { slug: 'cli', title: 'CLI', description: 'The halo-ds command line tool: set up a project, apply a brand colour, add ready-made blocks, add AI skills and read the docs.' },
  { slug: 'theming', title: 'Theming', description: 'Use your brand colour across Halo in light and dark mode, and switch between light, dark and system themes.' },
  { slug: 'ai', title: 'AI and MCP server', description: "Connect Claude Code, Cursor, VS Code and other AI tools to Halo's MCP server, skills and plain-text docs, so they use real props instead of guessing." },
];

export const exampleApps = [
  { id: 'saas', name: 'SaaS', about: 'a project management app' },
  { id: 'banking', name: 'Banking', about: 'a mobile banking app' },
  { id: 'sales-crm', name: 'Sales CRM', about: 'a sales pipeline and contacts app' },
  { id: 'tax', name: 'Tax', about: 'a tax filing app' },
  { id: 'creators', name: 'Creators', about: 'a creator storefront and calls app' },
  { id: 'healthcare', name: 'Healthcare', about: 'a clinic and patient records app' },
  { id: 'payroll', name: 'Payroll', about: 'a payroll and time off app' },
];

/** The home page questions as plain text, for the FAQ in search results. Keep in step with the FAQ section on the home page. */
export const faqs: [string, string][] = [
  ['Is Halo free?', 'Yes. The React components, design tokens, CLI, MCP server and Figma file are free, and the code is MIT licensed.'],
  ['Which React setups does it work with?', 'React 18 and 19, with Vite, Next.js or any other React setup. The styles and the font load by themselves, so there is nothing else to set up.'],
  ['How do AI tools use it?', "Halo's MCP server gives your assistant every component's props, examples and rules. Skills and plain-text docs work with tools that don't use MCP."],
  ['Can I use my own brand colour?', 'Yes. Run npx halo-ds theme "#2F6BFF" and it works out every brand colour for light and dark mode.'],
  ['Is it accessible?', 'Every component works with the keyboard and screen readers, and every story is checked automatically for accessibility problems in light and dark mode.'],
  ['Is there a Figma file?', 'Yes, free. Every component, variant and token from the code, so what you design is what ships.'],
];

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  /** The trail above the page, for search results. */
  crumbs: { name: string; path: string }[];
}

interface BlockInfo {
  slug: string;
  title: string;
  description: string;
}

const callout = (slug: string, fallback: string) => guides[slug]?.callout ?? fallback;
const trim = (text: string) => (text.length > 158 ? `${text.slice(0, 155).replace(/\s+\S*$/, '')}...` : text);

/** Every address the site has, with its title and description. Blocks come from the caller, since they are read from files. */
export function pages(blocks: BlockInfo[]): PageMeta[] {
  const home = { name: 'Home', path: '/' };
  const components = { name: 'Components', path: '/components' };
  const docs = { name: 'Docs', path: '/docs' };
  const figma = { name: 'Figma', path: '/figma' };
  const examples = { name: 'Examples', path: '/examples' };
  const out: PageMeta[] = [
    { path: '/', title: `${NAME}: React components, Figma library and MCP server`, description: HOME_DESCRIPTION, crumbs: [] },
    { path: '/components', title: `Components${SUFFIX}`, description: `All ${all.length} Halo components for React, with live examples, code and props, plus ready-made blocks and the foundations: colour, type, spacing and icons.`, crumbs: [home] },
    ...all.map((e) => ({ path: `/components/${e.slug}`, title: `${e.name}: React component${SUFFIX}`, description: trim(callout(e.slug, e.description)), crumbs: [home, components] })),
    ...foundations.map((f) => ({ path: `/components/foundation/${f.slug}`, title: `${f.title}${SUFFIX}`, description: trim(f.description), crumbs: [home, components] })),
    { path: '/components/blocks', title: `Blocks${SUFFIX}`, description: 'Whole page sections built from Halo components, like sign-in, pricing and dashboards. Copy the code or add one with npx halo-ds add.', crumbs: [home, components] },
    ...blocks.map((b) => ({ path: `/components/blocks/${b.slug}`, title: `${b.title} block${SUFFIX}`, description: trim(b.description), crumbs: [home, components, { name: 'Blocks', path: '/components/blocks' }] })),
    { path: '/figma', title: `Figma library${SUFFIX}`, description: 'The free Halo Figma library: every component, variant and token from the React code, so what you design is what ships.', crumbs: [home] },
    ...all.map((e) => ({ path: `/figma/${e.slug}`, title: `${e.name} in Figma${SUFFIX}`, description: trim(`When to use the ${e.name.toLowerCase()} and how to set it up in Figma. ${e.description}`), crumbs: [home, figma] })),
    ...docsPages.map((d) => ({ path: d.slug ? `/docs/${d.slug}` : '/docs', title: `${d.title}${SUFFIX}`, description: d.description, crumbs: d.slug ? [home, docs] : [home] })),
    { path: '/examples', title: `Example apps${SUFFIX}`, description: `Seven example apps with 29 screens, built only from Halo components. Click through them live on desktop, tablet and phone, and read the code.`, crumbs: [home] },
    ...exampleApps.map((a) => ({ path: `/examples/${a.id}`, title: `${a.name} example app${SUFFIX}`, description: `A live ${a.about}, built only from Halo components. Click through every screen and read the code.`, crumbs: [home, examples] })),
  ];
  return out;
}

/** The title and description for an address, or the home page's for anything unknown. */
export function metaFor(path: string, blocks: BlockInfo[]): PageMeta {
  const clean = path.replace(/\/$/, '') || '/';
  const list = pages(blocks);
  return list.find((p) => p.path === clean) ?? list[0]!;
}
