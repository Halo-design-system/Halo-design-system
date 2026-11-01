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
      const problems = results.violations
        .filter((v) => (v.impact === 'serious' || v.impact === 'critical') && !allowed.includes(v.id))
        .map((v) => `${v.id}: ${v.help} (${v.nodes.length}x) ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
      expect(problems, problems.join('\n')).toEqual([]);
    });
  }
}
