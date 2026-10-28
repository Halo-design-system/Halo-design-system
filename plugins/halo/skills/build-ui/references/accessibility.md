# Accessibility

Halo components handle focus, keyboard use and screen-reader roles inside themselves. These are the parts that depend on how you use them.

## Names and labels

- Every field has a visible label. Use the Field versions (`InputField`, `SelectField`, ...); a placeholder is not a label.
- Icon-only buttons (`CompactButton`, `Button iconOnly`) need an `aria-label` that says the action: "Delete file", not "Trash". Add a `Tooltip` with the same words.
- Groups of checkboxes or radios go in `CheckboxGroup` or `RadioGroup` with a `label`.
- Navigation landmarks, tab lists and tables need a name: `aria-label` on `Sidebar`, `TabList`, `Menu`, `Carousel`, `Tree`; a `caption` on `Table`.

## Structure

- One `h1` per page, then `h2` for sections, in order. Headings are plain `h1` and `h2` elements styled with Halo's type tokens (see design.md).
- Use buttons for actions and links for going somewhere: `LinkButton` with `href` for links.

## Meaning

- Never show meaning by colour alone. A status Badge has a word; an error has a message and an icon.
- Error messages go through the field's `error` prop, so they're announced and linked to the field.

## Keyboard

- Everything clickable must be reachable with Tab and work with Enter or Space. Halo components do; custom clickable elements must too, so prefer Halo components.
- Don't remove focus rings. Halo shows them for keyboard users only.
- Dialogs (`Modal`, `Drawer`) move focus in and back out by themselves. Give them a `title`.

## Motion

Halo respects reduced motion. Don't add your own animations without a `prefers-reduced-motion` check.

## Images

Decorative images get `alt=""`. Images that carry meaning get an `alt` that says what matters about them.
