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

---

## What a plugin package contains

A Cowork plugin is a `.zip` with everything at the root:

```text
my-plugin.zip
├── manifest.json          # M365 Unified App Manifest v1.29
├── color.png              # 192×192 full-color icon
├── outline.png            # 32×32 outline icon
└── skills/                # one folder per skill
    ├── skill-one/
    │   ├── SKILL.md        # required; frontmatter `name` MUST equal the folder name
    │   └── references/     # optional companion files (≤20, ≤5 MB each, ≤10 MB total)
    └── skill-two/
        └── SKILL.md
```

Packaging patterns: **skills-only** (omit `agentConnectors`), **skills + connector**, or **connector-only**
(omit `agentSkills`).

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
- Auth (`toolSource.remoteMcpServer.authorization.type`):
  - `None` — public/anonymous (omit `referenceId`).
  - `OAuthPluginVault` / `ApiKeyPluginVault` — set `referenceId` to the credential registration ID in the
    Microsoft Enterprise Token Store. **Secrets never go in the manifest or skill files.**
  - Servers with **Dynamic Client Registration** can omit `authorization`; Cowork creates the OAuth client.
- **Tool discovery** (inside `remoteMcpServer`):
  - **Dynamic** (recommended when the server exposes `tools/list`, e.g. Microsoft Learn) — *omit*
    `mcpToolDescription`; agents fetch the tool list at runtime. **Requires manifest v1.29+.** On v1.28 the
    package service rejects a `remoteMcpServer` with no `mcpToolDescription` (`Required properties are missing
    from object: mcpToolDescription`).
  - **Static** — set `mcpToolDescription.file` to a bundled JSON of tool definitions (matching `tools/list`
    output). Valid on v1.28; use only when the toolset is stable.
- For structured mid-tool-call input, your MCP server can use **elicitation** (flat object, primitive fields,
  no secrets) — see `../../references/links.md` → Cowork elicitation forms.

---

## Step 3 — Write the manifest

Start from `templates/plugin-package/manifest.json` (Unified App Manifest **v1.29**) and set:

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

Default output: a **sibling folder in the current workspace**, with the `.zip` written one level up so it
doesn't include itself.

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
- **Tenant publish:** M365 admin center → **Agents → All agents → … → Add agent** → upload the `.zip`; it then
  appears in **Cowork → Sources & Skills → Plugins → Discover**.
- **Public:** submit via Partner Center to the Microsoft 365 App Store.

Always **test in a new conversation** and select the plugin in the **Sources & Skills** panel before relying
on it.

---

## Convert an existing Claude plugin

If you already have a Claude Code plugin (`.claude-plugin/plugin.json`, `.mcp.json`, `skills/`), Microsoft's
[conversion script](https://aka.ms/copilot-cowork-plugin-conversion-script) emits a valid M365 `.zip`:

```powershell
.\Convert-ClaudePluginToMOS3.ps1 -PluginPath ./my-claude-plugin -OutputPath ./output
```

`skills/*/SKILL.md` copy over verbatim (same open standard); `.mcp.json` servers become `agentConnectors[]`.
Not yet converted: `commands/`, `agents/`, `hooks/`.

---

## Validation checklist (fix before upload)

- [ ] Each `agentSkills[]` entry has a `folder`; ≤20 entries; no duplicates.
- [ ] Every referenced folder exists in the zip and contains a `SKILL.md`.
- [ ] `SKILL.md` has valid YAML frontmatter with `name` + `description`.
- [ ] `name` is kebab-case and equals the folder's last path segment.
- [ ] Each connector has a unique `id` + `displayName`; exactly one `remoteMcpServer`; HTTPS `mcpServerUrl`.
- [ ] `authorization.referenceId` is present for OAuth/ApiKey, absent for `None`.
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
