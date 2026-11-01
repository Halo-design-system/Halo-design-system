# Halo UI, the Figma plugin

Every Halo component as a card, A to Z, showing the component and its name, with a search box on top. Click a card to place the component on the canvas. Select a frame first to place it inside the frame. The window is built with Halo's own React components and follows Figma's light or dark theme.

The pictures are in `previews/` (light) and `previews/dark/` (dark), one PNG per catalog entry, exported from the Figma file with the Semantic collection in each mode. Figma bakes the page colour into an export, so each set is exported on Halo's own surface colour for that mode, which is also the card's background. Their sizes in Figma are in `src/preview-sizes.ts`, so each shows at its real size and shrinks to fit the card.

A footer links to the Halo website; Figma opens it in the browser.

## Where the components come from

The plugin looks in three places, in this order:

1. **This file.** If the file has Halo's component pages (it is Halo, or a copy of it from the Community), the plugin places the component from here. It finds each one by its page and name, so keep the page names as they are.
2. **Your copy of Halo.** Open the plugin once in your copy and it remembers that copy's components, for you only. Publish the copy as a library (Assets, then Libraries, then Publish) and add it to the files you design in; the plugin then places components from it in any file.
3. **The Halo library**, for people in the team where the original file is published.

If none of these has the component, the plugin says so and how to add the library.

## Build

```bash
pnpm --filter @halo-ds/figma-plugin build
```

This writes `dist/code.js` and `dist/ui.html`. The component list comes from `apps/site/src/catalog.ts`; the Figma keys come from `src/library.ts`. The build stops if a catalog entry has no Figma component, or the other way round, so add both together.

To try it, open the Figma desktop app, choose Plugins, then Development, then Import plugin from manifest, and pick `packages/figma-plugin/manifest.json`. Run `pnpm --filter @halo-ds/figma-plugin watch` to rebuild on every change.

## Adding a component

1. Add it to `apps/site/src/catalog.ts`.
2. Add its parts to `src/library.ts`, under the same slug: the Figma page, the name, and the key. Get the key in Figma from the component set (in a plugin or the console, `node.key`).
3. Export its default variant as `previews/<slug>.png` on a white page, and in dark mode as `previews/dark/<slug>.png` on the dark `surface/primary` (2x, or smaller for big components). Add its Figma size to `src/preview-sizes.ts`.
4. Build. It stops if any of these is missing.

## Publishing the plugin

Before the first Community release, create the plugin in Figma (Plugins, then Development, then New plugin) and copy the id it gives into `manifest.json` in place of `halo-ds`. The icon (128 by 128) and cover image (1920 by 1080) are added in Figma's publish form, not here.
