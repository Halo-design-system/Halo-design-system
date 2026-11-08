import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Copy,
  DotsThree,
  DownloadSimple,
  FilePdf,
  Gear,
  LinkSimple,
  ListBullets,
  Plus,
  TextB,
  TextItalic,
  TextUnderline,
  Trash,
  X,
} from '@phosphor-icons/react';
import { CompactButton } from './CompactButton';
import type { CompactButtonSize, CompactButtonVariant } from './CompactButton';

const icons = { X: <X />, Plus: <Plus />, Gear: <Gear />, Copy: <Copy />, Trash: <Trash />, DotsThree: <DotsThree /> };

const variants: CompactButtonVariant[] = ['stroke', 'ghost', 'fill'];
const sizes: CompactButtonSize[] = ['lg', 'md'];
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 };
const caption: CSSProperties = { font: '500 13px/1.4 var(--halo-font-family-body)', color: 'var(--halo-text-secondary)' };
const panel: CSSProperties = { padding: 24, borderRadius: 16, background: 'var(--halo-surface-minimal)' };
const card: CSSProperties = {
  width: 380,
  borderRadius: 16,
  border: '1px solid var(--halo-border-secondary)',
  background: 'var(--halo-surface-primary)',
  color: 'var(--halo-text-primary)',
  font: '400 14px/22px var(--halo-font-family-body)',
  overflow: 'hidden',
};

function Grid({ columns, rows }: { columns: string[]; rows: [string, ReactNode[]][] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `100px repeat(${columns.length}, 90px)`, gap: '20px 16px', alignItems: 'center' }}>
      <span />
      {columns.map((c) => <span key={c} style={caption}>{c}</span>)}
      {rows.map(([label, cells]) => [
        <span key={label} style={{ ...caption, color: 'var(--halo-text-primary)' }}>{label}</span>,
        ...cells.map((cell, i) => <div key={`${label}-${i}`}>{cell}</div>),
      ])}
    </div>
  );
}

const meta = {
  title: 'Components/Compact button',
  component: CompactButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A small icon button for actions that sit beside other content: close, copy, edit, more. Use it where a full Button would be too heavy, like toolbars and table rows. It always needs an `aria-label`, since there is no visible text. For main actions or touch screens, use the Button (icon only) instead.\n\nWhen pressed, it shrinks very slightly and springs back with a subtle bounce, like the Button.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: variants, table: { type: { summary: variants.map((v) => `'${v}'`).join(' | ') } } },
    size: { control: 'inline-radio', options: sizes, table: { type: { summary: sizes.map((v) => `'${v}'`).join(' | ') } } },
    round: { control: 'boolean' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'select', options: Object.keys(icons), mapping: icons, table: { type: { summary: 'ReactNode' } } },
  },
  args: { variant: 'stroke', size: 'lg', round: false, selected: false, disabled: false, children: 'X', 'aria-label': 'Close' },
} satisfies Meta<typeof CompactButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Try every option with the controls below. */
export const Playground: Story = {};

/** Stroke has an outline, Ghost has no background until hovered, and Fill suits grey or tinted surfaces. */
export const Styles: Story = {
  render: () => (
    <div style={row}>
      <CompactButton variant="stroke" aria-label="Close"><X /></CompactButton>
      <CompactButton variant="ghost" aria-label="Settings"><Gear /></CompactButton>
      <div style={{ ...panel, background: 'var(--halo-surface-secondary)', padding: 12 }}>
        <CompactButton variant="fill" aria-label="Add"><Plus /></CompactButton>
      </div>
    </div>
  ),
};

/** lg is 28px with a 20px icon (default); md is 24px with a 16px icon. Corners are slightly rounded or fully round. */
export const SizesAndCorners: Story = {
  name: 'Sizes and corners',
  render: () => (
    <Grid
      columns={['lg', 'md', 'lg round', 'md round']}
      rows={variants.map((v) => [
        title(v),
        [
          <CompactButton key="1" variant={v} size="lg" aria-label="Close"><X /></CompactButton>,
          <CompactButton key="2" variant={v} size="md" aria-label="Close"><X /></CompactButton>,
          <CompactButton key="3" variant={v} size="lg" round aria-label="Close"><X /></CompactButton>,
          <CompactButton key="4" variant={v} size="md" round aria-label="Close"><X /></CompactButton>,
        ],
      ])}
    />
  ),
};

