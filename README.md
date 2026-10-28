<picture>
  <source media="(prefers-color-scheme: dark)" srcset="apps/docs/public/logo-dark.svg">
  <img alt="Halo Design System" src="apps/docs/public/logo.svg" height="48">
</picture>

# Halo Design System

An open-source design system for designers and developers: a Figma library and a React component library built from the same design tokens, with light and dark mode.

**📖 Docs & component playground: https://chidindu06f.github.io/Halo-design-system/**

> **Status:** early development. Foundations, 44 components, 40 illustrations and 20 awards are in place, in Figma and React. Not yet published to npm.

## Packages

| Package | Description |
| --- | --- |
| [`@halo-ds/tokens`](packages/tokens) | Design tokens as CSS variables (light + dark), JSON and JS, generated from Figma |
| [`@halo-ds/react`](packages/react) | React components |
| [`docs`](apps/docs) | Storybook: live documentation and component playground |

## Using Halo

```bash
npm install @halo-ds/react
```

That is all the setup: the styles, the design tokens and the Geist font load by themselves when you use a component.

```tsx
import { Button } from '@halo-ds/react';
```

Switch themes with the `data-theme` attribute on `<html>`: `light` (default), `dark`, or `system` (follows the OS).

Every token is a CSS variable starting with `--halo-`, so your own styles can use them too:

```css
.card {
  background: var(--halo-surface-primary);
  color: var(--halo-text-primary);
  padding: var(--halo-spacing-md);
  border-radius: var(--halo-radius-sm);
}
```

### Make it yours

- **Quick:** override a few brand variables in your own CSS, loaded after Halo's. No rebuild needed.
- **Full:** change the variables in your copy of the Figma file, export them, and rebuild the tokens so design and code match.

The **Theming** page in [Storybook](https://chidindu06f.github.io/Halo-design-system/) walks through both, with a live example.

## Working on Halo

Requirements: [Node.js](https://nodejs.org) 20+ and [pnpm](https://pnpm.io) (`npm install -g pnpm`). The project pins its own Node 24 runtime, which pnpm downloads automatically.

```bash
pnpm install     # install dependencies
pnpm dev         # build tokens and start Storybook at http://localhost:6006
pnpm build       # build every package
pnpm typecheck   # type-check every package
```

### Project structure

```
packages/
  tokens/     figma/ ← Figma variable exports (source of truth)
              scripts/build.mjs → dist/tokens.css, tokens.json, index.js
  react/      src/ ← components
apps/
  docs/       Storybook (foundations pages + component stories)
docs/         design notes (e.g. dark-mode mapping)
```

### Design → code workflow

1. Design the component in Figma using Halo variables (never raw hex values).
2. Build it in `packages/react/src/components/<Name>/` using the matching CSS variables.
3. Add a `<Name>.stories.tsx` so it appears in Storybook.
4. Review it in Storybook in both light and dark mode.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE). The Figma library also includes emojis, icons, flags and brand logos from other open-source projects; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for their licences and required credits.
