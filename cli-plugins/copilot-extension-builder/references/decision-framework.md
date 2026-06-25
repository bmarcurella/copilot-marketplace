# Decision Framework: agent vs plugin vs skill, and which surface

Use this when the answer to "what should I even build?" is unclear. The router skill loads this
during **Step 1 (primitive)** and **Step 2 (surface)** of the interview.

---

## Part 1 — The three primitives (cross-surface)

These three words mean slightly different things on each surface, but the underlying ideas are stable:

| Primitive | What it *is* | Build one when… |
| --- | --- | --- |
| **Skill** | On-demand workflow + bundled knowledge/assets that activates by description. | You have a repeatable task or domain knowledge that should kick in automatically, on one host, with no need for context isolation or its own distribution wrapper. |
| **Agent** | A persona/assistant with its own instructions, tools, and knowledge that a user (or another agent) talks to. | You want a configured assistant — specific instructions, a curated tool set, grounded knowledge — or you need context isolation / tool restrictions (a subagent). |
| **Plugin** | A **package** that bundles and distributes capabilities (skills, agents, hooks, MCP servers) — or, on M365, the **actions** an agent can call. | You want to share/install a unit of capability, or (on M365) give an agent the ability to read/write external systems. |

> The trap: people say "I want a plugin" when they actually want a **skill** (a behavior) or an
> **agent** (an assistant). A plugin is usually the *wrapper*, not the capability.

---

## Part 2 — "Is it best to build a plugin, or an agent?"

The honest answer depends on the surface, because the relationship between agent and plugin is **inverted** between them:

### GitHub Copilot CLI / VS Code
- The **plugin is the container**; the **agent and skill are the capabilities** inside it (or standalone).
- **Build the capability first** (a skill or an agent). Wrap it in a **plugin only when you want to install/share it as one unit** (versioned, distributable, with a marketplace entry).
- A single agent or skill you only use yourself does **not** need a plugin wrapper.

### Microsoft 365 Copilot
- The relationship is reversed: a **plugin cannot exist on its own** — it is only an **action inside a declarative agent**.
- So you **build the declarative agent first** (instructions + knowledge + conversation starters), then **attach a plugin** (MCP server or REST/OpenAPI) when the agent needs to *do* things in external systems.
- "A plugin that builds an agent" is backwards here. Think: **agent = the assistant; plugin = its hands.**

### Copilot Cowork
- A **skill** is the atomic unit (markdown instructions + a "when to use" description).
- A **plugin** bundles skills + connectors for distribution.
- Start with a **skill**; graduate to a **plugin package** when you need connectors or want to distribute a set.

### Copilot Studio
- You build an **agent**; you extend it with knowledge, tools, topics, and connectors (MCP via a custom connector).
- There is no standalone "plugin" — capabilities are **tools/connectors attached to the agent**.

---

## Part 3 — Decision tree

```text
1. Are you adding a CAPABILITY/BEHAVIOR, an ASSISTANT, or PACKAGING for distribution?
   ├─ Behavior that should auto-activate on a task ............... SKILL
   ├─ A configured assistant users converse with ................ AGENT
   └─ Bundling/sharing capabilities as one installable unit ..... PLUGIN (wrapper)

2. Where will it run? (the SURFACE)
   ├─ My terminal / VS Code (me + my team, code-centric) ........ GitHub Copilot CLI / VS Code
   ├─ Microsoft 365 Copilot (Word/Teams/M365 chat) ............. M365 declarative agent (+ plugin for actions)
   ├─ Copilot Cowork ........................................... Cowork skill / plugin package
   ├─ Copilot Studio (low-code, makers/business) ............... Copilot Studio agent
   └─ Azure AI Foundry (pro-code agent platform) ............... Foundry agent

3. Does it need to TAKE ACTION in an external system (read/write data, call an API)?
   ├─ Yes, via a standard protocol / existing MCP server ....... add an MCP server plugin/connector
   ├─ Yes, via an existing REST API with OpenAPI .............. add a REST/OpenAPI plugin
   └─ No, it only needs instructions + knowledge .............. agent/skill only, no plugin

4. Do you need CONTEXT ISOLATION or different TOOL RESTRICTIONS per stage?
   ├─ Yes ..................................................... AGENT (subagent)
   └─ No ..................................................... SKILL
```

---

## Part 4 — Tie-breakers

- **Skill vs Agent (CLI/VS Code):** same tools for every step → **Skill**. Need an isolated subagent that returns a single result, or per-stage tool limits → **Agent**.
- **Skill vs Instructions (CLI/VS Code):** applies to *most* work everywhere → **Instructions** (`applyTo`). Specific on-demand task → **Skill**.
- **Skill vs Prompt (CLI/VS Code):** multi-step workflow with bundled assets → **Skill**. Single focused parameterized task → **Prompt**.
- **MCP vs REST (M365 / actions):** target speaks (or should speak) MCP, or you want streaming/tool semantics → **MCP**. You already have a stable REST API with an OpenAPI description → **REST/OpenAPI plugin**.
- **Declarative agent vs custom-engine agent (M365):** grounded on Copilot's model + your knowledge/actions → **declarative agent**. You need your own orchestration/model → **custom engine agent** (Agents Toolkit).
- **Copilot Studio vs Foundry (agent platforms):** low-code, business makers, M365/Teams reach → **Copilot Studio**. Pro-code, custom eval/fine-tune, Azure-native → **Foundry**.

---

## Part 5 — What this builder does with your answer

- **Owns (scaffolds directly):** GitHub CLI **plugin packaging** and **Cowork** skill/package.
- **Routes (hands off to an installed skill):** standalone CLI/VS Code primitives, all M365 agent/plugin work, Copilot Studio, and Foundry.

The exact hand-off target for each combination is in [routing.md](routing.md). The full capability
matrix is in [surface-comparison.md](surface-comparison.md).
