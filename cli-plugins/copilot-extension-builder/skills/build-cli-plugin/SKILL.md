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

Then pick the **manifest format** from the components:

| Components | Format | Why |
| --- | --- | --- |
| Skills and/or MCP servers only | **Agent Plugins 1.0** (default) | Cross-tool spec; also convertible to a Cowork package with `atk import openplugin` |
| Any agents, hooks, LSP servers, or custom component paths | **Legacy** | Manifest path fields (`agents`, `hooks`, …) only exist in the legacy format |

Agent Plugins can carry Copilot-only agents/hooks under `com.github.copilot/`, but prefer legacy for
those unless the user wants spec portability for the skills.

---

## Step 2 — Create the structure

Create only the folders for the components you chose.

**Agent Plugins 1.0** (start from `templates/agent-plugin.json`, saved as `plugin.json`):

```text
{{plugin-name}}/
├── plugin.json              # manifest at the plugin ROOT (required)
├── skills/                  # fixed location — the only place skills load from
│   └── {{skill-name}}/
│       └── SKILL.md
├── mcp.json                 # optional; fixed location, needs the matching spec $schema
├── com.github.copilot/      # optional Copilot-only components
│   ├── agents/{{agent-name}}.agent.md
│   └── hooks/hooks.json
└── README.md
```

**Legacy** (start from `templates/plugin.json`):

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
- A root `plugin.json` with an Agent Plugins `$schema` wins over every other location. Legacy manifests are
  searched in this order: `.plugin/plugin.json`, `plugin.json`, `.github/plugin/plugin.json`,
  `.claude-plugin/plugin.json`. The legacy template uses `.github/plugin/plugin.json`.
- **Legacy component paths in `plugin.json` are relative to the plugin ROOT** (the top folder), not to the
  manifest's location.
- A **skill's `name` frontmatter field must match its folder name**, or it is silently ignored.
- For deep authoring of any individual agent/skill/instruction/prompt/hook, hand the file off to `agent-customization`; this skill just lays down working stubs.

---

## Step 3 — Fill in the manifest

**Agent Plugins 1.0** — closed schema. Required: `$schema`
(`https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`; the CLI also accepts 1.1.0) and `name`
(1–64 chars, lowercase letters/digits/`-`/`.`, alphanumeric at both ends, no `--` or `..`). Optional:
`version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords`, `extensions`.
**Don't add `skills`, `agents`, `hooks`, `mcpServers`, or `lspServers`**; they're ignored, and the
fixed folders above are used instead. A root `mcp.json` must declare the same spec version in its own
`$schema`. Unsupported spec versions make the CLI reject the whole plugin.

**Legacy** — required: `name`. Add only what you use:

| Field | When to add | Value |
| --- | --- | --- |
| `skills` | bundling skills | `["./skills"]` (array of dirs) — or omit to use the default `skills/` |
| `agents` | bundling agents | `"./agents"` — or omit to use the default `agents/` |
| `hooks` | bundling hooks | `"./hooks/hooks.json"` |
| `mcpServers` | bundling MCP | `"./.mcp.json"` |
| `keywords`, `repository`, `homepage`, `category`, `tags` | optional metadata | as needed |

`agents/` and `skills/` are auto-discovered at the default paths, so you can omit those fields unless
you use non-default locations. Don't put an Agent Plugins `$schema` in a legacy manifest; it only applies
to a root `plugin.json`.

---

## Step 4 — Install and test (the iteration loop)

Fastest loop — load the folder for one session, nothing installed or cached:

```powershell
copilot --plugin-dir ./{{plugin-name}}                    # interactive session with the plugin loaded
copilot --plugin-dir ./{{plugin-name}} plugin list        # listed under "External Plugins"
copilot --plugin-dir ./{{plugin-name}} skill list         # confirm its skills loaded
```

The Copilot CLI **deprecates direct path/repo installs** in favor of `plugin@marketplace` (Step 5), but
they still work if you need to test the installed path:

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
> `copilot plugin install ./{{plugin-name}}` again to pick up changes, then `/skills reload` in an
> open session so re-loaded skills are usable without restarting.

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

**VS Code (since Agent Plugins 1.0, 2026-08):** plugins installed with the CLI are auto-discovered by
VS Code from `~/.copilot/installed-plugins/` — no extra step. Users can also install straight from
VS Code by adding the marketplace repo to the `chat.plugins.marketplaces` setting (requires
`chat.plugins.enabled`) and browsing `@agentPlugins` in the Extensions view. A repo can recommend its
own plugins to anyone opening it via `.github/copilot/settings.json` with `extraKnownMarketplaces` and
`enabledPlugins`.

---

## Templates

| File | Purpose |
| --- | --- |
| `templates/agent-plugin.json` | Agent Plugins 1.0 manifest starter (save as root `plugin.json`) |
| `templates/plugin.json` | Legacy manifest starter (save as `.github/plugin/plugin.json`) |
| `templates/marketplace.json` | Distribution catalog |
| `templates/agent.agent.md` | Custom agent stub (accurate frontmatter) |
| `templates/skill/SKILL.md` | Skill stub |
| `templates/hooks.json` | Lifecycle hooks starter |
| `templates/mcp.json` | MCP server config (save as `.mcp.json` for legacy; Agent Plugins need `mcp.json` with the spec `$schema`) |
| `templates/README.md` | Plugin README starter |

To ship a skills-only Agent Plugin to Cowork as well, hand off to `build-cowork` (it covers
`atk import openplugin`).

## Safety

- Never commit secrets. In `.mcp.json`, use `env` with input/placeholder values, not literal keys.
- Keep hook scripts small and auditable; don't let them carry credentials.
- Precedence: agents/skills are **first-found-wins** (project beats plugin); MCP servers are **last-wins**.
