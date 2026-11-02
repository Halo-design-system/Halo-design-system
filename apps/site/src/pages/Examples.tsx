import { useEffect, useState } from 'react';
import { SegmentedControl, Tab, TabList, Tabs } from '@halo-ds/react';
import { DeviceMobile, Monitor } from '@phosphor-icons/react';
import { apps } from '../screens';
import type { Screen } from '../screens';
import { useRoute } from '../router';
import { liveApps } from '../live/registry';
import { Viewer } from '../live/Viewer';

function ScreenShot({ screen, device }: { screen: Screen; device: 'desktop' | 'mobile' }) {
  const src = `${import.meta.env.BASE_URL}screens/${screen.id}-${device}.webp`;
  const [w, h] = screen[device];
  return (
    <figure id={screen.id} className={`screen screen-${device}`}>
      <figcaption>
        <h2>{screen.name}</h2>
      </figcaption>
      {/* Phones scroll inside a fixed frame, so long screens don't stretch the page */}
      <div className={device === 'mobile' ? 'phone-frame' : 'desktop-frame'} tabIndex={device === 'mobile' ? 0 : undefined} aria-label={device === 'mobile' ? `${screen.name}, scroll to see the whole screen` : undefined}>
        <img src={src} alt={`${screen.name} screen`} loading="lazy" width={w} height={h} />
      </div>
    </figure>
  );
}

export function Examples() {
  const { path, go } = useRoute();
  const id = path.replace(/^\/examples\/?/, '');
  const app = apps.find((a) => a.id === id) ?? apps[0]!;
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  // Apps built in code run live; the rest show their Figma screens until they are built
  const live = liveApps.find((a) => a.id === app.id);

  // Links from a component page carry the screen in the hash: scroll to it once the page shows.
  useEffect(() => {
    const target = decodeURIComponent(window.location.hash.slice(1));
    if (target) requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ block: 'start' }));
  }, [app.id]);

  return (
    <div className="page examples">
      <header className="page-head">
        <p className="eyebrow">Examples</p>
        <h1>Components in real screens</h1>
        <p className="lede">Seven apps built only from Halo. Click around, switch devices, copy the code.</p>
      </header>

      <div className="examples-bar">
        <Tabs value={app.id} onValueChange={(v) => go(`/examples/${v}`)}>
          <TabList aria-label="Example apps">
            {apps.map((a) => (
              <Tab key={a.id} value={a.id}>{a.name}</Tab>
            ))}
          </TabList>
        </Tabs>
        {!live && <SegmentedControl
          aria-label="Device"
          size="sm"
          value={device}
          onValueChange={(v) => setDevice(v as 'desktop' | 'mobile')}
          options={[
            { value: 'desktop', label: 'Desktop', icon: <Monitor /> },
            { value: 'mobile', label: 'Mobile', icon: <DeviceMobile /> },
          ]}
        />}
      </div>

      {live ? (
        <Viewer key={live.id} app={live} />
      ) : (
        <div className={device === 'mobile' ? 'screens screens-mobile' : 'screens'}>
          {app.screens.map((s) => (
            <ScreenShot key={`${s.id}-${device}`} screen={s} device={device} />
          ))}
        </div>
      )}
    </div>
  );
}
