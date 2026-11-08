import { useEffect, useState } from 'react';
import { Badge, Input, LinkButton, SegmentedControl, Tab, TabList, TabPanel, Tabs } from '@halo-ds/react';
import { ArrowLeft, ArrowRight, Code, MagnifyingGlass } from '@phosphor-icons/react';
import { CodeBlock } from '../CodeBlock';
import { all, blocks, demosFor, exampleFor, groups, thumbFor } from '../registry';
import type { Demo, Entry } from '../registry';
import { Link, links, useRoute } from '../router';
import { BlockDetail, BlocksOverview } from './Blocks';
import { FoundationDetail, FoundationOverview, foundations } from './Foundation';

const managers = { npm: 'npm install', pnpm: 'pnpm add', yarn: 'yarn add', bun: 'bun add' } as const;
type Manager = keyof typeof managers;

/** The grouped component list. `base` picks where the links go: the component pages or the usage guide. */
export function Sidebar({ current, base = '/components' }: { current?: string; base?: string }) {
  const [q, setQ] = useState('');
  // Also searches the parts a page covers, so "image" finds ImageUpload on the File upload page.
  const squash = (text: string) => text.toLowerCase().replace(/\s+/g, '');
  const match = (e: Entry) => [e.name, ...e.exports].some((name) => squash(name).includes(squash(q)));
  return (
    <aside className="docs-side" aria-label="Components">
      <div className="docs-search">
        <Input size="sm" aria-label="Search components" placeholder="Search" iconLeft={<MagnifyingGlass />} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <nav className="docs-nav">
        {base === '/components' && foundations.some((f) => f.title.toLowerCase().includes(q.trim().toLowerCase())) && (
          <div className="docs-group">
            <p className="docs-group-name">Foundation</p>
            {foundations
              .filter((f) => f.title.toLowerCase().includes(q.trim().toLowerCase()))
              .map((f) => (
                <Link key={f.slug} to={`/components/foundation/${f.slug}`} className="docs-link" aria-current={current === `foundation/${f.slug}` ? 'page' : undefined}>
                  {f.title}
                </Link>
              ))}
          </div>
        )}
        {groups.map((g) => {
          const items = g.items.filter(match);
          if (!items.length) return null;
          return (
            <div key={g.name} className="docs-group">
              <p className="docs-group-name">{g.name}</p>
              {items.map((e) => (
                <Link key={e.slug} to={`${base}/${e.slug}`} className="docs-link" aria-current={current === e.slug ? 'page' : undefined}>
                  {e.name}
                </Link>
              ))}
            </div>
          );
        })}
        {base === '/components' && blocks.some((b) => b.title.toLowerCase().includes(q.trim().toLowerCase())) && (
          <div className="docs-group">
            <p className="docs-group-name">Blocks</p>
            {blocks
              .filter((b) => b.title.toLowerCase().includes(q.trim().toLowerCase()))
              .map((b) => (
                <Link key={b.slug} to={`/components/blocks/${b.slug}`} className="docs-link" aria-current={current === `blocks/${b.slug}` ? 'page' : undefined}>
                  {b.title}
                </Link>
              ))}
          </div>
        )}
      </nav>
    </aside>
  );
}

/** A card on the overview: the real component, shrunk and not clickable, with its name. */
function Thumb({ entry }: { entry: Entry }) {
  const Preview = thumbFor(entry.slug);
  return (
    <Link to={`/components/${entry.slug}`} className="overview-card">
      <span className="overview-name">{entry.name}</span>
      <div className="thumb" inert>
        <div className="thumb-inner">{Preview && <Preview />}</div>
      </div>
    </Link>
  );
}

function Overview() {
  // Links like /components#blocks jump to that section once the page shows
  useEffect(() => {
    const target = window.location.hash.slice(1);
    if (target) requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ block: 'start' }));
  }, []);
  return (
    <div className="docs-main">
      <header className="page-head">
        <p className="eyebrow">Components</p>
        <h1>Components</h1>
        <p className="lede">{all.length} components, each in Figma and in React, the foundation they are built on, and {blocks.length} blocks that put them together into whole page sections. Pick one to see it live, copy the code, and find its full props in Storybook.</p>
      </header>
      <FoundationOverview />
      {groups.map((g) => (
        <section key={g.name} className="overview-group" aria-labelledby={`g-${g.name}`}>
          <h2 id={`g-${g.name}`}>{g.name}</h2>
          <div className="overview-grid">
            {g.items.map((e) => (
              <Thumb key={e.slug} entry={e} />
            ))}
          </div>
        </section>
      ))}
      <BlocksOverview />
    </div>
  );
}

