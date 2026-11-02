import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Accordion,
  AccordionItem,
  Alert,
  Avatar,
  AvatarGroup,
  BarChart,
  Badge,
  Button,
  Calendar,
  Card,
  Checkbox,
  ColorPicker,
  FileItem,
  InputField,
  Pagination,
  Popover,
  ProgressCircle,
  RangeSlider,
  Rating,
  SegmentedControl,
  SelectField,
  Statistic,
  Stepper,
  Switch,
  Tab,
  TabList,
  Tabs,
  Tag,
  TextareaField,
  VerificationCode,
  useToast,
} from '@halo-ds/react';
import { ArrowRight, Code, FigmaLogo, Plugs } from '@phosphor-icons/react';
import { brandVariables, contrast, parseHex } from '../../../../packages/cli/src/colour';
import { CodeBlock } from '../CodeBlock';
import { useRoute } from '../router';
import { AiSection, AppsSection, ChartsSection, CommandSection, ComponentsSection, FaqSection, OpenSourceSection } from './HomeSections';

/* ---------- The headline: the end of the sentence changes, with the letters scrambling into place ---------- */

const endings = [
  'AI-assisted frontend',
  'scalable products',
  'fintech apps',
  'edtech platforms',
  'agentic products',
  'HR management tools',
  'healthcare apps',
  'SaaS dashboards',
];

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Scramble({ words }: { words: string[] }) {
  const [text, setText] = useState(words[0]!);
  useEffect(() => {
    let index = 0;
    let frame = 0;
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const timer = window.setInterval(() => {
      const from = words[index]!;
      index = (index + 1) % words.length;
      const to = words[index]!;
      // Without motion, just swap the words
      if (reducedMotion()) return setText(to);
      const start = performance.now();
      const run = (now: number) => {
        const t = Math.min(1, (now - start) / 700);
        const length = Math.round(from.length + (to.length - from.length) * Math.min(1, t * 2));
        let out = '';
        for (let i = 0; i < length; i++) {
          // Letters settle from left to right; the rest flicker
          if (i / length < t * 1.2 - 0.2) out += to[i] ?? '';
          else out += to[i] === ' ' ? ' ' : letters[Math.floor(Math.random() * letters.length)];
        }
        setText(t < 1 ? out : to);
        if (t < 1) frame = requestAnimationFrame(run);
      };
      frame = requestAnimationFrame(run);
    }, 2800);
    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(frame);
    };
  }, [words]);
  return (
    <span className="scramble" aria-hidden="true">
      {text}
    </span>
  );
}

/* ---------- Brand colours for the live components ---------- */

const presets = [
  { name: 'Purple', hex: '#CC1DD0' },
  { name: 'Blue', hex: '#2F6BFF' },
  { name: 'Teal', hex: '#0F9D8A' },
  { name: 'Green', hex: '#178C4E' },
  { name: 'Orange', hex: '#E2601B' },
  { name: 'Red', hex: '#E5484D' },
];

/** The site's light or dark mode, kept up to date when the theme switch changes it. */
function useSiteTheme() {
  const read = (): 'light' | 'dark' => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  const [theme, setTheme] = useState(read);
  useEffect(() => {
    const watch = new MutationObserver(() => setTheme(read()));
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => watch.disconnect();
  }, []);
  return theme;
}

/** The same colour maths as `npx halo-ds theme`, so what you try here is what the CLI writes. */
function brandStyle(hex: string, theme: 'light' | 'dark'): CSSProperties {
  // Purple is Halo's own, so the real tokens apply
  if (hex === presets[0]!.hex) return {};
  const rgb = parseHex(hex);
  if (!rgb) return {};
  const { light, dark } = brandVariables(rgb);
  const vars: Record<string, string> = { ...light, '--halo-button-primary-focused': light['--halo-button-primary']!, ...(theme === 'dark' ? dark : {}) };
  // A light brand colour gets dark text on its buttons, so the label stays readable
  if (contrast([255, 255, 255], rgb) < 3) Object.assign(vars, { '--halo-text-on-brand': '#111111', '--halo-icon-on-brand': '#111111' });
  return vars as CSSProperties;
}

function BrandDock({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  const custom = !presets.some((p) => p.hex === value);
  return (
    <div className="brand-dock">
      <span className="brand-dock-label">Try your brand colour</span>
      <div className="swatches" role="radiogroup" aria-label="Brand colour">
        {presets.map((p) => (
          <button key={p.name} type="button" role="radio" aria-checked={value === p.hex} aria-label={p.name} className="swatch" style={{ background: p.hex }} onClick={() => onChange(p.hex)} />
        ))}
        <Popover
          side="top"
          title="Any colour"
          trigger={<button type="button" role="radio" aria-checked={custom} aria-label="Pick any colour" className="swatch swatch-custom" style={custom ? { background: value } : undefined} />}
        >
          <ColorPicker value={value} onValueChange={onChange} showOpacity={false} swatches={presets.map((p) => p.hex)} />
        </Popover>
      </div>
    </div>
  );
}

/* ---------- The live components in the hero ---------- */

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
        <BarChart label="Visits this week" data={visits} xKey="day" series={[{ key: 'visits', label: 'Visits' }]} height={200} />
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
  return (
    <Card className="demo-card demo-calendar">
      <Calendar value={date} onChange={setDate} />
    </Card>
  );
}

function Checkout() {
  const [step, setStep] = useState(1);
  return (
    <Card className="demo-card">
      <div className="demo-form">
        <h3 className="demo-title">Checkout</h3>
        <Stepper aria-label="Checkout" orientation="vertical" current={step} steps={[{ title: 'Cart', description: '3 items' }, { title: 'Shipping', description: 'Address and delivery' }, { title: 'Payment' }]} />
        <Button variant="secondary" onClick={() => setStep((s) => (s + 1) % 3)}>Next step</Button>
      </div>
    </Card>
  );
}

