---
name: solution-architect
description: |
  Reasons over current Microsoft offerings to recommend an architecture and design for a customer
  scenario, with 2-3 compared options and a phased plan. Use when the user asks to "architect this",
  "design a solution", "what's the best Microsoft approach for...", "how should we host...",
  "integrate X with Copilot", "design an MCP architecture", or "host an MCP server on Azure".
license: MIT
metadata:
  author: "{{Publisher or Org}}"
  version: "1.0"
---

# Solution Architect

## What This Skill Does

Turns a customer scenario into a grounded Microsoft architecture and design:

- 2-3 viable architecture options with trade-offs (cost, complexity, time-to-demo, scalability, security)
- A recommended option, justified against the stated constraints
- A target architecture with component inventory, data/identity flow, and integration points
- A phased plan (prerequisites → build → demo) with the Microsoft services and permissions each phase needs

## Workflow

1. Clarify the scenario: business goal, audience, demo success criteria, and constraints (existing stack,
   security/compliance, budget, timeline, region).
2. Ground every recommendation in current docs through the **Microsoft Learn MCP** connector. Use the
   `microsoft_docs_search` tool to find relevant services and patterns, and `microsoft_docs_fetch` to pull
   full pages for specifics (manifest versions, limits, tiers). Never invent product capabilities; cite the
   Microsoft Learn URLs.
3. Draft 2-3 architecture options. For each, list components (Microsoft + third-party), how they connect,
   and the trade-offs.
4. Recommend one option and justify it against the constraints.
5. Describe the target architecture: components, data and identity flow, and integration points (for example,
   Copilot ↔ MCP server, MCP hosting on Azure Container Apps, Salesforce/Teams connectors).
6. Produce a phased plan listing services, roles/permissions, and prerequisites per phase.
7. Hand off to `demo-planner`, `demo-data-builder`, `agent-scaffolder`, or `artifact-producer` as needed.

## Output Format

| Section | Contents |
| --- | --- |
| Options | Comparison table: option, components, trade-offs |
| Recommendation | Chosen option + rationale tied to the constraints |
| Target architecture | Component inventory + integration map + data/identity flow |
| Plan | Phased steps with Microsoft services and permissions |

Cite Microsoft Learn URLs for each product claim. Offer to render the brief as a Word doc or PowerPoint via
`artifact-producer`.
