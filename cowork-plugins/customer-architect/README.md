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
    ├── demo-architect/           # orchestrator / entry point
    │   ├── SKILL.md
    │   └── references/           # per-phase methods, loaded on demand (generated — see below)
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

## How orchestration works

Cowork skills **cannot invoke each other**, and companion files may not use `..` path traversal — so an
orchestrator can't read a sibling skill's `SKILL.md`. Instead, `demo-architect` carries its own copy of each
phase's method under `references/`, which Cowork loads on demand when the orchestrator reaches that phase.

Those reference files are **generated**, never hand-edited. The source of truth is the block between
`<!-- method:start -->` and `<!-- method:end -->` in each specialist `SKILL.md`. Regenerate after editing a
specialist:

```bash
node scripts/sync-cowork-references.mjs          # regenerate
node scripts/sync-cowork-references.mjs --check   # CI: fail if stale
```

The five specialists remain independently triggerable for one-off asks ("just plan the demo").

## Connectors

- **Microsoft Learn MCP server** (`agentConnectors[0]`) — remote MCP server at
  `https://learn.microsoft.com/api/mcp` (no auth). Exposes `microsoft_docs_search`, `microsoft_docs_fetch`,
  and `microsoft_code_sample_search`.
- **Office (Word/Excel/PowerPoint)** is **native to Cowork** as built-in skills, so it is *not* a connector —
  `artifact-producer` and `demo-data-builder` delegate to those built-in skills.

## Before you publish

1. Replace `color.png` / `outline.png` with real branded icons.
2. Keep the generated `id` GUID stable across updates; bump `version` in `manifest.json` on each release.

## Build the package

From the repo root — this zips with `manifest.json` at the **root** (required; zipping the folder itself
produces a package Cowork rejects):

```bash
./scripts/build-cowork.sh customer-architect     # → dist/customer-architect-<version>.zip
```

Releases are built by CI: push a tag `cowork/customer-architect-v<version>` matching `manifest.json`.

## Install / test

1. **Personal sideload** with the Microsoft 365 Agents Toolkit CLI:

   ```bash
   npm install -g @microsoft/m365agentstoolkit-cli
   atk auth login
   atk install --file-path "./dist/customer-architect-1.1.0.zip" --scope Personal
   ```

2. **Direct upload in Cowork:** **Customize → Plugins → Upload plugin**, then select the `.zip`.
3. **Tenant publish:** M365 admin center → **Agents → All agents → … → Add agent**, upload the `.zip`; it
   then appears in **Cowork → Sources & Skills → Plugins → Discover**.

Test in a **new** conversation (skill edits don't apply to active threads), and enable the plugin plus the
**Microsoft Learn MCP** connector in **Sources & Skills** first.

### Smoke tests

| Prompt | Expect |
| --- | --- |
| "Build an end-to-end demo for Contoso showing Copilot over their CRM." | `demo-architect` activates, asks intake **once**, then runs all phases without stopping |
| "Just plan the demo for Contoso." | `demo-planner` activates alone |
| "Which Azure services should we use to host an MCP server?" | `solution-architect` activates, cites Learn URLs |
| "Make me a deck from that architecture." | `artifact-producer` activates; a `.pptx` lands in the output folder |

Watch the **Skills** chips in the side panel to confirm which skills loaded. During an end-to-end run you
should see `demo-architect` (and the built-in **Word**/**Excel**/**PowerPoint** skills) — *not* the five
specialists, because the orchestrator reads its own `references/` instead.

> Sources:
> [Build plugins for Copilot Cowork](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development),
> [Use Copilot Cowork](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/use-cowork).
