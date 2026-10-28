// npx halo-ds: set up Halo in a React app, make it your brand, and read the docs in the terminal.
import { spawnSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';
import { all, groups } from '../../../apps/site/src/catalog';
import { guides } from '../../../apps/site/src/guide';
import { brandVariables, parseHex, themeCss, toHex } from './colour';
import { addImport, installCommand, readProject, rel, setTheme } from './project';
import type { Project } from './project';

declare const __VERSION__: string;

const SITE = 'https://chidindu06f.github.io/Halo-design-system';
const THEMES = ['light', 'dark', 'system'] as const;

// ---------- Output ----------

const tty = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code: number) => (s: string) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);
const bold = paint(1);
const dim = paint(2);
const green = paint(32);
const yellow = paint(33);
const magenta = paint(35);
const say = (s = '') => process.stdout.write(`${s}\n`);
const done = (s: string) => say(`${green('✓')} ${s}`);
const note = (s: string) => say(`${yellow('!')} ${s}`);
const fail = (s: string): never => {
  process.stderr.write(`${s}\n`);
  process.exit(1);
};

const help = `${bold('halo-ds')} ${dim(__VERSION__)}  Set up Halo, make it your brand, and read the docs.

${bold('Usage')}
  npx halo-ds <command> [options]

${bold('Commands')}
  init                 Install Halo in this app, pick light, dark or system mode, and a brand colour
  theme <colour>       Make Halo your brand colour, for example: theme "#2F6BFF"
  docs [component]     When to use a component, how to import it, and its do's and don'ts
                       Leave the name out to list every component

${bold('Options')}
  -y, --yes            Use the defaults and don't ask questions
  -c, --cwd <path>     The app's folder (defaults to the current folder)
      --theme <mode>   init: light, dark or system
      --brand <colour> init: a brand colour, like "#2F6BFF"
      --skip-install   init: don't install the package
      --print          theme: print the CSS instead of writing a file
  -h, --help           Show this help
  -v, --version        Show the version

Docs: ${SITE}/docs`;

// ---------- Questions ----------

async function ask(question: string, fallback: string) {
  if (!process.stdin.isTTY) return fallback;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question(`${magenta('?')} ${question} ${dim(`(${fallback})`)} `)).trim();
  rl.close();
  return answer || fallback;
}

function needProject(cwd: string): Project {
  const p = readProject(cwd);
  if (!p) fail(`No package.json in ${cwd}.\nRun this in your app's folder, or create an app first:\n  npm create vite@latest my-app -- --template react-ts\n  npx create-next-app@latest my-app`);
  return p!;
}

// ---------- theme ----------

function writeTheme(p: Project, brand: string) {
  if (!p.entryFile) {
    note(`Couldn't find your entry file. Save this as a CSS file and import it once in your app:\n\n${themeCss(brand)}`);
    return;
  }
  const file = join(dirname(p.entryFile), 'halo-theme.css');
  writeFileSync(file, themeCss(brand));
  done(`Wrote your brand colours to ${bold(rel(p, file))}`);
  if (addImport(p.entryFile, './halo-theme.css') === 'added') done(`Imported it in ${bold(rel(p, p.entryFile))}`);

  const { buttonTextContrast } = brandVariables(parseHex(brand)!);
  if (buttonTextContrast < 3) note(`White text is hard to read on ${toHex(parseHex(brand)!)} (${buttonTextContrast.toFixed(1)}:1). Button labels may need a deeper shade.`);
}

function theme(colour: string | undefined, cwd: string, print: boolean) {
  if (!colour) fail('Give a colour, for example: npx halo-ds theme "#2F6BFF"');
  if (!parseHex(colour!)) fail(`"${colour}" isn't a hex colour. Try one like "#2F6BFF".`);
  if (print) return say(themeCss(colour!));
  writeTheme(needProject(cwd), colour!);
}

// ---------- init ----------

