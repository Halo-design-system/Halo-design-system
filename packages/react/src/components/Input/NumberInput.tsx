import { forwardRef, useEffect, useRef } from 'react';
import type { ForwardedRef } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../../internal/Icon';
import { useControllable } from '../../internal/useControllable';
import { CompactButton } from '../CompactButton';
import { InputField } from './Input';
import type { InputFieldProps } from './Input';
import styles from './NumberInput.module.css';

export interface NumberInputProps
  extends Omit<InputFieldProps, 'type' | 'value' | 'defaultValue' | 'onChange' | 'iconLeft' | 'iconRight' | 'min' | 'max' | 'step'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

type Spring = { x: number; v: number; k: number; c: number };
const spring = (k: number, c: number): Spring => ({ x: 0, v: 0, k, c });
/** Every spring here rests at 0. */
const stepSpring = (s: Spring, dt: number) => {
  s.v += (-s.k * s.x - s.c * s.v) * dt;
  s.x += s.v * dt;
};
const resting = (s: Spring) => Math.abs(s.x) < 0.001 && Math.abs(s.v) < 0.01;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const reducedMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setRef<T>(ref: ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

/**
 * The stepper's motion, on four springs that all settle to 0:
 * - roll (260, 24): a change sets it to 1, so the new number comes in from below (from above going down)
 *   while the old one leaves the other way.
 * - minus and plus (600, 14): past a limit the button gets a sideways kick, shaking "no".
 * - nudge (500, 16): the number gets a small push the same way, so you feel the wall.
 */
function useStepperMotion() {
  const input = useRef<HTMLInputElement>(null);
  const roll = useRef<HTMLSpanElement>(null);
  const minus = useRef<HTMLButtonElement>(null);
  const plus = useRef<HTMLButtonElement>(null);
  const m = useRef({ R: spring(260, 24), KM: spring(600, 14), KP: spring(600, 14), NN: spring(500, 16), dir: 1, frame: 0 });

  const paint = () => {
    const { R, KM, KP, NN, dir } = m.current;
    const layer = roll.current;
    const el = input.current;
    if (layer && el) {
      const [now, old] = layer.children as unknown as HTMLElement[];
      const r = R.x;
      const rolling = !resting(R);
      layer.hidden = !rolling;
      el.style.color = rolling ? 'transparent' : '';
      now!.style.transform = `translateY(${(dir * r * 100).toFixed(2)}%)`;
      now!.style.opacity = clamp01(1 - Math.abs(r)).toFixed(3);
      old!.style.transform = `translateY(${((r - 1) * dir * 100).toFixed(2)}%)`;
      old!.style.opacity = clamp01(r).toFixed(3);
      const nudge = `translateX(${(NN.x * 0.4).toFixed(2)}px)`;
      el.style.transform = resting(NN) ? '' : nudge;
      layer.style.transform = nudge;
    }
    if (minus.current) minus.current.style.transform = resting(KM) ? '' : `translateX(${(KM.x * 0.6).toFixed(2)}px)`;
    if (plus.current) plus.current.style.transform = resting(KP) ? '' : `translateX(${(KP.x * 0.6).toFixed(2)}px)`;
  };

  const run = () => {
    const s = m.current;
    cancelAnimationFrame(s.frame);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const all = [s.R, s.KM, s.KP, s.NN];
      for (let i = 0; i < 4; i++) all.forEach((sp) => stepSpring(sp, dt / 4));
      const done = all.every(resting);
      if (done) all.forEach((sp) => (sp.x = sp.v = 0));
      paint();
      if (!done) s.frame = requestAnimationFrame(tick);
    };
    s.frame = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(m.current.frame), []);

  /** Rolls from `from` to `to`. */
  const change = (from: number, to: number) => {
    if (reducedMotion() || !roll.current || !input.current) return;
    const s = m.current;
    const layer = roll.current;
    const el = input.current;
    // The rolling copy sits exactly over the text box, in its font
    layer.style.left = `${el.offsetLeft}px`;
    layer.style.width = `${el.offsetWidth}px`;
    layer.style.font = getComputedStyle(el).font;
    const [now, old] = layer.children as unknown as HTMLElement[];
    now!.textContent = String(to);
    old!.textContent = String(from);
    s.dir = to > from ? 1 : -1;
    s.R.x = 1;
    s.R.v = 0;
    run();
  };

  /** Shakes the button that hit the limit, and nudges the number the same way. */
  const wall = (d: 1 | -1) => {
    if (reducedMotion()) return;
    const s = m.current;
    (d < 0 ? s.KM : s.KP).v = 300 * d;
    s.NN.v = 160 * d;
    run();
  };

  return { input, roll, minus, plus, change, wall };
}

/** A number with minus and plus buttons on either side. Figma: Number input. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, disabled, size = 'md', ...rest },
  ref,
) {
  const [n, setN] = useControllable(value, defaultValue, onValueChange);
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const btn = size === 'sm' ? 'md' : 'lg';
  const motion = useStepperMotion();
  const press = (d: 1 | -1) => {
    const to = clamp(n + d * step);
    if (to === n) return motion.wall(d);
    motion.change(n, to);
    setN(to);
  };
  // At a limit the button stays pressable so it can shake "no", but reads as unavailable
  const atMin = n <= min;
  const atMax = n >= max;
  return (
    <InputField
      ref={(el) => {
        motion.input.current = el;
        setRef(ref, el);
      }}
      {...rest}
      size={size}
      disabled={disabled}
      className={cx(styles.number, rest.className)}
      inputMode="decimal"
      value={String(n)}
      onChange={(e) => {
        const v = Number(e.target.value);
        if (!Number.isNaN(v)) setN(clamp(v));
      }}
      iconLeft={
        <span className={styles.step}>
          <span ref={motion.roll} className={styles.roll} aria-hidden="true" hidden>
            <span />
            <span />
          </span>
          <CompactButton
            ref={motion.minus}
            variant="ghost"
            round
            size={btn}
            aria-label="Decrease"
            disabled={disabled}
            aria-disabled={atMin || undefined}
            className={cx(atMin && styles.wall)}
            onClick={() => press(-1)}
          >
            <Icon name="Minus" />
          </CompactButton>
        </span>
      }
      iconRight={
        <CompactButton
          ref={motion.plus}
          variant="ghost"
          round
          size={btn}
          aria-label="Increase"
          disabled={disabled}
          aria-disabled={atMax || undefined}
          className={cx(atMax && styles.wall)}
          onClick={() => press(1)}
        >
          <Icon name="Plus" />
        </CompactButton>
      }
    />
  );
});
