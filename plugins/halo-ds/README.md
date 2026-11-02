# Halo for Claude Code

This plugin helps Claude Code build, review and theme React interfaces with the Halo design system (`@halo-ds/react`). It adds four skills and one MCP server.

## Skills

- **build-ui**: builds screens with Halo components, starting from a ready-made block when one fits, with guides for layout, writing, accessibility and a checklist to review the result.
- **review-ui**: reviews existing code against Halo's rules and lists what to fix, file by file.
- **brand-theme**: applies a brand colour in light and dark mode.
- **migrate**: moves screens from shadcn/ui, Ant Design or Material UI to Halo.

The skills are Markdown files in this folder. They run nothing on their own.

## MCP server

The MCP server lets Claude look up each Halo component's import line, props, examples and usage guidance, the design tokens, and ready-made page blocks, instead of guessing them.

What it runs: `npx -y halo-ds@0.4.1 mcp`. npx downloads the `halo-ds` package, version 0.4.1, from the npm registry the first time, then starts it on your computer. The server talks to Claude Code over standard input and output only.

What it reads and sends: nothing from your project or computer. All of Halo's documentation is inside the package. It makes no network requests, collects no data and stores nothing.

The package's source is public: [packages/cli](https://github.com/Halo-design-system/Halo-design-system/tree/main/packages/cli) in the Halo repository.

## Install

```
/plugin marketplace add Halo-design-system/halo-claude-plugin
/plugin install halo-ds@halo-design-system
```

Restart Claude Code after installing so the plugin loads. Docs: https://halo-design-system.github.io/Halo-design-system/docs/ai

## License

MIT
