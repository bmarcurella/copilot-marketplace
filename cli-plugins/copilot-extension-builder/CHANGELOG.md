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
