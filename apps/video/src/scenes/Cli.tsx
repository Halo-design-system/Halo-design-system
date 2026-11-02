// The command-line tool sets Halo up, then adds a ready-made block, which appears beside it.
import { useCurrentFrame } from 'remotion';
import Pricing from '../../../site/src/blocks/07-pricing';
import { Caption, Line, Scene, Terminal, progress, typed } from '../ui';



const green = { color: 'var(--halo-icon-positive)' };
const dim = { color: 'var(--halo-text-secondary)' };
const magenta = { color: 'var(--halo-color-purple-300)' };

function Prompt({ text, at }: { text: string; at: number }) {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <div>
      <span style={dim}>$ </span>
      {typed(text, frame, at, 2)}
    </div>
  );
}

export function Cli() {
  const frame = useCurrentFrame();
  const block = progress(frame, 230, 256);
  return (
    <Scene>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 64, padding: '0 120px 0 160px' }}>
        <div style={{ flex: '0 0 720px', display: 'flex', flexDirection: 'column', gap: 56 }}>
          <Caption kicker="Command line" title="One command to start" />
          <Terminal title="my-app">
            <Prompt at={30} text="npx halo-ds init" />
            <Line at={70} style={dim}>
              Halo · Vite app, using npm
            </Line>
            <Line at={82}>
              <span style={magenta}>?</span> Light, dark or system mode? <span style={dim}>(system)</span> {frame >= 96 ? 'system' : ''}
            </Line>
            <Line at={110}>
              <span style={green}>✓</span> Installed @halo-ds/react
            </Line>
            <Line at={122}>
              <span style={green}>✓</span> Set data-theme="system" in index.html
            </Line>
            <Prompt at={150} text="npx halo-ds add pricing" />
            <Line at={206}>
              <span style={green}>✓</span> Added the Pricing block to src/blocks/Pricing.tsx
            </Line>
            <Line at={220}>
              <span style={green}>✓</span> Installed @phosphor-icons/react
            </Line>
          </Terminal>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', opacity: block, transform: `translateY(${(1 - block) * 32}px)` }}>
          <div
            style={{
              width: 1060,
              padding: 40,
              zoom: 0.75,
              borderRadius: 24,
              border: '1px solid var(--halo-border-secondary)',
              background: 'var(--halo-surface-primary)',
            }}
          >
            <Pricing />
          </div>
        </div>
      </div>
    </Scene>
  );
}
