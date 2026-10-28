---
name: build-ui
description: Build React screens and components with the Halo design system (@halo-ds/react). Use when the project depends on @halo-ds/react, or the user asks to build UI "with Halo", for pages, forms, dashboards, settings, dialogs or any interface work.
---

# Build UI with Halo

Halo is a React design system: `@halo-ds/react`. It is newer than most training data, so never guess component names or props. Look them up first.

## 1. Check the setup

- If `@halo-ds/react` is not in package.json, run `npx halo-ds init` (it installs Halo, sets the mode and can apply a brand colour). Use `npx halo-ds init --yes` when the user doesn't want questions.
- Halo needs no CSS or font imports. Don't add `@halo-ds/react/styles.css` or font imports.
- Light, dark or system mode comes from `data-theme` on the html element.

## 2. Look things up before writing code

Use the Halo MCP tools when they are available:

1. `get_setup_and_rules` once, at the start.
2. `find_component` with what the UI needs, for example "pick a date range".
3. `get_component` for each component you use: import line, every prop, examples, and when to use it.
4. `get_tokens` for colours, spacing and radius.

Without the MCP tools, run `npx halo-ds docs` to list components and `npx halo-ds docs <name>` for one.

## 3. Build

- Compose screens from Halo components. Don't rebuild buttons, fields, menus, dialogs or tables from plain HTML, and don't add another UI library alongside.
- Style layout and gaps with tokens: `var(--halo-spacing-6)`, `var(--halo-surface-primary)`, `var(--halo-text-secondary)`. Never hard-code hex colours.
- One primary Button per screen, for the main action. Secondary for the alternative, Ghost for quiet actions, Destructive for deleting. Premium only for upgrades, never next to a primary Button.
- Purple (the brand colour) is for the main action. Keep charts, stats and decorative tiles neutral.
- Clickable icons are `CompactButton` (or `Button iconOnly`) with an `aria-label`, plus a `Tooltip` with the same words.
- In forms, use the Field versions (`InputField`, `SelectField`, `TextareaField`, ...) and wrap them in `Form` for required checks and errors.
- Toasts need `<ToastProvider>` once at the root, then `useToast()`.
- No drop shadows on cards, panels, dialogs or drawers; Halo uses borders and its Overlay.
- Pick components by meaning, not looks: Badge shows a status, Tag is something people can remove; Alert stays in the page, Toast confirms and disappears, Modal must be answered. `get_component` explains each choice.

## 4. Before you finish

- Every import comes from `@halo-ds/react` and every prop exists (checked with `get_component`).
- No hard-coded colours or shadows; spacing uses tokens.
- One primary Button on the screen.
- Icon-only buttons have an `aria-label`.
- It works in light and dark mode: nothing assumes a white background.
