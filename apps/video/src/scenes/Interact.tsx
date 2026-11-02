// A cursor fills in a form made of real components: typing, a segmented control, a slider, a switch, a checkbox and a loading button.
import { interpolate, useCurrentFrame } from 'remotion';
import { Caption, Cursor, Scene, easeInOut, progress, typed, useTargets } from '../ui';
import type { Targets } from '../ui';
import { SettingsCard } from './SettingsCard';



// When each thing happens, in frames from the start of the scene
const T = { name: 50, yearly: 130, grab: 172, drop: 216, updates: 252, terms: 286, save: 326, saved: 360 };
const SEATS = [4, 12];

/** Where the slider's handle sits for a value. A native range keeps the handle inside the track. */
function handleAt(targets: Targets, seats: number) {
  const r = targets.range;
  if (!r) return undefined;
  // The handle is as tall as the range input, and as wide as it is tall
  const thumb = r.h;
  const pct = (seats - 1) / 19;
  return { x: r.x - r.w / 2 + thumb / 2 + pct * (r.w - thumb), y: r.y };
}

export function Interact() {
  const frame = useCurrentFrame();
  const { ref, targets } = useTargets();

  // The cursor glides over the last 18 frames before the drop, so the value moves with it
  const seats = Math.round(interpolate(frame, [T.drop - 18, T.drop], SEATS, { easing: easeInOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const state = {
    name: typed('John Carter', frame, T.name + 4, 2),
    billing: frame >= T.yearly ? 'yearly' : 'monthly',
    seats,
    updates: frame >= T.updates,
    terms: frame >= T.terms,
    saving: frame >= T.save && frame < T.saved,
    saved: progress(frame, T.saved, T.saved + 14),
  };

  const start = handleAt(targets, SEATS[0]!);
  const end = handleAt(targets, SEATS[1]!);

  return (
    <Scene>
      <div ref={ref} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 160px' }}>
        <Caption kicker="Components" title={<>Every state,<br />built in</>} />
        <div style={{ paddingTop: 100, zoom: 1.35 }}>
          <SettingsCard state={state} />
        </div>
        <Cursor
          targets={{ ...targets, ...(start && { start }), ...(end && { end }) }}
          keys={[
            { at: 30, to: { x: 1500, y: 980 } },
            { at: T.name, to: 'name' },
            { at: T.yearly, to: 'yearly' },
            { at: T.grab, to: 'start' },
            { at: T.grab + 4, to: 'start' },
            { at: T.drop, to: 'end' },
            { at: T.updates, to: 'updates' },
            { at: T.terms, to: 'terms' },
            { at: T.save, to: 'save' },
            { at: T.saved + 30, to: { x: 1700, y: 1000 } },
          ]}
          clicks={[T.name, T.yearly, T.grab, T.updates, T.terms, T.save]}
        />
      </div>
    </Scene>
  );
}
