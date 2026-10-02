---
name: build-cowork
description: "Use when you want to create or scaffold a Microsoft Copilot Cowork skill or plugin — content you add under Cowork's Customize page (or upload as a package) to teach Cowork new domain expertise or connect it to services. USE FOR: Cowork skill, Cowork plugin, extend Copilot Cowork, upload Cowork package, MOS package, M365 app package for Cowork, SKILL.md, agentSkills, agentConnectors, Cowork Customize, when-to-use description. DO NOT USE FOR: GitHub Copilot CLI/VS Code plugins (use build-cli-plugin); M365 Copilot declarative agents/plugins (route to M365 skills)."
license: MIT
metadata:
  author: bmarcurella
---

# Build a Copilot Cowork skill or plugin

Cowork is extended two ways:

- **Skills** — an **Agent Skill** (`SKILL.md`: YAML frontmatter + markdown body) that teaches Cowork a
  behavior or domain expertise. Add one quickly via **Customize → Skills → Add** (guided chat), or author the
  file and include it in a plugin package.
- **Plugins** — a **Microsoft 365 app package** (`.zip`) bundling one or more skills and/or **connectors**
  (remote MCP servers). It's the same packaging used by Teams apps and Copilot agents. Upload via
  **Customize → Plugins → Upload plugin**, sideload with the M365 Agents Toolkit CLI, or publish through the
  M365 admin center / Microsoft 365 App Store.

Templates are in `templates/`. Authoritative spec:
[Build plugins for Copilot Cowork](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development).

---

## Decision

- Just need one new behavior or domain expertise → author a **skill** and add it via **Customize → Skills**.
  Fastest path; no packaging required.
- Need to bundle several skills, ship **connectors** to external data/APIs, or distribute/publish → build a
  **plugin package** (`.zip`).
- Need rich programmatic actions with OAuth, Adaptive Cards, and Teams reach → that's an **M365 declarative
  agent + plugin** instead; route to the M365 skills (see `../../references/routing.md`).

> A Cowork connector **is a remote MCP server**. If your "connector" is really an OpenAPI/REST API with rich
> auth needs, build it as an M365 plugin and route accordingly.

> **Package `agentConnectors` vs. custom federated connectors.** Both put an MCP server in front of Copilot,
> but they're different products. A **custom federated connector** is created by an admin in the M365 admin
> center (Copilot → Connectors → Gallery → Create a new connector). It expects **read-only** tools and, for
> OAuth, a Developer Portal registration with a **client ID + client secret** (PKCE is optional on top). An
> **`agentConnectors[]` entry** ships inside this app package, allows write tools (gated by annotations), and
> its `OAuthPluginVault` registration can be a **public client (no secret) + PKCE** registered with
> `atk`'s `oauth/register` action. If the MCP server's OAuth only issues a public client, or exposes write
> tools, use the package path.

---

## What a plugin package contains

A Cowork plugin is a `.zip` with everything at the root:

```text
my-plugin.zip
├── manifest.json          # M365 Unified App Manifest v1.29 (v1.30 also valid)
├── color.png              # 192×192 full-color icon
├── outline.png            # 32×32 outline icon
├── tools/                 # only if a connector uses mcpToolDescription.file
└── skills/                # one folder per skill
    ├── skill-one/
    │   ├── SKILL.md        # required; frontmatter `name` MUST equal the folder name
    │   └── references/     # optional companion files (≤20, ≤5 MB each, ≤10 MB total)
    └── skill-two/
        └── SKILL.md
```

Packaging patterns: **skills-only** (omit `agentConnectors`), **skills + connector**, or **connector-only**
(omit `agentSkills`). Limits: ≤20 skills and ≤10 connectors per package.

---

## Step 1 — Author each skill (`SKILL.md`)

1. Copy `templates/skill/SKILL.md` into `skills/<skill-name>/SKILL.md`.
2. The frontmatter **`name`** must be **kebab-case** and **identical to the folder name** — a mismatch is the
   single most common cause of skill failures (validation `ASKILL-P006`). No consecutive/leading/trailing
   hyphens, no underscores, no uppercase.
