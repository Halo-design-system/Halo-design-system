import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Accordion, AccordionItem, Button } from '@halo-ds/react';
import {
  ArrowRight,
  ArrowSquareOut,
  Check,
  Devices,
  FigmaLogo,
  Layout,
  Moon,
  PaintBrush,
  Palette,
  Rows,
  Shapes,
  Smiley,
  SquaresFour,
  X,
} from '@phosphor-icons/react';
import { guideFor } from '../guide';
import { all } from '../registry';
import type { Entry } from '../registry';
import { Link, links, useRoute } from '../router';
import { Sidebar } from './Components';

const base = import.meta.env.BASE_URL;

// What's in the Figma file, counted from it. Each row opens to say more.
const features = [
  {
    icon: <SquaresFour />,
    title: 'Components',
    count: `${all.length} components, 2,125 variants`,
    text: 'Every component in the React package, built as a Figma component with the same name and the same options. A Button, for example, is one component with 400 variants for its types, sizes, states and icons, so you pick options instead of hunting for the right copy.',
  },
  {
    icon: <Layout />,
    title: 'Blocks',
    count: '8 page sections',
    text: 'Ready-made sections like sign in, a dashboard, a settings page and pricing, built from the components. Start a screen from one, then change the words and data. Each matches a block in code.',
  },
  {
    icon: <Moon />,
    title: 'Light and dark mode',
    count: 'Every component',
    text: 'Colours come from variables with a light and a dark mode. Switch any frame between them and every component inside follows.',
  },
  {
    icon: <Palette />,
    title: 'Design tokens',
    count: '288 variables, 42 text styles',
    text: 'Colour, spacing, radius, type and layout are all variables, with the same names as the CSS variables in code. Layout variables have Mobile, Tablet, Desktop and Wide modes for grids and margins.',
  },
  {
    icon: <Shapes />,
    title: 'Phosphor icons',
    count: '1,512 icons, regular and fill',
    text: 'The full Phosphor icon set, the same icons the code examples use through @phosphor-icons/react. Swap any icon in a component from its properties.',
  },
  {
    icon: <PaintBrush />,
    title: 'Custom illustrations',
    count: '40 illustrations, 60 awards',
    text: 'Illustrations drawn for Halo, for empty states, errors and first use, in quiet greys with a soft brand accent. Award badges, like Verified or On fire, sit on avatars and profiles.',
  },
  {
    icon: <Smiley />,
    title: 'Emojis, flags and logos',
    count: '3,719 emojis, 271 flags, 1,489 logos',
    text: 'Emojis for reactions and messages, country flags for phone and country fields, and logos for sign-in buttons, integrations and placeholder brands.',
  },
  {
    icon: <Devices />,
    title: 'Example apps',
    count: '7 apps, 29 screens, desktop and mobile',
    text: 'Banking, healthcare, payroll, tax, sales, creators and a SaaS product, each on desktop and mobile, built only from the components.',
  },
  {
    icon: <Rows />,
    title: 'Built like the code',
    count: 'Auto layout and slots',
    text: 'Every frame uses auto layout, so components resize the way they do in the browser. Slots take your own content without detaching, and spacing and corners are bound to variables.',
  },
];

const withGuide = all.filter((e) => guideFor(e.slug));

// Each cursor drifts around one part of the screenshot: the canvas, the layers and the properties
const cursors = [
  { name: 'Amara', colour: '#1FA971', path: 'canvas' },
  { name: 'Tunde', colour: '#F2603B', path: 'layers' },
  { name: 'Lena', colour: '#2F6BFF', path: 'panel' },
];