/** Hover, pressed and focus happen on their own. Selected and Disabled are set by hand. */
export const States: Story = {
  render: () => (
    <Grid
      columns={['Default', 'Selected', 'Disabled']}
      rows={variants.map((v) => [
        title(v),
        [
          <CompactButton key="d" variant={v} aria-label="Close"><X /></CompactButton>,
          <CompactButton key="s" variant={v} selected aria-label="Close"><X /></CompactButton>,
          <CompactButton key="x" variant={v} disabled aria-label="Close"><X /></CompactButton>,
        ],
      ])}
    />
  ),
};

function Toolbar() {
  const [on, setOn] = useState<Record<string, boolean>>({ bold: true });
  const toggle = (k: string) => setOn((s) => ({ ...s, [k]: !s[k] }));
  return (
    <div style={{ ...row, gap: 6 }}>
      <CompactButton variant="ghost" selected={!!on.bold} onClick={() => toggle('bold')} aria-label="Bold"><TextB /></CompactButton>
      <CompactButton variant="ghost" selected={!!on.italic} onClick={() => toggle('italic')} aria-label="Italic"><TextItalic /></CompactButton>
      <CompactButton variant="ghost" selected={!!on.underline} onClick={() => toggle('underline')} aria-label="Underline"><TextUnderline /></CompactButton>
      <span style={{ width: 1, height: 16, background: 'var(--halo-border-secondary)', margin: '0 4px' }} />
      <CompactButton variant="ghost" aria-label="Bulleted list"><ListBullets /></CompactButton>
      <CompactButton variant="ghost" aria-label="Add link"><LinkSimple /></CompactButton>
    </div>
  );
}

/** Selected is for buttons that switch something on and off. Click the toolbar buttons to toggle them. */
export const Toggle: Story = {
  render: () => <Toolbar />,
};

/** Compact buttons in everyday interfaces: a card header, a file row and a copy button inside a field. */
export const InUse: Story = {
  name: 'In use',
  render: () => (
    <div style={{ ...row, alignItems: 'flex-start', gap: 24 }}>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '16px 14px 12px 20px' }}>
          <strong style={{ flex: 1 }}>Meeting notes</strong>
          <CompactButton variant="ghost" aria-label="More options"><DotsThree /></CompactButton>
          <CompactButton variant="ghost" aria-label="Close"><X /></CompactButton>
        </div>
        <div style={{ padding: '8px 16px', background: 'var(--halo-surface-minimal)' }}><Toolbar /></div>
        <p style={{ margin: 0, padding: '16px 20px 24px', color: 'var(--halo-text-contrast)' }}>
          Share the first draft with the team on Friday, then collect feedback before the review next week.
        </p>
      </div>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px 12px 20px' }}>
          <FilePdf size={24} color="var(--halo-text-brand)" />
          <span style={{ flex: 1 }}>Project brief.pdf</span>
          <CompactButton variant="ghost" aria-label="Download Project brief.pdf"><DownloadSimple /></CompactButton>
          <CompactButton variant="ghost" aria-label="Delete Project brief.pdf"><Trash /></CompactButton>
        </div>
        <div style={{ padding: '0 20px 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 8px 8px 14px',
              borderRadius: 10,
              border: '1px solid var(--halo-border-secondary)',
              background: 'var(--halo-surface-minimal)',
            }}
          >
            <span style={{ flex: 1, color: 'var(--halo-text-contrast)' }}>halo.design/f/brief-2026</span>
            <CompactButton variant="stroke" aria-label="Copy link"><Copy /></CompactButton>
          </div>
        </div>
      </div>
    </div>
  ),
};
