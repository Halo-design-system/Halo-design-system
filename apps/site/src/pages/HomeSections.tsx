// The sections under the hero on the home page. Each one shows a part of Halo working, not just described.
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Accordion, AccordionItem, AreaChart, BarChart, Button, PieChart, SegmentedControl, Tab, TabList, Tabs } from '@halo-ds/react';
import { ArrowRight, CheckCircle, GithubLogo, Sparkle, Star } from '@phosphor-icons/react';
import { CodeBlock } from '../CodeBlock';
import { all, blocks, thumbFor } from '../registry';
import { Link, links, useRoute } from '../router';
import { apps } from '../screens';
import { mcpConfigs } from './Docs';
import './HomeSections.css';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Counts 0, 1, 2... every `ms`, and keeps counting while the page is open. */
function useTick(ms: number) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), ms);
    return () => window.clearInterval(t);
  }, [ms]);
  return tick;
}

/** Types `text` a letter at a time; shows it all at once when motion is reduced. */
function useTyped(text: string, speed = 45) {
  const [shown, setShown] = useState(reducedMotion() ? text : '');
  useEffect(() => {
    if (reducedMotion()) return setShown(text);
    setShown('');
    let i = 0;
    const t = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(t);
    }, speed);
    return () => window.clearInterval(t);
  }, [text, speed]);
  return shown;
}

function Head({ eyebrow, title, text, children }: { eyebrow: string; title: ReactNode; text: ReactNode; children?: ReactNode }) {
  return (
    <div className="hs-head">
      <span className="hs-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
      {children && <div className="hs-actions">{children}</div>}
    </div>
  );
}

/* ---------- One command adds a whole page section ---------- */

const featured = ['sign-in', 'pricing', 'dashboard', 'settings'];

