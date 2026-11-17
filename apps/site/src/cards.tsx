// What each component card shows on the home page and the Components page: one component, in one variant.
// Fit.tsx scales it to sit centred in the card, so these are drawn at their real size.
import type { ComponentType } from 'react';
import {
  Accordion, AccordionItem, Alert, Avatar, AvatarGroup, Badge, BarChart, BreadcrumbItem, Breadcrumbs, Button, ButtonGroup, Calendar, Card, Carousel,
  CarouselSlide, Checkbox, ColorField, CompactButton, DataTable, DatePickerField, Divider, EmptyState, EventCalendar, FileUpload, Illustration,
  InputField, LinkButton, List, ListItem, NavItem, Pagination, ProgressBar, QRCode, Radio, RadioGroup, Rating, ResizableHandle, ResizablePanel,
  ResizablePanelGroup, Result, RichTextEditor, SegmentedControl, SelectField, Sidebar, Skeleton, Slider, SocialButton, Spinner, Statistic, Stepper,
  Switch, Tab, TabList, Tabs, Tag, Text, TextareaField, TimePickerField, Toast, Tree, TreeSelect,
} from '@halo-ds/react';
import { ArrowRight, Copy, DotsThree, File, FilePdf, Folder, FolderSimple, House, PencilSimple, Plus, Trash, Users, FileImage, FileText } from '@phosphor-icons/react';

const w = (width: number, node: React.ReactNode) => <div style={{ width }}>{node}</div>;
const noop = () => {};
const today = new Date();
const people = [
  { id: 1, name: 'Ada Obi', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Kofi Mensah', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Lena Park', role: 'Viewer', status: 'Invited' },
];
const teams = [
  { id: 'product', label: 'Product', children: [{ id: 'design', label: 'Design' }, { id: 'research', label: 'Research' }] },
  { id: 'operations', label: 'Operations', children: [{ id: 'finance', label: 'Finance' }] },
];
const files = [
  { id: 'brand', label: 'Brand', icon: <Folder />, children: [{ id: 'logo', label: 'Logo.svg', icon: <File /> }, { id: 'guide', label: 'Guidelines.pdf', icon: <FilePdf /> }] },
  { id: 'notes', label: 'Notes.txt', icon: <File /> },
];
const pane = { display: 'grid', placeItems: 'center', height: '100%', color: 'var(--halo-text-secondary)', fontWeight: 600 } as const;

