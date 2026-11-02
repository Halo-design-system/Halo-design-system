# Launch video

The Halo launch video, made with [Remotion](https://www.remotion.dev) from the real components and blocks, so it always shows what the package does today.

```bash
pnpm --filter video studio   # preview and scrub through it in the browser
pnpm --filter video render   # write out/halo-launch.mp4
node scripts/stills.mjs 70 520   # from apps/video: save single frames to out/stills
```

Each scene is a file in `src/scenes`, with its length in frames at 30 frames a second. `src/Launch.tsx` puts them in order.

Remotion is free for individuals and companies of up to three people. Larger companies need a [company license](https://www.remotion.dev/license).
