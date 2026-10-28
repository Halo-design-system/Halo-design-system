import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, Ref, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useIsClient } from './useIsClient';

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';

// Transparent rather than visibility: hidden, so panels can take focus before they are placed.
const HIDDEN: CSSProperties = { position: 'absolute', top: 0, left: 0, opacity: 0, pointerEvents: 'none' };

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/**
 * Places a floating panel next to an anchor and keeps it there on scroll and resize.
 * Flips to the opposite side when there is no room.
 */
export function useFloating(
  anchor: RefObject<HTMLElement | null>,
  open: boolean,
  { side = 'bottom', align = 'start', gap = 4, matchWidth = false }: { side?: Side; align?: Align; gap?: number; matchWidth?: boolean } = {},
) {
  const floating = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<{ style: CSSProperties; side: Side }>({ style: HIDDEN, side });

  const place = useCallback(() => {
    const a = anchor.current;
    const f = floating.current;
    if (!a || !f) return;
    const r = a.getBoundingClientRect();
    const w = matchWidth ? Math.max(r.width, f.offsetWidth) : f.offsetWidth;
    const h = f.offsetHeight;
    const fits = (s: Side) =>
      s === 'top' ? r.top - h - gap >= 0
      : s === 'bottom' ? r.bottom + h + gap <= window.innerHeight
      : s === 'left' ? r.left - w - gap >= 0
      : r.right + w + gap <= window.innerWidth;
    const s = fits(side) || !fits(OPPOSITE[side]) ? side : OPPOSITE[side];
    let top: number;
    let left: number;
    if (s === 'top' || s === 'bottom') {
      top = s === 'top' ? r.top - h - gap : r.bottom + gap;
      left = align === 'start' ? r.left : align === 'end' ? r.right - w : r.left + r.width / 2 - w / 2;
      // Keep the start edge on screen when the panel is wider than the viewport.
      left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    } else {
      left = s === 'left' ? r.left - w - gap : r.right + gap;
      top = align === 'start' ? r.top : align === 'end' ? r.bottom - h : r.top + r.height / 2 - h / 2;
      // Keep it on screen when the anchor is near the top or bottom edge.
      top = Math.max(8, Math.min(top, window.innerHeight - h - 8));
    }
    setState({
      side: s,
      style: { position: 'absolute', top: top + window.scrollY, left: left + window.scrollX, minWidth: matchWidth ? r.width : undefined },
    });
  }, [anchor, side, align, gap, matchWidth]);

  useLayoutEffect(() => {
    if (!open) {
      setState((s) => (s.style === HIDDEN ? s : { side: s.side, style: HIDDEN }));
      return;
    }
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    // Follow size changes too, like a Combobox growing a new row of tags.
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(() => place());
    if (anchor.current) observer?.observe(anchor.current);
    if (floating.current) observer?.observe(floating.current);
    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, place, anchor]);

  return { floating, style: state.style, side: state.side, update: place };
}

/** Closes on Escape and on a click outside both the anchor and the panel. */
// Open panels, oldest first. A panel opened from inside another, like a Select in a date picker,
// sits on top: Escape closes only the top one, and clicks in it do not close the ones below.
const layers: RefObject<HTMLElement | null>[][] = [];

export function useDismiss(open: boolean, onClose: () => void, refs: RefObject<HTMLElement | null>[]) {
  const latest = useRef(onClose);
  latest.current = onClose;
  useEffect(() => {
    if (!open) return;
    layers.push(refs);
    const inside = (rs: RefObject<HTMLElement | null>[], t: Node) => rs.some((r) => r.current?.contains(t));
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      const above = layers.slice(layers.indexOf(refs) + 1);
      if (inside(refs, t) || above.some((rs) => inside(rs, t))) return;
      latest.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && layers[layers.length - 1] === refs) latest.current();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      layers.splice(layers.indexOf(refs), 1);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
}

/** Renders into document.body. Waits until after hydration, so server and browser HTML match. */
export function Portal({ children }: { children: ReactNode }) {
  const isClient = useIsClient();
  if (!isClient) return null;
  return createPortal(children, document.body);
}

/** Merges refs into one callback ref. */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const r of refs) {
      if (typeof r === 'function') r(node);
      else if (r && typeof r === 'object') (r as { current: T | null }).current = node;
    }
  };
}
