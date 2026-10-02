# Changelog

Dated record of knowledge-sync changes and notable manual updates. Newest first. Each entry cites the
source it came from.

- **Maintainer mode** syncs edit this file directly (then you commit & publish).
- **Consumer mode** syncs write to `${COPILOT_PLUGIN_DATA}/CHANGELOG.md` instead, leaving this read-only.

Format:

```text
## YYYY-MM-DD
- [source-id] what changed -> what was edited. (source: URL) [auto|review]
```

## 2026-10-02
- [cowork-plugin-development] **Resolves the 2026-08-14 review item.** Doc now leads with the Agents
  Toolkit CLI: `atk import openplugin` (CLI ≥1.1.12; Claude/Cursor/`.plugin` → `atk` project, devPreview
  manifest, placeholder `referenceId`, UUID v5 id), `atk export openplugin`, `atk package`; PowerShell
  conversion script is now "legacy". `mcpToolDescription` is optional ("Cowork discovers tools dynamically and
  doesn't use this file"). ApiKey auth not yet supported in Cowork; omitting `authorization` (implicit DCR) is
  Cowork-only; OAuth registrations should target "Any Microsoft 365 Organization". New: MCP annotations drive
  confirmation (unannotated = destructive), `contentEncoding: base64` file inputs, `copilot-cowork` client
  identity, dev-tunnel local testing, tenant publish path now Manage apps → Upload custom app → Add agent →
  updated `build-cowork/SKILL.md` and `templates/plugin-package/README.md`. Templates kept on **v1.29**:
  verified the published v1.28 schema still *requires* `mcpToolDescription` (v1.29/v1.30 don't), so the doc's
  v1.28 sample is not safe for dynamic discovery. (source: https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development) [review → applied]
- [m365-agent-connectors] New auth types `DynamicClientRegistration` (explicit, with `referenceId`; server
  must return `client_id` + `client_secret`) and `AzureKeyVault` (schema v1.29+); OAuth redirect URI
  `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect` → auth table in `build-cowork`, links;
  source added to `sources.json`. (source: https://learn.microsoft.com/en-us/microsoftteams/platform/m365-apps/agent-connectors) [auto]
- [federated-connectors] Added custom federated connectors (admin-created; read-only tools; OAuth requires
  client ID + secret) and contrasted them with package `agentConnectors[]` in `build-cowork` → new links
  section; source added to `sources.json`; lesson recorded. (source: https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/set-up-custom-federated-connectors) [auto]
- [m365-overview-plugins, m365-plugin-manifest, m365-declarative-agent-manifest] Pages updated 2026-09-30; no
  new version paths (plugin 2.5, DA 1.9/1.10, app manifest v1.31 all 404) → `last_known_updated` only. [auto]
- [cowork-plugins, cowork-customize, cowork-elicitation-forms] Pages updated 2026-09-14/15; no impact found on
  templates → `last_known_updated` only. [auto]
- [cli-plugin-reference, cli-plugins-creating, cli-add-skills, vscode-agent-plugins] First content-hash
  baseline recorded (no prior hash, so change can't be determined this run). [auto]

## 2026-08-14
- [cli-plugin-reference] Doc URL moved under `/reference/copilot-cli-reference/` → updated `sources.json`
  and `links.md`. Verified this repo's `.github/plugin/` layout is still third in the documented manifest
  search order. New `$schema` field opts a plugin into the Agent Plugins (Open Plugin Spec) 1.0 format →
  added to `build-cli-plugin` manifest table. (source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference) [auto]
- [vscode-agent-plugins] **Agent Plugins 1.0 GA (2026-08-12):** VS Code now auto-discovers plugins
  installed by the Copilot CLI from `~/.copilot/installed-plugins/`, installs from marketplaces via the
  `chat.plugins.marketplaces` setting, and honors workspace recommendations in
  `.github/copilot/settings.json` (`extraKnownMarketplaces`, `enabledPlugins`) → updated
  `build-cli-plugin` Step 5, `surface-comparison.md`, `links.md`; source added to `sources.json`.
  (source: https://code.visualstudio.com/docs/agent-customization/agent-plugins) [auto]
- [cli-add-skills] Documented skill discovery order (`.github/skills` > `.agents/skills` >
  `.claude/skills` > parent dirs > `~/.copilot/skills` > `~/.agents/skills` > plugins >
  `COPILOT_SKILLS_DIRS`), `/skills` session commands, the `copilot skill` subcommand, and
  `install --skill --scope user|project` → source added to `sources.json`, `/skills reload` noted in the
  `build-cli-plugin` iteration loop. (source: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills) [auto]
- [m365-declarative-agent-manifest] Declarative agent manifest **1.7 → 1.8** (adds `EmailActions` +
  `MeetingActions` capabilities; `EmbeddedKnowledge.files` now required) → updated `links.md`,
  `surface-comparison.md`, and the `sources.json` url. Plugin manifest 2.4 verified still current — no 2.5.
  (source: https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-manifest-1.8) [auto]
- [cowork-plugin-development] **Needs review, not applied:** the Cowork build doc's sample now pins
  Unified App Manifest **v1.28** (strict) and states `mcpToolDescription` is required on
  `remoteMcpServer` — in tension with the v1.29 dynamic-discovery path this repo ships and has uploaded
  successfully (lessons.md 2026-06-25). Unified manifest v1.30 (Aug 2026) is latest GA but only adds
  Outlook add-in fields. Left the v1.29 templates and `customer-architect` manifest unchanged; verify
  against a real Cowork upload before any change. Also new in the doc: workspace **file inputs** for
  connectors (`contentEncoding: base64`, ≤8 files, 150 MiB each), 20-skills/10-connectors package limits,
  MCP annotations driving confirmation prompts (unannotated tools treated as destructive).
  (source: https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development) [review]
- [cowork-plugins, cowork-customize] Cowork user-facing flows updated: self-service plugin upload with
  automatic Claude-plugin package conversion, plugin sharing/re-share, skill upload accepting
  `.md`/`.zip`/`.skill` (1 MB per .md, 10 MB compressed / 50 MB uncompressed / 100 files per archive) →
  `sources.json` notes refreshed. (source: https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-customize) [auto]

## 2026-06-25
- Initial release of **copilot-extension-builder**. Baseline knowledge captured from Microsoft Learn and
  GitHub Copilot docs; seven sources seeded in `references/sources.json` with `last_checked` 2026-06-25
  and `check_interval_days` 14.
- [github-cli] Verified during build that direct path installs are deprecated by the CLI → README and
  `build-cli-plugin` now lead with `plugin@marketplace`. (source: cli-plugin-reference) [auto]
- [github-cli] Verified that a local `marketplace add` requires an absolute path (a relative `./` is read
  as a GitHub repo). Documented in README and `build-cli-plugin`. (source: cli-plugin-reference) [auto]
