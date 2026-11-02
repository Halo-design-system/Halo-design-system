// Foundation: the design tokens and assets every component is built from, read straight from @halo-ds/tokens.
import { useEffect, useMemo, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { Award, Illustration, Input, SegmentedControl, Spinner, awardNames, illustrationNames, useToast } from '@halo-ds/react';
import { tokens } from '@halo-ds/tokens';
import type { Token } from '@halo-ds/tokens';
import { ArrowRight, Bell, Heart, House, MagnifyingGlass, Star } from '@phosphor-icons/react';
import { Link } from '../router';

export const foundations = [
  { slug: 'colour', title: 'Colour', description: 'Semantic colours for surfaces, text, icons and borders, with their light and dark values, and the palettes under them.' },
  { slug: 'typography', title: 'Typography', description: 'The Geist font, three weights and a 13-step type scale, each size with its line height.' },
  { slug: 'spacing', title: 'Spacing', description: 'The spacing steps used for padding and gaps, from 2 to 120 pixels.' },
  { slug: 'radius', title: 'Radius', description: 'Corner sizes, from sharp to fully round.' },
  { slug: 'layout', title: 'Grid and layout', description: 'Breakpoints, columns, gutters and margins for mobile, tablet, desktop and wide screens.' },
  { slug: 'icons', title: 'Icons', description: 'Every Phosphor icon, regular and fill, ready to search and copy.' },
  { slug: 'illustrations', title: 'Illustrations', description: 'Illustrations for empty states and results, and awards for achievements.' },
  { slug: 'assets', title: 'Emojis, flags and logos', description: 'Emojis, country flags and brand logos, in the Figma file.' },
] as const;

const byPrefix = (prefix: string) => tokens.filter((t) => t.name.startsWith(prefix));
const valueOf = (t: Token) => (t.values.light ?? t.values.default ?? Object.values(t.values)[0]) as string | number;
const leaf = (t: Token) => t.name.split('/').pop()!;

/** Copies text and says so. */
function useCopy() {
  const { toast } = useToast();
  return (text: string) => {
    navigator.clipboard?.writeText(text).then(
      () => toast({ type: 'success', title: 'Copied', description: text }),
      () => {},
    );
  };
}

function Section({ title, text, children }: { title: string; text?: ReactNode; children: ReactNode }) {
  return (
    <section className="docs-section foundation-section">
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {children}
    </section>
  );
}

/* ---------- Colour ---------- */

const semanticGroups: [string, string, string][] = [
  ['Surface', 'surface/', 'Backgrounds for pages, cards and panels.'],
  ['Text', 'text/', 'Words, from primary to quiet, and text on brand colour.'],
  ['Icon', 'icon/', 'Icons and small glyphs.'],
  ['Border', 'border/', 'Lines, outlines and the focus ring.'],
  ['Button', 'button/', 'The fills behind buttons, in each state.'],
  ['Fill', 'fill/', 'Brand fills for controls like switches and checkboxes.'],
  ['States', 'state/', 'Information, success, warning and error.'],
  ['Charts', 'chart/', 'The series colours for charts, in order.'],
  ['Tags', 'tag/', 'Tag backgrounds and their text.'],
];

function Swatch({ t, onCopy }: { t: Token; onCopy: (s: string) => void }) {
  const light = (t.values.light ?? t.values.default) as string;
  const dark = t.values.dark as string | undefined;
  return (
    <button type="button" className="token-swatch" onClick={() => onCopy(`var(${t.cssVar})`)} aria-label={`Copy ${t.cssVar}`}>
      <span className="token-chip" style={{ background: `var(${t.cssVar})` }} />
      <span className="token-name">{t.name.replace(/^(state|tag|chart)\//, '')}</span>
      <span className="token-values">{dark && dark !== light ? `${light} · ${dark}` : light}</span>
    </button>
  );
}

function Colour() {
  const copy = useCopy();
  const families = [...new Set(byPrefix('colours/').map((t) => t.name.split('/')[1]!))];
  return (
    <>
      {semanticGroups.map(([title, prefix, text]) => (
        <Section key={title} title={title} text={text}>
          <div className="token-grid">
            {byPrefix(prefix)
              .filter((t) => t.collection === 'Semantic' && t.type === 'color')
              .map((t) => (
                <Swatch key={t.name} t={t} onCopy={copy} />
              ))}
          </div>
        </Section>
      ))}
      <Section title="Palettes" text="The raw colours the semantic ones point at. Use the semantic names in your code, so light and dark mode keep working.">
        <div className="palettes">
          {families.map((f) => (
            <div key={f} className="palette">
              <span className="palette-name">{f}</span>
              <div className="palette-row">
                {byPrefix(`colours/${f}/`).map((t) => (
                  <button key={t.name} type="button" className="palette-step" style={{ background: valueOf(t) as string }} onClick={() => copy(`var(${t.cssVar})`)} aria-label={`Copy ${t.cssVar}`} title={`${leaf(t)} ${valueOf(t)}`}>
                    <span>{leaf(t)}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

/* ---------- Typography ---------- */

function Typography() {
  const copy = useCopy();
  const sizes = byPrefix('size/');
  const weights: [string, number][] = [['Regular', 400], ['Semibold', 600], ['Bold', 700]];
  return (
    <>
      <Section title="Font" text="Geist, for headings, body text, labels and captions. It loads with the components, so there is nothing to add.">
        <div className="type-weights">
          {weights.map(([name, w]) => (
            <div key={name} className="type-weight">
              <span style={{ fontWeight: w }}>Aa</span>
              <span className="token-name">{name}</span>
              <span className="token-values">{w}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Type scale" text="Each size comes with its line height. Click one to copy its variables.">
        <div className="type-scale">
          {[...sizes].reverse().map((t) => {
            const step = leaf(t);
            const lh = tokens.find((x) => x.name === `line-height/${step}`)!;
            return (
              <button key={step} type="button" className="type-row" onClick={() => copy(`font-size: var(${t.cssVar}); line-height: var(${lh.cssVar});`)}>
                <span className="type-meta">
                  <span className="token-name">{step}</span>
                  <span className="token-values">
                    {valueOf(t)} / {valueOf(lh)}
                  </span>
                </span>
                <span className="type-sample" style={{ fontSize: `var(${t.cssVar})`, lineHeight: `var(${lh.cssVar})` }}>
                  Build the screen you designed
                </span>
              </button>
            );
          })}
        </div>
      </Section>
    </>
  );
}

/* ---------- Spacing and radius ---------- */

function Spacing() {
  const copy = useCopy();
  return (
    <>
      <Section title="Steps" text="Use these for padding and gaps. Left and right padding should match.">
        <div className="space-list">
          {byPrefix('spacing/spacing-')
            .filter((t) => t.collection === 'Primitives')
            .map((t) => (
              <button key={t.name} type="button" className="space-row" onClick={() => copy(`var(${t.cssVar})`)}>
                <span className="token-name">{leaf(t)}</span>
                <span className="token-values">{valueOf(t)}px</span>
                <span className="space-bar" style={{ width: `var(${t.cssVar})` }} />
              </button>
            ))}
        </div>
      </Section>
      <Section title="Named sizes" text="Shortcuts for the steps used most.">
        <div className="space-list">
          {byPrefix('spacing/spacing-')
            .filter((t) => t.collection === 'Semantic')
            .map((t) => (
              <button key={t.name} type="button" className="space-row" onClick={() => copy(`var(${t.cssVar})`)}>
                <span className="token-name">{leaf(t)}</span>
                <span className="token-values">{valueOf(t)}px</span>
                <span className="space-bar" style={{ width: `var(${t.cssVar})` }} />
              </button>
            ))}
        </div>
      </Section>
    </>
  );
}

function Radius() {
  const copy = useCopy();
  return (
    <Section title="Corners" text="Click one to copy it.">
      <div className="radius-grid">
        {byPrefix('radius/').map((t) => (
          <button key={t.name} type="button" className="radius-item" onClick={() => copy(`var(${t.cssVar})`)}>
            <span className="radius-box" style={{ borderRadius: `var(${t.cssVar})` }} />
            <span className="token-name">{leaf(t)}</span>
            <span className="token-values">{valueOf(t)}px</span>
          </button>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Layout ---------- */

function Layout() {
  const get = (name: string) => tokens.find((t) => t.name === name)!;
  const modes = ['mobile', 'tablet', 'desktop', 'wide'] as const;
  const [mode, setMode] = useState<(typeof modes)[number]>('desktop');
  const cols = get('grid/columns').values[mode] as number;
  return (
    <>
      <Section title="Breakpoints" text="The grid changes at each width. The variables switch by themselves.">
        <div className="table-scroll">
          <table className="layout-table">
            <thead>
              <tr>
                <th>Screen</th>
                <th>From</th>
                <th>Columns</th>
                <th>Gutter</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              {modes.map((m) => (
                <tr key={m}>
                  <td>{m[0]!.toUpperCase() + m.slice(1)}</td>
                  <td>{get('breakpoint/min-width').values[m]}px</td>
                  <td>{get('grid/columns').values[m]}</td>
                  <td>{get('grid/gutter').values[m]}px</td>
                  <td>{get('grid/margin').values[m]}px</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="Columns">
        <SegmentedControl aria-label="Screen" size="sm" value={mode} onValueChange={(v) => setMode(v as typeof mode)} options={modes.map((m) => ({ value: m, label: m[0]!.toUpperCase() + m.slice(1) }))} />
        <div className="grid-demo" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: get('grid/gutter').values[mode] as number, paddingInline: Math.min(40, get('grid/margin').values[mode] as number) }}>
          {Array.from({ length: cols }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </Section>
    </>
  );
}

/* ---------- Icons ---------- */

/** Name, then the inside of its SVG in regular and fill. Made by scripts/icons.mjs. */
type IconSet = [string, [string, string]][];

function Icons() {
  const copy = useCopy();
  const [set, setSet] = useState<IconSet | null>(null);
  const [q, setQ] = useState('');
  const [weight, setWeight] = useState<'regular' | 'fill'>('regular');
  // Every icon is a big download, so this page fetches them only when it opens
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}foundation/icons.json`)
      .then((r) => r.json())
      .then((icons: Record<string, [string, string]>) => setSet(Object.entries(icons)));
  }, []);
  const shown = useMemo(() => (set ?? []).filter(([name]) => name.toLowerCase().includes(q.trim().toLowerCase().replace(/\s+/g, ''))), [set, q]);
  return (
    <Section title={set ? `${set.length.toLocaleString('en-US')} icons` : 'Icons'} text={<>From <a href="https://phosphoricons.com">Phosphor</a>, in regular and fill. Click one to copy it.</>}>
      <div className="icon-tools">
        <Input aria-label="Search icons" placeholder="Search, like arrow or bell" iconLeft={<MagnifyingGlass />} value={q} onChange={(e) => setQ(e.target.value)} />
        <SegmentedControl aria-label="Weight" value={weight} onValueChange={(v) => setWeight(v as typeof weight)} options={[{ value: 'regular', label: 'Regular' }, { value: 'fill', label: 'Fill' }]} />
      </div>
      {!set ? (
        <Spinner label="Loading icons" />
      ) : (
        <div className="icon-grid">
          {shown.slice(0, 400).map(([name, svg]) => (
            <button key={name} type="button" className="icon-cell" onClick={() => copy(`<${name}${weight === 'fill' ? ' weight="fill"' : ''} />`)} title={name}>
              {/* Generated from @phosphor-icons/react by our own build script */}
              <svg width={28} height={28} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg[weight === 'fill' ? 1 : 0] }} />
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}
      {set && shown.length > 400 && <p className="foundation-note">Showing 400 of {shown.length}. Search to find the rest.</p>}
    </Section>
  );
}

/* ---------- Illustrations ---------- */

function Illustrations() {
  const copy = useCopy();
  return (
    <>
      <Section title={`${illustrationNames.length} illustrations`} text="For empty states, results and onboarding. They follow light and dark mode and your brand colour.">
        <div className="art-grid">
          {illustrationNames.map((name) => (
            <button key={name} type="button" className="art-cell" onClick={() => copy(`<Illustration name="${name}" />`)}>
              <Illustration name={name} size={120} />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </Section>
      <Section title={`${awardNames.length} awards`} text="Badges for achievements, streaks and milestones.">
        <div className="art-grid">
          {awardNames.map((name) => (
            <button key={name} type="button" className="art-cell" onClick={() => copy(`<Award name="${name}" />`)}>
              <Award name={name} size={96} />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </Section>
    </>
  );
}

/* ---------- Emojis, flags and logos ---------- */

function Assets() {
  const sheets = [
    ['emojis', '3,719 emojis', 'For reactions, messages and status.'],
    ['flags', '271 flags', 'For phone number and country fields.'],
    ['logos', '1,489 logos', 'For sign-in buttons, integrations and placeholder brands.'],
  ] as const;
  return (
    <>
      {sheets.map(([file, title, text]) => (
        <Section key={file} title={title} text={text}>
          <img className="asset-sheet" src={`${import.meta.env.BASE_URL}foundation/${file}.webp`} alt={`A sample of the ${file} in the Figma file`} loading="lazy" width={2560} height={1024} />
        </Section>
      ))}
      <p className="foundation-note">
        These live in the Figma file as components, ready to drop into designs. <Link to="/figma">Get the Figma file</Link>
      </p>
    </>
  );
}

const pages: Record<(typeof foundations)[number]['slug'], ComponentType> = {
  colour: Colour,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  layout: Layout,
  icons: Icons,
  illustrations: Illustrations,
  assets: Assets,
};

export function FoundationDetail({ slug }: { slug: (typeof foundations)[number]['slug'] }) {
  const f = foundations.find((x) => x.slug === slug)!;
  const Page = pages[slug];
  return (
    <div className="docs-main">
      <header className="page-head">
        <p className="eyebrow">Foundation</p>
        <h1>{f.title}</h1>
        <p className="lede">{f.description}</p>
      </header>
      <Page />
    </div>
  );
}

/** Small previews for the overview cards. */
const previews: Record<(typeof foundations)[number]['slug'], () => ReactNode> = {
  colour: () => (
    <span className="fp-colour">
      {['purple-300', 'skyblue-400', 'green-400', 'yellow-300', 'orange-400', 'red-400'].map((c) => (
        <span key={c} style={{ background: `var(--halo-color-${c})` }} />
      ))}
    </span>
  ),
  typography: () => <span className="fp-type">Aa</span>,
  spacing: () => (
    <span className="fp-space">
      {[8, 16, 24, 40].map((w) => (
        <span key={w} style={{ width: w * 2 }} />
      ))}
    </span>
  ),
  radius: () => (
    <span className="fp-radius">
      {[2, 12, 24, 99].map((r) => (
        <span key={r} style={{ borderRadius: r }} />
      ))}
    </span>
  ),
  layout: () => (
    <span className="fp-grid">
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} />
      ))}
    </span>
  ),
  icons: () => (
    <span className="fp-icons">
      <House />
      <Bell />
      <Heart weight="fill" />
      <Star />
    </span>
  ),
  illustrations: () => <Illustration name={illustrationNames[0]!} size={88} />,
  assets: () => <img src={`${import.meta.env.BASE_URL}foundation/logos.webp`} alt="" className="fp-assets" />,
};

export function FoundationOverview() {
  return (
    <section className="overview-group" aria-labelledby="g-foundation" id="foundation">
      <h2 id="g-foundation">Foundation</h2>
      <div className="overview-grid">
        {foundations.map((f) => (
          <Link key={f.slug} to={`/components/foundation/${f.slug}`} className="overview-card foundation-card">
            <span className="overview-name">
              {f.title} <ArrowRight aria-hidden="true" />
            </span>
            <div className="thumb foundation-thumb">{previews[f.slug]()}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
