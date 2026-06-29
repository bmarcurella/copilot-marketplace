---
name: demo-planner
description: |
  Turns a scenario or architecture into a scene-by-scene customer demo runbook with talk-track, setup,
  timings, and fallbacks. Use when the user asks to "plan the demo", "write a demo script", "demo flow",
  "demo runbook", "what should we show", or "build a storyline" for a live customer demonstration.
license: MIT
metadata:
  author: "Brandon Marcurella"
  version: "1.0"
---

# Demo Planner

## What This Skill Does

Produces a runnable customer demo plan: audience and key message, scene-by-scene flow with talk-track,
prerequisites and setup, timings, and risk fallbacks.

## Intake — ask once

Audience and technical depth; the single key message; the architecture or capabilities being shown; demo
length; live vs recorded. Assume defaults for anything unstated and say so.

## Workflow

1. Fix the audience and the one key message the demo must land.
2. Break the demo into scenes. For each: goal, what's on screen, exact actions, talk-track, expected result.
3. List prerequisites and setup per scene: accounts, sample data, deployed services, connectors, permissions.
4. Add risks and fallbacks (what to do if a live call fails) and a reset checklist between runs.
5. Estimate timing per scene and total runtime; mark optional scenes.
6. Name the demo data and any scaffolded agents the plan needs so the data and scaffold phases can build
   them; when part of an end-to-end build, continue directly into those phases.

## Output Format

**Header** — audience, key message, total runtime.

**Scenes** — table:

| # | Scene | On screen | Actions | Talk-track | Expected result | Time |
| --- | --- | --- | --- | --- | --- | --- |

**Setup checklist** — accounts, data, services, connectors, permissions.

**Fallbacks & reset** — a fallback per risk, and the between-run reset steps.

Offer to render it as a Word runbook or PowerPoint via `artifact-producer`.
