# copilot-marketplace

A personal, organized home for everything I build for GitHub Copilot and Microsoft Copilot — and a
**GitHub Copilot CLI marketplace** others can install from.

## Why this exists: "plugin" means three different things

| Artifact | What it is | How others get it | Lives in |
| --- | --- | --- | --- |
| **GitHub Copilot CLI / VS Code plugin** | `plugin.json` bundling agents/skills/hooks/MCP | `copilot plugin marketplace add bmarcurella/copilot-marketplace` → `copilot plugin install NAME@copilot-marketplace` | `cli-plugins/` |
| **Cowork plugin** | M365 app package (`manifest.json` v1.29 + icons + `skills/`) | Build → `.zip` → upload in Cowork / M365 admin center, or attach to a **GitHub Release** | `cowork-plugins/` |
| **Standalone skill / agent / instruction / prompt / hook** | a single `SKILL.md` / `.agent.md` / `.instructions.md` / etc. | Copy into a repo's `.github/`, or bundle into a CLI plugin | `library/` |

Only **CLI plugins** have a true git marketplace. **Cowork plugins** are zip artifacts. The **library** is
reusable building blocks.

## Layout

```text
copilot-marketplace/
├── .github/plugin/marketplace.json   # the Copilot CLI catalog (lists every cli-plugins/* entry)
├── cli-plugins/                      # installable via the marketplace
│   └── copilot-extension-builder/
├── cowork-plugins/                   # M365 app packages → build .zip → GitHub Release
│   └── customer-architect/
├── library/                          # reusable building blocks (inert here)
│   ├── agents/   skills/   instructions/   prompts/
└── dist/                             # built .zip artifacts (gitignored)
```

## Install a CLI plugin (the marketplace)

```powershell
copilot plugin marketplace add bmarcurella/copilot-marketplace
copilot plugin marketplace browse copilot-marketplace
copilot plugin install copilot-extension-builder@copilot-marketplace
```

### Available CLI plugins

| Plugin | Description |
| --- | --- |
| [`copilot-extension-builder`](cli-plugins/copilot-extension-builder) | Interview-driven builder for agents/skills/plugins across CLI, M365, Cowork, Studio, Foundry. |

## Use a Cowork plugin

Cowork plugins aren't installed from this marketplace — they're M365 app packages. **Download the
`.zip` from [GitHub Releases](../../releases)** and upload it in
**Cowork → Customize → Plugins → Upload plugin**.

Releases are built by CI: bump `version` in the plugin's `manifest.json`, merge, then push a tag —

```sh
git tag cowork/customer-architect-v1.0.1 && git push origin cowork/customer-architect-v1.0.1
```

To build locally for testing (manifest.json must sit at the **zip root** — don't zip the folder itself):

```sh
cd cowork-plugins/customer-architect
zip -r ../../dist/customer-architect.zip . -x "README.md" -x "*.DS_Store"
```

### Available Cowork plugins

| Plugin | Description |
| --- | --- |
| [`customer-architect`](cowork-plugins/customer-architect) | Architect & scaffold Microsoft customer demos (Learn MCP + Office). |

## MCP servers (separate repo)

Runnable MCP servers live in **[bmarcurella/mcp-servers](https://github.com/bmarcurella/mcp-servers)** —
they're software (Node services with Dockerfiles and Azure Container Apps deployment), so they have
their own lifecycle: run locally with `docker compose up`, or deploy to Azure with the included
script. Start new servers from its `templates/server-template/`.

| Server | Description |
| --- | --- |
| [`opportunity-dashboard`](https://github.com/bmarcurella/mcp-servers/tree/main/servers/opportunity-dashboard) | Interactive Dynamics 365 Sales dashboard backed by live Dataverse data. |

## Add something new

Install the builder, then run it — it decides agent vs plugin vs skill and scaffolds into the right folder:

```text
copilot plugin install copilot-extension-builder@copilot-marketplace
# then ask it to build a CLI plugin → cli-plugins/, a Cowork plugin → cowork-plugins/, a skill → library/
```

When you add a new **CLI plugin**, also add an entry to `.github/plugin/marketplace.json` with
`"source": "cli-plugins/<name>"`.

## Working on this repo

Having the repo open does **not** make its plugins available — plugins are installed user-level
from the marketplace, then work in every project (including this one). Dogfood your own catalog:

```sh
copilot plugin marketplace add bmarcurella/copilot-marketplace
copilot plugin install copilot-extension-builder@copilot-marketplace
```

Repo conventions for AI assistants live in [CLAUDE.md](CLAUDE.md) (Claude Code) and
[.github/copilot-instructions.md](.github/copilot-instructions.md) (GitHub Copilot).
Before pushing, run the same validation CI runs on every PR:

```sh
node scripts/validate.mjs
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full checklist.

## Conventions

- **CLI plugin** folders contain `.github/plugin/plugin.json` plus their components.
- **Cowork plugin** folders contain `manifest.json` (Unified App Manifest v1.29), `color.png`, `outline.png`, and `skills/<name>/SKILL.md`.
- **Library** items are standalone and inert here; bundle them into a plugin or copy into a project's `.github/` (see [library/README.md](library/README.md)).
- Built `.zip` artifacts are **never committed** — they go to `dist/` (gitignored) locally and ship via GitHub Releases built by CI.
- Never commit secrets; MCP/auth use environment variables and Token Store references.
