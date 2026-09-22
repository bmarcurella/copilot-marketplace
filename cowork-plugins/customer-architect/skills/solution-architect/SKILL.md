---
name: solution-architect
description: |
  Decides the Microsoft architecture and design for a customer scenario — 2-3 compared options, a justified
  recommendation, a target architecture, and a phased build plan. Use when the user asks to "architect this",
  "design a solution", "what's the best Microsoft approach for...", "how should we host this", "which Azure
  services should we use", "compare options", or "design the integration with Copilot". To generate the actual
  agent or MCP files, use agent-scaffolder. For a complete end-to-end demo package — architecture plus demo
  plan, demo data, and deliverables — use demo-architect.
license: MIT
metadata:
  author: "Brandon Marcurella"
  version: "1.1.0"
---

# Solution Architect

## What This Skill Does

Turns a customer scenario into a grounded, decision-ready Microsoft architecture:

- 2-3 viable options with explicit trade-offs (cost, complexity, time-to-demo, scalability, security)
- A recommended option, justified against the stated constraints
- A target architecture: component inventory, data/identity flow, and integration points
- A phased build plan (prerequisites → build → demo) naming the services and permissions per phase

## Intake

If the conversation already established a brief — customer, audience, key message, constraints — use it and
do not ask again. Otherwise ask once, batched: business goal; audience; demo success criteria; constraints
(existing stack, security/compliance, budget, timeline, region). Assume sensible defaults for anything
unstated and say which defaults you assumed rather than stalling.

<!-- method:start -->
## Grounding

Ground every product claim in the `microsoft-learn-mcp` connector: use the `microsoft_docs_search` tool to
find services and patterns, and `microsoft_docs_fetch` for specifics (manifest versions, limits, tiers).
Never invent capabilities. If the connector is unavailable, proceed but label each claim "verify". Cite the
Microsoft Learn URL for each product claim.

## Workflow

1. Restate the scenario and constraints in 3-5 lines.
2. Draft 2-3 options. For each: components (Microsoft + third-party), how they connect, and the trade-offs.
3. Recommend one option and justify it against each stated constraint.
4. Describe the target architecture: components, data and identity flow, and integration points (for example,
   Copilot ↔ MCP server, MCP hosting on Azure Container Apps, Salesforce/Teams connectors).
5. Produce a phased plan: per phase, the Microsoft services, the roles/permissions, and the prerequisites.

## Output Format

**Options** — comparison table:

| Option | Key components | Pros | Cons | Time-to-demo |
| --- | --- | --- | --- | --- |

**Recommendation** — the chosen option plus one line per constraint showing how it is met.

**Target architecture** — component inventory + an integration / data-flow map (list or diagram) + the
identity flow.

**Plan** — phased table: phase, services, permissions/roles, prerequisites, output.
<!-- method:end -->

## When run standalone

After presenting the architecture, offer to render it as a Word design doc or PowerPoint deck via
`artifact-producer`, or to continue into a full demo package via `demo-architect`.
