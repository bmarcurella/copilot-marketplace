# Lessons learned

Append a short, dated bullet whenever a scaffold or routing decision is corrected, or a surface behaves
differently than the references say. This is the builder's "gets smarter as it's used" loop.

- **Maintainer mode** (running from this writable git source): edit this file directly, then commit so
  everyone benefits on the next `copilot plugin update`.
- **Consumer mode** (running from a read-only installed copy): write lessons to
  `${COPILOT_PLUGIN_DATA}/lessons.md` instead, and consider opening an issue/PR upstream.

Format: `YYYY-MM-DD — [surface] short lesson (what was wrong → what to do instead).`

## Entries

<!-- Example:
- 2026-06-25 — [github-cli] `plugin.json` gained a `category` field → add it to the CLI template and links.
- 2026-06-25 — [m365] user wanted Teams reach, not just M365 chat → route to microsoft-365-agents-toolkit, not typespec-only.
-->

- 2026-06-25 — [github-cli] `copilot plugin install ./path` (direct path/repo install) is deprecated; the CLI warns that a future release supports only `plugin@marketplace`. Lead with marketplace install everywhere.
- 2026-06-25 — [github-cli] `copilot plugin marketplace add` with a relative `./path` is treated as a GitHub `OWNER/REPO` spec and fails (`git clone https://github.com/./...`); for a local marketplace pass an **absolute** path.
- 2026-06-25 — [cowork] A Cowork plugin is a **Microsoft 365 app package (.zip)**, not a loose manifest + markdown. Required layout: `manifest.json` (Unified App Manifest **v1.29**; v1.28 also valid, with `agentSkills[]` + optional `agentConnectors[]`) + `color.png` (192×192) + `outline.png` (32×32) + `skills/<name>/SKILL.md`. Each `SKILL.md` needs YAML frontmatter (`name`, `description`) and the **folder name must equal `name`** (kebab-case) or it's rejected. Connectors are `agentConnectors[]` entries pointing to **remote MCP servers** (`remoteMcpServer.mcpServerUrl`, auth `None`/`OAuthPluginVault`/`ApiKeyPluginVault`) — *not* markdown files. Cowork's "Upload plugin" accepts a Claude plugin or this MOS `.zip`. → The `build-cowork` skill's "no public package schema" note and its `manifest.json` / `plugin-package/` templates are now WRONG; rebuild from [cowork-plugin-development](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development).
- 2026-06-25 — [cowork] `sources.json` is missing the two authoritative authoring pages: `cowork-plugin-development` (package schema, validation rules ASKILL-*, conversion script) and `cowork-elicitation-forms` (MCP elicitation). Add both to the allow-list so `sync-knowledge` tracks them.
- 2026-06-25 — [cowork] `atk install` failed with `Manifest is not valid: Required properties are missing from object: mcpToolDescription` at `agentConnectors[0].toolSource.remoteMcpServer`. Cause: manifest **v1.28** *requires* `mcpToolDescription` (static tool defs); omitting it for **dynamic** `tools/list` discovery needs manifest **v1.29** (June 2026). Fix → set `$schema`/`manifestVersion` to **1.29** and omit `mcpToolDescription` for servers that expose `tools/list` (e.g. Microsoft Learn MCP `https://learn.microsoft.com/api/mcp`); or stay on v1.28 and add `mcpToolDescription.file` with a bundled tool-definition JSON.
- 2026-06-25 — [cowork] A "connector server error" in Cowork for a **public/anonymous** remote MCP connector can be **transient** (public-endpoint throttling/availability), not a config bug — it cleared on retry / a fresh conversation. Diagnose by hitting the endpoint directly: `initialize` + `tools/list` returning **200** with no `WWW-Authenticate` and **404** on `/.well-known/oauth-*` proves the server is healthy and anonymous. Keep `authorization.type` = **None**; do **not** switch to DCR (omitting `authorization`) for such servers — DCR makes Cowork attempt OAuth discovery the anonymous server can't satisfy. DCR applies only when the server returns `401` + `WWW-Authenticate` and publishes an auth-server `registration_endpoint`.