function Overview({ entry }: { entry: Entry }) {
  return (
    <div className="page figma-page">
      <header className="figma-hero">
        <div className="figma-hero-text">
          <p className="eyebrow">Figma library</p>
          <h1>Design with the same components you ship</h1>
          <p className="lede">
            The Figma library mirrors the React package piece for piece: the same names, the same variants and the same tokens. Duplicate it, set your brand colour, and design screens your developers can build as drawn.
          </p>
          <div className="hero-actions figma-actions">
            <Button iconLeft={<FigmaLogo />} iconRight={<ArrowSquareOut />} onClick={() => window.open(links.figma, '_blank', 'noopener')}>
              Get the Figma file
            </Button>
            <Button variant="secondary" iconRight={<ArrowRight />} onClick={() => document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' })}>
              When to use what
            </Button>
          </div>
        </div>
        <div className="figma-shot">
          <img
            src={`${base}figma/figma-ui.webp`}
            alt="The Figma file open on a banking dashboard built from the components, with a Button selected and its properties in the right panel"
            width={1920}
            height={1034}
          />
          {/* Teammates working in the file: decorative, so hidden from screen readers */}
          <div aria-hidden="true">
            {cursors.map((c) => (
              <span key={c.name} className={`figma-cursor figma-cursor-${c.path}`} style={{ '--c': c.colour } as CSSProperties}>
                <svg viewBox="0 0 16 16" width="18" height="18">
                  <path d="M1 1l5.5 13.5 2-5.5 5.5-2z" fill="var(--c)" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
                <span className="figma-cursor-name">{c.name}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="figma-section" aria-labelledby="inside">
        <h2 id="inside">What's inside</h2>
        <Accordion className="inside-list">
          {features.map((f) => (
            <AccordionItem
              key={f.title}
              value={f.title}
              headingLevel={3}
              title={
                <span className="inside-row">
                  <span className="inside-icon" aria-hidden="true">{f.icon}</span>
                  <span className="inside-title">{f.title}</span>
                  <span className="inside-count">{f.count}</span>
                </span>
              }
            >
              <p className="inside-text">{f.text}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="figma-section" id="guide" aria-labelledby="guide-title">
        <h2 id="guide-title">When to use what</h2>
        <p className="lede">Pick a component to see where it belongs in a real screen, and the mistakes to avoid.</p>
        <div className="docs figma-guide">
          <Sidebar current={entry.slug} base="/figma" />
          <GuidePage entry={entry} />
        </div>
      </section>
    </div>
  );
}

function GuidePage({ entry }: { entry: Entry }) {
  const { guide, image } = guideFor(entry.slug)!;
  const i = withGuide.indexOf(entry);
  const prev = withGuide[i - 1];
  const next = withGuide[i + 1];

  return (
    <div className="docs-main guide">
      <header className="page-head">
        <h2 className="guide-title">{entry.name}</h2>
        <p className="lede">{guide.callout}</p>
        <div className="head-links">
          <Link to={`/components/${entry.slug}`}>Code and examples</Link>
          <a href={links.figma} target="_blank" rel="noreferrer">Open in Figma</a>
        </div>
      </header>

      <div className="guide-about">
        {guide.about.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {guide.example && (
        <section className="docs-section" aria-labelledby="in-use">
          <h3 id="in-use" className="guide-h">In use</h3>
          <figure className="guide-example">
            <img src={`${base}usage/${image}.webp`} alt="" width={guide.example.width} height={guide.example.height} loading="lazy" />
            <figcaption>{guide.example.caption}</figcaption>
          </figure>
        </section>
      )}

      <section className="docs-section" aria-labelledby="dos">
        <h3 id="dos" className="guide-h">Do's and don'ts</h3>
        <div className="dodont">
          <div className="dodont-card dodont-do">
            <h4><Check aria-hidden="true" weight="bold" /> Do</h4>
            <ul>{guide.dos.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div className="dodont-card dodont-dont">
            <h4><X aria-hidden="true" weight="bold" /> Don't</h4>
            <ul>{guide.donts.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
      </section>

      {guide.compare.map((c) => (
        <section key={c.title} className="docs-section" aria-label={c.title}>
          <h3 className="guide-h">{c.title}</h3>
          {c.intro && <p>{c.intro}</p>}
          <div className="compare">
            {c.options.map((o) => (
              <div key={o.title} className="compare-card">
                <h4>{o.title}</h4>
                {o.points.length > 1 ? (
                  <ul>{o.points.map((t) => <li key={t}>{t}</li>)}</ul>
                ) : (
                  <p>{o.points[0]}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <nav className="pager" aria-label="More guides">
        {prev ? <Link to={`/figma/${prev.slug}`} className="pager-link">{prev.name}</Link> : <span />}
        {next && <Link to={`/figma/${next.slug}`} className="pager-link pager-next">{next.name}</Link>}
      </nav>
    </div>
  );
}

export function Figma() {
  const { path } = useRoute();
  const slug = path.replace(/^\/figma\/?/, '');
  const entry = withGuide.find((e) => e.slug === slug) ?? withGuide[0]!;
  // Picking a component in the guide list scrolls back to the guide, not to the top of the page
  useEffect(() => {
    if (slug) document.getElementById('guide')?.scrollIntoView({ block: 'start' });
  }, [slug]);
  return <Overview entry={entry} />;
}
