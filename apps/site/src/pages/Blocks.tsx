import { useEffect, useRef, useState } from 'react';
import { SegmentedControl, Tab, TabList, TabPanel, Tabs } from '@halo-ds/react';
import { DeviceMobile, DeviceTablet, Monitor } from '@phosphor-icons/react';
import { CodeBlock } from '../CodeBlock';
import { all, blocks } from '../registry';
import type { Block } from '../registry';
import { Link, useRoute } from '../router';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const categories = [...new Set(blocks.map((b) => b.category))];

type Device = 'desktop' | 'tablet' | 'mobile';
const widths: Record<Device, string> = { desktop: '100%', tablet: '768px', mobile: '390px' };

/** The Halo components a block imports, so each can link to its page. */
function componentsIn(code: string) {
  const names = code.match(/import \{([^}]*)\} from '@halo-ds\/react'/)?.[1]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
  return all.filter((e) => e.exports.some((x) => names.includes(x)));
}

function BlockSidebar({ current }: { current?: string }) {
  return (
    <aside className="docs-side" aria-label="Blocks">
      <nav className="docs-nav">
        <Link to="/blocks" className="docs-link" aria-current={current ? undefined : 'page'}>
          All blocks
        </Link>
        {categories.map((c) => (
          <div key={c} className="docs-group">
            <p className="docs-group-name">{c}</p>
            {blocks
              .filter((b) => b.category === c)
              .map((b) => (
                <Link key={b.slug} to={`/blocks/${b.slug}`} className="docs-link" aria-current={current === b.slug ? 'page' : undefined}>
                  {b.title}
                </Link>
              ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

/** A card on the overview: the real block, shrunk and not clickable. */
function Thumb({ block }: { block: Block }) {
  return (
    // Blocks hold links of their own, so the card is not one big link: its title link stretches over it
    <div className="overview-card block-card">
      <Link to={`/blocks/${block.slug}`} className="overview-name block-card-link">{block.title}</Link>
      <div className="block-thumb" inert>
        <div className="block-thumb-inner">
          <block.Block />
        </div>
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div className="docs-main">
      <header className="page-head">
        <p className="eyebrow">Blocks</p>
        <h1>Blocks</h1>
        <p className="lede">
          Whole page sections built from Halo components, like a sign-in screen or a settings page. Copy the code, or add one to your app with a single command, then change the words and data to fit your product.
        </p>
      </header>
      {categories.map((c) => (
        <section key={c} className="overview-group" aria-labelledby={`b-${c}`}>
          <h2 id={`b-${c}`}>{c}</h2>
          <div className="block-grid">
            {blocks
              .filter((b) => b.category === c)
              .map((b) => (
                <Thumb key={b.slug} block={b} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** The block in an iframe, so phone and tablet widths behave like a real screen of that size. */
function Preview({ block, device }: { block: Block; device: Device }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(640);
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source === frame.current?.contentWindow && e.data?.type === 'halo-block-height') setHeight(e.data.height);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);
  return (
    <div className="block-stage">
      <iframe
        ref={frame}
        title={`${block.title} preview`}
        src={`${base}/block-frame/${block.slug}`}
        style={{ width: widths[device], height }}
      />
    </div>
  );
}

function Detail({ block }: { block: Block }) {
  const [tab, setTab] = useState('preview');
  const [device, setDevice] = useState<Device>('desktop');
  const used = componentsIn(block.code);
  useEffect(() => setTab('preview'), [block.slug]);

  return (
    <div className="docs-main">
      <header className="page-head">
        <p className="eyebrow">Blocks · {block.category}</p>
        <h1>{block.title}</h1>
        <p className="lede">{block.description}</p>
      </header>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="block-bar">
          <TabList aria-label="Block">
            <Tab value="preview">Preview</Tab>
            <Tab value="code">Code</Tab>
          </TabList>
          {tab === 'preview' && (
            <SegmentedControl
              aria-label="Screen size"
              size="sm"
              value={device}
              onValueChange={(v) => setDevice(v as Device)}
              options={[
                { value: 'desktop', label: 'Desktop', icon: <Monitor /> },
                { value: 'tablet', label: 'Tablet', icon: <DeviceTablet /> },
                { value: 'mobile', label: 'Phone', icon: <DeviceMobile /> },
              ]}
            />
          )}
        </div>
        <TabPanel value="preview">
          <Preview block={block} device={device} />
        </TabPanel>
        <TabPanel value="code" className="preview-code">
          <CodeBlock code={block.code} />
        </TabPanel>
      </Tabs>

      <section className="docs-section" aria-labelledby="add">
        <h2 id="add">Add it to your app</h2>
        <p>
          Run this in your app&apos;s folder. It saves the block as a file in <code>src/blocks</code>, ready to import and edit. Or copy the code above.
        </p>
        <CodeBlock code={`npx halo-ds add ${block.slug}`} label="Copy command" />
      </section>

      {used.length > 0 && (
        <section className="docs-section" aria-labelledby="used">
          <h2 id="used">Components in this block</h2>
          <p className="block-used">
            {used.map((e, i) => (
              <span key={e.slug}>
                {i > 0 && ', '}
                <Link to={`/components/${e.slug}`}>{e.name}</Link>
              </span>
            ))}
          </p>
        </section>
      )}
    </div>
  );
}

export function Blocks() {
  const { path } = useRoute();
  const slug = path.replace(/^\/blocks\/?/, '');
  const block = blocks.find((b) => b.slug === slug);
  return (
    <div className="docs">
      <BlockSidebar current={block?.slug} />
      {block ? <Detail block={block} /> : <Overview />}
    </div>
  );
}

/** What the preview iframe loads: one block on its own, in the site's light or dark mode. */
export function BlockFrame({ slug }: { slug: string }) {
  const block = blocks.find((b) => b.slug === slug);
  const root = useRef<HTMLDivElement>(null);

  // Follow the site's theme, including when it changes in the page around the iframe
  useEffect(() => {
    const apply = () => {
      let theme = 'light';
      try {
        theme = localStorage.getItem('halo-site-theme') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      } catch {
        // Storage can be blocked; light it is
      }
      document.documentElement.dataset.theme = theme;
    };
    apply();
    window.addEventListener('storage', apply);
    return () => window.removeEventListener('storage', apply);
  }, []);

  // Tell the page how tall the block is, so the iframe fits it without scrolling
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const send = () => window.parent.postMessage({ type: 'halo-block-height', height: Math.ceil(el.getBoundingClientRect().height) }, window.location.origin);
    const ro = new ResizeObserver(send);
    ro.observe(el);
    send();
    return () => ro.disconnect();
  }, []);

  return <div ref={root} className="block-frame">{block ? <block.Block /> : null}</div>;
}
