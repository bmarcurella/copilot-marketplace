# Copilot Extension Builder

An interview-driven builder for **Copilot agents, skills, and plugins** across every surface you work in as an architect:

- **GitHub Copilot CLI / VS Code** — plugins, agents, skills, instructions, prompts, hooks
- **Microsoft 365 Copilot** — declarative agents + plugins (MCP server or REST/OpenAPI)
- **Copilot Cowork** — skills and plugin packages
- **Copilot Studio** — agents and MCP connectors
- **Azure AI Foundry** — agents (routed)

Invoke it with `/copilot-extension-builder`. It first helps you **decide what to build** (agent vs plugin vs skill, and on which surface), then **scaffolds** the result — generating real files you can test immediately.

## Why this exists

The word *plugin* means different things on every surface, and most starter content goes stale fast. This builder does three things to fix that:

1. **Decides for you.** A short interview routes "agent vs plugin vs skill" and "which host" using a built-in decision framework and capability matrix.
2. **Owns the gaps, routes the rest.** It fully scaffolds the things nothing else does (GitHub CLI **plugin packaging** and **Cowork**), and routes to the skills you already have installed for Microsoft 365 / Copilot Studio / VS Code primitives — instead of duplicating them and drifting out of date.
3. **Keeps itself current.** A self-update step (`/sync-knowledge`) checks the canonical Microsoft Learn and GitHub docs on a cadence, auto-applies low-risk changes, flags structural ones for review, and records everything in [CHANGELOG.md](CHANGELOG.md).

## What it owns vs routes

| You want to build… | Behavior |
| --- | --- |
| A GitHub CLI **plugin** (bundle agents/skills/hooks/MCP into `plugin.json` + `marketplace.json`) | **Scaffolds** — `build-cli-plugin` |
| A **Cowork** skill or plugin package | **Scaffolds** — `build-cowork` |
| A standalone CLI/VS Code agent, skill, instruction, prompt, or hook | **Routes** → `agent-customization` |
| An **M365** declarative agent + plugin (MCP or REST) | **Routes** → `microsoft-365-agents-toolkit`, `typespec-create-api-plugin`, `typespec-api-operations`, `mcp-create-declarative-agent` |
| A **Copilot Studio** agent / MCP connector | **Routes** → `mcp-create-declarative-agent`, `typespec-create-agent`, `mcp-copilot-studio-server-generator` |
| An **Azure AI Foundry** agent | **Routes** → `microsoft-foundry` |

See [references/routing.md](references/routing.md) for exact hand-offs and [references/surface-comparison.md](references/surface-comparison.md) for the full capability matrix.

## Install

This folder is the **maintainer source of truth** — where you author, version, and publish from. Other people never run from this path; they install a published copy.

### Make it available to yourself

This folder ships a marketplace catalog, which is the recommended way to install — the Copilot CLI now
**deprecates direct path/repo installs** in favor of `plugin@marketplace`.

```powershell
# Register this folder as a local marketplace.
# Use an ABSOLUTE path — a relative ./path is interpreted as a GitHub repo spec.
copilot plugin marketplace add "D:\Personal Agents.Skills.Plugins\copilot-extension-builder"
copilot plugin install copilot-extension-builder@copilot-extension-builder-marketplace
copilot plugin list            # confirm it loaded (4 skills)
```

Installing the plugin makes its skills available in both Copilot CLI and VS Code. After editing the
source, run the install command again to refresh the cache.

> Deprecated but handy for quick local iteration: `copilot plugin install ./copilot-extension-builder`.

### Share it with others

Push this folder to a GitHub repo, then have others register the marketplace and install:

```powershell
copilot plugin marketplace add OWNER/REPO
copilot plugin install copilot-extension-builder@copilot-extension-builder-marketplace
```

Consumers get future improvements with `copilot plugin update copilot-extension-builder`.

> Direct `copilot plugin install OWNER/REPO` still works but is deprecated. Before publishing, set
> `author`, and add `repository` + `homepage` in [.github/plugin/plugin.json](.github/plugin/plugin.json).
> The marketplace entry's `source` is `"."`, which assumes this folder is the repository root. If you keep
> it as a subfolder of a larger repo, change `source` to that subfolder path (for example
> `"plugins/copilot-extension-builder"`).

## How it stays up to date

| | Maintainer (you, from this source) | Consumer (installed copy) |
| --- | --- | --- |
| Where edits go | Real files here → you commit & publish | `${COPILOT_PLUGIN_DATA}` only |
| Effect | Everyone benefits via `copilot plugin update` | Local notes; prompts you to update |

`sync-knowledge` auto-detects which mode it is in (writable git source = maintainer; read-only install = consumer) and never writes into the read-only install cache. The monitored doc list and cadence live in [references/sources.json](references/sources.json) (`check_interval_days` defaults to 14).

## Layout

```text
copilot-extension-builder/
├── .github/plugin/
│   ├── plugin.json            # plugin manifest
│   └── marketplace.json       # distribution catalog
├── skills/
│   ├── copilot-extension-builder/   # router + freshness gate (entry point)
│   ├── build-cli-plugin/            # GitHub CLI plugin packaging (+ templates/)
│   ├── build-cowork/                # Cowork skill / package (+ templates/)
│   └── sync-knowledge/              # self-update engine
├── references/                # decision framework, capability matrix, routing, links, sources, lessons
├── hooks/hooks.json           # SessionStart staleness reminder (optional)
├── scripts/                   # check-freshness.ps1 / .sh
├── CHANGELOG.md               # dated record of knowledge-sync changes
└── README.md
```

## License

MIT
