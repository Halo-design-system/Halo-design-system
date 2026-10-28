import { createContext, useContext, useEffect, useState } from 'react';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

// A small router: the site only needs a few paths, so it uses the History API directly.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

const strip = (path: string) => (path.startsWith(base) ? path.slice(base.length) : path) || '/';

const Ctx = createContext<{ path: string; go: (to: string) => void }>({ path: '/', go: () => {} });

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => strip(window.location.pathname));
  useEffect(() => {
    const onPop = () => setPath(strip(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const go = (to: string) => {
    window.history.pushState(null, '', base + to);
    setPath(to);
    window.scrollTo(0, 0);
  };
  return <Ctx.Provider value={{ path, go }}>{children}</Ctx.Provider>;
}

export const useRoute = () => useContext(Ctx);

/** A link inside the site. Plain clicks change the page without reloading; modified clicks open as usual. */
export function Link({ to, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const { go } = useRoute();
  return (
    <a
      href={base + to}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(to);
      }}
      {...rest}
    />
  );
}

export const links = {
  storybook: 'https://halo-design-system.github.io/Halo-design-system/storybook/',
  github: 'https://github.com/Halo-design-system/Halo-design-system',
  npm: 'https://www.npmjs.com/package/@halo-ds/react',
  // Replace with the Figma Community link once the file is published
  figma: 'https://www.figma.com/community',
};