function Review() {
  const [stars, setStars] = useState(4);
  return (
    <Card className="demo-card">
      <div className="demo-form">
        <div>
          <h3 className="demo-title">Rate your order</h3>
          <p className="demo-sub">Tell others what you thought.</p>
        </div>
        <Rating value={stars} onValueChange={setStars} aria-label="Rating" />
        <TextareaField label="Your review" placeholder="The fit was great and it arrived early." rows={3} />
      </div>
    </Card>
  );
}

function Storage() {
  return (
    <Card className="demo-card">
      <div className="demo-row-card">
        <ProgressCircle value={72} showValue size="lg" aria-label="Storage used" />
        <div>
          <h3 className="demo-title">Storage</h3>
          <p className="demo-sub">36 GB of 50 GB used.</p>
        </div>
      </div>
    </Card>
  );
}

function Verify() {
  return (
    <Card className="demo-card">
      <div className="demo-form">
        <div>
          <h3 className="demo-title">Check your email</h3>
          <p className="demo-sub">Enter the 4-digit code we sent you.</p>
        </div>
        <VerificationCode length={4} aria-label="Verification code" />
      </div>
    </Card>
  );
}

function Help() {
  return (
    <Card className="demo-card">
      <div className="demo-form">
        <h3 className="demo-title">Questions</h3>
        <Accordion>
          <AccordionItem title="Can I change plans later?">Yes, any time. The price changes from your next bill.</AccordionItem>
          <AccordionItem title="Do you offer refunds?">Within 30 days, no questions asked.</AccordionItem>
          <AccordionItem title="Is there a free trial?">Every plan starts with 14 free days.</AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
}

function Notice() {
  return <Alert type="success" title="Payment received" description="Invoice #2041 is marked as paid." />;
}

function Results() {
  const [page, setPage] = useState(2);
  return (
    <Card className="demo-card">
      <div className="demo-form">
        <div className="demo-row-card">
          <AvatarGroup size="sm" max={3} total={8}>
            <Avatar name="Ada Obi" />
            <Avatar name="Kofi Mensah" />
            <Avatar name="Lena Park" />
          </AvatarGroup>
          <p className="demo-sub">8 people are viewing</p>
        </div>
        <Pagination pageCount={9} page={page} onPageChange={setPage} variant="compact" />
      </div>
    </Card>
  );
}

// Laid out as columns; each list fills one column from the top
const wall = [
  [SignUp, Storage, Help],
  [Numbers, Settings, Results, Notice],
  [PickDate, Team, Verify],
  [Visits, Filters, Checkout],
  [Uploads, Review],
];

const features = [
  {
    icon: <FigmaLogo />,
    title: 'Designed in Figma',
    text: 'Every component, variant and token, in light and dark.',
  },
  {
    icon: <Code />,
    title: 'Built in React',
    text: 'Typed, accessible, and styled with CSS variables.',
  },
  {
    icon: <Plugs />,
    title: 'Kept in sync',
    text: 'Same tokens and names, so what you design ships.',
  },
];

export function Home() {
  const { go } = useRoute();
  const [brand, setBrand] = useState(presets[0]!.hex);
  const theme = useSiteTheme();
  const style = useMemo(() => brandStyle(brand, theme), [brand, theme]);
  return (
    <>
      <section className="hero">
        <h1>
          The React design system for <span className="sr-only">{endings.join(', ')}</span>
          <Scramble words={endings} />
        </h1>
        <p className="lede">
          Halo gives your AI tools the components, props and design rules they need through an MCP server, skills and a CLI. Matching Figma library included.
        </p>
        <div className="hero-actions">
          <Button size="lg" iconRight={<ArrowRight />} onClick={() => go('/docs/installation')}>Start for free</Button>
          <Button size="lg" variant="secondary" onClick={() => go('/components')}>Browse components</Button>
        </div>
        <div className="hero-install">
          <CodeBlock code="npm install @halo-ds/react" label="Copy install command" compact />
        </div>
      </section>

      <section className="hero-wall" aria-label="Live components to try">
        <div className="wall" style={style}>
          {wall.map((col, c) => (
            // Each column drifts slowly up or down. A second copy follows the first, so it loops without a gap.
            <div key={c} className="wall-col" data-drift={c % 2 ? 'down' : 'up'} style={{ '--speed': `${70 + c * 9}s` } as CSSProperties}>
              {[0, 1].map((copy) => (
                <div key={copy} className="wall-run" aria-hidden={copy === 1 || undefined} inert={copy === 1 || undefined}>
                  {col.map((Item, i) => (
                    <div key={i} className="wall-item" style={{ '--i': c + i * 2 } as CSSProperties}>
                      <Item />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        <BrandDock value={brand} onChange={setBrand} />
      </section>

      <CommandSection />
      <ComponentsSection />
      <AiSection />
      <AppsSection />
      <ChartsSection />

      <section className="features" aria-label="What you get">
        {features.map((f) => (
          <div key={f.title} className="feature">
            <span className="feature-icon" aria-hidden="true">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>

      <OpenSourceSection />
      <FaqSection />

      <section className="cta">
        <h2>Start building</h2>
        <p>Install the package or open the Figma file.</p>
        <div className="hero-actions">
          <Button iconRight={<ArrowRight />} onClick={() => go('/docs/installation')}>Installation</Button>
          <Button variant="secondary" iconLeft={<FigmaLogo />} onClick={() => go('/figma')}>Figma file</Button>
        </div>
      </section>
    </>
  );
}
