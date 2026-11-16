import { cloneElement, isValidElement, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, FocusEvent, KeyboardEvent, MouseEvent, PointerEvent, ReactElement, ReactNode, Ref } from 'react';
import { createPortal } from 'react-dom';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Tooltip.module.css';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

/** Parts you can style with `classNames` and `styles`. */
export type TooltipPart = 'root' | 'bubble';

export interface TooltipProps extends PartsProps<TooltipPart> {
  /** The tooltip text. Keep it to a few words. Figma: Label. */
  content: ReactNode;
  /** Which side it appears on. Flips if there is no room. Figma: Placement. */
  side?: TooltipSide;
  /** Milliseconds to wait on hover before showing. Keyboard focus shows it straight away. */
  delay?: number;
  /** The element the tooltip describes. It must accept a ref and focus/hover events. */
  children: ReactElement;
}

const GAP = 4; // between the arrow and the element
const OPPOSITE: Record<TooltipSide, TooltipSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

// Once one tooltip has been shown, moving straight to another shows it without the delay.
let lastClosedAt = 0;
const WARM_WINDOW = 300;

type Handlers = {
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  onPointerEnter?: (e: PointerEvent) => void;
  onPointerDown?: (e: PointerEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  'aria-describedby'?: string;
  ref?: Ref<HTMLElement>;
};

// 10 by 5px arrow pointing at the element (5 by 10 for left and right).
const ARROWS: Record<TooltipSide, { w: number; h: number; d: string }> = {
  top: { w: 10, h: 5, d: 'M0 0L10 0L5 5Z' },
  bottom: { w: 10, h: 5, d: 'M0 5L10 5L5 0Z' },
  left: { w: 5, h: 10, d: 'M0 0L0 10L5 5Z' },
  right: { w: 5, h: 10, d: 'M5 0L5 10L0 5Z' },
};

function Arrow({ side }: { side: TooltipSide }) {
  const a = ARROWS[side];
  return (
    <svg className={styles.arrow} width={a.w} height={a.h} viewBox={`0 0 ${a.w} ${a.h}`} aria-hidden="true">
      <path d={a.d} fill="currentColor" />
    </svg>
  );
}

export function Tooltip({ content, side = 'top', delay = 500, children, classNames, styles: partStyles }: TooltipProps) {
  const part = parts<TooltipPart>('tooltip', { classNames, styles: partStyles });
  const id = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const showTimer = useRef<number | undefined>(undefined);
  const hideTimer = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  // A touch also fires mouse events; the last pointer type tells them apart
  const pointer = useRef<string>('mouse');
  const [pos, setPos] = useState<{ top: number; left: number; side: TooltipSide } | null>(null);

  const clearTimers = () => {
    window.clearTimeout(showTimer.current);
    window.clearTimeout(hideTimer.current);
  };
  const show = useCallback((wait: number) => {
    clearTimers();
    if (wait <= 0 || Date.now() - lastClosedAt < WARM_WINDOW) setOpen(true);
    else showTimer.current = window.setTimeout(() => setOpen(true), wait);
  }, []);
  const hide = useCallback((wait = 0) => {
    clearTimers();
    const close = () => {
      setOpen(false);
      lastClosedAt = Date.now();
    };
    if (wait > 0) hideTimer.current = window.setTimeout(close, wait);
    else close();
  }, []);

  useEffect(() => () => clearTimers(), []);

  // Position next to the trigger; flip to the opposite side if it would leave the screen.
  const place = useCallback(() => {
    const t = triggerRef.current;
    const tip = tipRef.current;
    if (!t || !tip) return;
    const r = t.getBoundingClientRect();
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    const fits = (s: TooltipSide) =>
      s === 'top' ? r.top - h - GAP >= 0
      : s === 'bottom' ? r.bottom + h + GAP <= window.innerHeight
      : s === 'left' ? r.left - w - GAP >= 0
      : r.right + w + GAP <= window.innerWidth;
    const s = fits(side) || !fits(OPPOSITE[side]) ? side : OPPOSITE[side];
    let top = 0;
    let left = 0;
    if (s === 'top' || s === 'bottom') {
      top = s === 'top' ? r.top - h - GAP : r.bottom + GAP;
      left = Math.min(Math.max(4, r.left + r.width / 2 - w / 2), window.innerWidth - w - 4);
    } else {
      left = s === 'left' ? r.left - w - GAP : r.right + GAP;
      top = r.top + r.height / 2 - h / 2;
    }
    setPos({ top: top + window.scrollY, left: left + window.scrollX, side: s });
  }, [side]);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    place();
    const onMove = () => place();
    // Scrolling moves the page away from the pointer, so the tooltip closes instead of following along
    const onScroll = () => hide();
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && hide();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onMove);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, place, hide]);

  if (!isValidElement(children)) return children;
  const child = children as ReactElement<Handlers>;
  const p = child.props;
  const childRef = (p.ref ?? (child as unknown as { ref?: Ref<HTMLElement> }).ref) as Ref<HTMLElement> | undefined;

  const setTriggerRef = (node: HTMLElement | null) => {
    triggerRef.current = node;
    if (typeof childRef === 'function') childRef(node);
    else if (childRef && typeof childRef === 'object') (childRef as { current: HTMLElement | null }).current = node;
  };

  const trigger = cloneElement(child, {
    ref: setTriggerRef,
    'aria-describedby': [p['aria-describedby'], open ? id : undefined].filter(Boolean).join(' ') || undefined,
    onPointerEnter: (e: PointerEvent) => {
      p.onPointerEnter?.(e);
      pointer.current = e.pointerType;
    },
    onPointerDown: (e: PointerEvent) => {
      p.onPointerDown?.(e);
      pointer.current = e.pointerType;
      if (e.pointerType !== 'mouse') hide();
    },
    onMouseEnter: (e: MouseEvent) => {
      p.onMouseEnter?.(e);
      // Only a real mouse hover; a tap on a phone would leave it open with nothing to close it
      if (pointer.current === 'mouse') show(delay);
    },
    onMouseLeave: (e: MouseEvent) => {
      p.onMouseLeave?.(e);
      hide(100); // a moment to move the pointer onto the tooltip
    },
    onFocus: (e: FocusEvent) => {
      p.onFocus?.(e);
      // Only keyboard focus, not a mouse click
      if ((e.target as HTMLElement).matches?.(':focus-visible')) show(0);
    },
    onBlur: (e: FocusEvent) => {
      p.onBlur?.(e);
      hide();
    },
  });

  const style: CSSProperties = pos ? { top: pos.top, left: pos.left } : { top: 0, left: 0, visibility: 'hidden' };

  return (
    <>
      {trigger}
      {open &&
        createPortal(
          <div
            ref={tipRef}
            id={id}
            role="tooltip"
            {...part('root', styles.tooltip, style)}
            data-side={pos?.side ?? side}
            onMouseEnter={() => clearTimers()}
            onMouseLeave={() => hide(100)}
          >
            <span {...part('bubble', styles.bubble)}>{content}</span>
            <Arrow side={pos?.side ?? side} />
          </div>,
          document.body,
        )}
    </>
  );
}
