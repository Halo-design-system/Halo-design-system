import { useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Avatar,
  BarChart,
  Badge,
  Button,
  Calendar,
  Card,
  Checkbox,
  FileItem,
  InputField,
  RangeSlider,
  SegmentedControl,
  SelectField,
  Statistic,
  Switch,
  Tab,
  TabList,
  Tabs,
  Tag,
  useToast,
} from '@halo-ds/react';
import { ArrowRight, Code, FigmaLogo, Plugs } from '@phosphor-icons/react';
import { CodeBlock } from '../CodeBlock';
import { Link, links, useRoute } from '../router';
import { apps } from '../screens';

/* Brand colours people can try on the live examples. Purple is Halo's own, so it uses the real tokens.
   The others set the few variables a rebrand needs, with light and dark values (site.css picks by theme). */
const brands = [
  { name: 'Purple', main: '#CC1DD0' },
  {
    name: 'Blue', main: '#2F6BFF', hover: '#1F5FE0', ring: '#C9DAFF',
    light: { soft: '#EAF1FF', tint: '#C9DAFF', text: '#1A4CC2' },
    dark: { soft: '#14306E', tint: '#1C3F8F', text: '#C9DAFF' },
  },
  {
    name: 'Green', main: '#178C4E', hover: '#11693A', ring: '#B9E6CE',
    light: { soft: '#E8F7EF', tint: '#B9E6CE', text: '#11693A' },
    dark: { soft: '#0E3D24', tint: '#13502F', text: '#B9E6CE' },
  },
  {
    name: 'Orange', main: '#E2601B', hover: '#C24F12', ring: '#FFD3B8',
    light: { soft: '#FFF2EA', tint: '#FFD3B8', text: '#8F3A0C' },
    dark: { soft: '#5A2608', tint: '#73320C', text: '#FFD3B8' },
  },
];

const brandVars = (b: (typeof brands)[number]) =>
  (b.light
    ? {
        '--b-main': b.main,
        '--b-hover': b.hover,
        '--b-ring': b.ring,
        '--b-soft-light': b.light.soft,
        '--b-tint-light': b.light.tint,
        '--b-text-light': b.light.text,
        '--b-soft-dark': b.dark.soft,
        '--b-tint-dark': b.dark.tint,
        '--b-text-dark': b.dark.text,
      }
    : {}) as CSSProperties;

function SignUp() {
  const { toast } = useToast();
  return (
    <Card className="demo-card">
      <form
        className="demo-form"
        onSubmit={(e) => {
          e.preventDefault();
          toast({ type: 'success', title: 'Account created', description: 'Check your email to confirm it.' });
        }}
      >
        <div>
          <h3 className="demo-title">Create your account</h3>
          <p className="demo-sub">Free for 14 days. No card needed.</p>
        </div>
        <InputField label="Work email" type="email" placeholder="name@company.com" />
        <SelectField
          label="Team size"
          placeholder="Choose one"
          options={[
            { value: '1', label: 'Just me' },
            { value: '10', label: '2 to 10' },
            { value: '50', label: '11 to 50' },
            { value: '51', label: 'More than 50' },
          ]}
        />
        <Checkbox label="Send me product updates" defaultChecked />
        <Button type="submit">Create account</Button>
      </form>
    </Card>
  );
}

function Numbers() {
  return (
    <Card className="demo-card">
      <div className="demo-stats">
        <Statistic label="Revenue" value={48920} prefix="$" change="+5.6%" trend="up" comparison="vs last month" />
        <Statistic label="Churn" value={2.3} precision={1} suffix="%" change="-0.4%" trend="down" sentiment="positive" comparison="vs last month" />
      </div>
    </Card>
  );
}

function Settings() {
  const [view, setView] = useState('week');
  return (
    <Card className="demo-card">
      <div className="demo-form">
        <h3 className="demo-title">Notifications</h3>
        <Switch label="New comments" description="When someone replies to you." defaultChecked />
        <Switch label="Weekly summary" description="Every Monday morning." />
        <SegmentedControl
          aria-label="Digest"
          fullWidth
          value={view}
          onValueChange={setView}
          options={[
            { value: 'day', label: 'Daily' },
            { value: 'week', label: 'Weekly' },
            { value: 'never', label: 'Never' },
          ]}
        />
      </div>
    </Card>
  );
}

