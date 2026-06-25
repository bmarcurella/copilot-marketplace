# {{Plugin Name}} — Copilot Cowork plugin package

A **Microsoft 365 app package** (`.zip`) that extends Copilot Cowork with Agent Skills and (optionally) remote
MCP connectors. Format per
[Build plugins for Copilot Cowork](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development).

## Layout (everything zips at the root)

```text
{{plugin-name}}/
├── manifest.json          # M365 Unified App Manifest v1.29
├── color.png              # 192×192 color icon
├── outline.png            # 32×32 outline icon
└── skills/
    ├── {{skill-one}}/
    │   ├── SKILL.md        # frontmatter `name` MUST equal the folder name
    │   └── references/     # optional companion files
    └── {{skill-two}}/
        └── SKILL.md
```

## Build it

1. For each skill, copy `../skill/SKILL.md` to `skills/<name>/SKILL.md`; make the frontmatter `name` equal the
   folder name (kebab-case).
2. Fill in `manifest.json`: generate a stable `id` GUID, set `developer` / `name` / `description`, list each
   skill in `agentSkills[]`, and keep `agentConnectors[]` only if you need remote MCP servers (otherwise
   delete it).
3. Add `color.png` (192×192) and `outline.png` (32×32).
4. Package:

   ```powershell
   Compress-Archive -Path manifest.json, color.png, outline.png, skills -DestinationPath ..\{{plugin-name}}.zip -Force
   ```

## Connector auth (when used)

| `authorization.type` | Use | `referenceId` |
| --- | --- | --- |
| `None` | public/anonymous MCP server | omit |
| `OAuthPluginVault` | OAuth 2.0 server | required — credential registration ID in the Enterprise Token Store |
| `ApiKeyPluginVault` | API-key server | required — as above |

Servers that support Dynamic Client Registration can omit `authorization` entirely. **No secrets in the
manifest** — only the `referenceId` reference.

## Tool discovery

- **Dynamic** (recommended) — omit `mcpToolDescription`; agents call the server's `tools/list` at runtime.
  **Requires manifest v1.29+** (on v1.28 a `remoteMcpServer` without `mcpToolDescription` is rejected).
- **Static** — set `mcpToolDescription.file` to a bundled JSON of tool definitions; valid on v1.28.

## Install / test / publish

- **Cowork:** Customize → Plugins → **Upload plugin** → select the `.zip`.
- **Sideload (personal):** `npm i -g @microsoft/m365agentstoolkit-cli` → `atk auth login` →
  `atk install --file-path "..\{{plugin-name}}.zip" --scope Personal`.
- **Tenant:** M365 admin center → Agents → All agents → … → Add agent → upload the `.zip`.
- **Public:** submit via Partner Center to the Microsoft 365 App Store.

Generate a GUID for `id`:

```powershell
[guid]::NewGuid().ToString()
```
