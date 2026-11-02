// The finished form in light mode, then dark mode sweeps across from the switch.
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Moon, Sun } from '@phosphor-icons/react';
import { SegmentedControl } from '@halo-ds/react';
import { Caption, Cursor, Scene, easeInOut, progress, useTargets } from '../ui';
import { SettingsCard, finalState } from './SettingsCard';



const noop = () => {};

function Layer({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <AbsoluteFill data-theme={theme} className="stage">
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 160px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          <Caption kicker="Theming" title="Light and dark mode" />
          <div style={{ display: 'flex', zoom: 1.5 }}>
            <SegmentedControl
              aria-label="Theme"
              value={theme}
              onValueChange={noop}
              options={[
                { value: 'light', label: 'Light', icon: <Sun /> },
                { value: 'dark', label: <span data-target="dark">Dark</span>, icon: <Moon /> },
              ]}
            />
          </div>
        </div>
        <div style={{ paddingTop: 100, zoom: 1.35 }}>
          <SettingsCard state={finalState} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

const CLICK = 44;

export function DarkMode() {
  const frame = useCurrentFrame();
  const { ref, targets } = useTargets();
  const at = targets.dark ?? { x: 300, y: 760 };
  // A circle grows from the Dark option until it covers the frame
  const r = progress(frame, CLICK, CLICK + 40, easeInOut) * 2400;
  return (
    <Scene>
      <AbsoluteFill ref={ref}>
        <Layer theme="light" />
        <AbsoluteFill style={{ clipPath: `circle(${r}px at ${at.x}px ${at.y}px)` }}>
          <Layer theme="dark" />
        </AbsoluteFill>
        <Cursor targets={targets} keys={[{ at: 14, to: { x: 900, y: 900 } }, { at: CLICK, to: 'dark' }]} clicks={[CLICK]} hideAfter={CLICK + 30} />
      </AbsoluteFill>
    </Scene>
  );
}
