import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/**
 * Shows its content shrunk to fit the box it sits in, so nothing ever spills out of a card.
 * The content is laid out at `width` pixels, scaled to at most `scale`, and smaller when it would not fit.
 * `center` puts it in the middle of the box; `top` fills the box's width from the top, for whole pages.
 */
export function Fit({ children, width = 420, scale = 0.85, pad = 16, align = 'center' }: { children: ReactNode; width?: number; scale?: number; pad?: number; align?: 'center' | 'top' }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const b = box.current;
    const el = inner.current;
    if (!b || !el) return;
    const fit = () => {
      // offsetWidth and offsetHeight ignore the transform, so they are the content's own size
      const w = Math.max(el.offsetWidth, el.scrollWidth);
      const h = Math.max(el.offsetHeight, el.scrollHeight);
      if (!w || !h) return;
      const s = align === 'top' ? b.clientWidth / w : Math.min(scale, (b.clientWidth - pad * 2) / w, (b.clientHeight - pad * 2) / h);
      el.style.transform = align === 'top' ? `scale(${s})` : `translate(-50%, -50%) scale(${s})`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(b);
    ro.observe(el);
    return () => ro.disconnect();
  }, [align, pad, scale]);
  return (
    <div ref={box} className={`fit fit-${align}`}>
      {/* Small things keep their own width, so they are not shrunk as if they were `width` wide */}
      <div ref={inner} className="fit-inner" style={align === 'top' ? { width } : { width: 'max-content', maxWidth: width }}>
        {children}
      </div>
    </div>
  );
}
