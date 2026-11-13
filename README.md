<picture>
  <source media="(prefers-color-scheme: dark)" srcset="apps/docs/public/logo-dark.svg">
  <img alt="Halo Design System" src="apps/docs/public/logo.svg" height="48">
</picture>

# Halo Design System

An open-source design system for designers and developers: a Figma library and a React component library built from the same design tokens, with light and dark mode.

**📖 Website and docs: https://halo-design-system.github.io/Halo-design-system/**

**🧪 Component playground (Storybook): https://halo-design-system.github.io/Halo-design-system/storybook/**

- **56 components** in Figma and React, with 2,125 Figma variants
- **288 design tokens** and 42 text styles, in light and dark
- **1,512 icons, 100 illustrations**, 3,719 emojis, 271 flags and 1,489 brand logos
- **8 ready-made blocks** and **7 example apps** you can click through on the site
- **An MCP server, a CLI and a Claude Code plugin**, so AI assistants build with Halo correctly

Free and open source under the MIT licence. Current version: 0.6.0 on [npm](https://www.npmjs.com/package/@halo-ds/react).

## Packages

| Package | Description |
| --- | --- |
| [`@halo-ds/tokens`](packages/tokens) | Design tokens as CSS variables (light + dark), JSON and JS, generated from Figma |
| [`@halo-ds/react`](packages/react) | React components |
| [`halo-ds`](packages/cli) | CLI and MCP server: `npx halo-ds init`, `theme`, `add`, `docs` and `mcp` |
| [`figma-plugin`](packages/figma-plugin) | Figma plugin: search every component and place it on the canvas |
| [`halo-ds` plugin](plugins/halo-ds) | Claude Code plugin: skills to build, review, theme and migrate UI |
| [`site`](apps/site) | The website: docs, components, foundations and the live example apps |
| [`docs`](apps/docs) | Storybook: live documentation and component playground |

## Using Halo

```bash
npx halo-ds init
```

This installs Halo and asks for the mode and a brand colour. Or install it yourself:

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

- **Quick:** run `npx halo-ds theme "#2F6BFF"` with your brand colour, or pick one on the website. It sets your brand colour in light and dark. No rebuild needed.
- **Full:** change the variables in your copy of the Figma file, export them, and rebuild the tokens so design and code match.

The [Theming](https://halo-design-system.github.io/Halo-design-system/docs/theming) page walks through both.

## Use it with AI assistants

Add the MCP server so your assistant knows every component's props, examples and rules:

```bash
claude mcp add halo -- npx -y halo-ds mcp
```

Setup for Cursor, VS Code, Windsurf and others: https://halo-design-system.github.io/Halo-design-system/docs/ai

## Working on Halo

Requirements: [Node.js](https://nodejs.org) 22.12+ and [pnpm](https://pnpm.io) (`npm install -g pnpm`). The project pins its own Node 24 runtime, which pnpm downloads automatically.

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
  cli/        the halo-ds CLI and MCP server
  figma-plugin/
plugins/
  halo-ds/    the Claude Code plugin
apps/
  site/       the website, with the live example apps in src/live
  docs/       Storybook (foundations pages + component stories)
  video/      the launch video (Remotion)
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
