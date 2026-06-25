# Surface Comparison: glossary + capability matrix

The router loads this when you need to see, at a glance, what each surface calls things and what it
can actually do. Pair it with [decision-framework.md](decision-framework.md).

---

## Glossary — what each word means per surface

| Surface | "Agent" | "Plugin" | "Skill" |
| --- | --- | --- | --- |
| **GitHub Copilot CLI / VS Code** | A custom subagent persona (`*.agent.md`) with instructions + tool restrictions. | A distributable **package** (`plugin.json`) bundling agents, skills, hooks, MCP servers, commands. | An on-demand workflow (`SKILL.md`) that activates by description; can bundle scripts/templates. |
| **Microsoft 365 Copilot** | A **declarative agent** = instructions + knowledge + conversation starters + capabilities + actions. | An **action** the declarative agent calls: an **MCP server** or a **REST/OpenAPI** endpoint. *Not standalone.* | (Not a first-class noun; closest is a capability/behavior expressed in the agent's instructions.) |
| **Copilot Cowork** | Cowork itself is the agent; you extend it. | An **M365 app package** (`.zip`, manifest v1.29) bundling Agent Skills + MCP connectors; uploaded or acquired from the marketplace. | An **Agent Skill** (`SKILL.md`: frontmatter `name`/`description` + workflow body); created via guided chat or in a package. |
| **Copilot Studio** | The thing you build (low-code), extended with knowledge/tools/topics. | Not a noun; capabilities are **tools/connectors** (incl. MCP via custom connector). | Not a noun; closest is a **topic** or tool. |
| **Azure AI Foundry** | A hosted/prompt **agent** (`agent.yaml`) with tools, knowledge, eval. | Not a noun; capabilities are **tools**/connected resources. | Not a noun. |

> Practical takeaway: **"plugin" is a packaging/actions word**, and it is only a standalone deliverable
> on **GitHub Copilot CLI/VS Code** and **Cowork**. On **M365/Studio/Foundry**, you build an **agent**
> and attach actions.

---

## Capability matrix — primitive × surface

Legend: ✅ native/first-class · 🔁 via routing to an installed skill · ⛔ not applicable

| Capability | CLI / VS Code | M365 Copilot | Cowork | Copilot Studio | Foundry |
| --- | --- | --- | --- | --- | --- |
| Standalone **agent** | ✅ `*.agent.md` | ✅ declarative agent | ⛔ (extend Cowork) | ✅ Studio agent | ✅ Foundry agent |
| Standalone **skill** | ✅ `SKILL.md` | ⛔ | ✅ Cowork skill | ⛔ | ⛔ |
| **Plugin / package** | ✅ `plugin.json` | ✅ as agent action | ✅ plugin package | ⛔ (tools/connectors) | ⛔ (tools) |
| **Actions via MCP** | ✅ `.mcp.json` | ✅ MCP plugin | ✅ connector | ✅ MCP custom connector | ✅ tool |
| **Actions via REST/OpenAPI** | 🔁 MCP/tooling | ✅ REST plugin (OpenAPI) | ✅ connector | ✅ custom connector | ✅ tool |
| **Knowledge grounding** | instructions/skills | ✅ knowledge sources | ✅ sources/files | ✅ knowledge | ✅ knowledge index |
| **Adaptive Card responses** | ⛔ | ✅ | partial | ✅ | n/a |
| **Lifecycle hooks** | ✅ `hooks.json` | ⛔ | ⛔ | ⛔ | ⛔ |
| **Distribution unit** | plugin + marketplace | Teams/M365 app package | M365 app package (.zip) | Studio publish | Foundry deploy |
| **Primary manifest** | `plugin.json` | declarative-agent v1.7 + plugin v2.4 | Unified Manifest v1.29 + `SKILL.md` | (Studio config) | `agent.yaml` |

---

## Who builds where (audience cues)

- **CLI / VS Code** — you and other developers, in the terminal/editor; code-centric automation, repo-aware.
- **M365 Copilot** — knowledge workers in Word/Excel/Teams/M365 Chat; grounded Q&A + actions on business systems.
- **Cowork** — Cowork users who want extra skills/connectors in their conversations.
- **Copilot Studio** — low-code makers and business teams; conversational agents with topics + connectors.
- **Foundry** — pro-code teams needing custom orchestration, evaluation, and fine-tuning on Azure.

---

## Scaffolding tools per surface (what actually generates files)

| Surface | Tooling | This builder's role |
| --- | --- | --- |
| CLI / VS Code plugin packaging | `plugin.json` conventions, `copilot plugin install` | **Owns** (`build-cli-plugin`) |
| CLI / VS Code agent/skill/instruction/prompt/hook | `agent-customization` skill | **Routes** |
| Cowork skill / package | M365 app package (manifest v1.29 + `SKILL.md`); Customize page upload/guided | **Owns** (`build-cowork`) |
| M365 declarative agent + plugin | M365 Agents Toolkit, TypeSpec, Kiota | **Routes** |
| Copilot Studio agent / MCP connector | Copilot Studio, MCP connector skills | **Routes** |
| Foundry agent | `microsoft-foundry` skill | **Routes** |

Exact routing targets and invocation phrases: [routing.md](routing.md).
Canonical documentation links: [links.md](links.md).
