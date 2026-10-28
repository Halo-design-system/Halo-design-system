# Before you finish

Run through this on every screen you built or changed. Fix what you find, then run it again.

## Searches to run

Run these on the files you changed (adjust `src`). Each hit needs a look; not every hit is wrong.

```bash
# Hard-coded colours: use var(--halo-...) tokens instead
grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(" src --include=*.tsx --include=*.ts --include=*.css

# Drop shadows: Halo uses borders and its Overlay
grep -rn "box-shadow\|boxShadow" src

# Plain HTML controls where a Halo component exists
grep -rnE "<(button|input|select|textarea|dialog)\b" src --include=*.tsx

# Imports Halo doesn't need
grep -rnE "@halo-ds/react/styles.css|@halo-ds/tokens/css|@fontsource/geist" src

# Icon-only buttons: each needs an aria-label
grep -rnE "<CompactButton|iconOnly" src --include=*.tsx
```

## Then check by eye

- [ ] Every component and prop exists (checked with `get_component` or `npx halo-ds docs`).
- [ ] One primary Button per screen. Premium only for upgrades, never next to a primary.
- [ ] Spacing uses tokens, and left and right padding are equal.
- [ ] Every field has a label; every icon-only button has an `aria-label` and a Tooltip.
- [ ] Headings go in order: one `h1`, then `h2`.
- [ ] Words follow `copy.md`: verbs on buttons, sentence case, no em dashes.
- [ ] It works in light and dark mode: switch `data-theme` and look.
- [ ] It works at 375, 768, 1024 and 1440 wide, with nothing scrolling sideways.
- [ ] Empty, loading and error states exist where data can be missing or slow.
- [ ] `useToast` has a `ToastProvider` above it.
