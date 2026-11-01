# Page structure and screen sizes

## Breakpoints

| Name | From | Columns | Gutter | Page margin |
| --- | --- | --- | --- | --- |
| Mobile | 0 | 4 | 16px | 16px |
| Tablet | 600px | 8 | 24px | 24px |
| Desktop | 1024px | 12 | 24px | 40px |
| Wide | 1440px | 12 | 24px | 80px |

The current values are CSS variables, so a layout can follow them: `--halo-grid-columns`, `--halo-grid-gutter`, `--halo-grid-margin`.

## App pages

- Desktop: a `Sidebar` on the left (it can collapse to icons) and the page on the right. Or a `TopBar` for apps with a few sections.
- Phones: a `TopBar` with the menu button and actions only; the logo and the links live in the menu `Drawer` it opens.
- Start each page with its title, an optional line under it, and the page's main action on the right. `Breadcrumbs` go above the title on pages two or more levels deep.
- Put content in sections with clear headings, separated by space (`--halo-spacing-10`) rather than lines.

## On phones

- Stack columns; side-by-side fields (`FormRow`) stack by themselves.
- Tables with many columns become a `List` of rows on phones.
- A horizontal `Stepper` switches to its compact form under 600px by itself.
- `Drawer` with `side="bottom"` makes a bottom sheet.
- Make tap targets at least 40px tall; Halo's medium and large controls already are.

## Check these widths

375 (phone), 768 (tablet), 1024 (laptop) and 1440 (desktop). Nothing should scroll sideways except a table or code inside its own box.
