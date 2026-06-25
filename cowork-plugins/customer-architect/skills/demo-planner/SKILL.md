---
name: demo-planner
description: |
  Turns a scenario or architecture into a scene-by-scene customer demo runbook with talk-track, setup,
  timings, and fallbacks. Use when the user asks to "plan the demo", "write a demo script", "demo flow",
  "demo runbook", "what should we show", or "build a storyline" for a live customer demonstration.
license: MIT
metadata:
  author: "{{Publisher or Org}}"
  version: "1.0"
---

# Demo Planner

## What This Skill Does

Produces a runnable customer demo plan: audience and key message, scene-by-scene flow, prerequisites and
setup, timings, and risk fallbacks.

## Workflow

1. Confirm the audience (persona, technical depth) and the single key message the demo must land.
2. Break the demo into scenes. For each: goal, what's on screen, exact actions, talk-track, expected result.
3. List prerequisites and setup per scene: accounts, sample data, deployed services, connectors, permissions.
4. Add risks and fallbacks (what to do if a live call fails) and a reset checklist between runs.
5. Estimate timing per scene and total runtime; mark optional scenes.
6. Identify the demo data and scaffolded agents the plan needs, and hand off to `demo-data-builder` and
   `agent-scaffolder`.

## Output Format

A demo runbook containing:

- Header: audience, key message, total runtime
- Per-scene table: scene, on-screen, actions, talk-track, expected result, time
- A setup checklist and a fallback list

Offer to render it as a Word runbook or PowerPoint via `artifact-producer`.
