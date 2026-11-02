// Shared pieces for every scene: the frame, captions, typing, and a cursor that clicks real components.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Audio, Easing, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/** 0 to 1 over [start, end], eased, held at the ends. */
export function progress(frame: number, start: number, end: number, easing = easeOut) {
  return interpolate(frame, [start, end], [0, 1], { easing, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

/** The text typed so far, a character every `speed` frames from `start`. */
export function typed(text: string, frame: number, start: number, speed = 2) {
  return text.slice(0, Math.max(0, Math.floor((frame - start) / speed)));
}

/** A scene: fades in and out, on the light page colour unless a theme is given. */
export function Scene({ children, theme = 'light', fadeOut = true }: { children: ReactNode; theme?: 'light' | 'dark'; fadeOut?: boolean }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = Math.min(progress(frame, 0, 8), fadeOut ? 1 - progress(frame, durationInFrames - 8, durationInFrames, easeInOut) : 1);
  // Each scene lands with a small push in, to hit with the beat
  const scale = 1.04 - progress(frame, 0, 14) * 0.04;
  return (
    <AbsoluteFill data-theme={theme} className="stage" style={{ opacity }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
}

/** A number that counts up from `from` to `to`, with thousands separators. */
export function Count({ to, from = 0, start = 0, frames = 30 }: { to: number; from?: number; start?: number; frames?: number }) {
  const frame = useCurrentFrame();
  const n = Math.round(from + (to - from) * progress(frame, start, start + frames));
  return <>{n.toLocaleString('en-US')}</>;
}

/** A big number with a word under it, like 56 components. */
export function Title({ value, label, size = 120 }: { value: ReactNode; label: ReactNode; size?: number }) {
  const frame = useCurrentFrame();
  const p = progress(frame, 4, 20);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
      <span style={{ font: `600 ${size}px/1 var(--halo-font-family-heading)`, letterSpacing: '-0.03em', color: 'var(--halo-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ font: `500 ${Math.round(size * 0.3)}px/1.2 var(--halo-font-family-body)`, color: 'var(--halo-text-secondary)' }}>{label}</span>
    </div>
  );
}

/** The words on the left of a scene. Slides up a little as it appears. */
export function Caption({ kicker, title, sub, delay = 6, style }: { kicker: string; title: ReactNode; sub?: ReactNode; delay?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const show = (d: number) => {
    const p = progress(frame, delay + d, delay + d + 18);
    return { opacity: p, transform: `translateY(${(1 - p) * 24}px)` };
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640, ...style }}>
      <span style={{ ...show(0), font: '600 24px/32px var(--halo-font-family-body)', color: 'var(--halo-text-secondary)' }}>{kicker}</span>
      <h2 style={{ ...show(4), margin: 0, font: '600 76px/84px var(--halo-font-family-heading)', letterSpacing: '-0.02em', color: 'var(--halo-text-primary)' }}>{title}</h2>
      {sub && <p style={{ ...show(8), margin: 0, font: '400 28px/40px var(--halo-font-family-body)', color: 'var(--halo-text-secondary)' }}>{sub}</p>}
    </div>
  );
}

export interface Point {
  x: number;
  y: number;
}
export type Targets = Record<string, Point & { w: number; h: number }>;

/**
 * Finds the centre of every element marked data-target inside the returned ref, in video pixels.
 * Measures again each frame, so the cursor can follow things that move, like a slider handle.
 */
export function useTargets() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender('Waiting for fonts before measuring'));
  const released = useRef(false);
  const [ready, setReady] = useState(false);
  const [targets, setTargets] = useState<Targets>({});

  useEffect(() => {
    document.fonts.ready.then(() => setReady(true));
  }, []);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!ready || !root) return;
    const box = root.getBoundingClientRect();
    // The studio shows the video scaled down, so convert screen pixels back to video pixels
    const scale = box.width / root.offsetWidth || 1;
    const next: Targets = {};
    // Slider tracks count as targets too, named "range"
    root.querySelectorAll<HTMLElement>('[data-target], input[type="range"]').forEach((el) => {
      const r = el.getBoundingClientRect();
      next[el.dataset.target ?? 'range'] = { x: (r.left - box.left + r.width / 2) / scale, y: (r.top - box.top + r.height / 2) / scale, w: r.width / scale, h: r.height / scale };
    });
    setTargets(next);
    if (!released.current) {
      released.current = true;
      continueRender(handle);
    }
  }, [frame, ready, handle]);

  return { ref, targets };
}

export interface CursorKey {
  /** The frame the cursor arrives. */
  at: number;
  /** A target name, or a point in video pixels. */
  to: string | Point;
}

