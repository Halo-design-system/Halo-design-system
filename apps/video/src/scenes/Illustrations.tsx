// Illustrations and awards on a turning carousel: the front ones large and sharp, the back ones small and faded.
import { useCurrentFrame } from 'remotion';
import { Award, Illustration, awardNames, illustrationNames } from '@halo-ds/react';
import { Count, Scene, Title, progress } from '../ui';

const N = 10;
const items = Array.from({ length: N }, (_, i) =>
  i % 2 === 0 ? { kind: 'illustration' as const, name: illustrationNames[(i * 3) % illustrationNames.length]! } : { kind: 'award' as const, name: awardNames[(i * 5) % awardNames.length]! },
);

export function Illustrations() {
  const frame = useCurrentFrame();
  const spin = frame * 0.018 + progress(frame, 0, 30) * 1.2;
  return (
    <Scene>
      {items.map((it, i) => {
        const a = (i / N) * Math.PI * 2 + spin;
        const depth = (Math.cos(a) + 1) / 2; // 1 at the front, 0 at the back
        const x = Math.sin(a) * 820;
        const y = 140 - depth * 30;
        const scale = 0.5 + depth * 1.1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              zIndex: Math.round(depth * 100),
              opacity: 0.25 + depth * 0.75,
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
            }}
          >
            {it.kind === 'illustration' ? <Illustration name={it.name} size={260} /> : <Award name={it.name} size={220} />}
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, display: 'grid', placeItems: 'center', zIndex: 200 }}>
        <Title value={<Count to={100} start={4} />} label="illustrations" size={110} />
      </div>
    </Scene>
  );
}
