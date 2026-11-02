// The Figma library, which matches the code.
import { Img, useCurrentFrame, useVideoConfig } from 'remotion';
import figmaUi from '../../../site/public/figma/figma-ui.webp';
import { Caption, Scene, easeInOut, progress } from '../ui';



export function Figma() {
  const frame = useCurrentFrame();
  const p = progress(frame, 10, 36);
  const { durationInFrames } = useVideoConfig();
  const zoom = 1 + progress(frame, 0, durationInFrames, easeInOut) * 0.05;
  return (
    <Scene>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 80, padding: '0 0 0 160px' }}>
        <Caption style={{ flex: '0 0 520px' }} kicker="Figma" title="A matching Figma library" />
        <div
          style={{
            flex: 1,
            height: 720,
            borderRadius: '24px 0 0 24px',
            border: '1px solid var(--halo-border-secondary)',
            borderRight: 'none',
            overflow: 'hidden',
            opacity: p,
            transform: `translateX(${(1 - p) * 60}px)`,
          }}
        >
          <Img src={figmaUi} style={{ height: '100%', transform: `scale(${zoom})`, transformOrigin: 'left center' }} />
        </div>
      </div>
    </Scene>
  );
}
