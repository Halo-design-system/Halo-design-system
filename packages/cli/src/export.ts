// Writes the plain-text docs for AI tools into the website's build: llms.txt (an index),
// llms-full.txt (everything in one file), a Markdown page per component, the tokens, the rules
// and the skill files. Run by the website build: node packages/cli/build/export.mjs <site dist>.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { all, groups } from '../../../apps/site/src/catalog';
import { RULES, getComponent, getTokens, skills } from './mcp';

const SITE = 'https://chidindu06f.github.io/Halo-design-system';
const out = resolve(process.argv[2] ?? 'dist');

function write(path: string, text: string) {
  const file = join(out, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text.endsWith('\n') ? text : `${text}\n`);
}

const intro = `Halo is an open-source design system: React components (\`@halo-ds/react\`) and a matching Figma library, built from the same design tokens. Install with \`npm install @halo-ds/react\`; the styles, tokens and font load by themselves.`;

// One Markdown page per component, next to its web page: /components/badge -> /components/badge.md
for (const e of all) write(`components/${e.slug}.md`, getComponent(e.slug, true));

write('llms/rules.md', RULES);
write('llms/tokens.md', `# Halo design tokens\n\n${getTokens()}`);
for (const [path, text] of Object.entries(skills)) write(path, text);

const skillFiles = Object.keys(skills).filter((p) => p.startsWith('skills/')).sort();

write(
  'llms.txt',
  `# Halo design system

> ${intro}

Before building UI with Halo, read the setup and rules. Look up each component's props before using it; don't guess them.

## Start here

- [Setup and rules](${SITE}/llms/rules.md): How to install Halo and the rules for using it well
- [Everything in one file](${SITE}/llms-full.txt): The rules, every component and the tokens, for a single read
- [Design tokens](${SITE}/llms/tokens.md): Colour, spacing, radius, type and layout variables, with light and dark values

${groups
  .map((g) => `## ${g.name}\n\n${g.items.map((e) => `- [${e.name}](${SITE}/components/${e.slug}.md): ${e.description}`).join('\n')}`)
  .join('\n\n')}

## Skills

- [Rules for AGENTS.md, CLAUDE.md or Cursor rules](${SITE}/INSTRUCTIONS.md)
${skillFiles.map((p) => `- [${p.replace(/^skills\//, '')}](${SITE}/${p})`).join('\n')}

## Optional

- [Docs](${SITE}/docs): Installation, CLI, theming, and AI and MCP server setup
- [MCP server](${SITE}/docs/ai): \`npx -y halo-ds@latest mcp\`, for live lookups while coding
`,
);

write(
  'llms-full.txt',
  `# Halo design system

> ${intro}

${RULES}

# Components

${all.map((e) => getComponent(e.slug, true)).join('\n\n---\n\n')}

---

# Design tokens

${getTokens()}
`,
);

console.log(`AI docs: llms.txt, llms-full.txt and ${all.length} component pages in ${out}`);
