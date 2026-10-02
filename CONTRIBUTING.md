# Contributing

Thanks for adding to the marketplace! This repo holds **content-only** Copilot artifacts,
organized by distribution surface — see the [README](README.md) for the layout. Runnable MCP
servers belong in [mcp-servers](https://github.com/bmarcurella/mcp-servers) instead.

## Adding a plugin or skill

1. **Branch** off `main` (or fork).
2. **Scaffold** — either install the builder and let it interview you:

   ```
   copilot plugin marketplace add bmarcurella/copilot-marketplace
   copilot plugin install copilot-extension-builder@copilot-marketplace
   ```

   or copy the templates from `cli-plugins/copilot-extension-builder/skills/*/templates/`.
3. **Place it by surface:**
   - GitHub Copilot CLI / VS Code plugin → `cli-plugins/<name>/` and **add an entry** to
     `.github/plugin/marketplace.json` (`"source": "cli-plugins/<name>"`, version matching
     the plugin's manifest). Use the **Agent Plugins 1.0** layout: root `plugin.json` with
     `"$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"` and metadata only
     (`name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords`,
     `extensions`). Components live in fixed folders, not manifest fields:
     - `skills/<skill>/SKILL.md` and a root `mcp.json` (with the matching spec `$schema`) — portable.
     - `com.github.copilot/agents/*.agent.md`, `com.github.copilot/hooks/hooks.json`,
       `com.github.copilot/commands/`, `com.github.copilot/automations/` — Copilot-only. Hook commands
       can use `${PLUGIN_ROOT}` for files in the plugin.

     The validator still accepts the older `.github/plugin/plugin.json` format, but every plugin here
     has moved off it.
   - Cowork plugin → `cowork-plugins/<name>/` (`manifest.json` v1.29, `color.png` 192×192,
     `outline.png` 32×32, `skills/<skill>/SKILL.md`). Do **not** add it to marketplace.json —
     Cowork packages ship as Release zips. If the skills already exist in a CLI plugin, generate the
     package instead of hand-writing it — see [Ship CLI plugin skills to Cowork](#ship-cli-plugin-skills-to-cowork).
   - Standalone skill/agent/prompt/instruction → `library/<type>/` (see `library/README.md`).
4. **Validate locally** (CI runs all three on every PR):
   - `node scripts/validate.mjs` (Node 20.11+) — marketplace, both plugin manifest formats, every
     skill and agent (plugins and `library/`), Cowork packaging rules.
   - `node scripts/sync-cowork-references.mjs --check` — if you edited a `customer-architect`
     specialist skill, run it without `--check` first to regenerate the orchestrator's `references/`.
   - `node scripts/validate-cowork-schema.mjs` — runs `atk validate` on each Cowork `manifest.json`
     against its M365 schema (`npm install -g @microsoft/m365agentstoolkit-cli`; no sign-in needed).
5. **Try it:** `copilot --plugin-dir ./cli-plugins/<name>` loads a CLI plugin for one session without
   installing it. For Cowork, build with `./scripts/build-cowork.ps1 <plugin>` (Windows) or
   `./scripts/build-cowork.sh <plugin>` and upload the zip from `dist/`.
6. **Open a PR.**

## PR checklist

- [ ] `node scripts/validate.mjs` passes (plus the two Cowork checks if you touched `cowork-plugins/`)
- [ ] No placeholder values left (`example.com`, `{{TOKEN}}`, "Publisher or Org", …)
- [ ] No `.zip` files or secrets committed (packages ship via GitHub Releases)
- [ ] Every `SKILL.md` has `name` (matching its folder) and a `description` with clear
      when-to-use triggers
- [ ] Versions bumped where changed (CLI plugins: the plugin manifest **and** its marketplace.json
      entry — VS Code only detects plugin updates when the version changes)
- [ ] README tables updated if you added a plugin

> **Iteration tip:** installed plugin components are cached. For quick checks, skip installing and run
> `copilot --plugin-dir ./cli-plugins/<name>`. To test the installed path, reinstall
> (`copilot plugin install <name>@copilot-marketplace`) and run `/skills reload` in an open session.

## Ship CLI plugin skills to Cowork

Cowork can't install CLI plugins, but the Agents Toolkit CLI converts an Agent Plugins (or Claude/Cursor)
plugin into a Cowork project, so you don't hand-write the manifest:

```powershell
npm install -g @microsoft/m365agentstoolkit-cli    # 1.1.12+ for `import openplugin`
atk import openplugin --path ./cli-plugins/<name> --output $env:TEMP\<name>-cowork `
  --privacy-url https://github.com/bmarcurella/copilot-marketplace/blob/main/PRIVACY.md `
  --terms-url https://github.com/bmarcurella/copilot-marketplace/blob/main/TERMS.md
```

Copy the generated `appPackage/manifest.json`, `color.png`, `outline.png`, and `skills/` into
`cowork-plugins/<name>/`, then fix the manifest before committing:

| Generated | Change to | Why |
| --- | --- | --- |
| `$schema` / `manifestVersion` = `devPreview` | v1.29 (`.../teams/v1.29/MicrosoftTeams.schema.json`, `"1.29"`) | GA schema with dynamic MCP tool discovery |
| `version` copied from the plugin (e.g. `0.2.0`) | `1.0.0` or higher | M365 validation rejects app versions starting with `0` |
| `id` (UUID v5 from the plugin name) | keep it | must stay stable across releases; override with `--app-id` |
| connector `authorization.referenceId` placeholder | your OAuth registration ID, or `"type": "None"` with no `referenceId` | placeholders fail at install |
| placeholder icons | real 192×192 / 32×32 icons before store submission | — |

Then run `node scripts/validate.mjs` and `node scripts/validate-cowork-schema.mjs`. The skills now exist
in both folders: edit them in `cli-plugins/<name>/skills/`, re-run the import, and copy `skills/` over again.
Verified 2026-10-02 with `atk` 1.1.18: the import reads a root `plugin.json` directly. If an older `atk`
can't find the manifest, copy it to `.plugin/plugin.json` for the import.

## Releasing a Cowork plugin

Bump `version` in the plugin's `manifest.json`, merge to `main`, then push a tag (or run the
**Release Cowork plugin** workflow from the Actions tab):

```
git tag cowork/<plugin>-v<version> && git push origin cowork/<plugin>-v<version>
```

The `release-cowork.yml` workflow validates (including the M365 schema check), builds the app package,
and attaches it to a GitHub Release.
