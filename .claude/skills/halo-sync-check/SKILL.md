---
name: halo-sync-check
description: Check that the Halo Figma library, the React package, the tokens and the website all match, and list what has drifted. Use before a release, after Figma or code changes, or when the user asks whether Figma and code are in sync.
---

# Halo sync check

Compare the four sources of truth and report every difference. Don't fix anything until the user has seen the report.

- **Figma**: file key `LVZSmXHpIl0qR5fKYzzLrK`. Read it with the Figma MCP tools (`use_figma` for variables and component sets). Editing needs the connector signed in with the account that has edit access.
- **Tokens**: `packages/tokens/figma/<Collection>/<Mode>.tokens.json` (exported from Figma) and the built `packages/tokens/dist/tokens.json`.
- **React**: `packages/react/src`. For every component's props, run `pnpm --filter halo-ds build` and read `packages/cli/src/generated/data.json` (`props`).
- **Website**: `apps/site/src/catalog.ts` (component list), `apps/site/src/guide.ts` (usage guidance), `apps/site/src/examples` and `apps/site/src/demos`.

## 1. Tokens

Read every variable in Figma's Semantic, Primitives, Typography and Layout collections, with each mode's value. Compare with the `.tokens.json` files:

- variables in Figma but not in the JSON, or the other way round
- different values, or a different alias (for example Figma points `text/brand` at purple/600 and the JSON at purple/500)
- modes that don't match (Light and Dark in Semantic; Mobile, Tablet, Desktop and Wide in Layout)

If the JSON is behind Figma, say the tokens need exporting again and `pnpm build:tokens` running.

## 2. Components

List Figma's component sets (skip `Doc/` and other documentation helpers) and their variant and boolean properties. Match each to a React component by name (`Input field` matches `InputField`, `Cards` matches `Card`). Report:

- components that exist only in Figma or only in React
- variant values that differ: Figma `Type=Primary|Secondary|Ghost|Destructive|Premium` against React `variant`
- sizes that differ: Figma full words (Small, Medium, Large) against React short values (sm, md, lg) are the same; anything else is a difference
- boolean properties in Figma with no matching prop, like `L icon` with no `iconLeft`

## 3. Website and docs

For every export in `catalog.ts`, check it has an example in `examples/`, demos in `demos/<slug>/`, and guidance in `guide.ts`; and that every React component appears in `catalog.ts`. Also check that each Figma component set has a description, without a "React: import" line.

## Report

One table per area: what differs, where (Figma node or file path), and the likely fix. Put differences people would notice first (a missing component, a wrong colour) and naming details last. Finish with a count per area, and ask which to fix.
