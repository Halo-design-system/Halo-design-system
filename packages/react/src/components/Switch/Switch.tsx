import { forwardRef, useEffect, useId, useRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useControllable } from '../../internal/useControllable';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Switch.module.css';

/** Parts you can style with `classNames` and `styles`. `className` goes on the root; other props go on the switch button. */
export type SwitchPart = 'root' | 'control' | 'track' | 'thumb' | 'text' | 'label' | 'description';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'>, PartsProps<SwitchPart> {
  /** The setting it turns on or off. Figma: Label. */
  label?: ReactNode;
  /** Extra detail, like why it is disabled. Figma: Description. */
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** 28 by 16 (sm) or 36 by 20 (md). Figma: Size. */
  size?: 'sm' | 'md';
  /** Switch before the label, or at the end of a full-width row. Figma: Control position. */
  controlPosition?: 'start' | 'end';
}

/** Thumb size and how far it travels, in px, per size. Matches the CSS. */
const SIZES = { sm: { thumb: 12, travel: 12 }, md: { thumb: 16, travel: 16 } };

type Spring = { x: number; v: number; t: number; k: number; c: number };
const spring = (x: number, k: number, c: number): Spring => ({ x, v: 0, t: x, k, c });
const step = (s: Spring, dt: number) => {
  s.v += (-s.k * (s.x - s.t) - s.c * s.v) * dt;
  s.x += s.v * dt;
};
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * The thumb's motion. A position spring (stiffness 320, damping 18) carries it across and lands with a small
 * bounce; a stretch spring (300, 20) gets a kick on each flip, so the thumb grows long toward where it is
 * going, then rounds back up. The track fills with the brand colour as the thumb travels.
 */
function useSwitchMotion(on: boolean, size: 'sm' | 'md') {
  const thumb = useRef<HTMLSpanElement>(null);
  const state = useRef<{ p: Spring; w: Spring; frame: number; on: boolean } | null>(null);
  const paint = (p: number, w: number, isOn: boolean) => {
    const el = thumb.current;
    if (!el) return;
    const { thumb: t, travel } = SIZES[size];
    const grow = clamp01(w) * t * (10 / 26);
    const x = p * travel;
    el.style.setProperty('--grow', `${grow.toFixed(2)}px`);
    el.style.setProperty('--x', `${(isOn ? x - grow * clamp01(p) : x).toFixed(2)}px`);
    el.parentElement?.style.setProperty('--p', `${(clamp01(p) * 100).toFixed(1)}%`);
  };
  useEffect(() => {
    const first = !state.current;
    if (first) state.current = { p: spring(on ? 1 : 0, 320, 18), w: spring(0, 300, 20), frame: 0, on };
    const s = state.current!;
    if (first || s.on === on) return paint(s.p.x, s.w.x, on);
    s.on = on;
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      s.p.x = s.p.t = on ? 1 : 0;
      s.p.v = s.w.v = s.w.x = 0;
      return paint(s.p.x, 0, on);
    }
    s.p.t = on ? 1 : 0;
    s.w.t = 0;
    s.w.v = 60;
    cancelAnimationFrame(s.frame);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      for (let i = 0; i < 4; i++) {
        step(s.p, dt / 4);
        step(s.w, dt / 4);
      }
      const settled = Math.abs(s.p.x - s.p.t) < 0.001 && Math.abs(s.p.v) < 0.01 && Math.abs(s.w.x) < 0.001 && Math.abs(s.w.v) < 0.01;
      if (settled) {
        s.p.x = s.p.t;
        s.p.v = s.w.x = s.w.v = 0;
      }
      paint(s.p.x, s.w.x, on);
      if (!settled) s.frame = requestAnimationFrame(tick);
    };
    s.frame = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, size]);
  useEffect(() => () => cancelAnimationFrame(state.current?.frame ?? 0), []);
  return thumb;
}

/** Turns one setting on or off straight away. Use a Checkbox when the choice is sent with a form. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, description, checked, defaultChecked = false, onCheckedChange, size = 'md', controlPosition = 'start', disabled, id, className, classNames, styles: partStyles, onClick, ...rest },
  ref,
) {
  const part = parts<SwitchPart>('switch', { classNames, styles: partStyles });
  const [on, setOn] = useControllable(checked, defaultChecked, onCheckedChange);
  const thumb = useSwitchMotion(on, size);
  const autoId = useId();
  const btnId = id ?? autoId;
  const labelId = label ? `${btnId}-label` : undefined;
  const descId = description ? `${btnId}-description` : undefined;
  const control = (
    <button
      ref={ref}
      id={btnId}
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={labelId}
      aria-describedby={descId}
      disabled={disabled}
      {...part('track', styles.track, rest.style)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) setOn(!on);
      }}
      {...rest}
      style={part('track', undefined, rest.style).style}
    >
      <span ref={thumb} {...part('thumb', styles.thumb)} />
    </button>
  );
  if (!label && !description) return <span {...part('root', [styles[size], className])}>{control}</span>;
  return (
    <div data-disabled={disabled || undefined} {...part('root', [styles.field, styles[size], styles[controlPosition], disabled && styles.disabled, className])}>
      <span {...part('control', styles.control)}>{control}</span>
      <span {...part('text', styles.text)}>
        {label && (
          <label id={labelId} htmlFor={btnId} {...part('label', styles.label)}>
            {label}
          </label>
        )}
        {description && <span id={descId} {...part('description', styles.description)}>{description}</span>}
      </span>
    </div>
  );
});
