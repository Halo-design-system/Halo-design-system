import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * False during server rendering and the first render while hydrating, true after that.
 * Use it for anything that only exists in the browser (portals, feature checks), so the
 * HTML from the server matches what React draws first and hydration never fails.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
