# @halo-ds/react

React components for the Halo design system, with light and dark mode, built on the `@halo-ds/tokens` CSS variables.

```bash
npm install @halo-ds/react
```

That is all the setup: the styles, the design tokens and the Geist font load by themselves when you use a component. Or set up a project in one step, with dark mode and your brand colour, using the CLI: `npx halo-ds init`.

Then use the components:

```tsx
import { Button, Modal, EmptyState, Illustration } from '@halo-ds/react';

export function Projects() {
  return (
    <EmptyState
      media={<Illustration name="no-projects" />}
      title="Start your first project"
      description="Projects keep your files, tasks and people in one place."
      actions={<Button>Create project</Button>}
    />
  );
}
```

Set `data-theme` on `<html>` to `light`, `dark` or `system`.

## Your brand

Override the brand variables in your own CSS, loaded after Halo's:

```css
:root {
  --halo-button-primary: #2f6bff;
  --halo-surface-brand-contrast: #1f5fe0;
  --halo-text-brand: #1a4cc2;
  --halo-font-family-body: 'Inter', system-ui, sans-serif;
  --halo-font-family-label: 'Inter', system-ui, sans-serif;
}
```

The Theming page in the [docs](https://halo-design-system.github.io/Halo-design-system/) lists every brand variable and shows how to rebrand from Figma.

## Docs

Every component, with live examples and props: https://halo-design-system.github.io/Halo-design-system/

## License

MIT
