# Repository conventions for AI assistants

This is a marketplace monorepo for Microsoft Copilot artifacts — inert content only (manifests,
SKILL.md files, templates). Runnable MCP servers live in the separate
[mcp-servers](https://github.com/bmarcurella/mcp-servers) repo.

## Structure: one top-level folder per distribution surface

- `cli-plugins/` — GitHub Copilot CLI / VS Code plugins, served by the git marketplace catalog at
  `.github/plugin/marketplace.json`. All use the Agent Plugins 1.0 layout: root `plugin.json`
  (metadata only), `skills/`, optional `mcp.json`, Copilot-only parts in `com.github.copilot/`.
- `cowork-plugins/` — M365 Copilot Cowork app packages (`manifest.json` v1.29 + icons +
  `skills/<name>/SKILL.md`), shipped as `.zip` on GitHub Releases — never via the marketplace.
- `library/` — standalone reusable skills/agents/prompts/instructions; inert here.

New surfaces (MS Scout, Copilot Studio, …) get their own top-level folder — never mix surfaces.

## Rules

1. New CLI plugins must be registered in `.github/plugin/marketplace.json` with
   `"source": "cli-plugins/<name>"`; the entry's `version` must match the plugin's manifest.
2. Every `SKILL.md` needs frontmatter: `name` matching its folder, and a `description` with
   when-to-use trigger phrases. Every `*.agent.md` needs a `description`.
3. Never commit `.zip` files or secrets. Built packages go to gitignored `dist/` and ship via
   GitHub Releases (`release-cowork.yml` builds them from a `cowork/<plugin>-v<version>` tag).
4. Run `node scripts/validate.mjs` after changes — CI enforces it on every PR, along with
   `sync-cowork-references.mjs --check` and `validate-cowork-schema.mjs` (`atk validate`).
5. Scaffold from the templates in `cli-plugins/copilot-extension-builder/skills/*/templates/`
   instead of writing manifests from scratch; generate Cowork packages from an Agent Plugins
   plugin with `atk import openplugin` (CONTRIBUTING.md).
6. Work on branches; never commit directly to `main`.
