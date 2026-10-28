# Colour, surfaces, spacing and type

Every value is a CSS variable starting with `--halo-`. Look up exact values with the MCP tool `get_tokens`. All of these change for dark mode by themselves, so never hard-code a colour.

## Colour

**Surfaces** (backgrounds)
- `--halo-surface-primary`: the page and cards
- `--halo-surface-minimal`: a slightly different area, like a sidebar or a section band
- `--halo-surface-secondary`: neutral fills, like hover backgrounds and tiles
- `--halo-surface-brand`, `--halo-surface-brand-secondary`: soft brand tints, used sparingly

**Text**
- `--halo-text-primary`: titles and main text
- `--halo-text-contrast`: descriptions under a title
- `--halo-text-secondary`: captions, dates, metadata
- `--halo-text-brand`: brand-coloured text, used sparingly
- `--halo-text-disabled`: disabled text

**Borders**
- `--halo-border-primary`: dividers between rows and sections
- `--halo-border-secondary`: the outline of cards, fields and panels
- `--halo-border-strong`: a border that needs to stand out

**Status colours** come with the components: use `Badge`, `Alert` and `Toast` with `success`, `warning`, `error` or `information` rather than colouring things yourself.

## Using colour well

- The brand colour (purple by default) is for the main action on a screen. Don't use it for decoration, charts, stats or icons.
- Keep charts neutral: the chart components choose their own colours.
- Meaning never comes from colour alone: a status also has words or an icon.

## Spacing

Gaps and padding use the spacing scale. The numbers are pixels:

| Token | px | Token | px |
| --- | --- | --- | --- |
| `--halo-spacing-1` | 2 | `--halo-spacing-8` | 20 |
| `--halo-spacing-2` | 4 | `--halo-spacing-9` | 24 |
| `--halo-spacing-3` | 6 | `--halo-spacing-10` | 40 |
| `--halo-spacing-4` | 8 | `--halo-spacing-11` | 60 |
| `--halo-spacing-5` | 10 | `--halo-spacing-12` | 80 |
| `--halo-spacing-6` | 12 | `--halo-spacing-13` | 120 |
| `--halo-spacing-7` | 16 | | |

A good default: 8 to 12 between related items, 16 to 24 inside cards and between fields, 40 between page sections. Keep left and right padding equal.

## Corners

`--halo-radius-4` (8px) for small items, `--halo-radius-6` (16px) for cards and panels, `--halo-radius-10` (fully round) for pills. Components already have the right corners; only your own layout boxes need these.

## Surfaces, not shadows

Separate things with surfaces and borders: a card is `--halo-surface-primary` with a `--halo-border-secondary` border. Don't add drop shadows to cards, panels, dialogs or drawers. Dialogs get Halo's Overlay behind them.

## Type

Use the `Text` component for body text: `size` sm, md or lg; `weight` regular or semibold; `color` primary, contrast or secondary. It renders a `p` by default; `as` can make it a `span`, `div`, `label` or `small`.

Text is for body copy, not headings. Write headings as plain `h1` and `h2` with Halo's type tokens:

```css
h1 { margin: 0; font: var(--halo-font-weight-semibold) var(--halo-font-size-3xl)/var(--halo-line-height-3xl) var(--halo-font-family-heading); }
h2 { margin: 0; font: var(--halo-font-weight-semibold) var(--halo-font-size-xl)/var(--halo-line-height-xl) var(--halo-font-family-heading); }
```

The font is Geist and loads by itself.
