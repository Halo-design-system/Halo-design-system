import { useState } from 'react';
import type { ReactNode } from 'react';
import { Alert, SegmentedControl, Tab, TabList, TabPanel, Tabs } from '@halo-ds/react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { CodeBlock } from '../CodeBlock';
import { Link, links, useRoute } from '../router';

// ---------- Shared bits ----------

const managers = ['npm', 'pnpm', 'yarn', 'bun'] as const;
type Manager = (typeof managers)[number];
const add: Record<Manager, string> = { npm: 'npm install', pnpm: 'pnpm add', yarn: 'yarn add', bun: 'bun add' };
const run: Record<Manager, string> = { npm: 'npx', pnpm: 'pnpm dlx', yarn: 'yarn dlx', bun: 'bunx' };

/** One package-manager choice for the whole Docs section, so every command matches. */
let chosen: Manager = 'npm';
function useManager() {
  const [pm, setPm] = useState<Manager>(chosen);
  const set = (m: Manager) => {
    chosen = m;
    setPm(m);
  };
  const picker = (
    <SegmentedControl aria-label="Package manager" size="sm" value={pm} onValueChange={(v) => set(v as Manager)} options={managers.map((m) => ({ value: m, label: m }))} />
  );
  return { pm, picker };
}

function Head({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: ReactNode }) {
  return (
    <header className="page-head">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {lede && <p className="lede">{lede}</p>}
    </header>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="docs-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="step" aria-labelledby={`step-${n}`}>
      <span className="step-n" aria-hidden="true">{n}</span>
      <div className="step-body">
        <h3 id={`step-${n}`}>{title}</h3>
        {children}
      </div>
    </section>
  );
}

const usage = `import { Button, InputField } from '@halo-ds/react';

export default function App() {
  return (
    <form>
      <InputField label="Email" type="email" placeholder="name@company.com" />
      <Button type="submit">Continue</Button>
    </form>
  );
}`;

// ---------- Pages ----------

function Introduction() {
  return (
    <>
      <Head eyebrow="Docs" title="Introduction" lede="Halo is a design system for designers and developers: a Figma library and React components built from the same design tokens." />
      <Section id="what" title="What you get">
        <ul className="docs-list">
          <li><strong>56 React components</strong> that work with the keyboard and screen readers, in light and dark mode.</li>
          <li><strong>A Figma library</strong> with the same names, variants and tokens, so designs and code match.</li>
          <li><strong>One install.</strong> The styles, tokens and font load by themselves; there is nothing to import first.</li>
          <li><strong>A CLI</strong> that sets up a project, applies your brand colour and shows the docs in your terminal.</li>
          <li><strong>Built for AI assistants.</strong> An MCP server and skills give Claude, Cursor and other tools the real components and rules, so they don&apos;t guess.</li>
        </ul>
      </Section>
      <Section id="start" title="Start here">
        <div className="docs-cards">
          <Link to="/docs/installation" className="docs-card"><strong>Installation</strong><span>Add Halo to a Vite or Next.js app.</span></Link>
          <Link to="/docs/cli" className="docs-card"><strong>CLI</strong><span>Set up, theme and read the docs from the terminal.</span></Link>
          <Link to="/docs/theming" className="docs-card"><strong>Theming</strong><span>Use your brand colour everywhere.</span></Link>
          <Link to="/docs/ai" className="docs-card"><strong>Use with AI</strong><span>Connect Claude, Cursor or VS Code to Halo.</span></Link>
          <Link to="/components" className="docs-card"><strong>Components</strong><span>Every component, live, with code.</span></Link>
        </div>
      </Section>
    </>
  );
}

const frameworks = {
  vite: { label: 'Vite', create: { npm: 'npm create vite@latest my-app -- --template react-ts', pnpm: 'pnpm create vite my-app --template react-ts', yarn: 'yarn create vite my-app --template react-ts', bun: 'bun create vite my-app --template react-ts' } },
  next: { label: 'Next.js', create: { npm: 'npx create-next-app@latest my-app', pnpm: 'pnpm create next-app my-app', yarn: 'yarn create next-app my-app', bun: 'bun create next-app my-app' } },
} as const;
type Framework = keyof typeof frameworks;

