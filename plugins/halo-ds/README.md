# Halo for Claude Code

This plugin helps Claude Code build, review and theme React interfaces with the Halo design system (`@halo-ds/react`). It adds four skills.

## Skills

- **build-ui**: builds screens with Halo components, starting from a ready-made block when one fits, with guides for layout, writing, accessibility and a checklist to review the result.
- **review-ui**: reviews existing code against Halo's rules and lists what to fix, file by file.
- **brand-theme**: applies a brand colour in light and dark mode.
- **migrate**: moves screens from shadcn/ui, Ant Design or Material UI to Halo.

The skills are Markdown files in this folder. They run nothing on their own.

## Optional: add the MCP server

Halo also has an MCP server that looks up each component's props, examples and usage guidance, the design tokens and ready-made page blocks. It is not part of this plugin. The skills work without it, and use it when it is connected. To add it:

```bash
claude mcp add halo -- npx -y halo-ds mcp
```

npx downloads the `halo-ds` package from the npm registry the first time, then starts it on your computer. It reads nothing from your project, makes no network requests and collects no data. Its source is public: [packages/cli](https://github.com/Halo-design-system/Halo-design-system/tree/main/packages/cli) in the Halo repository.

## Install

```
/plugin marketplace add Halo-design-system/halo-claude-plugin
/plugin install halo-ds@halo-design-system
```

Restart Claude Code after installing so the plugin loads. Docs: https://halo-design-system.github.io/Halo-design-system/docs/ai

## License

MIT