3. Write a precise **`description`** (1–1024 chars) with explicit trigger phrases ("Use when the user asks
   to…"). This is what Cowork uses to select the skill.
4. Keep the body a lean workflow (target < 5,000 tokens / ~1,500–2,000 words): what it does, numbered steps,
   and an explicit output format. Move deep material to `references/` and name those files in the body.
5. If the skill calls connector tools, **name the tools explicitly** (e.g., "use the `search_records` tool").
6. Never embed secrets in `SKILL.md`; use a connector with auth instead.

---

## Step 2 — (Optional) Add connectors

Connectors are **remote MCP servers** declared in the manifest's `agentConnectors[]` — not files.

- Transport: **streamable HTTP over HTTPS** (TLS 1.2+), JSON-RPC 2.0; support `tools/list` and `tools/call`.
- Each entry needs a unique `id`, a `displayName`, and a `toolSource.remoteMcpServer.mcpServerUrl` (valid
  HTTPS).
- Auth (`toolSource.remoteMcpServer.authorization.type`). `referenceId` is required for every type except
  `None`, and must be absent for `None`. **Secrets never go in the manifest or skill files.**
  - `None` — public/anonymous.
  - `OAuthPluginVault` — recommended for production. `referenceId` = the OAuth client registration ID
    (Developer Portal, or `atk`'s `oauth/register` action in `m365agents.yml`, which writes it to an env var).
    Public clients (no secret) are fine with `isPKCEEnabled: true`. Set usage to **Any Microsoft 365
    Organization** if the plugin must work across tenants. Add
    `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect` to the provider's allowed redirect URIs.
  - `ApiKeyPluginVault` — **not supported in Cowork yet**; use OAuth/DCR or `None` for Cowork.
  - `DynamicClientRegistration` — explicit type + `referenceId` to a Developer Portal DCR config; the server
    must expose an RFC 7591 registration endpoint that returns a `client_id` **and** `client_secret`.
    Alternatively, **omit `authorization` entirely** and Cowork creates the OAuth client itself — but that
    shortcut is **Cowork-only** (not Copilot Chat). Don't use DCR for anonymous servers (see lessons.md).
  - `AzureKeyVault` — **v1.29+**; `referenceId` maps to a secret in your own Key Vault.
- **Tool discovery** (inside `remoteMcpServer`):
  - **Dynamic** (recommended) — *omit* `mcpToolDescription`; agents call `tools/list` at runtime and pick
    up tool changes without republishing. **Requires manifest v1.29+.** The v1.28 schema still lists
    `mcpToolDescription` as required (`Required properties are missing from object: mcpToolDescription`),
    even though the Learn sample uses v1.28.
  - **Static** — set `mcpToolDescription.file` to a bundled JSON (matching `tools/list` output); the file
    must exist in the zip. Cowork itself ignores this file and always discovers dynamically.
- **Annotate every tool** (`annotations` in `tools/list`): `readOnlyHint: true` auto-runs;
  `readOnlyHint: false` or `destructiveHint: true` prompts for confirmation; `title` labels the prompt.
  Unannotated tools are treated as destructive.
- **File inputs:** declare a parameter with `contentEncoding: base64` and Cowork sends the workspace file's
  bytes (≤8 files, ≤150 MiB per call, one array file param per tool, inline — no `$ref`, ≤4 levels deep).
- **Recognizing Cowork traffic:** match the `copilot-cowork` prefix (case-insensitive) on the `User-Agent`
  header (every request) or `clientInfo.name` (`initialize` only). It carries no user/tenant identity.
- **Local testing:** expose a local server with a dev tunnel (`devtunnel port create <t> -p <port>
  --protocol http` — `http` describes the *local* service; `https` causes 502s).
- For structured mid-tool-call input, your MCP server can use **elicitation** (flat object, primitive fields,
  no secrets) — see `../../references/links.md` → Cowork elicitation forms.

---

## Step 3 — Write the manifest

Start from `templates/plugin-package/manifest.json` (Unified App Manifest **v1.29**; v1.30 is also valid and
only adds Outlook add-in fields) and set:

- `id` — a stable GUID (keep it constant across updates). Generate with `[guid]::NewGuid().ToString()`.
- `developer` (name + website/privacy/terms URLs), `name` (short/full), `description` (short/full), `icons`,
  `accentColor`.
- `agentSkills[]` — one `{ "folder": "./skills/<name>" }` per skill (≤20, no duplicates).
- `agentConnectors[]` — optional; one entry per remote MCP server (delete the array if skills-only).

---

## Step 4 — Add icons

- `color.png` — 192×192 full-color.
- `outline.png` — 32×32 single-color outline.

Placeholders are fine for personal testing; replace before store submission.

---

## Step 5 — Package (zip at root)

```powershell
Compress-Archive -Path manifest.json, color.png, outline.png, skills -DestinationPath ..\my-plugin.zip -Force
```

Add `tools` to `-Path` only if a connector uses `mcpToolDescription.file`. Default output: a **sibling folder
in the current workspace**, with the `.zip` written one level up so it doesn't include itself.

In an Agents Toolkit project (`appPackage/manifest.json` with `${{ENV_VAR}}` placeholders such as an OAuth
`referenceId`), let `atk` resolve the placeholders and zip instead:

```bash
atk package --manifest-file ./appPackage/manifest.json \
  --output-package-file ./appPackage/build/appPackage.zip \
  --output-folder ./appPackage/build
```

---

## Step 6 — Install / test / publish

- **Upload in Cowork:** **Customize → Plugins → Upload plugin** → select the `.zip` (this is the "Claude
  plugin or MOS package" the upload dialog asks for).
- **Personal sideload:**
  ```bash
  npm install -g @microsoft/m365agentstoolkit-cli
  atk auth login
  atk install --file-path "./my-plugin.zip" --scope Personal
  ```
- **Tenant publish:** M365 admin center → **Manage apps → Upload custom app → … → Add agent** → upload the
  `.zip`; it then appears in **Cowork → Sources & Skills → Plugins → Discover**.
- **Public:** submit via Partner Center to the Microsoft 365 App Store.

Always **test in a new conversation** and select the plugin in the **Sources & Skills** panel before relying
on it.

---

## Convert an existing Claude plugin

If you already have a Claude Code or Cursor plugin (`.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`,
or `.plugin/plugin.json`, plus `.mcp.json` and `skills/`), the Agents Toolkit CLI (**v1.1.12+**) imports it
into an `atk` project:

```bash
npm install -g @microsoft/m365agentstoolkit-cli
atk import openplugin --path ./my-claude-plugin --output ./my-plugin-project \
  --privacy-url https://contoso.com/privacy --terms-url https://contoso.com/terms
```

- `skills/*/SKILL.md` copy over verbatim; `.mcp.json` servers become `agentConnectors[]` (HTTPS URLs default to
  `OAuthPluginVault`, localhost/HTTP to `None`; override with `--default-auth-type`).
- The generated `authorization.referenceId` is a **placeholder** — replace it with your real OAuth
  registration ID before publishing.
- The generated manifest is **`devPreview`**; set `$schema`/`manifestVersion` to a GA version (v1.29+ for
  dynamic discovery) if your publishing channel requires it.
- The `id` is a deterministic UUID v5 from the plugin name (override with `--app-id`). Placeholder icons are
  generated if missing.
- Agent Plugins 1.0 layout (top-level `plugin.json` + `mcp.json`): move to `.plugin/plugin.json` and rename to
  `.mcp.json` first.
- Not yet converted: `commands/`, `agents/`, `hooks/`.
- Round-trip back to a plugin directory with `atk export openplugin`. Then package with `atk package` (Step 5).

Legacy alternative: Microsoft's
[PowerShell conversion script](https://aka.ms/copilot-cowork-plugin-conversion-script)
(`.\Convert-ClaudePluginToMOS3.ps1 -PluginPath ./my-claude-plugin -OutputPath ./output`).

---

## Validation checklist (fix before upload)

- [ ] Each `agentSkills[]` entry has a `folder`; ≤20 entries; no duplicates.
- [ ] Every referenced folder exists in the zip and contains a `SKILL.md`.
- [ ] `SKILL.md` has valid YAML frontmatter with `name` + `description`.
- [ ] `name` is kebab-case and equals the folder's last path segment.
- [ ] Each connector has a unique `id` + `displayName`; exactly one `remoteMcpServer`; HTTPS `mcpServerUrl`.
- [ ] `authorization.referenceId` is present for every type except `None`, and absent for `None`.
- [ ] If `mcpToolDescription` is present, its `file` exists in the zip; if absent, manifest is v1.29+.
- [ ] Every MCP tool returns `annotations` (`readOnlyHint` / `destructiveHint` / `title`).
- [ ] No fields outside the target schema version (`additionalProperties: false` rejects e.g. `packageName`).
- [ ] Companion files: ≤20 per skill, ≤5 MB each, relative paths, no `..`, no hidden/reserved names.

---

## Tips

- The `description` drives selection — be specific with trigger phrases; vague descriptions don't activate.
- Don't duplicate Cowork's built-in skills; check the built-in list first.
- Prefer several **narrow** skills over one broad "do everything" skill.
- Skills use the **Agent Skills** open standard, so the same `SKILL.md` also works in Claude Code, VS Code
  Copilot, and others.

## Templates

| File | Purpose |
| --- | --- |
| `templates/skill/SKILL.md` | One Agent Skill (frontmatter + workflow body) |
| `templates/plugin-package/manifest.json` | M365 Unified App Manifest v1.29 (agentSkills + agentConnectors) |
| `templates/plugin-package/README.md` | Package layout, zip command, and install/test/publish steps |
