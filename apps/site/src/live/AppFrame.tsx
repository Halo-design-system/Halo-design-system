// One screen of a live example app on its own page: inside the Examples preview, or full page from Live preview.
import { useEffect } from 'react';
import { useRoute } from '../router';
import { NavContext } from './kit';
import { liveApps } from './registry';

export function AppFrame({ path }: { path: string }) {
  const { go } = useRoute();
  const [appId, screenId = ''] = path.split('/');
  const app = liveApps.find((a) => a.id === appId);
  const screen = app?.screens.find((s) => s.id === screenId);

  // Follow the site's light or dark mode, also when it changes in the page around the preview
  useEffect(() => {
    const apply = () => {
      let theme = 'light';
      try {
        theme = localStorage.getItem('halo-site-theme') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      } catch {
        // Storage can be blocked; light it is
      }
      document.documentElement.dataset.theme = theme;
    };
    apply();
    window.addEventListener('storage', apply);
    return () => window.removeEventListener('storage', apply);
  }, []);

  // Inside a device frame, scroll without a scrollbar, like a phone
  useEffect(() => {
    if (window.parent !== window) document.documentElement.style.scrollbarWidth = 'none';
  }, []);

  // Tell the Examples page which screen is showing, so its tabs and code follow clicks inside the app
  useEffect(() => {
    if (window.parent !== window) window.parent.postMessage({ type: 'halo-app-screen', app: appId, screen: screenId }, window.location.origin);
    window.scrollTo(0, 0);
  }, [appId, screenId]);

  if (!app) return null;
  const nav = (to: string) => go(`/app-frame/${app.id}/${to}`);
  return (
    <NavContext.Provider value={nav}>
      {screen ? <screen.Screen key={screen.id} /> : <app.Missing page={screenId || app.home} />}
    </NavContext.Provider>
  );
}