async function init(cwd: string, opts: { yes: boolean; theme?: string; brand?: string; skipInstall: boolean }) {
  const p = needProject(cwd);
  const names = { next: 'Next.js', vite: 'Vite', react: 'React' };
  say(`${bold('Halo')} ${dim(`· ${names[p.framework]} app, using ${p.manager}`)}\n`);

  let mode = opts.theme ?? (opts.yes ? 'system' : await ask('Light, dark or system mode?', 'system'));
  if (!(THEMES as readonly string[]).includes(mode)) {
    note(`"${mode}" isn't light, dark or system. Using system.`);
    mode = 'system';
  }
  let brand = opts.brand ?? (opts.yes ? '' : await ask('Brand colour as a hex, or Enter to keep Halo purple:', 'keep'));
  if (brand === 'keep') brand = '';
  if (brand && !parseHex(brand)) {
    note(`"${brand}" isn't a hex colour, so Halo purple stays. Change it later with: npx halo-ds theme "#2F6BFF"`);
    brand = '';
  }
  say();

  // 1. The package. It brings its own styles, tokens and font, so there's nothing else to import.
  const install = installCommand(p.manager, '@halo-ds/react');
  if (opts.skipInstall) note(`Skipped installing. Run: ${install}`);
  else if (p.hasHalo) done('Halo is already installed');
  else {
    say(dim(`$ ${install}`));
    const [cmd, ...args] = install.split(' ');
    const run = spawnSync(cmd!, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
    if (run.status !== 0) fail(`Installing didn't work. Run it yourself: ${install}`);
    done('Installed @halo-ds/react');
  }

  // 2. Light, dark or system, on the html element
  if (p.htmlFile) {
    const r = setTheme(p.htmlFile, mode);
    if (r === 'not-found') note(`Couldn't find <html> in ${rel(p, p.htmlFile)}. Add data-theme="${mode}" to it yourself.`);
    else done(`Set ${bold(`data-theme="${mode}"`)} in ${bold(rel(p, p.htmlFile))}`);
  } else note(`Add data-theme="${mode}" to your <html> element.`);

  // 3. The brand colour, if one was picked
  if (brand) writeTheme(p, brand);

  say(`
${bold("You're set.")} Use any component:

  ${magenta("import { Button } from '@halo-ds/react';")}

  ${dim('export default function App() {')}
  ${dim('  return <Button>Save</Button>;')}
  ${dim('}')}

When to use each one: ${bold('npx halo-ds docs')}
Components: ${SITE}/components`);
}

// ---------- docs ----------

function docs(name: string | undefined) {
  if (!name) {
    for (const g of groups) {
      say(bold(g.name));
      for (const e of g.items) say(`  ${e.slug.padEnd(20)}${dim(e.description)}`);
      say();
    }
    return say(`More on one: ${bold('npx halo-ds docs badge')}`);
  }
  const q = name.toLowerCase().replace(/\s+/g, '-');
  const entry = all.find((e) => e.slug === q || e.name.toLowerCase() === name.toLowerCase()) ?? all.find((e) => e.slug.includes(q) || q.includes(e.slug));
  if (!entry) fail(`No component called "${name}". See them all with: npx halo-ds docs`);
  const e = entry!;
  const shared: Record<string, string> = { 'event-calendar': 'calendar', 'tree-select': 'tree' };
  const g = guides[e.slug] ?? guides[shared[e.slug] ?? ''];

  // Components that share a guide (like Tree select and Tree) keep their own one-liner
  say(`${bold(e.name)}\n${guides[e.slug]?.callout ?? e.description}\n`);
  say(bold('Import'));
  say(`  ${magenta(`import { ${e.exports.join(', ')} } from '@halo-ds/react';`)}\n`);
  if (g) {
    say(bold('When to use it'));
    say(`  ${g.about[0]}\n`);
    say(bold('Do'));
    g.dos.forEach((d) => say(`  ${green('+')} ${d}`));
    say(`\n${bold("Don't")}`);
    g.donts.forEach((d) => say(`  ${yellow('-')} ${d}`));
    for (const c of g.compare) {
      say(`\n${bold(c.title)}`);
      if (c.intro) say(`  ${c.intro}`);
      for (const o of c.options) say(`  ${bold(o.title)}: ${o.points.join(' ')}`);
    }
    say();
  }
  say(`Examples and code: ${SITE}/components/${e.slug}`);
  say(`Props:             ${SITE}/storybook/?path=/docs/${e.storybook}`);
}

// ---------- Start ----------

async function main() {
  let parsed;
  try {
    parsed = parseArgs({
      allowPositionals: true,
      options: {
        yes: { type: 'boolean', short: 'y' },
        cwd: { type: 'string', short: 'c' },
        theme: { type: 'string' },
        brand: { type: 'string' },
        'skip-install': { type: 'boolean' },
        print: { type: 'boolean' },
        help: { type: 'boolean', short: 'h' },
        version: { type: 'boolean', short: 'v' },
      },
    });
  } catch (err) {
    return fail(`${(err as Error).message}\n\n${help}`);
  }
  const { values: v, positionals: [command, arg] } = parsed;
  if (v.version) return say(__VERSION__);
  if (v.help || !command) return say(help);
  const cwd = resolve(v.cwd ?? process.cwd());
  if (v.cwd && !existsSync(cwd)) fail(`No folder at ${cwd}`);

  if (command === 'init') return init(cwd, { yes: Boolean(v.yes), theme: v.theme, brand: v.brand, skipInstall: Boolean(v['skip-install']) });
  if (command === 'theme') return theme(arg, cwd, Boolean(v.print));
  if (command === 'docs') return docs(arg);
  fail(`Unknown command "${command}".\n\n${help}`);
}

main();
