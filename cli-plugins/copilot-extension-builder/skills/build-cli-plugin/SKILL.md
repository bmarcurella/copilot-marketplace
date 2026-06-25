---
name: build-cli-plugin
description: "Use when you want to scaffold, build, or package a GitHub Copilot CLI or VS Code plugin (a plugin.json package). Bundles agents, skills, hooks, and MCP servers into one installable, distributable unit, and can add a marketplace.json catalog. USE FOR: build a plugin, scaffold plugin.json, package my agent/skill, GitHub Copilot CLI plugin, VS Code agent plugin, plugin marketplace, install a local plugin, bundle skills and agents. DO NOT USE FOR: authoring a single standalone agent/skill/instruction/prompt/hook (route to agent-customization); M365/Cowork/Studio plugins."
license: MIT
metadata:
  author: bmarcurella
---

# Build a GitHub Copilot CLI / VS Code plugin

Package one or more components — agents, skills, hooks, MCP servers — into a single installable plugin
with a `plugin.json` manifest. This is the **distribution wrapper**; if the user only needs one standalone
component, route to `agent-customization` instead.

Templates are in `templates/` (sibling to this file). Copy them and replace `{{PLACEHOLDERS}}`.

---

## Step 1 — Gather

- **name** — kebab-case, letters/numbers/hyphens, max 64 chars (e.g., `release-notes-tools`).
- **description** — one line, max 1024 chars.
- **version** — semver, start at `0.1.0`.
- **author** — name (email/url optional).
- **components to bundle** — any of: agents, skills, hooks, MCP servers.
- **distribute?** — also generate `marketplace.json`.
- **output location** — default: a sibling folder in the current workspace named after the plugin.

---

## Step 2 — Create the structure

Create only the folders for the components you chose:

```text
{{plugin-name}}/
├── .github/plugin/
│   ├── plugin.json          # manifest (required)
│   └── marketplace.json     # optional, for distribution
├── agents/                  # optional
│   └── {{agent-name}}.agent.md
├── skills/                  # optional
│   └── {{skill-name}}/
│       └── SKILL.md
├── hooks/                   # optional
│   └── hooks.json
├── .mcp.json                # optional
└── README.md
```

Notes:
- The manifest is searched in this order: `.plugin/plugin.json`, `plugin.json`, `.github/plugin/plugin.json`, `.claude-plugin/plugin.json`. This template uses `.github/plugin/plugin.json`.
- **Component paths in `plugin.json` are relative to the plugin ROOT** (the top folder), not to the manifest's location.
- A **skill's `name` frontmatter field must match its folder name**, or it is silently ignored.
- For deep authoring of any individual agent/skill/instruction/prompt/hook, hand the file off to `agent-customization`; this skill just lays down working stubs.

---

## Step 3 — Fill in the manifest

Start from `templates/plugin.json`. Required: `name`. Add only what you use:

| Field | When to add | Value |
| --- | --- | --- |
| `skills` | bundling skills | `["./skills"]` (array of dirs) — or omit to use the default `skills/` |
| `agents` | bundling agents | `"./agents"` — or omit to use the default `agents/` |
| `hooks` | bundling hooks | `"./hooks/hooks.json"` |
| `mcpServers` | bundling MCP | `"./.mcp.json"` |
| `keywords`, `repository`, `homepage`, `category`, `tags` | optional metadata | as needed |

`agents/` and `skills/` are auto-discovered at the default paths, so you can omit those fields unless
you use non-default locations.

---

## Step 4 — Install and test (the iteration loop)

The Copilot CLI now **deprecates direct path/repo installs** in favor of `plugin@marketplace` (Step 5).
For quick local iteration the direct install still works:

```powershell
copilot plugin install ./{{plugin-name}}   # deprecated, but fine for local dev
copilot plugin list                        # confirm it loaded
```

In an interactive session, verify components:
```text
/skills list      # skills loaded?
/agent            # agents loaded?
```

> Installed components are **cached**. After editing the source, run
> `copilot plugin install ./{{plugin-name}}` again to pick up changes.

Remove with `copilot plugin uninstall {{plugin-name}}` (use the manifest `name`, not the path).

---

## Step 5 — Distribute (optional)

1. Generate `marketplace.json` from `templates/marketplace.json`.
2. Push the plugin folder to a GitHub repo.
3. Others register the marketplace and install (the non-deprecated path):

```powershell
copilot plugin marketplace add OWNER/REPO
copilot plugin install {{plugin-name}}@{{marketplace-name}}
```

For a **local** marketplace, pass an **absolute path** — a relative `./path` is interpreted as a GitHub
repo spec and will fail:

```powershell
copilot plugin marketplace add "C:\abs\path\to\{{plugin-name}}"
```

`marketplace.json` `source` is `"."` when the plugin is the repo root; use a subfolder path
(e.g., `"plugins/{{plugin-name}}"`) if it lives in a larger repo.

---

## Templates

| File | Purpose |
| --- | --- |
| `templates/plugin.json` | Manifest starter |
| `templates/marketplace.json` | Distribution catalog |
| `templates/agent.agent.md` | Custom agent stub (accurate frontmatter) |
| `templates/skill/SKILL.md` | Skill stub |
| `templates/hooks.json` | Lifecycle hooks starter |
| `templates/mcp.json` | MCP server config (save as `.mcp.json`) |
| `templates/README.md` | Plugin README starter |

## Safety

- Never commit secrets. In `.mcp.json`, use `env` with input/placeholder values, not literal keys.
- Keep hook scripts small and auditable; don't let them carry credentials.
- Precedence: agents/skills are **first-found-wins** (project beats plugin); MCP servers are **last-wins**.
