# {{Plugin Name}} — Copilot Cowork plugin package

A **Microsoft 365 app package** (`.zip`) that extends Copilot Cowork with Agent Skills and (optionally) remote
MCP connectors. Format per
[Build plugins for Copilot Cowork](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development).

## Layout (everything zips at the root)

```text
{{plugin-name}}/
├── manifest.json          # M365 Unified App Manifest v1.29 (v1.30 also valid)
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
   # PowerShell 7+ (Windows PowerShell 5.1's Compress-Archive writes backslash entry names)
   Compress-Archive -Path manifest.json, color.png, outline.png, skills -DestinationPath ..\{{plugin-name}}.zip -Force
   ```

   Add `tools` to `-Path` if a connector uses `mcpToolDescription.file`. In an Agents Toolkit project, use
   `atk package --manifest-file ./appPackage/manifest.json --output-package-file ./appPackage/build/appPackage.zip --output-folder ./appPackage/build`
   so `${{ENV_VAR}}` placeholders (e.g. the OAuth `referenceId`) are resolved.

## Connector auth (when used)

| `authorization.type` | Use | `referenceId` |
| --- | --- | --- |
| `None` | public/anonymous MCP server | must be omitted |
| `OAuthPluginVault` | OAuth 2.0 server (recommended); public client + PKCE is fine | OAuth client registration ID |
| `ApiKeyPluginVault` | API-key server — **not supported in Cowork yet** | API key registration ID |
| `DynamicClientRegistration` | server has an RFC 7591 registration endpoint returning `client_id` + `client_secret` | DCR config ID (Developer Portal) |
| `AzureKeyVault` | secret in your own Key Vault — **manifest v1.29+** | Key Vault secret registration ID |

Omitting `authorization` entirely makes **Cowork** use DCR on its own; that shortcut isn't supported in
Copilot Chat. For OAuth, set the registration's usage to **Any Microsoft 365 Organization** for cross-tenant
use and allow the redirect URI `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect`.
**No secrets in the manifest** — only the `referenceId` reference.

## Tool discovery

- **Dynamic** (recommended) — omit `mcpToolDescription`; agents call the server's `tools/list` at runtime.
  **Requires manifest v1.29+** (the v1.28 schema still requires `mcpToolDescription`).
- **Static** — set `mcpToolDescription.file` to a bundled JSON of tool definitions (must be in the zip).
  Cowork ignores it and discovers dynamically anyway.
- Give every tool MCP `annotations` (`readOnlyHint`, `destructiveHint`, `title`); unannotated tools are
  treated as destructive and prompt for confirmation.

## Install / test / publish

- **Cowork:** Customize → Plugins → **Upload plugin** → select the `.zip`.
- **Sideload (personal):** `npm i -g @microsoft/m365agentstoolkit-cli` → `atk auth login` →
  `atk install --file-path "..\{{plugin-name}}.zip" --scope Personal`.
- **Tenant:** M365 admin center → Manage apps → Upload custom app → … → Add agent → upload the `.zip`.
- **Public:** submit via Partner Center to the Microsoft 365 App Store.

Generate a GUID for `id`:

```powershell
[guid]::NewGuid().ToString()
```
