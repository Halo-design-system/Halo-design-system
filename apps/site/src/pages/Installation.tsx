import { useState } from 'react';
import { Alert, SegmentedControl, Tab, TabList, TabPanel, Tabs } from '@halo-ds/react';
import { CodeBlock } from '../CodeBlock';
import { Link, links } from '../router';

const managers = ['npm', 'pnpm', 'yarn', 'bun'] as const;
type Manager = (typeof managers)[number];
const add: Record<Manager, string> = { npm: 'npm install', pnpm: 'pnpm add', yarn: 'yarn add', bun: 'bun add' };
const packages = '@halo-ds/react';

const frameworks = {
  vite: {
    label: 'Vite',
    create: { npm: 'npm create vite@latest my-app -- --template react-ts', pnpm: 'pnpm create vite my-app --template react-ts', yarn: 'yarn create vite my-app --template react-ts', bun: 'bun create vite my-app --template react-ts' },
  },
  next: {
    label: 'Next.js',
    create: { npm: 'npx create-next-app@latest my-app', pnpm: 'pnpm create next-app my-app', yarn: 'yarn create next-app my-app', bun: 'bun create next-app my-app' },
  },
} as const;
type Framework = keyof typeof frameworks;

const usage = `import { Button, InputField } from '@halo-ds/react';

export default function App() {
  return (
    <form>
      <InputField label="Email" type="email" placeholder="name@company.com" />
      <Button type="submit">Continue</Button>
    </form>
  );
}`;

const theming = `/* In any CSS file of yours. Your values always win. */
:root {
  --halo-button-primary: #2f6bff;
  --halo-button-primary-hover: #1f5fe0;
  --halo-fill-brand: #2f6bff;
}`;

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="step" aria-labelledby={`step-${n}`}>
      <span className="step-n" aria-hidden="true">{n}</span>
      <div className="step-body">
        <h2 id={`step-${n}`}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

export function Installation() {
  const [pm, setPm] = useState<Manager>('npm');
  const [fw, setFw] = useState<Framework>('vite');
  return (
    <div className="page narrow">
      <header className="page-head">
        <p className="eyebrow">Get started</p>
        <h1>Installation</h1>
        <p className="lede">Add Halo to a React app in four steps. It works with React 18 and 19, in Vite, Next.js and any other React setup.</p>
      </header>

      <div className="install-controls">
        <div>
          <span className="control-label" id="pm-label">Package manager</span>
          <SegmentedControl aria-label="Package manager" size="sm" value={pm} onValueChange={(v) => setPm(v as Manager)} options={managers.map((m) => ({ value: m, label: m }))} />
        </div>
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
            <Step n={2} title="Install Halo">
              <p>That is all the setup. The styles, the design tokens and the Geist font load by themselves when you use a component.</p>
              <CodeBlock code={`${add[pm]} ${packages}`} label="Copy command" />
            </Step>
            <Step n={3} title="Use a component">
              <p>
                Import what you need. See every component on the <Link to="/components">Components</Link> page. For dark mode, set <code>data-theme</code> on the html element to <code>dark</code>, or to <code>system</code> to follow the device.
              </p>
              <CodeBlock code={usage} />
            </Step>
          </TabPanel>
        ))}
      </Tabs>

      <section className="after">
        <h2>Make it yours</h2>
        <p>Change a few CSS variables to use your brand colour. Buttons and filled controls each have their own, so you can change one without the other.</p>
        <CodeBlock code={theming} />
        <p>
          The <a href={links.storybook + '?path=/docs/theming--docs'}>Theming guide</a> lists every variable, and the <a href={links.storybook + '?path=/docs/customising--docs'}>Customising guide</a> shows how to restyle the parts inside a component.
        </p>
        <Alert
          type="information"
          title="Designing in Figma?"
          description="The Figma library uses the same tokens and component names as the code, so designs and builds match."
          actions={<Link to="/figma">Get the Figma file</Link>}
        />
      </section>
    </div>
  );
}
