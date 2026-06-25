# {{PLUGIN_NAME}}

{{ONE_LINE_DESCRIPTION}}

## Components

<!-- List what this plugin bundles. -->
- Agents: {{list or "none"}}
- Skills: {{list or "none"}}
- Hooks: {{yes/no}}
- MCP servers: {{list or "none"}}

## Install

```powershell
copilot plugin install ./{{PLUGIN_NAME}}
copilot plugin list
```

Re-run `copilot plugin install ./{{PLUGIN_NAME}}` after edits (components are cached).

## Uninstall

```powershell
copilot plugin uninstall {{PLUGIN_NAME}}
```

## License

MIT
