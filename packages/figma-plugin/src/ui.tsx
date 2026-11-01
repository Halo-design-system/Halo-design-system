// The plugin window, built with Halo: a search box and every component as a card,
// A to Z, showing the component itself and its name. Clicking a card places it.
import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, MagnifyingGlass } from '@phosphor-icons/react';
import { Card, EmptyState, Input, LinkButton, Text, ToastProvider, useToast } from '@halo-ds/react';
import { all } from '../../../apps/site/src/catalog';
import { sizes } from './preview-sizes';
import { previews, previewsDark } from './previews';
import './ui.css';

const WEBSITE = 'https://halo-design-system.github.io/Halo-design-system/';

const send = (msg: object) => parent.postMessage({ pluginMessage: msg }, '*');

const components = [...all].sort((a, b) => a.name.localeCompare(b.name));

// Figma marks its theme on <html> (themeColors: true), following its own setting or the system.
// Halo reads data-theme, and the pictures switch to match.
function useFigmaTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const isDark = root.classList.contains('figma-dark');
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
      setDark(isDark);
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

function App() {
  const dark = useFigmaTheme();
  const pictures = dark ? previewsDark : previews;
  const { toast } = useToast();
  const [query, setQuery] = useState('');

  useEffect(() => {
    onmessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (msg?.type === 'missing') {
        toast({ type: 'error', title: `Couldn’t find ${msg.name}`, description: 'Add the Halo library to this file, then try again.' });
      }
    };
  }, [toast]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? components.filter((c) => c.name.toLowerCase().includes(q)) : components;
  }, [query]);

  return (
    <div className="app">
      <header className="search">
        <Input
          type="search"
          size="md"
          iconLeft={<MagnifyingGlass />}
          placeholder="Search, like Button"
          aria-label="Search components"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && shown[0]) send({ type: 'place', slug: shown[0].slug, index: 0 });
          }}
          autoFocus
        />
      </header>
      {shown.length ? (
        <main className="grid">
          {shown.map((c) => (
            <Card
              key={c.slug}
              classNames={{ media: 'stage', content: 'label' }}
              media={
                <div className="frame">
                  <img src={pictures[c.slug]} alt="" draggable={false} style={{ width: sizes[c.slug]?.[0] }} />
                </div>
              }
              onClick={() => send({ type: 'place', slug: c.slug, index: 0 })}
              title={`Place ${c.name}`}
            >
              <Text size="sm" weight="semibold" as="span">
                {c.name}
              </Text>
            </Card>
          ))}
        </main>
      ) : (
        <EmptyState size="sm" icon={<MagnifyingGlass />} title="No components found" description="Try another name." />
      )}
      <footer className="footer">
        <LinkButton
          size="sm"
          href={WEBSITE}
          iconRight={<ArrowUpRight />}
          onClick={(e) => {
            e.preventDefault();
            send({ type: 'open', url: WEBSITE });
          }}
        >
          Visit the Halo website
        </LinkButton>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <ToastProvider position="bottom-center" limit={1}>
    <App />
  </ToastProvider>,
);