export const cards: Record<string, ComponentType> = {
  /* Actions */
  button: () => <Button iconLeft={<Plus />}>New project</Button>,
  'compact-button': () => <CompactButton variant="stroke" aria-label="Edit"><PencilSimple /></CompactButton>,
  'link-button': () => <LinkButton href="#" iconRight={<ArrowRight />}>View all invoices</LinkButton>,
  'social-button': () => w(280, <SocialButton provider="google" variant="outline" fullWidth />),
  'button-group': () => (
    <ButtonGroup aria-label="Range">
      <Button variant="secondary">Day</Button>
      <Button variant="secondary">Week</Button>
      <Button variant="secondary">Month</Button>
    </ButtonGroup>
  ),

  /* Forms */
  form: () => (
    <div style={{ display: 'grid', gap: 16, width: 300 }}>
      <InputField label="First name" placeholder="John" />
      <Button>Save</Button>
    </div>
  ),
  input: () => w(300, <InputField label="Email" placeholder="johndoe@example.com" />),
  textarea: () => w(300, <TextareaField label="Message" placeholder="Write your message" />),
  select: () => w(300, <SelectField label="Country" placeholder="Choose a country" options={[{ value: 'ng', label: 'Nigeria' }]} />),
  checkbox: () => <Checkbox label="Email me about new comments" defaultChecked />,
  radio: () => (
    <RadioGroup label="Plan" defaultValue="team">
      <Radio value="free" label="Free" />
      <Radio value="team" label="Team" />
      <Radio value="business" label="Business" />
    </RadioGroup>
  ),
  switch: () => <Switch label="Dark mode" defaultChecked />,
  slider: () => w(300, <Slider label="Volume" defaultValue={60} />),
  'date-picker': () => w(300, <DatePickerField label="Due date" />),
  'time-picker': () => w(300, <TimePickerField label="Start time" defaultValue="09:30" />),
  'color-picker': () => w(300, <ColorField label="Brand colour" defaultValue="#2F6BFF" />),
  'file-upload': () => w(380, <FileUpload description="PNG or PDF, up to 10 MB" onFiles={noop} />),
  rating: () => <Rating aria-label="Rating" defaultValue={4} size="lg" />,
  'segmented-control': () => (
    <SegmentedControl aria-label="View" value="month" onValueChange={noop} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
  ),
  'tree-select': () => w(300, <TreeSelect nodes={teams} placeholder="Choose a team" aria-label="Team" />),
  'rich-text-editor': () => w(420, <RichTextEditor aria-label="Notes" defaultValue="<p>This update makes <strong>sharing</strong> faster.</p>" />),

  /* Navigation */
  navigation: () => (
    <div style={{ display: 'flex', height: 240, borderRadius: 16, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--halo-border-secondary)' }}>
      <Sidebar header={<strong>Studio</strong>}>
        <NavItem icon={<House />} selected>Home</NavItem>
        <NavItem icon={<FolderSimple />}>Projects</NavItem>
        <NavItem icon={<Users />}>Team</NavItem>
      </Sidebar>
    </div>
  ),
  tabs: () => (
    <Tabs defaultValue="overview">
      <TabList aria-label="Project">
        <Tab value="overview">Overview</Tab>
        <Tab value="activity">Activity</Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
    </Tabs>
  ),
  breadcrumbs: () => (
    <Breadcrumbs>
      <BreadcrumbItem href="#" icon={<House />}>Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Projects</BreadcrumbItem>
      <BreadcrumbItem>Brand refresh</BreadcrumbItem>
    </Breadcrumbs>
  ),
  pagination: () => <Pagination pageCount={5} defaultPage={2} />,
  stepper: () => w(400, <Stepper compactBelow={false} current={1} steps={[{ title: 'Account' }, { title: 'Profile' }, { title: 'Review' }]} />),
  menu: () => (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'end', width: 220 }}>
      <CompactButton variant="stroke" aria-label="More"><DotsThree /></CompactButton>
      <div style={{ width: '100%' }}>
        <List variant="card" size="sm">
          <ListItem icon={<PencilSimple />} title="Rename" />
          <ListItem icon={<Copy />} title="Duplicate" />
          <ListItem icon={<Trash />} title="Delete" />
        </List>
      </div>
    </div>
  ),

  /* Feedback */
  alert: () => w(380, <Alert type="information" title="Your trial ends in 3 days" description="Pick a plan to keep your projects." />),
  toast: () => <Toast type="success" title="Changes saved" onClose={noop} />,
  progress: () => w(300, <ProgressBar label="Uploading" value={64} style={{ width: '100%' }} />),
  spinner: () => <Spinner size="lg" />,
  skeleton: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', width: 300 }}>
      <Skeleton shape="circle" width={48} height={48} />
      <div style={{ display: 'grid', gap: 8, flex: 1 }}>
        <Skeleton width="60%" />
        <Skeleton width="90%" />
      </div>
    </div>
  ),
  'empty-state': () => <EmptyState media={<Illustration name="no-projects" />} title="No projects yet" actions={<Button>New project</Button>} />,
  result: () => <Result status="success" title="Payment sent" actions={<Button>Back to overview</Button>} />,

  /* Overlays, drawn open */
  tooltip: () => (
    <div style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
      <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--halo-surface-invert)', color: 'var(--halo-text-invert)', fontSize: 13 }}>Copy link</span>
      <CompactButton variant="stroke" aria-label="Copy link"><Copy /></CompactButton>
    </div>
  ),
  tour: () =>
    w(300, (
      <Card>
        <Text size="sm" color="secondary">Step 1 of 3</Text>
        <Text weight="semibold">Find anything</Text>
        <Text size="sm" color="secondary">Search projects, people and files.</Text>
        <div style={{ display: 'flex', gap: 8, alignSelf: 'stretch', justifyContent: 'flex-end' }}>
          <Button size="sm" variant="secondary">Skip</Button>
          <Button size="sm">Next</Button>
        </div>
      </Card>
    )),
  modal: () =>
    w(320, (
      <Card>
        <Text size="lg" weight="semibold">Delete this project?</Text>
        <Text color="secondary">Its files and tasks are deleted too.</Text>
        <div style={{ display: 'flex', gap: 8, alignSelf: 'stretch', justifyContent: 'flex-end' }}>
          <Button size="sm" variant="secondary">Cancel</Button>
          <Button size="sm" variant="destructive">Delete</Button>
        </div>
      </Card>
    )),
  drawer: () => (
    <div style={{ display: 'flex', width: 400, height: 240, borderRadius: 12, overflow: 'hidden', background: 'var(--halo-surface-overlay)' }}>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'grid', alignContent: 'start', gap: 12, width: 200, padding: 20, background: 'var(--halo-surface-primary)' }}>
        <Text size="lg" weight="semibold">Filters</Text>
        <Checkbox label="Active" defaultChecked />
        <Checkbox label="Paused" />
        <Button size="sm">Show results</Button>
      </div>
    </div>
  ),
  popover: () => (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'center', width: 260 }}>
      <Button variant="secondary" size="sm">Share</Button>
      <Card>
        <Text weight="semibold">Share this file</Text>
        <Text size="sm" color="secondary">Anyone with the link can view it.</Text>
      </Card>
    </div>
  ),

  /* Data display */
  table: () =>
    w(360, (
      <DataTable
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'role', header: 'Role' },
          { key: 'status', header: 'Status', render: (m: (typeof people)[number]) => <Badge size="sm" color={m.status === 'Active' ? 'success' : 'neutral'}>{m.status}</Badge> },
        ]}
        rows={people}
        getRowId={(m) => m.id}
        pageSize={0}
      />
    )),
  statistic: () => w(240, <Card><Statistic label="Revenue" value={48920} prefix="$" change="+5.6%" trend="up" comparison="vs last month" /></Card>),
  charts: () =>
    w(360, <BarChart label="Orders" data={['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => ({ d, orders: [42, 58, 51, 66, 73][i] }))} xKey="d" series={[{ key: 'orders', label: 'Orders' }]} height={200} />),
  card: () =>
    w(240, (
      <Card media={<img src="https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&q=80" alt="" />}>
        <Text weight="semibold">Brand refresh</Text>
        <Text size="sm" color="secondary">Edited 5 minutes ago</Text>
      </Card>
    )),
  list: () =>
    w(320, (
      <List variant="divided">
        <ListItem icon={<FilePdf />} title="Quarterly report.pdf" description="2.4 MB" />
        <ListItem icon={<FileImage />} title="Cover image.png" description="840 KB" />
        <ListItem icon={<FileText />} title="Notes.txt" description="12 KB" />
      </List>
    )),
  avatar: () => (
    <AvatarGroup max={3} total={8} size="lg">
      <Avatar name="Ada Obi" />
      <Avatar name="Kofi Mensah" />
      <Avatar name="Lena Park" />
    </AvatarGroup>
  ),
  badge: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge color="success" dot>Live</Badge>
      <Badge color="warning">Due soon</Badge>
      <Badge color="error">Overdue</Badge>
    </div>
  ),
  tag: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Tag color="blue" onRemove={noop}>Design</Tag>
      <Tag color="green" onRemove={noop}>Research</Tag>
    </div>
  ),
  calendar: () => <Calendar months={1} value={today} onChange={noop} />,
  'event-calendar': () => w(340, <EventCalendar header="simple" views={['month']} />),
  tree: () => w(260, <Tree nodes={files} defaultExpanded={['brand']} defaultSelected="guide" aria-label="Files" />),
  accordion: () =>
    w(360, (
      <Accordion defaultValue={['billing']}>
        <AccordionItem value="billing" title="How does billing work?">You pay monthly for each member.</AccordionItem>
        <AccordionItem value="data" title="Where is my data stored?">In Europe or the United States.</AccordionItem>
      </Accordion>
    )),
  carousel: () =>
    w(360, (
      <Carousel aria-label="Highlights">
        {['Plan', 'Build'].map((t, i) => (
          <CarouselSlide key={t}>
            <div style={{ display: 'grid', placeItems: 'center', aspectRatio: '16 / 9', borderRadius: 16, background: i ? '#f3c8f4' : '#c9daff', color: '#0c0c0c', fontSize: 24, fontWeight: 600 }}>{t}</div>
          </CarouselSlide>
        ))}
      </Carousel>
    )),
  'qr-code': () => <QRCode value="https://example.com/invite/7Q2K9" label="Scan to open the invite" />,
  resizable: () => (
    <div style={{ width: 380, height: 200, borderRadius: 16, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--halo-border-secondary)' }}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35}><div style={pane}>Files</div></ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize" />
        <ResizablePanel><div style={pane}>Preview</div></ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
  divider: () => w(300, <Divider label="or" />),
  text: () => (
    <div style={{ display: 'grid', gap: 4, width: 300 }}>
      <Text size="lg" weight="semibold">Quarterly report</Text>
      <Text size="sm" color="secondary">Updated 2 hours ago</Text>
    </div>
  ),
};
