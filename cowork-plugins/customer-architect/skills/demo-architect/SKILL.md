---
name: demo-architect
description: |
  End-to-end conductor for building a customer demo on the Microsoft stack. It gathers the brief once, then
  drives architecture, design, demo plan, demo data, agent scaffolding, and finished deliverables in one
  continuous pass instead of stopping after a single artifact. Use when the user asks to "build a demo",
  "architect and build a customer demo", "put together an end-to-end demo for <customer>", "design and deliver
  a demo", "create a full demo from scratch", or describes a scenario and wants the whole package rather than
  one piece. This is the entry point; it sequences the specialist skills.
license: MIT
metadata:
  author: "Brandon Marcurella"
  version: "1.0"
---

# Demo Architect (orchestrator)

## What This Skill Does

Owns the full customer-demo lifecycle and produces one coherent **demo package** — architecture + design,
build-and-run plan, demo data, agent scaffold, and customer-ready Word/PowerPoint/Excel deliverables. It
sequences the specialist skills so the work does not stall after one step.

This is the **entry point**. The specialists (`solution-architect`, `demo-planner`, `demo-data-builder`,
`agent-scaffolder`, `artifact-producer`) define *how* each phase is done; this skill decides *what runs, in
what order*, and keeps going to the end.

## Before you start

Ground the architecture in current docs via the **Microsoft Learn MCP** connector. If it is not enabled in
**Sources & Skills**, ask the user to turn it on. If they decline or it is unavailable, proceed but mark every
product or version claim as an assumption to verify, and say so up front.

## Intake — ask once, batched

Collect these in a single prompt. Fill gaps with sensible defaults and state them rather than asking again:

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
3. **Architecture & design** — apply the `solution-architect` method: 2-3 grounded options, a recommended
   option, the target architecture, and a phased build plan.
4. **Demo plan** — apply `demo-planner`: scene-by-scene runbook with talk-track, setup, timings, fallbacks.
5. **Demo data** — apply `demo-data-builder`: generate the datasets the runbook references, as real files.
6. **Agent scaffold** — apply `agent-scaffolder` *only if* the demo includes a custom agent or MCP server.
7. **Deliverables** — apply `artifact-producer`: produce the requested Word/PowerPoint/Excel files.
8. Do not stop between phases to ask "should I continue?" — complete the package, then summarize.

## Output Format

A single consolidated response containing, in order:

- **Brief** — restated scenario, audience, key message, constraints.
- **Architecture & design** — options table, recommendation, target-architecture map, phased plan.
- **Demo runbook** — scene table with talk-track, timings, and fallbacks.
- **Generated files** — the demo-data files, agent scaffold, and deliverables, each named with a one-line
  description and what to review.
- **Next steps** — what the user must do in a portal/UI, and what to customize before the live demo.

Cite Microsoft Learn URLs for each product claim.