/** True when there is room for two columns of demos. */
function useWide() {
  const query = '(min-width: 1101px)';
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

/** One labelled variant, like Ant Design's examples: the demo, what it shows, and its code on request. */
function DemoCard({ demo, slug }: { demo: Demo; slug: string }) {
  const [code, setCode] = useState(false);
  return (
    <section className="variant-card" aria-labelledby={`${slug}-${demo.id}`}>
      <div className="demo-preview">
        <demo.Demo />
      </div>
      <div className="demo-meta">
        <h3 id={`${slug}-${demo.id}`}>{demo.title}</h3>
        <p>{demo.description}</p>
        <LinkButton size="sm" iconLeft={<Code />} aria-expanded={code} onClick={() => setCode(!code)}>
          {code ? 'Hide code' : 'Show code'}
        </LinkButton>
      </div>
      {code && <CodeBlock code={demo.code} />}
    </section>
  );
}

function Detail({ entry }: { entry: Entry }) {
  const [pm, setPm] = useState<Manager>('npm');
  const [tab, setTab] = useState('preview');
  const ex = exampleFor(entry.slug);
  const demos = demosFor(entry.slug);
  const cols = useWide() ? 2 : 1;
  const i = all.indexOf(entry);
  const prev = all[i - 1];
  const next = all[i + 1];
  useEffect(() => setTab('preview'), [entry.slug]);
  const usage = `import { ${entry.exports.join(', ')} } from '@halo-ds/react';`;

  return (
    <div className="docs-main">
      <header className="page-head">
        <p className="eyebrow">Components</p>
        <h1>{entry.name}</h1>
        <p className="lede">{entry.description}</p>
        <div className="head-links">
          <Link to={`/figma/${entry.slug}`}>When to use it</Link>
          <a href={`${links.storybook}?path=/docs/${entry.storybook}`}>Props in Storybook</a>
        </div>
      </header>

      {ex ? (
        <Tabs value={tab} onValueChange={setTab}>
          <TabList aria-label="Example">
            <Tab value="preview">Preview</Tab>
            <Tab value="code">Code</Tab>
          </TabList>
          <TabPanel value="preview" className="preview">
            <ex.Example />
          </TabPanel>
          <TabPanel value="code" className="preview-code">
            <CodeBlock code={ex.code} />
          </TabPanel>
        </Tabs>
      ) : (
        <div className="preview preview-soon">
          <Badge color="neutral">Example coming soon</Badge>
        </div>
      )}

      {demos.length > 0 && (
        <section className="docs-section" aria-labelledby="examples">
          <h2 id="examples">Examples</h2>
          {/* Two columns on wide screens, filled alternately so short and tall demos pack without gaps */}
          <div className="demo-columns">
            {Array.from({ length: cols }, (_, col) => col).map((col) => (
              <div key={col} className="demo-list">
                {demos
                  .filter((_, i) => i % cols === col)
                  .map((d) => (
                    <DemoCard key={`${entry.slug}-${d.id}`} demo={d} slug={entry.slug} />
                  ))}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="docs-section" aria-labelledby="install">
        <h2 id="install">Installation</h2>
        <p>Every component comes in one package. Install it once.</p>
        <SegmentedControl aria-label="Package manager" size="sm" value={pm} onValueChange={(v) => setPm(v as Manager)} options={Object.keys(managers).map((m) => ({ value: m, label: m }))} />
        <CodeBlock code={`${managers[pm]} @halo-ds/react`} label="Copy command" />
        <p>
          First time? See <Link to="/docs/installation">Installation</Link>, or set everything up with <code>npx halo-ds init</code>.
        </p>
      </section>

      <section className="docs-section" aria-labelledby="usage">
        <h2 id="usage">Usage</h2>
        <CodeBlock code={usage} />
      </section>

      <nav className="pager" aria-label="More components">
        {prev ? (
          <Link to={`/components/${prev.slug}`} className="pager-link">
            <ArrowLeft aria-hidden="true" /> {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/components/${next.slug}`} className="pager-link pager-next">
            {next.name} <ArrowRight aria-hidden="true" />
          </Link>
        )}
      </nav>
    </div>
  );
}

export function Components() {
  const { path } = useRoute();
  // Blocks live at /components/blocks/<name>; old /blocks/<name> links land here too
  const slug = path.replace(/^\/(components\/?|blocks\/?)/, path.startsWith('/blocks') ? 'blocks/' : '').replace(/\/$/, '');
  const entry = all.find((e) => e.slug === slug);
  const block = blocks.find((b) => slug === `blocks/${b.slug}`);
  const foundation = foundations.find((f) => slug === `foundation/${f.slug}`);
  return (
    <div className="docs">
      <Sidebar current={entry?.slug ?? (block || foundation ? slug : undefined)} />
      {entry ? <Detail entry={entry} /> : block ? <BlockDetail block={block} /> : foundation ? <FoundationDetail key={foundation.slug} slug={foundation.slug} /> : <Overview />}
    </div>
  );
}
