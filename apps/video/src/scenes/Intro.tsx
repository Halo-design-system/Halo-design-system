// The mark builds ring by ring, then the name and the headline.
import { useCurrentFrame } from 'remotion';
import { Mark, Scene, progress } from '../ui';



export function Intro() {
  const frame = useCurrentFrame();
  const rings = [0, 1, 2].map((i) => progress(frame, 6 + i * 6, 24 + i * 6));
  const name = progress(frame, 30, 48);
  const line = progress(frame, 46, 66);
  return (
    <Scene>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Mark size={120} rings={rings} />
          <span style={{ opacity: name, transform: `translateX(${(1 - name) * -16}px)`, font: '600 112px/1 var(--halo-font-family-heading)', letterSpacing: '-0.03em', color: 'var(--halo-text-primary)' }}>
            Halo
          </span>
        </div>
        <p
          style={{
            margin: 0,
            maxWidth: 1600,
            textAlign: 'center',
            opacity: line,
            transform: `translateY(${(1 - line) * 20}px)`,
            font: '500 52px/64px var(--halo-font-family-heading)',
            letterSpacing: '-0.02em',
            color: 'var(--halo-text-secondary)',
          }}
        >
          The React design system for AI-assisted frontend development
        </p>
      </div>
    </Scene>
  );
}
