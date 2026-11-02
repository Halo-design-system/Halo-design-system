// The example apps that run live on the site, and the source of every file, for the Code view.
import type { ComponentType } from 'react';
import { banking } from './banking';
import { saas } from './saas';
import { salesCrm } from './sales-crm';

export interface LiveApp {
  id: string;
  name: string;
  /** The made-up address shown in the browser bar. */
  host: string;
  home: string;
  screens: { id: string; name: string; file: string; Screen: ComponentType }[];
  shared: string[];
  /** Shown for menu pages the example doesn't have. */
  Missing: ComponentType<{ page: string }>;
}

export const liveApps: LiveApp[] = [saas, banking, salesCrm];

const sources = import.meta.glob(['./*/*.{tsx,ts,css}', './shared/*.{tsx,css}', './kit.tsx'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

/** The text of one of an app's files, like sourceOf('saas', 'Overview.tsx'). Paths with a slash are from the live folder, like 'shared/AppShell.tsx'. */
export const sourceOf = (app: string, file: string) => sources[file.includes('/') || file === 'kit.tsx' ? `./${file}` : `./${app}/${file}`] ?? '';

/** The address of a screen on its own, without the site around it. */
export const frameUrl = (app: string, screen: string) => `${import.meta.env.BASE_URL}app-frame/${app}/${screen}`;
