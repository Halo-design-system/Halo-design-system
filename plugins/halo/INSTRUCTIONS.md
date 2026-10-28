## Halo design system

This project builds its UI with Halo (`@halo-ds/react`). Halo is newer than most AI training data, so look components up instead of guessing.

- Look up every component before using it: the Halo MCP tools `find_component` and `get_component`, or `npx halo-ds docs <name>`. Never guess prop names.
- Build from Halo components. Don't rebuild buttons, fields, menus, dialogs or tables from plain HTML, and don't add another UI library.
- Use `var(--halo-...)` tokens for colour, spacing and radius. Never hard-code colours. No drop shadows on cards, panels or dialogs.
- One primary Button per screen. Secondary for the alternative, Destructive for deleting. Premium only for upgrades, never next to a primary.
- Icon-only buttons are `CompactButton` or `Button iconOnly`, with an `aria-label` and a `Tooltip`.
- Forms use the Field versions (`InputField`, `SelectField`, ...) inside `Form`. Headings are plain `h1`/`h2`; `Text` is for body copy.
- Words: sentence case, a verb on every button ("Save changes", not "OK"), no em dashes.
- Halo needs no CSS or font imports. Mode is `data-theme` on the html element: `light`, `dark` or `system`.
- Before finishing, check light and dark mode and widths from 375 to 1440.
