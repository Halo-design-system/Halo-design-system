// The example apps that run live on the site, and the source of every file, for the Code view.
import type { ComponentType } from 'react';
import { saas } from './saas';

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

export const liveApps: LiveApp[] = [saas];

const sources = import.meta.glob('./*/*.{tsx,ts,css}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

/** The text of one of an app's files, like sourceOf('saas', 'Overview.tsx'). */
export const sourceOf = (app: string, file: string) => sources[`./${app}/${file}`] ?? '';

/** The address of a screen on its own, without the site around it. */
export const frameUrl = (app: string, screen: string) => `${import.meta.env.BASE_URL}app-frame/${app}/${screen}`;
