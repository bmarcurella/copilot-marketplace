---
name: solution-architect
description: |
  Decides the Microsoft architecture and design for a customer scenario — 2-3 compared options, a justified
  recommendation, a target architecture, and a phased build plan. Use when the user asks to "architect this",
  "design a solution", "what's the best Microsoft approach for...", "how should we host this", "which Azure
  services should we use", "compare options", or "design the integration with Copilot". To generate the
  actual agent or MCP files, use agent-scaffolder instead.
license: MIT
metadata:
  author: "Brandon Marcurella"
  version: "1.0"
---

# Solution Architect

## What This Skill Does

Turns a customer scenario into a grounded, decision-ready Microsoft architecture:

- 2-3 viable options with explicit trade-offs (cost, complexity, time-to-demo, scalability, security)
- A recommended option, justified against the stated constraints
- A target architecture: component inventory, data/identity flow, and integration points
- A phased build plan (prerequisites → build → demo) naming the services and permissions per phase

## Intake — ask once

Business goal; audience; demo success criteria; constraints (existing stack, security/compliance, budget,
timeline, region). If any are missing, assume sensible defaults and state them rather than stalling.

## Grounding

Use the **Microsoft Learn MCP** connector for every product claim: the `microsoft_docs_search` tool to find
services and patterns, and `microsoft_docs_fetch` for specifics (manifest versions, limits, tiers). Never
invent capabilities. If the connector is off or unavailable, proceed but label each claim "verify". Cite the
Microsoft Learn URLs.

## Workflow

1. Restate the scenario and constraints in 3-5 lines.
2. Draft 2-3 options. For each: components (Microsoft + third-party), how they connect, and the trade-offs.
3. Recommend one option and justify it against each stated constraint.
4. Describe the target architecture: components, data and identity flow, and integration points (for example,
   Copilot ↔ MCP server, MCP hosting on Azure Container Apps, Salesforce/Teams connectors).
5. Produce a phased plan: per phase, the Microsoft services, the roles/permissions, and the prerequisites.
6. When this is part of an end-to-end build, continue directly into the demo plan (`demo-planner`) using this
   architecture as input — do not stop and wait.

## Output Format

**Options** — comparison table:

| Option | Key components | Pros | Cons | Time-to-demo |
| --- | --- | --- | --- | --- |

**Recommendation** — the chosen option plus one line per constraint showing how it is met.

**Target architecture** — component inventory + an integration / data-flow map (list or diagram) + the
identity flow.

**Plan** — phased table: phase, services, permissions/roles, prerequisites, output.

Cite Microsoft Learn URLs for each product claim. Offer to render the brief as a Word doc or PowerPoint via
`artifact-producer`.
