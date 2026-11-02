// Design tokens: colours, type, radius and spacing orbit the counts in two rings turning opposite ways.
import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { Count, Scene, Title, progress } from '../ui';

const families = ['purple', 'skyblue', 'green', 'yellow', 'orange', 'red', 'pink', 'black'];
const shades = [200, 400, 600];

const swatches = families.flatMap((f, i) => [shades[i % 3]!, shades[(i + 1) % 3]!].map((s) => `var(--halo-color-${f}-${s})`));

function Chip({ children, style }: { children?: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        width: 128,
        height: 128,
        borderRadius: 24,
        border: '1px solid var(--halo-border-secondary)',
        background: 'var(--halo-surface-primary)',
        font: '600 36px/1 var(--halo-font-family-heading)',
        color: 'var(--halo-text-primary)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const inner: ReactNode[] = [
  <Chip>Aa</Chip>,
  <Chip style={{ borderRadius: 4 }} />,
  <Chip style={{ font: '400 28px/1 var(--halo-font-family-body)' }}>16</Chip>,
  <Chip style={{ borderRadius: 48 }} />,
  <Chip style={{ font: '700 36px/1 var(--halo-font-family-heading)' }}>Bold</Chip>,
  <Chip>
    <span style={{ width: 48, height: 8, borderRadius: 4, background: 'var(--halo-text-primary)' }} />
  </Chip>,
  <Chip style={{ borderRadius: 12 }} />,
  <Chip style={{ font: '400 32px/1 "Geist Mono", monospace' }}>{'{ }'}</Chip>,
];

function Ring({ items, radius, turn }: { items: ReactNode[]; radius: number; turn: number }) {
  return (
    <>
      {items.map((node, i) => {
        const a = (i / items.length) * Math.PI * 2 + turn;
        return (
          <div key={i} style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) translate(${Math.cos(a) * radius}px, ${Math.sin(a) * radius * 0.6}px)` }}>
            {node}
          </div>
        );
      })}
    </>
  );
}

export function Tokens() {
  const frame = useCurrentFrame();
  const grow = progress(frame, 0, 30);
  const turn = frame * 0.012;
  return (
    <Scene>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${0.7 + grow * 0.3})`, opacity: grow }}>
        <Ring radius={820} turn={turn} items={swatches.map((c) => <div style={{ width: 104, height: 104, borderRadius: '50%', background: c, border: '1px solid var(--halo-border-secondary)' }} />)} />
        <Ring radius={500} turn={-turn * 1.4} items={inner} />
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
        <Title value={<Count to={288} start={6} />} label="design tokens" />
        <span style={{ opacity: progress(frame, 24, 40), font: '500 36px/1 var(--halo-font-family-body)', color: 'var(--halo-text-secondary)' }}>
          <Count to={42} start={24} frames={20} /> text styles
        </span>
      </div>
    </Scene>
  );
}