function Team() {
  const people = [
    { name: 'Ada Obi', role: 'Owner', tone: 'brand' as const },
    { name: 'Kofi Mensah', role: 'Editor', tone: 'neutral' as const },
    { name: 'Lena Park', role: 'Viewer', tone: 'neutral' as const },
  ];
  return (
    <Card className="demo-card">
      <div className="demo-form">
        <Tabs defaultValue="members">
          <TabList aria-label="Team">
            <Tab value="members">Members</Tab>
            <Tab value="invites">Invites</Tab>
          </TabList>
        </Tabs>
        <ul className="demo-people">
          {people.map((p) => (
            <li key={p.name}>
              <Avatar size="sm" name={p.name} />
              <span className="demo-person">{p.name}</span>
              <Badge size="sm" color={p.tone}>{p.role}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function Uploads() {
  return (
    <Card className="demo-card">
      <div className="demo-form">
        <div>
          <h3 className="demo-title">Uploads</h3>
          <p className="demo-sub">Two of three files are done.</p>
        </div>
        <FileItem name="Brand guidelines.pdf" size={2_400_000} status="uploading" progress={64} onCancel={() => {}} />
        <FileItem name="Cover image.png" size={840_000} status="complete" onRemove={() => {}} />
        <FileItem name="Pitch deck.key" size={12_600_000} status="complete" onRemove={() => {}} />
      </div>
    </Card>
  );
}

const visits = [
  { day: 'Mon', visits: 320 },
  { day: 'Tue', visits: 410 },
  { day: 'Wed', visits: 380 },
  { day: 'Thu', visits: 520 },
  { day: 'Fri', visits: 490 },
];

function Visits() {
  return (
    <Card className="demo-card">
      <div className="demo-form">
        <div>
          <h3 className="demo-title">Visits this week</h3>
          <p className="demo-sub">2,120 in total, up 14% on last week.</p>
        </div>
        <BarChart label="Visits this week" data={visits} xKey="day" series={[{ key: 'visits', label: 'Visits' }]} height={230} />
      </div>
    </Card>
  );
}

function Filters() {
  const [tags, setTags] = useState(['Design', 'Remote', 'Full time']);
  return (
    <Card className="demo-card">
      <div className="demo-form">
        <h3 className="demo-title">Filters</h3>
        <RangeSlider label="Salary" min={0} max={200} defaultValue={[60, 140]} formatValue={(v) => `$${v}k`} handleLabels={['Lowest salary', 'Highest salary']} />
        <div className="demo-tags">
          {tags.map((t) => (
            <Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Tag>
          ))}
        </div>
      </div>
    </Card>
  );
}

function PickDate() {
  const [date, setDate] = useState<Date | null>(new Date());
  return <Calendar value={date} onChange={setDate} />;
}

const features = [
  {
    icon: <FigmaLogo />,
    title: 'Designed in Figma',
    text: 'Every component with its variants and states, plus colour, spacing and type variables for light and dark mode.',
  },
  {
    icon: <Code />,
    title: 'Built in React',
    text: 'TypeScript components that work with the keyboard and screen readers. Style any part of them with classes or CSS variables.',
  },
  {
    icon: <Plugs />,
    title: 'Kept in sync',
    text: 'Design and code share the same tokens and the same names, so what you design is what ships.',
  },
];

export function Home() {
  const { go } = useRoute();
  const [brand, setBrand] = useState(brands[0]!);
  return (
    <>
      <section className="hero">
        <Badge color="neutral" variant="outline" className="hero-badge">Free and open source</Badge>
        <h1>One design system for Figma and React.</h1>
        <p className="lede">
          Halo gives designers a Figma library and developers React components built from the same tokens. Start with sixty components, light and dark mode, and seven example apps.
        </p>
        <div className="hero-actions">
          <Button size="lg" iconRight={<ArrowRight />} onClick={() => go('/docs/installation')}>Get started</Button>
          <Button size="lg" variant="secondary" onClick={() => go('/components')}>Browse components</Button>
          <Button size="lg" variant="ghost" iconLeft={<FigmaLogo />} onClick={() => go('/figma')}>Get the Figma file</Button>
        </div>
        <div className="hero-install">
          <CodeBlock code="npm install @halo-ds/react" label="Copy install command" compact />
        </div>
      </section>

      <section className="try" aria-labelledby="try-title">
        <div className="try-head">
          <div>
            <h2 id="try-title">Try it</h2>
            <p>These are the real components. Click around, then try your own brand colour.</p>
          </div>
          <div className="swatches" role="radiogroup" aria-label="Brand colour">
            {brands.map((b) => (
              <button
                key={b.name}
                type="button"
                role="radio"
                aria-checked={brand.name === b.name}
                aria-label={b.name}
                className="swatch"
                style={{ background: b.main }}
                onClick={() => setBrand(b)}
              />
            ))}
          </div>
        </div>
        <div className="demo-grid" data-rebrand={brand.light ? '' : undefined} style={brandVars(brand)}>
          <div className="demo-col">
            <SignUp />
            <Uploads />
          </div>
          <div className="demo-col">
            <Numbers />
            <Settings />
            <Visits />
          </div>
          <div className="demo-col">
            <Card className="demo-card demo-calendar">
              <PickDate />
            </Card>
            <Team />
            <Filters />
          </div>
        </div>
      </section>

      <section className="features" aria-label="What you get">
        {features.map((f) => (
          <div key={f.title} className="feature">
            <span className="feature-icon" aria-hidden="true">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>

      <section className="showcase" aria-labelledby="showcase-title">
        <div className="try-head">
          <div>
            <h2 id="showcase-title">See it in real screens</h2>
            <p>Seven example apps, on desktop and mobile, with every component named.</p>
          </div>
          <Button variant="secondary" iconRight={<ArrowRight />} onClick={() => go('/examples')}>All examples</Button>
        </div>
        <div className="used-grid showcase-grid">
          {(['saas', 'banking', 'healthcare'] as const).map((id) => {
            const app = apps.find((a) => a.id === id)!;
            const screen = app.screens[0]!;
            return (
              <Link key={id} to={`/examples/${id}`} className="used-card">
                <img src={`${import.meta.env.BASE_URL}screens/${screen.id}-desktop.webp`} alt="" loading="lazy" width={screen.desktop[0]} height={screen.desktop[1]} />
                <span className="used-screen">{app.name}</span>
                <span className="used-name">{app.screens.length} screens</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="cta">
        <h2>Start building</h2>
        <p>Install the package, or grab the Figma file and start designing.</p>
        <div className="hero-actions">
          <Button iconRight={<ArrowRight />} onClick={() => go('/docs/installation')}>Installation</Button>
          <Button variant="secondary" iconLeft={<FigmaLogo />} onClick={() => go('/figma')}>Figma file</Button>
        </div>
      </section>
    </>
  );
}