function Installation() {
  const { pm, picker } = useManager();
  const [fw, setFw] = useState<Framework>('vite');
  const [way, setWay] = useState<'cli' | 'manual'>('cli');
  return (
    <>
      <Head eyebrow="Get started" title="Installation" lede="Add Halo to a React app. It works with React 18 and 19, in Vite, Next.js and any other React setup." />
      <div className="install-controls">
        <div>
          <span className="control-label">Package manager</span>
          {picker}
        </div>
      </div>

      <div className="docs-choice" role="radiogroup" aria-label="How to install">
        <button type="button" role="radio" aria-checked={way === 'cli'} className="docs-card" onClick={() => setWay('cli')}>
          <strong>Use the CLI</strong>
          <span>One command sets everything up, including dark mode and your brand colour.</span>
        </button>
        <button type="button" role="radio" aria-checked={way === 'manual'} className="docs-card" onClick={() => setWay('manual')}>
          <strong>Install by hand</strong>
          <span>Add the package yourself. It is one install, with nothing to import first.</span>
        </button>
      </div>

      <Tabs value={fw} onValueChange={(v) => setFw(v as Framework)}>
        <TabList aria-label="Framework">
          {(Object.keys(frameworks) as Framework[]).map((k) => (
            <Tab key={k} value={k}>{frameworks[k].label}</Tab>
          ))}
        </TabList>
        {(Object.keys(frameworks) as Framework[]).map((k) => (
          <TabPanel key={k} value={k} className="install-panel">
            <Step n={1} title="Create an app">
              <p>Skip this if you already have one.</p>
              <CodeBlock code={frameworks[k].create[pm]} label="Copy command" />
            </Step>
            {way === 'cli' ? (
              <Step n={2} title="Run init in your app's folder">
                <p>It installs Halo, then asks for light, dark or system mode and, if you like, your brand colour.</p>
                <CodeBlock code={`${run[pm]} halo-ds init`} label="Copy command" />
              </Step>
            ) : (
              <Step n={2} title="Install Halo">
                <p>That is all the setup. The styles, the design tokens and the Geist font load by themselves when you use a component.</p>
                <CodeBlock code={`${add[pm]} @halo-ds/react`} label="Copy command" />
              </Step>
            )}
            <Step n={3} title="Use a component">
              <p>
                Import what you need. Every component is on the <Link to="/components">Components</Link> page.
                {way === 'manual' && <> For dark mode, see <Link to="/docs/dark-mode">Dark mode</Link>.</>}
              </p>
              <CodeBlock code={usage} />
            </Step>
          </TabPanel>
        ))}
      </Tabs>

      <Alert
        type="information"
        title="Designing in Figma?"
        description="The Figma library uses the same tokens and component names as the code, so designs and builds match."
        actions={<Link to="/figma">Get the Figma file</Link>}
      />
    </>
  );
}

const initOutput = `Halo · Vite app, using npm

? Light, dark or system mode? (system) dark
? Brand colour as a hex, or Enter to keep Halo purple: (keep) #2F6BFF

✓ Installed @halo-ds/react
✓ Set data-theme="dark" in index.html
✓ Wrote your brand colours to src/halo-theme.css
✓ Imported it in src/main.tsx`;

const docsOutput = `Badge
A small label that shows the status, category or count of something.

Import
  import { Badge } from '@halo-ds/react';

When to use it
  Use a badge to tag an item with a short status like Active or Beta...

Do
  + Keep labels to one or two words, in sentence case.
Don't
  - Make badges clickable; use a Tag or a Button instead.`;

