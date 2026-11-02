// Emojis, flags and logos from the Figma file: three tilted rows racing past, each with its count.
import { Img, useCurrentFrame } from 'remotion';
import emojis from '../assets/figma/emojis.png';
import flags from '../assets/figma/flags.png';
import logos from '../assets/figma/logos.png';
import { Count, Scene, progress } from '../ui';

// Each sheet is a 10 by 4 grid of 256px cells, 40 items, exported from the Figma components
const SHEET = { cols: 10, rows: 4, cell: 256 };
const SIZE = 150;

function Item({ src, index }: { src: string; index: number }) {
  const s = SIZE / SHEET.cell;
  const c = index % SHEET.cols;
  const r = Math.floor(index / SHEET.cols);
  return (
    <div style={{ flex: `0 0 ${SIZE}px`, height: SIZE, overflow: 'hidden', position: 'relative' }}>
      <Img src={src} style={{ position: 'absolute', width: SHEET.cols * SHEET.cell * s, height: SHEET.rows * SHEET.cell * s, left: -c * SIZE, top: -r * SIZE, maxWidth: 'none' }} />
    </div>
  );
}

function Strip({ src, count, label, dir, speed, start }: { src: string; count: number; label: string; dir: 1 | -1; speed: number; start: number }) {
  const frame = useCurrentFrame();
  const p = progress(frame, start, start + 16);
  const x = -1600 + dir * frame * speed;
  const order = Array.from({ length: 80 }, (_, i) => i % 40);
  return (
    <div style={{ position: 'relative', height: SIZE + 40, opacity: p }}>
      <div style={{ position: 'absolute', top: 20, display: 'flex', gap: 36, transform: `translateX(${x}px)` }}>
        {order.map((n, i) => (
          <Item key={i} src={src} index={n} />
        ))}
      </div>
      <div className="band" style={{ position: 'absolute', left: 420, top: 34, display: 'flex', alignItems: 'baseline', gap: 16, padding: '24px 36px', borderRadius: 24 }}>
        <span style={{ font: '600 76px/1 var(--halo-font-family-heading)', letterSpacing: '-0.03em', color: 'var(--halo-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
          <Count to={count} start={start} />
        </span>
        <span style={{ font: '500 32px/1 var(--halo-font-family-body)', color: 'var(--halo-text-secondary)' }}>{label}</span>
      </div>
    </div>
  );
}

export function Assets() {
  return (
    <Scene>
      <div style={{ position: 'absolute', inset: -200, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40, transform: 'rotate(-6deg)' }}>
        <Strip src={emojis} count={3719} label="emojis" dir={-1} speed={7} start={0} />
        <Strip src={flags} count={271} label="flags" dir={1} speed={8} start={8} />
        <Strip src={logos} count={1489} label="logos" dir={-1} speed={6} start={16} />
      </div>
    </Scene>
  );
}
