// The stories to check, read from the built Storybook's index.
import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';

interface Entry {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
  tags?: string[];
}

const index = JSON.parse(readFileSync(new URL('../storybook-static/index.json', import.meta.url), 'utf8')) as { entries: Record<string, Entry> };

/** Every story, except ones tagged `skip-test` in their file. */
export const stories = Object.values(index.entries).filter((e) => e.type === 'story' && !e.tags?.includes('skip-test'));

export const themes = ['light', 'dark'] as const;

/** Opens one story on its own, in light or dark mode, and waits until it has drawn. */
export async function openStory(page: Page, id: string, theme: (typeof themes)[number]) {
  // The same moment every run, so things that show "now", like the calendar's current-time line, don't move
  await page.clock.setFixedTime(new Date('2026-11-02T10:30:00'));
  // Storybook's theme switch sets data-theme itself, so ask it for the mode rather than setting it after
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme === 'dark' ? 'Dark' : 'Light'}`);
  await page.waitForSelector('#storybook-root > *', { state: 'attached' });
  await page.waitForFunction((t) => document.documentElement.dataset.theme === t, theme);
  await page.evaluate(() => document.fonts.ready);
  // Let entrance transitions and the theme switch settle
  await page.waitForTimeout(200);
}
