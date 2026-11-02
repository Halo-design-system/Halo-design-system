// How to get it, and where to read more.
import { useCurrentFrame } from 'remotion';
import { Mark, Scene, progress } from '../ui';



export function Outro() {
  const frame = useCurrentFrame();
  const show = (d: number) => {
    const p = progress(frame, d, d + 18);
    return { opacity: p, transform: `translateY(${(1 - p) * 20}px)` };
  };
  return (
    <Scene fadeOut={false}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 56 }}>
        <div style={{ ...show(4), display: 'flex', alignItems: 'center', gap: 20 }}>
          <Mark size={80} />
          <span style={{ font: '600 80px/1 var(--halo-font-family-heading)', letterSpacing: '-0.03em', color: 'var(--halo-text-primary)' }}>Halo</span>
        </div>
        <div
          style={{
            ...show(14),
            padding: '20px 36px',
            borderRadius: 16,
            border: '1px solid var(--halo-border-secondary)',
            background: 'var(--halo-surface-primary)',
            font: '400 40px/52px "Geist Mono", ui-monospace, monospace',
            color: 'var(--halo-text-primary)',
          }}
        >
          npm install @halo-ds/react
        </div>
        <div style={{ ...show(24), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span style={{ font: '500 32px/40px var(--halo-font-family-body)', color: 'var(--halo-text-primary)' }}>halo-design-system.github.io/Halo-design-system</span>
        </div>
      </div>
    </Scene>
  );
}