function Options({ rows }: { rows: [string, string][] }) {
  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <thead>
          <tr>
            <th scope="col">Option</th>
            <th scope="col">What it does</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([o, d]) => (
            <tr key={o}>
              <td><code>{o}</code></td>
              <td>{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cli() {
  const { pm, picker } = useManager();
  const x = run[pm];
  return (
    <>
      <Head eyebrow="Get started" title="CLI" lede="Set up Halo, make it your brand and read the docs, all from the terminal. Run it with npx; there is nothing to install." />
      <div className="install-controls">
        <div>
          <span className="control-label">Package manager</span>
          {picker}
        </div>
      </div>

      <Section id="init" title="init">
        <p>Sets Halo up in the app you run it in. It finds out whether the app uses Vite or Next.js and which package manager it uses, then:</p>
        <ul className="docs-list">
          <li>installs <code>@halo-ds/react</code></li>
          <li>sets light, dark or system mode on the <code>html</code> element</li>
          <li>writes your brand colour to <code>halo-theme.css</code> and imports it, if you give one</li>
        </ul>
        <CodeBlock code={`${x} halo-ds init`} label="Copy command" />
        <p>What you will see:</p>
        <pre className="docs-terminal">{initOutput}</pre>
        <Options
          rows={[
            ['-y, --yes', "Use the defaults and don't ask questions: system mode, Halo purple."],
            ['--theme <mode>', 'light, dark or system.'],
            ['--brand <colour>', 'A brand colour as a hex, like "#2F6BFF".'],
            ['--skip-install', "Don't install the package, only set things up."],
            ['-c, --cwd <path>', "The app's folder, if it isn't the current one."],
          ]}
        />
      </Section>

      <Section id="theme" title="theme">
        <p>
          Makes Halo your brand colour. From one colour it works out the button, hover, tint, text and focus colours for light and dark mode, and keeps brand text readable. Run it again any time to change colour.
        </p>
        <CodeBlock code={`${x} halo-ds theme "#2F6BFF"`} label="Copy command" />
        <Options
          rows={[
            ['--print', 'Print the CSS instead of writing a file, to paste wherever you like.'],
            ['-c, --cwd <path>', "The app's folder, if it isn't the current one."],
          ]}
        />
      </Section>

      <Section id="docs" title="docs">
        <p>Shows when to use a component, how to import it, and its do's and don'ts. Leave the name out to list every component.</p>
        <CodeBlock code={`${x} halo-ds docs badge`} label="Copy command" />
        <pre className="docs-terminal">{docsOutput}</pre>
      </Section>

      <Section id="mcp" title="mcp">
        <p>
          Starts the MCP server that AI assistants use to look Halo up while they code. You don&apos;t run it yourself; you add it to your AI tool&apos;s settings. See <Link to="/docs/ai">Use with AI</Link>.
        </p>
      </Section>

      <Section id="help" title="Help">
        <CodeBlock code={`${x} halo-ds --help`} label="Copy command" />
      </Section>
    </>
  );
}

const brandCss = `/* In any CSS file of yours. Your values always win over Halo's. */
:root,
[data-theme='light'] {
  --halo-button-primary: #2f6bff;           /* primary buttons */
  --halo-button-primary-hover: #1f5fe0;
  --halo-button-primary-pressed: #1f5fe0;
  --halo-fill-brand: #2f6bff;               /* checkboxes, switches, sliders, progress */
  --halo-fill-brand-hover: #1f5fe0;
  --halo-surface-brand: #eaf1ff;            /* soft brand backgrounds */
  --halo-surface-brand-secondary: #c9daff;  /* tinted areas, brand badges */
  --halo-text-brand: #1a4cc2;               /* brand text */
  --halo-text-link: #2f6bff;                /* link buttons */
  --halo-border-focus: #c9daff;             /* focus rings */
}

[data-theme='dark'] {
  --halo-surface-brand: #10275c;
  --halo-surface-brand-secondary: #183a85;
  --halo-text-brand: #a9c4ff;
  --halo-text-link: #a9c4ff;
  --halo-border-focus: #183a85;
}`;

function Theming() {
  const { pm } = useManager();
  return (
    <>
      <Head eyebrow="Customising" title="Theming" lede="Every colour, space and corner in Halo is a CSS variable. Change a few to make Halo your brand." />
      <Section id="cli" title="The quick way">
        <p>One command works out every brand colour from yours, for light and dark mode.</p>
        <CodeBlock code={`${run[pm]} halo-ds theme "#2F6BFF"`} label="Copy command" />
      </Section>
      <Section id="manual" title="By hand">
        <p>
          Set the brand variables in any CSS file. Halo keeps its defaults in a CSS layer, so yours win whatever order the files load in. Buttons and filled controls each have their own variables, so you can change one without the other.
        </p>
        <CodeBlock code={brandCss} />
        <p>
          The <a href={`${links.storybook}?path=/docs/theming--docs`}>Theming guide</a> lists every variable, and the <a href={`${links.storybook}?path=/docs/customising--docs`}>Customising guide</a> shows how to restyle the parts inside a component.
        </p>
      </Section>
    </>
  );
}

const toggle = `const html = document.documentElement;

// Follow the device, or pick one
html.dataset.theme = 'system'; // 'light' | 'dark' | 'system'`;

function DarkMode() {
  return (
    <>
      <Head eyebrow="Customising" title="Dark mode" lede={<>Every component works in light and dark. Choose with the <code>data-theme</code> attribute on the html element.</>} />
      <Section id="values" title="The three modes">
        <ul className="docs-list">
          <li><code>light</code>: the default, when <code>data-theme</code> is not set.</li>
          <li><code>dark</code>: always dark.</li>
          <li><code>system</code>: follows the device setting, and changes when it does.</li>
        </ul>
        <CodeBlock code={`<html lang="en" data-theme="system">`} />
      </Section>
      <Section id="switch" title="Let people switch">
        <p>Change the attribute from anywhere, for example from a toggle in your settings.</p>
        <CodeBlock code={toggle} />
        <p>Part of a section can use the other mode too: set <code>data-theme</code> on any element and everything inside it follows.</p>
      </Section>
    </>
  );
}


const mcpCommand = 'npx -y halo-ds@latest mcp';
const mcpConfigs = {
  claude: { label: 'Claude Code', file: 'In your terminal', code: `claude mcp add halo -- ${mcpCommand}` },
  cursor: { label: 'Cursor', file: '.cursor/mcp.json', code: JSON.stringify({ mcpServers: { halo: { command: 'npx', args: ['-y', 'halo-ds@latest', 'mcp'] } } }, null, 2) },
  vscode: { label: 'VS Code', file: '.vscode/mcp.json', code: JSON.stringify({ servers: { halo: { type: 'stdio', command: 'npx', args: ['-y', 'halo-ds@latest', 'mcp'] } } }, null, 2) },
  windsurf: { label: 'Windsurf', file: '~/.codeium/windsurf/mcp_config.json', code: JSON.stringify({ mcpServers: { halo: { command: 'npx', args: ['-y', 'halo-ds@latest', 'mcp'] } } }, null, 2) },
  desktop: { label: 'Claude Desktop', file: 'claude_desktop_config.json', code: JSON.stringify({ mcpServers: { halo: { command: 'npx', args: ['-y', 'halo-ds@latest', 'mcp'] } } }, null, 2) },
} as const;
type Tool = keyof typeof mcpConfigs;

function Ai() {
  const [tool, setTool] = useState<Tool>('cursor');
  return (
    <>
      <Head
        eyebrow="Build with AI"
        title="Use with AI"
      />

      <Section id="plugin" title="Claude Code: install the plugin">
        <p>One plugin adds the MCP server below and four skills. Run these in Claude Code:</p>
        <CodeBlock code={'/plugin marketplace add Chidindu06F/Halo-design-system\n/plugin install halo@halo-design-system'} label="Copy commands" />
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th scope="col">Skill</th>
                <th scope="col">What it does</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>/halo:build-ui</code></td><td>Builds screens with Halo: looks up each component first, uses tokens, follows the rules.</td></tr>
              <tr><td><code>/halo:review-ui</code></td><td>Reviews code against Halo&apos;s rules and lists what to fix, file by file.</td></tr>
              <tr><td><code>/halo:brand-theme</code></td><td>Applies your brand colour in light and dark mode.</td></tr>
              <tr><td><code>/halo:migrate</code></td><td>Moves screens from shadcn/ui, Ant Design or Material UI to Halo.</td></tr>
            </tbody>
          </table>
        </div>
        <p>Claude also uses them by itself when a task fits, so you rarely need to type them.</p>
      </Section>

      <Section id="mcp" title="Any AI tool: add the MCP server">
        <p>
          The MCP server lets your assistant look Halo up while it codes. Add it once in your tool&apos;s settings; it runs on your computer and needs nothing else installed.
        </p>
        <Tabs value={tool} onValueChange={(v) => setTool(v as Tool)}>
          <TabList aria-label="AI tool">
            {(Object.keys(mcpConfigs) as Tool[]).map((k) => (
              <Tab key={k} value={k}>{mcpConfigs[k].label}</Tab>
            ))}
          </TabList>
          {(Object.keys(mcpConfigs) as Tool[]).map((k) => (
            <TabPanel key={k} value={k} className="install-panel">
              <p className="docs-file">{mcpConfigs[k].file}</p>
              <CodeBlock code={mcpConfigs[k].code} label="Copy" />
            </TabPanel>
          ))}
        </Tabs>
      </Section>

      <Section id="tools" title="What your assistant can look up">
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th scope="col">Tool</th>
                <th scope="col">What it gives</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>get_setup_and_rules</code></td><td>How to set Halo up, and the rules for using it well.</td></tr>
              <tr><td><code>list_components</code></td><td>Every component, grouped, with one line each.</td></tr>
              <tr><td><code>find_component</code></td><td>The right component for a need, like &quot;confirm before deleting&quot;.</td></tr>
              <tr><td><code>get_component</code></td><td>Import line, every prop, working examples, when to use it, and do&apos;s and don&apos;ts.</td></tr>
              <tr><td><code>get_tokens</code></td><td>Colour, spacing and radius variables, with light and dark values.</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="try" title="Try asking">
        <ul className="docs-list">
          <li>&quot;Build a settings page with Halo: profile fields, notification switches and a save button.&quot;</li>
          <li>&quot;Which Halo component should I use to show that a payment failed?&quot;</li>
          <li>&quot;Review this page against Halo&apos;s rules.&quot;</li>
          <li>&quot;Move this dialog from shadcn to Halo.&quot;</li>
        </ul>
      </Section>

      <Section id="without" title="Without MCP">
        <p>Any assistant that can run commands can read the same docs from the terminal:</p>
        <CodeBlock code="npx halo-ds docs badge" label="Copy command" />
      </Section>
    </>
  );
}

// ---------- Layout ----------

const pages = [
  { group: 'Get started', items: [
    { slug: '', title: 'Introduction', Page: Introduction },
    { slug: 'installation', title: 'Installation', Page: Installation },
    { slug: 'cli', title: 'CLI', Page: Cli },
  ] },
  { group: 'Customising', items: [
    { slug: 'theming', title: 'Theming', Page: Theming },
    { slug: 'dark-mode', title: 'Dark mode', Page: DarkMode },
  ] },
  { group: 'Build with AI', items: [
    { slug: 'ai', title: 'Use with AI', Page: Ai },
  ] },
];
const flat = pages.flatMap((g) => g.items);
const to = (slug: string) => (slug ? `/docs/${slug}` : '/docs');

export function Docs() {
  const { path } = useRoute();
  // The old /installation link still opens Installation
  const slug = path === '/installation' ? 'installation' : path.replace(/^\/docs\/?/, '');
  const i = Math.max(0, flat.findIndex((p) => p.slug === slug));
  const page = flat[i]!;
  const prev = flat[i - 1];
  const next = flat[i + 1];
  return (
    <div className="docs">
      <aside className="docs-side" aria-label="Docs">
        <nav className="docs-nav">
          {pages.map((g) => (
            <div key={g.group} className="docs-group">
              <p className="docs-group-name">{g.group}</p>
              {g.items.map((p) => (
                <Link key={p.slug} to={to(p.slug)} className="docs-link" aria-current={p === page ? 'page' : undefined}>
                  {p.title}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <div className="docs-main docs-page">
        <page.Page />
        <nav className="pager" aria-label="More docs">
          {prev ? <Link to={to(prev.slug)} className="pager-link"><ArrowLeft aria-hidden="true" /> {prev.title}</Link> : <span />}
          {next && <Link to={to(next.slug)} className="pager-link pager-next">{next.title} <ArrowRight aria-hidden="true" /></Link>}
        </nav>
      </div>
    </div>
  );
}
