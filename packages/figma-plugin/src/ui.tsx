// The plugin window, built with Halo: a search box and every component as a card,
// A to Z, showing the component itself and its name. Clicking a card places it.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, DiamondsFour, MagnifyingGlass, Moon, Sun } from '@phosphor-icons/react';
import { Card, EmptyState, Input, LinkButton, SegmentedControl, Spinner, Text, ToastProvider, useToast } from '@halo-ds/react';
import { all } from '../../../apps/site/src/catalog';
import { loadLibrary, subset } from './snapshot/subset';
import { sizes } from './preview-sizes';
import { previews, previewsDark } from './previews';
import './ui.css';

const WEBSITE = 'https://halodesignsystem.dev/';

const send = (msg: object) => parent.postMessage({ pluginMessage: msg }, '*');

const components = [...all].sort((a, b) => a.name.localeCompare(b.name));

type Mode = 'light' | 'dark';

// The mode the person designs in, chosen in the window and kept between sessions by the main thread.
// The window, the pictures and the components it places all follow it.
function useMode() {
  const [mode, setMode] = useState<Mode>('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);
  return [mode, setMode] as const;
}

/**
 * A small label that follows the mouse over a card and says what a click does. It sits just below and right of the
 * pointer, in Halo's tooltip colours, with no arrow. It waits a moment before showing, so moving across the grid
 * doesn't flash it, and stays inside the window.
 */
function useHoverLabel() {
  const [label, setLabel] = useState<{ text: string; x: number; y: number; on: boolean } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const box = useRef<HTMLDivElement>(null);
  const props = (text: string) => ({
    onPointerMove: (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const { clientX: x, clientY: y } = e;
      setLabel((l) => ({ text, x, y, on: l?.text === text ? l.on : false }));
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setLabel((l) => (l ? { ...l, on: true } : l)), 400);
    },
    onPointerLeave: () => {
      window.clearTimeout(timer.current);
      setLabel(null);
    },
    onPointerDown: () => {
      window.clearTimeout(timer.current);
      setLabel(null);
    },
  });
  // Keep it inside the window: flip to the left or above the pointer near the edges
  const w = box.current?.offsetWidth ?? 0;
  const h = box.current?.offsetHeight ?? 0;
  const left = label ? (label.x + 14 + w > window.innerWidth - 8 ? label.x - 10 - w : label.x + 14) : 0;
  const top = label ? (label.y + 18 + h > window.innerHeight - 8 ? label.y - 10 - h : label.y + 18) : 0;
  const node = label ? (
    <div ref={box} className="hover-label" aria-hidden="true" style={{ left, top, opacity: label.on ? 1 : 0 }}>
      {label.text}
    </div>
  ) : null;
  return { props, node };
}

function App() {
  const [mode, setMode] = useMode();
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const pictures = mode === 'dark' ? previewsDark : previews;
  const { toast } = useToast();
  const [query, setQuery] = useState('');

  const [busy, setBusy] = useState<string | null>(null);
  const hover = useHoverLabel();

  useEffect(() => {
    const failed = (name: string, message: string) => {
      setBusy(null);
      toast({ type: 'error', title: `Couldn’t add ${name}`, description: message });
    };
    onmessage = async (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (msg?.type === 'done') setBusy(null);
      if (msg?.type === 'mode') setMode(msg.mode);
      if (msg?.type === 'note') toast({ type: 'information', title: msg.title, description: msg.message });
      if (msg?.type === 'failed') failed(msg.name, msg.message);
      if (msg?.type === 'need') {
        try {
          send({ type: 'data', slug: msg.slug, index: msg.index, placed: msg.placed, mode: modeRef.current, data: subset(await loadLibrary(), msg.key) });
        } catch (error) {
          failed('this component', String((error as Error).message));
        }
      }
    };
    send({ type: 'hello' });
  }, [toast]);

  // Unpacking the component data takes a moment, so do it while the window opens, not on the first click.
  useEffect(() => {
    const timer = setTimeout(() => loadLibrary().catch(() => undefined), 300);
    return () => clearTimeout(timer);
  }, []);

  const place = (slug: string) => {
    if (busy) return;
    setBusy(slug);
    send({ type: 'place', slug, index: 0, mode: modeRef.current });
  };

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? components.filter((c) => c.name.toLowerCase().includes(q)) : components;
  }, [query]);

  return (
    <div className="app">
      <header className="search">
        <div className="title">
          <Text weight="semibold" as="span">
            Halo UI
          </Text>
          <span className="count">
            <DiamondsFour weight="fill" aria-hidden />
            <Text size="sm" color="secondary" as="span">
              {components.length}
            </Text>
            <SegmentedControl
              size="sm"
              aria-label="Component colour mode"
              value={mode}
              onValueChange={(value) => {
                setMode(value as Mode);
                send({ type: 'mode', mode: value });
              }}
              options={[
                { value: 'light', icon: <Sun />, 'aria-label': 'Light' },
                { value: 'dark', icon: <Moon />, 'aria-label': 'Dark' },
              ]}
            />
          </span>
        </div>
        <Input
          type="search"
          size="md"
          iconLeft={<MagnifyingGlass />}
          placeholder="Search, like Button"
          aria-label="Search components"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && shown[0]) place(shown[0].slug);
          }}
          autoFocus
        />
      </header>
      {shown.length ? (
        <main className="grid">
          {shown.map((c) => (
            <Card
              key={c.slug}
              {...hover.props(`Place ${c.name}`)}
              classNames={{ media: 'stage', content: 'label' }}
              media={
                <div className="frame">
                  {busy === c.slug ? <Spinner /> : <img src={pictures[c.slug]} alt="" draggable={false} style={{ width: sizes[c.slug]?.[0] }} />}
                </div>
              }
              onClick={() => place(c.slug)}
              aria-label={`Place ${c.name}`}
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
      {hover.node}
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
