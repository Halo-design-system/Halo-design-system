// Visual: a screenshot of every story in light and dark mode, compared with the approved one in
// tests/__screenshots__. A change in how a component looks fails the check until it is approved
// by updating the screenshots (the "Update screenshots" workflow on GitHub).
import { expect, test } from '@playwright/test';
import { openStory, stories, themes } from './stories';

for (const story of stories) {
  for (const theme of themes) {
    test(`${story.title} / ${story.name} (${theme}) looks the same`, async ({ page }) => {
      await openStory(page, story.id, theme);
      await expect(page.locator('#storybook-root')).toHaveScreenshot(`${story.id}-${theme}.png`);
    });
  }
}
