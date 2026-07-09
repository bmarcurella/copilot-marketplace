---
name: demo-architect
description: |
  End-to-end conductor for building a customer demo on the Microsoft stack. Gathers the brief once, then runs
  architecture, design, demo plan, demo data, agent scaffolding, and finished deliverables in one continuous
  pass instead of stopping after a single artifact. Use when the user asks to "build a demo", "architect and
  build a customer demo", "put together an end-to-end demo for <customer>", "design and deliver a demo",
  "create a full demo from scratch", or describes a scenario and wants the whole package rather than one
  piece. For a single piece only, use solution-architect, demo-planner, demo-data-builder, agent-scaffolder,
  or artifact-producer directly.
license: MIT
metadata:
  author: "Brandon Marcurella"
  version: "1.1.0"
---

# Demo Architect (orchestrator)

## What This Skill Does

Owns the full customer-demo lifecycle and produces one coherent **demo package** — architecture + design,
build-and-run plan, demo data, agent scaffold, and customer-ready Word/PowerPoint/Excel deliverables.

This skill is self-contained: the method for each phase lives in its own reference file under `references/`,
listed below. Read the reference file for a phase when you reach that phase — not before. Do not wait for
another skill to activate; you already have everything you need.

## Additional Resources

- **`references/architecture-method.md`** — how to produce the architecture options, recommendation, target
  architecture, and phased plan.
- **`references/demo-plan-method.md`** — how to produce the scene-by-scene runbook with talk-track, timings,
  and fallbacks.
- **`references/demo-data-method.md`** — how to design and generate the synthetic demo datasets.
- **`references/agent-scaffold-method.md`** — how to scaffold an agent or MCP server, including tool
  annotations.
- **`references/deliverables-method.md`** — how to structure and produce the Word/PowerPoint/Excel files.

## Before you start

Ground the architecture in current docs via the `microsoft-learn-mcp` connector (tools:
`microsoft_docs_search`, `microsoft_docs_fetch`, `microsoft_code_sample_search`). If it is not enabled in
**Sources & Skills**, ask the user to turn it on. If they decline or it is unavailable, proceed but mark
every product or version claim as an assumption to verify, and say so up front.

File creation is delegated to Cowork's built-in **Word**, **Excel**, and **PowerPoint** skills. Finished
files land in the conversation's output folder and the OneDrive **Cowork** folder.

## Intake — ask once, batched

Collect these in a single prompt. Fill gaps with sensible defaults and state them rather than asking again.
This is the **only** intake for the whole run; every later phase inherits this brief.

1. Customer / scenario and the business problem to solve.
2. Audience and technical depth (exec, IT decision-maker, developer).
3. The one key message the demo must land.
4. Constraints: existing stack, security/compliance, budget, timeline, region.
5. Demo length and format (live, recorded, hands-on lab).
6. Deliverables wanted: deck, design doc, workbook, working agent scaffold (any or all).

## Workflow

1. Run the intake above and restate the brief in 3-5 lines for confirmation.
2. Present a one-screen **plan of record** (the phases below and what each will produce), then proceed
   without waiting unless the user explicitly asked to review between phases.
3. **Architecture & design** — read `references/architecture-method.md` and follow it.
4. **Demo plan** — read `references/demo-plan-method.md` and follow it, using the architecture as input.
5. **Demo data** — read `references/demo-data-method.md` and follow it, generating the datasets the runbook
   references as real files.
6. **Agent scaffold** — *only if* the demo includes a custom agent or MCP server: read
   `references/agent-scaffold-method.md` and follow it. Otherwise skip this phase and say you skipped it.
7. **Deliverables** — read `references/deliverables-method.md` and follow it to produce the requested files.
8. Do not stop between phases to ask "should I continue?" and do not re-run intake. Complete the package,
   then summarize.

## Output Format

A single consolidated response containing, in order:

- **Brief** — restated scenario, audience, key message, constraints.
- **Architecture & design** — options table, recommendation, target-architecture map, phased plan.
- **Demo runbook** — scene table with talk-track, timings, and fallbacks.
- **Generated files** — the demo-data files, agent scaffold, and deliverables, each named with a one-line
  description and what to review.
- **Next steps** — what the user must do in a portal/UI, and what to customize before the live demo.

Cite Microsoft Learn URLs for each product claim.
