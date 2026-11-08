import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';

/** Sets data-wrapped on a multi-value field once its tags run past one row, so it can ease its fully round corners. */
export function useWrapped(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => el.toggleAttribute('data-wrapped', el.offsetHeight > parseFloat(getComputedStyle(el).minHeight));
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    return () => observer.disconnect();
  }, [ref]);
}
