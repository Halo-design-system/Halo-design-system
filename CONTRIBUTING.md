# Contributing to Halo

Thanks for helping! Halo welcomes contributions from designers and developers.

## Ground rules

- **Tokens, not values.** Components use semantic tokens (`--halo-surface-primary`, `--halo-text-secondary`), never hex codes or primitive colors. This is what makes dark mode work.
- **Figma is the source of truth for tokens.** Don't hand-edit `packages/tokens/figma/*.json` or anything in `dist/`. Change the variable in Figma and re-export.
- **Accessible by default.** Text meets WCAG AA contrast (4.5:1), interactive elements are keyboard-usable with a visible focus ring (`--halo-border-focus`), and Storybook's Accessibility panel shows no violations.
- **Both themes.** Check every change in light and dark mode using the Storybook toolbar.

## For designers

- Use the Halo Figma library's variables for every fill, stroke, radius and spacing value.
- Name component variants and properties the way they'll appear in code (e.g. `variant=primary`, `size=md`, `state=disabled`).
- To propose a new token or component, open an issue with a Figma link and a short description of the use case.

## For developers

```bash
pnpm install
pnpm dev        # Storybook at http://localhost:6006
```

Adding a component:

```
packages/react/src/components/Button/
  Button.tsx
  Button.module.css
  Button.stories.tsx
  index.ts
```

Then export it from `packages/react/src/index.ts`.

## Automatic checks

Every push and pull request runs the **Checks** workflow on GitHub: it builds everything, checks the types, then opens every Storybook story in light and dark mode to check accessibility (with axe) and compare a screenshot with the approved one.

- **Run them yourself** after `pnpm build`: `pnpm --filter docs test:a11y` and `pnpm --filter docs test:visual`. Screenshots are approved on Linux, so the visual check is most reliable on GitHub.
- **Meant to change how something looks?** Run the **Update screenshots** workflow from the Actions tab. It takes new screenshots and commits them as the approved ones.
- **Accessibility problems** found when the checks were switched on are listed in `apps/docs/tests/known-a11y-issues.ts`. Anything not on that list fails. Fix them and delete the line; the list should only get shorter.

## Updating tokens from Figma

See [packages/tokens/README.md](packages/tokens/README.md).

## Figma Dev Mode and Code Connect

Every component set in the Figma file has a link to its Storybook page and a line like `React: import { Button } from "@halo-ds/react";` in its description, so developers inspecting a design in Dev Mode can find the code on any Figma plan.

[Code Connect](https://developers.figma.com/docs/code-connect/) goes further: Dev Mode shows a ready-to-paste React snippet with the props set from the selected variant. The mappings live in `packages/react/figma/*.figma.tsx`. Button, Compact button, Badge, Tag, Alert and Input field map their Figma properties to props; the rest link the component and show a basic example. Publishing needs a Dev or Full seat on a Figma Organization or Enterprise plan. With that, from `packages/react`:

```bash
npx @figma/code-connect connect publish --token <your Figma access token>
```

When you add a Figma property or a component, update its `.figma.tsx` file in the same change.

## Releasing to npm

Halo publishes two packages, `@halo-ds/tokens` and `@halo-ds/react`, under the `halo-ds` npm organisation.

One-time setup:

1. Create an npm account at [npmjs.com](https://www.npmjs.com) and turn on two-factor authentication.
2. Create a free organisation named `halo-ds` (Add Organization in your npm profile). The `@halo-ds/` names only work once you own it.
3. Sign in from the terminal: `npm login`. Run it from your home folder, not inside this repository: the repository asks for Node 24, so `npm` commands run inside it stop with `EBADDEVENGINES` on older Node versions (pnpm downloads Node 24 for you, so `pnpm` commands are fine). The sign-in is saved for your whole computer. Check it worked with `npm whoami`.

Releases are batched. Pushing to `main` only updates Storybook; nothing goes to npm until someone runs `pnpm release`. Add each change to the **Unreleased** section of [CHANGELOG.md](CHANGELOG.md) as you make it, and release when there is a worthwhile batch, such as a few new components, a breaking change, or a fix people are waiting for.

Each release:

1. In `CHANGELOG.md`, rename **Unreleased** to the new version and add a fresh empty **Unreleased** section above it.
2. Set the same new version in `packages/tokens/package.json`, `packages/react/package.json` and `packages/cli/package.json` (for example `0.1.0`, then `0.1.1` for fixes and `0.2.0` for new components). Also set it in the plugin: `version` in `plugins/halo-ds/.claude-plugin/plugin.json`, the `halo-ds@` version in `plugins/halo-ds/.mcp.json` and `plugins/halo-ds/README.md` (the plugin directory needs an exact version, not `@latest`), and both `version` fields in `server.json`.
3. Check what would be published, without publishing:

   ```bash
   pnpm release:check
   ```

4. Publish both packages:

   ```bash
   pnpm release
   ```

   pnpm swaps the internal `workspace:*` link for the real version number, so `@halo-ds/react` depends on the matching `@halo-ds/tokens`.

5. Pin the plugin to the new package. Set the version in `plugins/halo-ds/package.json` (both fields), then refresh its lockfile, which records the published package's hash. Claude's plugin directory holds plugins that run `npx` without one.

   ```bash
   cd plugins/halo-ds && npm install --package-lock-only --ignore-scripts
   ```

6. Tag the release in git: `git tag v0.1.0 && git push --tags`.
7. The MCP Registry listing updates by itself: pushing the version tag runs the **Publish to the MCP Registry** workflow, which reads `server.json` and signs in through GitHub. Run it from the Actions tab if the tag went out before npm finished. The `mcpName` in `packages/cli/package.json` must match the `name` in `server.json`.
8. The Claude Code plugin is published from its own repository, [Halo-design-system/halo-claude-plugin](https://github.com/Halo-design-system/halo-claude-plugin), so Claude's plugin directory can list it (this repository's build settings would block it). Edit it here in `plugins/halo-ds`; that repository's **Sync** workflow copies it from the newest version tag once a day. Run Sync from its Actions tab to copy it straight away.

