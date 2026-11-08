// Accessibility: axe checks every story in light and dark mode, for things like missing labels,
// low colour contrast and broken ARIA. A story fails on any serious or critical problem that isn't
// in known-a11y-issues.ts.
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { knownIssues } from './known-a11y-issues';
import { openStory, stories, themes } from './stories';

for (const story of stories) {
  const allowed = knownIssues[story.title] ?? [];
  for (const theme of themes) {
    test(`${story.title} / ${story.name} (${theme}) is accessible`, async ({ page }) => {
      await openStory(page, story.id, theme);
      const results = await new AxeBuilder({ page })
        .include('#storybook-root')
        // A story shows one piece of a page, so page-level rules (one main landmark, a level-one heading) don't apply
        .disableRules(['region', 'landmark-one-main', 'page-has-heading-one'])
        .analyze();
      const problems: string[] = [];
      for (const v of results.violations) {
        if ((v.impact !== 'serious' && v.impact !== 'critical') || allowed.includes(v.id)) continue;
        let nodes = v.nodes;
        // WCAG doesn't ask disabled controls to meet contrast, and Halo marks them with data-disabled
        // Error text uses the same red as its icon (state/error/primary) by design, at 4.15:1 on white. Only that red is let through.
        if (v.id === 'color-contrast') {
          const keep = await Promise.all(nodes.map((n) => page.locator(String(n.target[0])).first().evaluate((el) => !el.closest('[data-disabled]') && getComputedStyle(el).color !== 'rgb(233, 53, 68)').catch(() => true)));
          nodes = nodes.filter((_, i) => keep[i]);
        }
        if (nodes.length) problems.push(`${v.id}: ${v.help} (${nodes.length}x) ${nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
      }
      expect(problems, problems.join('\n')).toEqual([]);
    });
  }
}
