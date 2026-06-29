# Customer Architect — Copilot Cowork plugin

A Microsoft 365 app package that extends **Copilot Cowork** to help you **architect and scaffold customer
demos** on the Microsoft stack. It reasons over current Microsoft offerings via the **Microsoft Learn MCP
server**, then produces architecture options, a plan, demo data, agent scaffolds, and Word/Excel/PowerPoint
deliverables.

This package follows the official Cowork plugin format: an
[M365 app package](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development)
(`manifest.json` v1.29 + icons + `skills/` folders) zipped at the root.

## Package contents

```text
customer-architect/
├── manifest.json                 # M365 Unified App Manifest v1.29 (agentSkills + agentConnectors)
├── color.png                     # 192×192 color icon (placeholder — replace before store submission)
├── outline.png                   # 32×32 outline icon (placeholder — replace before store submission)
└── skills/
    ├── demo-architect/SKILL.md          # orchestrator / entry point
    ├── solution-architect/SKILL.md
    ├── demo-planner/SKILL.md
    ├── demo-data-builder/SKILL.md
    ├── agent-scaffolder/SKILL.md
    └── artifact-producer/SKILL.md
```

## Skills

| Skill | When it activates |
| --- | --- |
| `demo-architect` | **Entry point** — drives the whole demo end-to-end (architecture → deliverables) |
| `solution-architect` | Architect/design a Microsoft solution with options + plan |
| `demo-planner` | Turn an architecture into a scene-by-scene demo runbook |
| `demo-data-builder` | Generate synthetic demo datasets (Excel/CSV/JSON) |
| `agent-scaffolder` | Scaffold Copilot/MCP agents for the demo |
| `artifact-producer` | Produce Word/PowerPoint/Excel deliverables |

## Connectors

- **Microsoft Learn MCP server** (`agentConnectors[0]`) — remote MCP server at
  `https://learn.microsoft.com/api/mcp` (no auth). Exposes `microsoft_docs_search`, `microsoft_docs_fetch`,
  and `microsoft_code_sample_search`.
- **Office (Word/Excel/PowerPoint)** is **native to Cowork**, so it is *not* a connector — `artifact-producer`
  and `demo-data-builder` use those capabilities directly.

## Before you publish

1. Set `developer.name` and the `websiteUrl` / `privacyUrl` / `termsOfUseUrl` in `manifest.json` (currently
   placeholders), and replace the `{{Publisher or Org}}` author in each `SKILL.md`.
2. Replace `color.png` / `outline.png` with real branded icons.
3. Keep the generated `id` GUID stable across updates.

## Package (zip at root)

```powershell
Compress-Archive -Path manifest.json, color.png, outline.png, skills -DestinationPath ..\customer-architect.zip -Force
```

## Install / test

- **Personal sideload** with the Microsoft 365 Agents Toolkit CLI:

  ```bash
  npm install -g @microsoft/m365agentstoolkit-cli
  atk auth login
  atk install --file-path "..\customer-architect.zip" --scope Personal
  ```

- **Direct upload in Cowork:** **Customize → Plugins → Upload plugin**, then select the `.zip`.
- **Tenant publish:** M365 admin center → **Agents → All agents → … → Add agent**, upload the `.zip`; it then
  appears in **Cowork → Sources & Skills → Plugins → Discover**.

Test in a **new** conversation and select the plugin in the **Sources & Skills** panel before relying on it.

> Sources:
> [Build plugins for Copilot Cowork](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development),
> [Elicitation forms](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-elicitation-forms).
