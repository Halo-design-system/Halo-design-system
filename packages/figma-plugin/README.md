# Halo Figma plugin

Lists every Halo component, grouped like the website, with search. Click a component to place it on the canvas. Select a frame first to place it inside the frame.

Components with more than one part, like Input (Input field, Input, Number input and more), show the other parts as chips under the name. Clicking the row places the main part; clicking a chip places that part.

## Where the components come from

The plugin looks in three places, in this order:

1. **This file.** If the file has Halo's component pages (it is Halo, or a copy of it from the Community), the plugin places the component from here. It finds each one by its page and name, so keep the page names as they are.
2. **Your copy of Halo.** Open the plugin in your copy and choose **Use this file**. The plugin remembers that copy's components, for you only. Publish the copy as a library (Assets, then Libraries, then Publish) and add it to the files you design in; the plugin then places components from it in any file.
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
3. Build.

## Publishing the plugin

Before the first Community release, create the plugin in Figma (Plugins, then Development, then New plugin) and copy the id it gives into `manifest.json` in place of `halo-ds`.
