---
name: build-ui
description: Build React screens and components with the Halo design system (@halo-ds/react). Use when the project depends on @halo-ds/react, or the user asks to build UI "with Halo", for pages, forms, dashboards, settings, dialogs or any interface work.
---

# Build UI with Halo

Halo is a React design system: `@halo-ds/react`. It is newer than most training data, so never guess component names or props. Look them up first.

## Workflow

1. **Check the setup.** If `@halo-ds/react` is not in package.json, run `npx halo-ds init` (add `--yes` to skip questions). Halo needs no CSS or font imports. Light, dark or system mode comes from `data-theme` on the html element.
2. **Plan by job.** List what the screen must do (collect an email, confirm a delete, show a status) and pick a component for each job with `references/components.md`.
3. **Look up every component** before using it. With the Halo MCP server: `get_component` for its import, props and examples, `find_component` when unsure, `get_tokens` for values. Without it: `npx halo-ds docs <name>`.
4. **Build** with the rules below and the topic files.
5. **Check** with `references/checklist.md` before you say it's done.

## Topic files

Read the ones the task needs:

| File | When |
| --- | --- |
| `references/components.md` | Choosing the right component for a job |
| `references/design.md` | Colour, surfaces, spacing, radius, type |
| `references/layout.md` | Page structure, breakpoints, phones |
| `references/copy.md` | Button labels, errors, empty states, any words on screen |
| `references/accessibility.md` | Labels, keyboard, focus, screen readers |
| `references/checklist.md` | The review before finishing, with searches to run |
| `examples/settings-page.md` | A worked account settings page |
| `examples/dashboard.md` | A worked dashboard with stats, a chart and a table |

## Rules

- Build from Halo components. Don't rebuild buttons, fields, menus, dialogs or tables from plain HTML, and don't add another UI library alongside.
- Use tokens for colour, spacing and radius: `var(--halo-spacing-7)`, `var(--halo-text-secondary)`. Never hard-code hex colours.
- One primary Button per screen, for the main action. Secondary for the alternative, Ghost for quiet actions, Destructive for deleting. Premium only for upgrades, never next to a primary Button.
- The brand colour is for the main action. Charts, stats and decorative tiles stay neutral.
- Clickable icons are `CompactButton` (or `Button iconOnly`) with an `aria-label`, plus a `Tooltip` with the same words.
- In forms, use the Field versions (`InputField`, `SelectField`, ...) inside `Form`.
- No drop shadows on cards, panels, dialogs or drawers. Halo uses borders, and its Overlay behind dialogs.

## Quick decisions

- A status people only read: **Badge**. Something people can remove: **Tag**.
- A message that stays until dealt with: **Alert**. A confirmation that disappears: **Toast**. A question that must be answered: **Modal**.
- Pick one from 2 to 5 options in a form: **RadioGroup**. A long list: **SelectField**. Search or several: **Combobox**.
- A setting that applies straight away: **Switch**. A choice sent with a form: **Checkbox**.
- Change how the same content is shown: **SegmentedControl**. Different sections of a page: **Tabs**.
