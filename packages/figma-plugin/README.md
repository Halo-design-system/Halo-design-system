# Halo UI, the Figma plugin

Every Halo component as a card, A to Z, showing the component and its name, with a search box on top. Click a card to place the component on the canvas. Select a frame first to place it inside the frame. The window is built with Halo's own React components and follows Figma's light or dark theme.

The pictures are in `previews/` (light) and `previews/dark/` (dark), one PNG per catalog entry, exported from the Figma file with the Semantic collection in each mode. Figma bakes the page colour into an export, so each set is exported on Halo's own surface colour for that mode, which is also the card's background. Their sizes in Figma are in `src/preview-sizes.ts`, so each shows at its real size and shrinks to fit the card.

A footer links to the Halo website; Figma opens it in the browser.

## Works in any file

Figma has no public libraries, so the plugin carries Halo's components with it. Clicking a card looks for the component in this order:

1. **This file**, when it is Halo or a copy of it.
2. **The "Halo components" page** in this file, from an earlier click.
3. **A published Halo library** the person can reach, which keeps the instance linked to it.
4. **The data inside the plugin.** It creates Halo's variables and styles once per file, builds the component's default look on a "Halo components" page, places an instance, then adds the other variants in the background. Only the components someone clicks get all their variants; parts used inside them keep the ones they need. If the plugin closes before that finishes, it carries on the next time the plugin opens in that file.

A file keeps the version it received. On a plan with too few variable modes, a collection keeps its default mode only, and the free plan's page limit puts the components in a section beside the design.

## Updating the component data

When components change in Figma, the plugin needs a new copy of them:

1. Build the plugin (below).
2. In the Figma desktop app, choose Plugins, then Development, then Import plugin from manifest, and pick `dist/export-plugin/manifest.json`.
3. Open the Halo file and run **Halo UI export**. When it finishes, choose **Save** and save the file as `library/halo-library.json.gz`.
4. Build again.

## Build

```bash
pnpm --filter @halo-ds/figma-plugin build
```

This writes `dist/code.js`, `dist/ui.html` and the export plugin in `dist/export-plugin`. The component list comes from `apps/site/src/catalog.ts`; the Figma keys come from `src/library.ts`. The build stops if a catalog entry has no Figma component, or the other way round, so add both together.

To try it, open the Figma desktop app, choose Plugins, then Development, then Import plugin from manifest, and pick `packages/figma-plugin/manifest.json`. Run `pnpm --filter @halo-ds/figma-plugin watch` to rebuild on every change.

## Adding a component

1. Add it to `apps/site/src/catalog.ts`.
2. Add its parts to `src/library.ts`, under the same slug: the Figma page, the name, and the key. Get the key in Figma from the component set (in a plugin or the console, `node.key`).
3. Export its default variant as `previews/<slug>.png` on a white page, and in dark mode as `previews/dark/<slug>.png` on the dark `surface/primary` (2x, or smaller for big components). Add its Figma size to `src/preview-sizes.ts`.
4. Build. It stops if any of these is missing.

## Publishing the plugin

Publish from Plugins, then Manage plugins, in the Figma desktop app. `manifest.json` holds the plugin's Figma ID; keep it the same for every update, or Figma treats it as a separate plugin. The icon (128 by 128) and cover image (1920 by 1080) are added in Figma's publish form, not here.
