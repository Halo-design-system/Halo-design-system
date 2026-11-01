---
name: brand-theme
description: Make the Halo design system use a brand colour, in light and dark mode. Use when the user wants to change Halo's colours, apply their brand, rebrand, or match a colour from a logo or design.
---

# Apply a brand colour to Halo

1. Get the colour as a hex, like `#2F6BFF`. If the user gives a name ("our blue") or a logo, ask for the hex or pick it from what they shared and confirm it.
2. Run `npx halo-ds theme "<hex>"` in the app's folder. It writes `halo-theme.css` next to the app's entry file (`src/main.tsx` in Vite, the root layout in Next.js) and imports it. From one colour it works out the button, hover, tint, focus, link and brand text colours for light and dark mode, keeping brand text readable.
3. To see the CSS without writing a file, run `npx halo-ds theme "<hex>" --print`.
4. If the CLI can't run, write the variables by hand in any CSS file. Look them up with the Halo MCP tool `get_tokens` (search "brand"). Set them for `:root, [data-theme='light']` and again for `[data-theme='dark']`. The user's values always win over Halo's defaults, whatever order the files load in.

## Good to know

- Buttons (`--halo-button-primary*`) and other filled controls like checkboxes and switches (`--halo-fill-brand*`) have their own variables, so a team can change one without the other.
- If white text is hard to read on the colour, the CLI says so. Mention it, but the choice is the user's: some brands keep a bright colour on purpose.
- Keep the brand colour for the main action. Charts and decorative areas stay neutral.
- Show the result in light and dark mode before finishing.