export function CommandSection() {
  const [pick, setPick] = useState(0);
  const [auto, setAuto] = useState(true);
  const tick = useTick(5000);
  // Moves on to the next block every few seconds, until someone picks one
  useEffect(() => {
    if (auto && tick > 0) setPick((p) => (p + 1) % featured.length);
  }, [tick, auto]);
  const block = blocks.find((b) => b.slug === featured[pick])!;
  const typed = useTyped(`npx halo-ds add ${block.slug}`);
  const done = typed.length === `npx halo-ds add ${block.slug}`.length;
  return (
    <section className="hs hs-command">
      <Head eyebrow="Command line" title="Add a whole page with one command" text="Sign-in, pricing, dashboards and more, straight into your project." />
      <div className="hs-command-body">
        <div className="hs-terminal" data-theme="dark">
          <div className="hs-terminal-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="hs-terminal-lines">
            <p>
              <span className="hs-dim">$ </span>
              {typed}
              {!done && <span className="hs-caret" />}
            </p>
            {done && (
              <>
                <p className="hs-in">
                  <span className="hs-ok">✓</span> Added the {block.title} block to src/blocks/{block.title.replace(/\s/g, '')}.tsx
                </p>
                <p className="hs-in hs-dim">Then change the words, data and handlers to fit your app.</p>
              </>
            )}
          </div>
          <div className="hs-chips" role="tablist" aria-label="Blocks">
            {featured.map((slug, i) => (
              <button
                key={slug}
                type="button"
                role="tab"
                aria-selected={i === pick}
                className="hs-chip"
                onClick={() => {
                  setAuto(false);
                  setPick(i);
                }}
              >
                {blocks.find((b) => b.slug === slug)!.title}
              </button>
            ))}
          </div>
        </div>
        <div className="hs-block-frame" key={block.slug}>
          <div className="hs-block-zoom" inert>
            <block.Block />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- The components ---------- */

const showcase = ['button', 'input', 'date-picker', 'table', 'select', 'tabs', 'toast', 'charts', 'avatar', 'stepper', 'file-upload', 'rating'];

export function ComponentsSection() {
  const { go } = useRoute();
  const entries = showcase.map((s) => all.find((e) => e.slug === s)).filter((e) => e !== undefined);
  return (
    <section className="hs">
      <Head eyebrow="Components" title={`${all.length} components, every state built in`} text="Keyboard and screen reader ready, in light and dark.">
        <Button variant="secondary" iconRight={<ArrowRight />} onClick={() => go('/components')}>
          Browse all components
        </Button>
      </Head>
      <div className="hs-card-grid">
        {entries.map((e) => {
          const Preview = thumbFor(e.slug);
          return (
            <Link key={e.slug} to={`/components/${e.slug}`} className="hs-card">
              <div className="hs-card-preview" inert>
                <div className="thumb-inner">{Preview && <Preview />}</div>
              </div>
              <span className="hs-card-name">{e.name}</span>
              <span className="hs-card-text">{e.description}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- AI tools ---------- */

const calls = ['get_setup_and_rules', 'list_blocks', 'get_block sign-in', 'get_component PasswordInput'];

function AiChat() {
  // A loop: the request types in, the tools tick off one by one, then the answer
  const step = useTick(700) % 14;
  const ask = 'Build a sign-in page for my app';
  return (
    <div className="hs-chat" aria-label="An AI assistant using the Halo MCP server">
      <p className="hs-bubble">{step >= 1 ? ask : ' '}</p>
      <p className={`hs-thinking ${step >= 2 ? 'hs-in' : 'hs-hidden'}`}>
        <Sparkle aria-hidden="true" /> Checking the design system
      </p>
      {calls.map((c, i) => (
        <p key={c} className={`hs-call ${step >= 3 + i * 2 ? 'hs-in' : 'hs-hidden'}`}>
          <CheckCircle weight="fill" className={step >= 4 + i * 2 ? 'hs-done' : 'hs-pending'} aria-hidden="true" />
          <span className="hs-dim">halo</span> {c}
        </p>
      ))}
      <p className={`hs-answer ${step >= 11 ? 'hs-in' : 'hs-hidden'}`}>
        Added <strong>src/pages/SignIn.tsx</strong> with Halo&apos;s inputs, buttons and checkbox.
      </p>
    </div>
  );
}

export function AiSection() {
  const { go } = useRoute();
  const [tool, setTool] = useState<keyof typeof mcpConfigs>('claude');
  const config = mcpConfigs[tool];
  return (
    <section className="hs">
      <Head eyebrow="AI tools" title="Your AI knows every component" text="It reads props, examples and rules through Halo's MCP server.">
        <Button variant="secondary" iconRight={<ArrowRight />} onClick={() => go('/docs/ai')}>
          Set up your AI tool
        </Button>
      </Head>
      <div className="hs-ai-body">
        <div className="hs-ai-setup">
          <Tabs value={tool} onValueChange={(v) => setTool(v as typeof tool)} variant="pill" size="sm">
            <TabList aria-label="AI tool">
              {(Object.keys(mcpConfigs) as (keyof typeof mcpConfigs)[]).map((k) => (
                <Tab key={k} value={k}>
                  {mcpConfigs[k].label}
                </Tab>
              ))}
            </TabList>
          </Tabs>
          <p className="hs-file">{config.file}</p>
          <CodeBlock code={config.code} label="Copy setup" />
        </div>
        <AiChat />
      </div>
    </section>
  );
}

/* ---------- Example apps ---------- */

export function AppsSection() {
  const [app, setApp] = useState(apps[0]!.id);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const current = apps.find((a) => a.id === app)!;
  const tick = useTick(3500);
  const screen = current.screens[tick % current.screens.length]!;
  return (
    <section className="hs">
      <Head eyebrow="Example apps" title="Seven apps, every screen designed" text="Over 200 screens, desktop and mobile, built only from Halo.">
        <Link to="/examples" className="hs-link">
          See all examples <ArrowRight aria-hidden="true" />
        </Link>
      </Head>
      <div className="hs-apps-tools">
        <Tabs value={app} onValueChange={setApp} variant="pill" size="sm">
          <TabList aria-label="App">
            {apps.map((a) => (
              <Tab key={a.id} value={a.id}>
                {a.name}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <SegmentedControl aria-label="Screen size" size="sm" value={device} onValueChange={(v) => setDevice(v as typeof device)} options={[{ value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Mobile' }]} />
      </div>
      <div className={`hs-device hs-${device}`}>
        <div className="hs-device-bar">
          <span />
          <span />
          <span />
          <span className="hs-device-name">
            {current.name} · {screen.name}
          </span>
        </div>
        <div className="hs-device-screen">
          <img key={`${screen.id}-${device}`} src={`${import.meta.env.BASE_URL}screens/${screen.id}-${device}.webp`} alt={`${current.name}: ${screen.name}`} width={screen[device][0]} height={screen[device][1]} />
        </div>
      </div>
    </section>
  );
}

/* ---------- Charts ---------- */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((m, i) => ({ m, visits: [320, 410, 380, 520, 490, 610, 580, 700][i], signups: [120, 160, 150, 210, 230, 260, 250, 320][i] }));

/** True while the element is on screen. Each time it comes back into view, `run` goes up, so animations can replay. */
function useInView<T extends Element>() {
  const [el, setEl] = useState<T | null>(null);
  const [run, setRun] = useState(0);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e!.isIntersecting) {
        setSeen(true);
        setRun((r) => r + 1);
      } else setSeen(false);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [el]);
  return { ref: setEl, run, seen };
}

/** A number that counts up from zero each time `run` changes. */
function CountUp({ to, run, format = (n: number) => n.toLocaleString('en-US') }: { to: number; run: number; format?: (n: number) => string }) {
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!run || reducedMotion()) return setN(to);
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 1200);
      setN(to * (1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [to, run]);
  return <>{format(n)}</>;
}

/** A chart card that replays its chart's entrance each time it scrolls into view. */
function ChartCard({ title, wide, children }: { title: ReactNode; wide?: boolean; children: (run: number) => ReactNode }) {
  const { ref, run } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`hs-chart${wide ? ' hs-chart-wide' : ''}`}>
      <p className="hs-chart-title">{title}</p>
      {/* A new key remounts the chart, which starts its animation again */}
      <div key={run} data-chart-run={run} className={run ? 'hs-chart-play' : undefined}>
        {children(run)}
      </div>
    </div>
  );
}

export function ChartsSection() {
  return (
    <section className="hs">
      <Head eyebrow="Charts" title="Charts that read at a glance" text="Line, area, bar and pie. They follow your theme." />
      <div className="hs-charts">
        <ChartCard title="Visits and sign-ups" wide>
          {() => <AreaChart label="Visits and sign-ups" data={months} xKey="m" series={[{ key: 'visits', label: 'Visits' }, { key: 'signups', label: 'Sign-ups' }]} height={240} legend />}
        </ChartCard>
        <ChartCard title="Traffic by device">
          {(run) => (
            <PieChart
              label="Traffic by device"
              variant="donut"
              data={[{ label: 'Desktop', value: 58 }, { label: 'Mobile', value: 34 }, { label: 'Tablet', value: 8 }]}
              centerLabel="Visits"
              centerValue={<CountUp to={12.4} run={run} format={(n) => `${n.toFixed(1)}k`} />}
              legend="bottom"
              size={180}
            />
          )}
        </ChartCard>
        <ChartCard title="Orders this week" wide>
          {() => <BarChart label="Orders this week" data={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({ d, orders: [42, 58, 51, 66, 73, 38, 30][i] }))} xKey="d" series={[{ key: 'orders', label: 'Orders' }]} height={220} />}
        </ChartCard>
        <ChartCard title="Revenue">
          {(run) => (
            <div className="hs-stat">
              <strong>
                $<CountUp to={48920} run={run} format={(n) => Math.round(n).toLocaleString('en-US')} />
              </strong>
              <span className="hs-up">
                Up <CountUp to={12} run={run} format={(n) => `${Math.round(n)}%`} /> on last month
              </span>
            </div>
          )}
        </ChartCard>
      </div>
    </section>
  );
}

/* ---------- Open source ---------- */

export function OpenSourceSection() {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    // The live star count, shown once there are some; the section still reads fine without it
    fetch('https://api.github.com/repos/Halo-design-system/Halo-design-system')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && typeof d.stargazers_count === 'number' && setStars(d.stargazers_count))
      .catch(() => {});
  }, []);
  return (
    <section className="hs hs-center">
      <Head eyebrow="Open source" title="Free, and yours to change" text="MIT licensed. Use it anywhere, including paid projects." />
      <a className="hs-github" href={links.github}>
        <GithubLogo weight="fill" aria-hidden="true" />
        <span>Star on GitHub</span>
        {stars ? (
          <span className="hs-stars">
            <Star weight="fill" aria-hidden="true" /> {stars.toLocaleString('en-US')}
          </span>
        ) : null}
      </a>
    </section>
  );
}

/* ---------- Questions ---------- */

const faqs: [string, ReactNode][] = [
  ['Is Halo free?', 'Yes. The React components, design tokens, CLI, MCP server and Figma file are free, and the code is MIT licensed.'],
  ['Which React setups does it work with?', 'React 18 and 19, with Vite, Next.js or any other React setup. The styles and the font load by themselves, so there is nothing else to set up.'],
  ['How do AI tools use it?', <>Halo&apos;s MCP server gives your assistant every component&apos;s props, examples and rules. Skills and plain-text docs work with tools that don&apos;t use MCP. See <Link to="/docs/ai">AI and MCP server</Link>.</>],
  ['Can I use my own brand colour?', <>Yes. Run <code>npx halo-ds theme &quot;#2F6BFF&quot;</code> and it works out every brand colour for light and dark mode. Try it on the components at the top of this page.</>],
  ['Is it accessible?', 'Every component works with the keyboard and screen readers, and every story is checked automatically for accessibility problems in light and dark mode.'],
  ['Is there a Figma file?', 'Yes, free. Every component, variant and token from the code, so what you design is what ships.'],
];

export function FaqSection() {
  return (
    <section className="hs hs-faq">
      <Head eyebrow="Questions" title="Frequently asked questions" text="Anything else? Ask on GitHub." />
      <Accordion>
        {faqs.map(([q, a]) => (
          <AccordionItem key={q} title={q}>
            {a}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
