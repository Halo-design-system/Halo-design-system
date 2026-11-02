// Shows a live example app in a device frame: pick a screen and a device, click around, open it full page, or read its code.
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, SegmentedControl, Select, Tab, TabList, TabPanel, Tabs } from '@halo-ds/react';
import { ArrowSquareOut, BatteryFull, CellSignalFull, Code, DeviceMobile, DeviceTablet, Eye, Monitor, WifiHigh } from '@phosphor-icons/react';
import { CodeBlock } from '../CodeBlock';
import { frameUrl, sourceOf } from './registry';
import type { LiveApp } from './registry';
import './viewer.css';

const devices = {
  desktop: { label: 'Desktop', icon: <Monitor />, width: 1440, height: 900 },
  tablet: { label: 'Tablet', icon: <DeviceTablet />, width: 834, height: 1112 },
  mobile: { label: 'Mobile', icon: <DeviceMobile />, width: 390, height: 844 },
};
type Device = keyof typeof devices;

/** The phone or tablet status bar, drawn like the one in the Figma file. Decoration only, so it is hidden from screen readers. */
function StatusBar() {
  return (
    <div className="lv-status" aria-hidden="true">
      <span>9:41</span>
      <span className="lv-status-icons">
        <CellSignalFull weight="fill" />
        <WifiHigh weight="bold" />
        <BatteryFull weight="fill" />
      </span>
    </div>
  );
}

/** The browser bar above the desktop preview, with the app's address. */
function BrowserBar({ address }: { address: string }) {
  return (
    <div className="lv-browser" aria-hidden="true">
      <span className="lv-dots">
        <span />
        <span />
        <span />
      </span>
      <span className="lv-address">{address}</span>
    </div>
  );
}

/** Scales the device down to fit the page width, so every device shows whole. */
function useFit(width: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / width));
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();
    return () => ro.disconnect();
  }, [width]);
  return { ref, scale };
}

function DeviceFrame({ device, src, address }: { device: Device; src: string; address: string }) {
  const d = devices[device];
  const chrome = device === 'desktop' ? 44 : 0;
  const { ref, scale } = useFit(d.width + (device === 'desktop' ? 0 : 28));
  let frame: ReactNode;
  if (device === 'desktop') {
    frame = (
      <div className="lv-desktop" style={{ width: d.width }}>
        <BrowserBar address={address} />
        <iframe title="Live example" src={src} style={{ height: d.height }} />
      </div>
    );
  } else {
    frame = (
      <div className={`lv-handheld lv-${device}`} style={{ width: d.width + 28 }}>
        <div className="lv-glass">
          <StatusBar />
          <iframe title="Live example" src={src} style={{ height: d.height - 54 }} />
        </div>
      </div>
    );
  }
  const height = (d.height + chrome + (device === 'desktop' ? 0 : 28)) * scale;
  return (
    <div ref={ref} className="lv-stage" style={{ height }}>
      <div className="lv-scale" style={{ transform: `scale(${scale})` }}>
        {frame}
      </div>
    </div>
  );
}

export function Viewer({ app }: { app: LiveApp }) {
  const [screen, setScreen] = useState(app.screens[0]!.id);
  const [device, setDevice] = useState<Device>('desktop');
  const [view, setView] = useState('preview');
  const [src, setSrc] = useState(frameUrl(app.id, app.screens[0]!.id));
  const current = app.screens.find((s) => s.id === screen);

  // Clicks inside the app move to other screens; keep the picker and code in step
  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'halo-app-screen' || e.data.app !== app.id) return;
      setScreen(e.data.screen);
    };
    window.addEventListener('message', on);
    return () => window.removeEventListener('message', on);
  }, [app.id]);

  const pick = (id: string) => {
    setScreen(id);
    setSrc(`${frameUrl(app.id, id)}?v=${Date.now()}`);
  };

  const files = current ? [current.file, ...app.shared] : app.shared;

  return (
    <section className="lv" aria-label={`${app.name} example`}>
      <div className="lv-bar">
        <Select aria-label="Screen" size="sm" value={current ? screen : ''} placeholder="Pick a screen" onValueChange={pick} options={app.screens.map((s) => ({ value: s.id, label: s.name }))} />
        <SegmentedControl
          aria-label="Device"
          size="sm"
          value={device}
          onValueChange={(v) => {
            // A new device loads a new frame; keep it on the screen you were on
            setDevice(v as Device);
            setSrc(`${frameUrl(app.id, screen)}?v=${Date.now()}`);
          }}
          options={(Object.keys(devices) as Device[]).map((k) => ({ value: k, label: devices[k].label, icon: devices[k].icon }))}
        />
        <SegmentedControl
          aria-label="View"
          size="sm"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'preview', label: 'Preview', icon: <Eye /> },
            { value: 'code', label: 'Code', icon: <Code /> },
          ]}
        />
        <Button size="sm" variant="secondary" iconRight={<ArrowSquareOut />} onClick={() => window.open(frameUrl(app.id, screen), '_blank', 'noopener')}>
          Live preview
        </Button>
      </div>

      {/* The preview stays mounted under the code, so the app keeps its state when you switch back */}
      <div hidden={view !== 'preview'}>
        <DeviceFrame device={device} src={src} address={`${app.host}/${screen}`} />
      </div>
      {view === 'code' && (
        <Tabs defaultValue={files[0]} key={files[0]}>
          <TabList aria-label="Files">
            {files.map((f) => (
              <Tab key={f} value={f}>
                {f}
              </Tab>
            ))}
          </TabList>
          {files.map((f) => (
            <TabPanel key={f} value={f}>
              <div className="lv-code">
                <CodeBlock code={sourceOf(app.id, f)} />
              </div>
            </TabPanel>
          ))}
        </Tabs>
      )}
    </section>
  );
}
