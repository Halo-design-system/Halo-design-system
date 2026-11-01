---
name: review-ui
description: Review React code that uses the Halo design system (@halo-ds/react) against Halo's rules, and list what to fix. Use when the user asks to review, audit or check UI code, a page or a pull request in a project that uses Halo.
---

# Review UI against Halo's rules

Read the files the user points at (or the changed files), check them against the list below, then report. Use the Halo MCP tool `get_component` to confirm props; without it, `npx halo-ds docs <name>`.

## What to check

**Uses Halo, not look-alikes**
- Plain `<button>`, `<input>`, `<select>`, `<dialog>` or hand-built menus, tabs or tables where a Halo component exists.
- Components from another UI library mixed in.
- Props that don't exist on the Halo component (check with `get_component`; never assume).

**Tokens, not hard-coded values**
- Hex, `rgb()` or named colours in styles: replace with `var(--halo-...)` (look them up with `get_tokens`).
- Pixel spacing and radius in layout styles where a spacing or radius token fits.
- `box-shadow` on cards, panels, dialogs or drawers: Halo uses borders, not shadows. (Focus rings and Toast are fine.)

**Buttons**
- More than one primary Button on a screen.
- Premium used for everyday actions, or next to a primary Button.
- Destructive styling on actions that are easy to undo.

**Accessibility**
- Icon-only buttons without an `aria-label`; clickable bare icons (should be `CompactButton`).
- Fields without a visible label (a placeholder is not a label).
- Meaning shown by colour alone.

**Picking the right component**
- Badge used for something people can remove (that's a Tag), Toast used for an error people must fix (that's an Alert), Modal used for a message that needs no answer.

**Setup**
- Imports of `@halo-ds/react/styles.css` or fonts (not needed), a missing `ToastProvider` around `useToast`, or no `data-theme` when the app has dark mode.

## Report

Group findings by how much they matter: must fix (broken, inaccessible), should fix (breaks the rules), worth a look. For each: the file and line, what's wrong in one sentence, and the fix with the Halo component or token to use. End with what's already done well, briefly. Offer to make the fixes.
