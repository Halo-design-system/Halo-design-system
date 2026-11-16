import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/**
 * A row that scrolls sideways instead of wrapping. The ends fade out while there is more to scroll that way,
 * so it's clear something is hidden. The fade is a mask, so it works on any background, light or dark.
 */
export function ScrollRow({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      el.toggleAttribute('data-more-start', el.scrollLeft > 2);
      el.toggleAttribute('data-more-end', el.scrollLeft < max - 2);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);
  // Keeps the picked tab in view when it changes
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mo = new MutationObserver(() => {
      const on = el.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!on) return;
      const r = on.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      if (r.left < b.left || r.right > b.right) el.scrollBy({ left: r.left - b.left - 24, behavior: 'smooth' });
    });
    mo.observe(el, { subtree: true, attributes: true, attributeFilter: ['aria-selected'] });
    return () => mo.disconnect();
  }, []);
  return (
    <div ref={ref} className={className ? `scroll-row ${className}` : 'scroll-row'}>
      {children}
    </div>
  );
}