/** A pointer that glides between targets and shows a press on each click frame. */
export function Cursor({ keys, clicks = [], targets, hideAfter }: { keys: CursorKey[]; clicks?: number[]; targets: Record<string, Point>; hideAfter?: number }) {
  const frame = useCurrentFrame();
  const point = (k: CursorKey): Point | undefined => (typeof k.to === 'string' ? targets[k.to] : k.to);
  const known = keys.filter((k) => point(k));
  if (known.length === 0) return null;

  let pos = point(known[0]!)!;
  for (let i = 0; i < known.length - 1; i++) {
    const a = known[i]!;
    const b = known[i + 1]!;
    if (frame >= a.at) {
      // Leave for the next target 18 frames before arriving, or sooner if they are close together
      const leave = Math.max(a.at, b.at - 18);
      const t = progress(frame, leave, b.at, easeInOut);
      const pa = point(a)!;
      const pb = point(b)!;
      pos = { x: pa.x + (pb.x - pa.x) * t, y: pa.y + (pb.y - pa.y) * t };
    }
  }

  const since = Math.min(...clicks.map((c) => (frame >= c ? frame - c : Infinity)));
  const press = since < 8 ? 1 - Math.abs(since - 3) / 5 : 0;
  const ring = since < 16 ? since / 16 : 1;
  const opacity = Math.min(progress(frame, keys[0]!.at - 8, keys[0]!.at), hideAfter ? 1 - progress(frame, hideAfter, hideAfter + 8) : 1);

  return (
    <div style={{ position: 'absolute', left: pos.x, top: pos.y, opacity, pointerEvents: 'none', zIndex: 50 }}>
      {clicks.map((c) => (
        <Sequence key={c} from={c} durationInFrames={6} layout="none">
          <Audio src={staticFile('click.wav')} volume={0.8} />
        </Sequence>
      ))}
      {ring < 1 && (
        <span
          style={{
            position: 'absolute',
            left: -24 * (0.5 + ring),
            top: -24 * (0.5 + ring),
            width: 48 * (0.5 + ring),
            height: 48 * (0.5 + ring),
            borderRadius: '50%',
            border: '2px solid var(--halo-text-primary)',
            opacity: 0.35 * (1 - ring),
          }}
        />
      )}
      <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: `translate(-6px, -4px) scale(${1 - press * 0.15})`, transformOrigin: '6px 4px' }}>
        <path d="M6 4 L6 26 L12 20.5 L16 29 L20 27.2 L16.2 19 L24 19 Z" fill="#111" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** A terminal window. Always dark, in both themes. */
export function Terminal({ title = 'Terminal', children, style }: { title?: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      data-theme="dark"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        border: '1px solid var(--halo-border-secondary)',
        background: 'var(--halo-surface-primary)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', borderBottom: '1px solid var(--halo-border-secondary)' }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--halo-surface-secondary)' }} />
        ))}
        <span style={{ marginLeft: 12, font: '500 18px/24px var(--halo-font-family-body)', color: 'var(--halo-text-secondary)' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '24px 28px', font: '400 20px/32px "Geist Mono", ui-monospace, monospace', color: 'var(--halo-text-primary)' }}>
        {children}
      </div>
    </div>
  );
}

/** A line that appears on its frame, like terminal output. */
export function Line({ at, children, style }: { at: number; children?: ReactNode; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return <div style={{ whiteSpace: 'pre-wrap', minHeight: 34, ...style }}>{children}</div>;
}

/** The Halo mark: three rings, the bottom one follows the theme. */
export function Mark({ size = 96, rings = [1, 1, 1] }: { size?: number; rings?: number[] }) {
  const paths = [
    { fill: 'var(--halo-color-purple-200)', d: 'M40 6.66667C40 10.3486 31.0457 13.3333 20 13.3333C8.9543 13.3333 0 10.3486 0 6.66667C0 2.98477 8.9543 0 20 0C31.0457 0 40 2.98477 40 6.66667ZM4.4 6.66667C4.4 9.53855 11.3844 11.8667 20 11.8667C28.6156 11.8667 35.6 9.53855 35.6 6.66667C35.6 3.79479 28.6156 1.46667 20 1.46667C11.3844 1.46667 4.4 3.79479 4.4 6.66667Z' },
    { fill: 'var(--halo-color-purple-600)', d: 'M40 19.1111C40 22.793 31.0457 25.7778 20 25.7778C8.9543 25.7778 0 22.793 0 19.1111C0 15.4292 8.9543 12.4444 20 12.4444C31.0457 12.4444 40 15.4292 40 19.1111ZM4.4 19.1111C4.4 21.983 11.3844 24.3111 20 24.3111C28.6156 24.3111 35.6 21.983 35.6 19.1111C35.6 16.2392 28.6156 13.9111 20 13.9111C11.3844 13.9111 4.4 16.2392 4.4 19.1111Z' },
    { fill: 'var(--halo-icon-primary)', d: 'M40 31.5556C40 35.2375 31.0457 38.2222 20 38.2222C8.9543 38.2222 0 35.2375 0 31.5556C0 27.8737 8.9543 24.8889 20 24.8889C31.0457 24.8889 40 27.8737 40 31.5556ZM4.4 31.5556C4.4 34.4274 11.3844 36.7556 20 36.7556C28.6156 36.7556 35.6 34.4274 35.6 31.5556C35.6 28.6837 28.6156 26.3556 20 26.3556C11.3844 26.3556 4.4 28.6837 4.4 31.5556Z' },
  ];
  return (
    <svg width={size} height={size} viewBox="0 -0.9 40 40" aria-hidden="true" style={{ overflow: 'visible' }}>
      {paths.map((p, i) => (
        <path key={i} fill={p.fill} fillRule="evenodd" d={p.d} style={{ opacity: rings[i], transform: `translateY(${(1 - (rings[i] ?? 1)) * -12}px)` }} />
      ))}
    </svg>
  );
}
