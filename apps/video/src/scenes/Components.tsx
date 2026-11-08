// Three rows of real components sliding past in opposite directions, under the counts.
import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { Bell, Gear, MagnifyingGlass, PencilSimple, ShareNetwork, Trash } from '@phosphor-icons/react';
import {
  Accordion,
  AccordionItem,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  BarChart,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Checkbox,
  ColorSwatch,
  CompactButton,
  FileItem,
  InputField,
  LinkButton,
  NumberInput,
  Pagination,
  ProgressBar,
  ProgressCircle,
  QRCode,
  Radio,
  RadioGroup,
  RangeSlider,
  Rating,
  SegmentedControl,
  SelectField,
  Skeleton,
  SocialButton,
  Sparkline,
  Spinner,
  Statistic,
  Stepper,
  Switch,
  Tab,
  TabList,
  Tabs,
  Tag,
  Toast,
  VerificationCode,
} from '@halo-ds/react';
import { Count, Scene, Title, progress } from '../ui';

export const noop = () => {};

function Tile({ children, width = 320 }: { children: ReactNode; width?: number }) {
  return (
    <div
      style={{
        flex: `0 0 ${width}px`,
        height: 190,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        borderRadius: 24,
        border: '1px solid var(--halo-border-secondary)',
        background: 'var(--halo-surface-primary)',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{children}</div>
    </div>
  );
}

const rows: { width?: number; node: ReactNode }[][] = [
  [
    { node: <Button>Get started</Button> },
    { node: <InputField label="Email" placeholder="johndoe@example.com" style={{ width: 300 }} /> },
    { node: <Switch label="Notifications" defaultChecked /> },
    { node: <Rating value={4} readOnly aria-label="Rating" /> },
    { width: 440, node: <Tabs defaultValue="a"><TabList aria-label="Sections"><Tab value="a">Overview</Tab><Tab value="b">Activity</Tab><Tab value="c">Settings</Tab></TabList></Tabs> },
    { node: <ProgressCircle value={72} showValue size="lg" aria-label="Upload" /> },
    { node: <AvatarGroup max={4} total={12}><Avatar name="Ada Lane" color="blue" /><Avatar name="Sam Okafor" color="green" /><Avatar name="Maya Lopez" color="orange" /><Avatar name="Leo Park" color="purple" /></AvatarGroup> },
    { width: 440, node: <Alert type="success" title="Payment received" description="The invoice is marked as paid." /> },
    { node: <ButtonGroup aria-label="Edit"><Button variant="secondary" iconLeft={<PencilSimple />}>Edit</Button><Button variant="secondary" iconLeft={<ShareNetwork />}>Share</Button></ButtonGroup> },
    { node: <VerificationCode length={4} defaultValue="4821" aria-label="Code" /> },
    { node: <Statistic label="Active users" value="12,480" change="8%" trend="up" sentiment="positive" /> },
    { node: <Spinner size="lg" label="" /> },
  ],
  [
    { node: <SegmentedControl aria-label="Period" defaultValue="w" onValueChange={noop} options={[{ value: 'd', label: 'Day' }, { value: 'w', label: 'Week' }, { value: 'm', label: 'Month' }]} /> },
    { node: <SelectField label="Country" options={[{ value: 'ng', label: 'Nigeria' }]} value="ng" onValueChange={noop} /> },
    { node: <RangeSlider label="Price" showValue min={0} max={100} defaultValue={[20, 70]} /> },
    { width: 440, node: <Stepper aria-label="Steps" current={1} steps={[{ title: 'Cart' }, { title: 'Shipping' }, { title: 'Payment' }]} /> },
    { node: <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}><Tag color="blue">Design</Tag><Tag color="green">Shipped</Tag><Tag color="orange">Review</Tag><Tag color="pink">Urgent</Tag></div> },
    { node: <QRCode value="https://example.com" size={150} label="Scan to open" /> },
    { node: <SocialButton provider="github" /> },
    { width: 440, node: <BarChart label="Sales" height={160} xKey="m" series={[{ key: 'v', label: 'Sales' }]} data={[{ m: 'Jan', v: 12 }, { m: 'Feb', v: 18 }, { m: 'Mar', v: 15 }, { m: 'Apr', v: 24 }, { m: 'May', v: 21 }, { m: 'Jun', v: 30 }]} /> },
    { node: <RadioGroup label="Plan" defaultValue="pro"><Radio value="free" label="Free" /><Radio value="pro" label="Pro" /></RadioGroup> },
    { node: <div style={{ display: 'flex', gap: 12 }}>{['#2F6BFF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((c, i) => <ColorSwatch key={c} color={c} shape="circle" selected={i === 0} aria-label={c} />)}</div> },
    { node: <NumberInput label="Seats" defaultValue={5} min={1} style={{ width: 200 }} /> },
  ],
  [
    { width: 440, node: <Toast type="information" title="New comment" description="Ada replied to your post." onClose={noop} /> },
    { node: <Breadcrumbs><BreadcrumbItem href="#">Home</BreadcrumbItem><BreadcrumbItem href="#">Projects</BreadcrumbItem><BreadcrumbItem>Website</BreadcrumbItem></Breadcrumbs> },
    { node: <Checkbox label="Remember me" defaultChecked /> },
    { node: <Pagination pageCount={9} defaultPage={2} variant="compact" /> },
    { width: 440, node: <FileItem name="brand-guide.pdf" size={2400000} status="uploading" progress={64} onCancel={noop} /> },
    { node: <ProgressBar label="Storage" value={64} valueLabel="64%" style={{ width: '100%' }} /> },
    { node: <div style={{ display: 'flex', gap: 12 }}><CompactButton aria-label="Search"><MagnifyingGlass /></CompactButton><CompactButton aria-label="Alerts"><Bell /></CompactButton><CompactButton aria-label="Settings"><Gear /></CompactButton><CompactButton aria-label="Delete"><Trash /></CompactButton></div> },
    { node: <Sparkline label="Visits" data={[12, 18, 15, 24, 22, 30, 34]} width={280} height={80} fill /> },
    { width: 440, node: <Accordion style={{ width: '100%' }}><AccordionItem title="How do refunds work?">Within 30 days.</AccordionItem><AccordionItem title="Can I change plans?">Any time.</AccordionItem></Accordion> },
    { node: <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}><Skeleton width="70%" /><Skeleton width="100%" /><Skeleton width="45%" /></div> },
    { node: <div style={{ display: 'flex', gap: 8 }}><Badge color="success">Active</Badge><Badge color="warning">Pending</Badge><Badge color="error">Failed</Badge></div> },
    { node: <LinkButton>View all</LinkButton> },
  ],
];

function Row({ items, dir, speed, offset }: { items: (typeof rows)[number]; dir: 1 | -1; speed: number; offset: number }) {
  const frame = useCurrentFrame();
  const x = offset + dir * frame * speed;
  // Two copies side by side, so the row never runs out
  const loop = [...items, ...items];
  return (
    <div style={{ display: 'flex', gap: 24, transform: `translateX(${x}px)` }}>
      {loop.map((it, i) => (
        <Tile key={i} width={it.width}>
          {it.node}
        </Tile>
      ))}
    </div>
  );
}

export function Components() {
  const frame = useCurrentFrame();
  const rowsIn = progress(frame, 0, 24);
  return (
    <Scene>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24, overflow: 'hidden', zoom: 1.5, opacity: rowsIn }}>
        <Row items={rows[0]!} dir={-1} speed={3.5} offset={-100} />
        <Row items={rows[1]!} dir={1} speed={4} offset={-2200} />
        <Row items={rows[2]!} dir={-1} speed={3} offset={-500} />
      </div>
      {/* The counts sit on a band across the middle row */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="band" style={{ display: 'flex', alignItems: 'center', gap: 64, padding: '36px 64px', borderRadius: 32 }}>
          <Title value={<Count to={56} from={0} start={10} />} label="components" />
          <Title value={<Count to={2125} from={0} start={18} />} label="variants" />
        </div>
      </div>
    </Scene>
  );
}
