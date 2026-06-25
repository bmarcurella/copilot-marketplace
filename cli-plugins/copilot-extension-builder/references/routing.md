# Routing: where to hand off per surface + primitive

When the interview lands on something this builder **does not own**, hand off to the installed skill or
agent below. Owned paths (GitHub CLI plugin packaging, Cowork) stay in this plugin.

> The router should confirm the target skill/agent is actually installed before promising it. If it is
> missing, fall back to the canonical docs in [links.md](links.md) and scaffold from first principles.

---

## Owned by this builder (do not route)

| Goal | Handler |
| --- | --- |
| Package a GitHub Copilot CLI / VS Code **plugin** (`plugin.json` + components + marketplace) | `build-cli-plugin` skill (in this plugin) |
| Create a **Cowork** skill or plugin package | `build-cowork` skill (in this plugin) |
| Check/refresh this builder's own knowledge | `sync-knowledge` skill (in this plugin) |

---

## Routed to installed skills

### GitHub Copilot CLI / VS Code — individual primitives
For a **standalone** agent, skill, instruction, prompt, or hook (not a distributable plugin package):

- **Route to:** `agent-customization`
- **Covers:** `*.instructions.md`, `*.prompt.md`, `*.agent.md`, `SKILL.md`, `copilot-instructions.md`, `AGENTS.md`, hooks
- **Hand-off phrasing:** "Use the agent-customization workflow to create a `<type>` named `<name>` in `<location>`."
- **Then:** if the user later wants to distribute several of these as one unit, come back to `build-cli-plugin` to wrap them.

### Microsoft 365 Copilot — declarative agent + plugin
- **Declarative agent (no/low code, manifest-first):** `mcp-create-declarative-agent`
- **Declarative agent (TypeSpec):** `typespec-create-agent`
- **API/REST plugin (TypeSpec):** `typespec-create-api-plugin`, then `typespec-api-operations` to add GET/POST/PATCH/DELETE
- **MCP plugin / full project / provision / deploy / local test:** `microsoft-365-agents-toolkit`
- **Adaptive Card responses:** `mcp-create-adaptive-cards`
- **Deploy / manage published agents:** `mcp-deploy-manage-agents`
- **Deep expert help:** subagent **"MCP M365 Agent Expert"**
- **Sequence:** build/choose the **agent** first → add a **plugin** (MCP or REST) for actions → optional Adaptive Cards → deploy.

### Copilot Studio — agent + connectors
- **MCP server for Studio:** `mcp-copilot-studio-server-generator`
- **Power Platform custom connector + MCP:** `power-platform-mcp-connector-suite`
- **Deep expert help:** subagent **"Power Platform MCP Integration Expert"** or **"Power Platform Expert"**
- **Note:** the Studio agent itself is authored in the Copilot Studio web UI; this builder helps with the **connector/MCP** side and the decision/architecture.

### Power Platform solution context (when the agent is part of a bigger solution)
- **Architecture from requirements:** `power-platform-architect`
- **Code App scaffold:** `power-apps-code-app-scaffold`

### Azure AI Foundry — pro-code agents
- **Route to:** `microsoft-foundry`
- **Covers:** hosted/prompt agent create, tools, eval, continuous monitoring, prompt optimizer, fine-tune (SFT/DPO/RFT), deploy.

---

## Routing quick table

| Interview result | Route to |
| --- | --- |
| CLI/VS Code · standalone agent/skill/instruction/prompt/hook | `agent-customization` |
| CLI/VS Code · distributable plugin package | **`build-cli-plugin`** (owned) |
| M365 · declarative agent | `mcp-create-declarative-agent` or `typespec-create-agent` |
| M365 · REST/OpenAPI plugin | `typespec-create-api-plugin` + `typespec-api-operations` |
| M365 · MCP plugin / project / deploy | `microsoft-365-agents-toolkit` |
| M365 · Adaptive Cards | `mcp-create-adaptive-cards` |
| Cowork · skill or package | **`build-cowork`** (owned) |
| Copilot Studio · agent + MCP/connector | `mcp-copilot-studio-server-generator`, `power-platform-mcp-connector-suite` |
| Foundry · agent | `microsoft-foundry` |

---

## After any hand-off

1. Confirm the routed skill produced the expected files/output.
2. Append a one-line note to [lessons.md](lessons.md) if the user corrected the routing or the result
   (this is how the builder gets smarter — see `sync-knowledge`, maintainer mode).
