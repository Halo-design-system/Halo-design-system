// Checks every Storybook story in a real browser: accessibility with axe, and a screenshot compared
// with the approved one. Run after `pnpm build`, which makes storybook-static.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  // One approved screenshot per story, made on Linux in CI (fonts render differently on other systems)
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled', caret: 'hide' },
  },
  use: {
    baseURL: 'http://localhost:6007',
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: 'node tests/serve.mjs',
    url: 'http://localhost:6007/index.json',
    reuseExistingServer: !process.env.CI,
  },
});
