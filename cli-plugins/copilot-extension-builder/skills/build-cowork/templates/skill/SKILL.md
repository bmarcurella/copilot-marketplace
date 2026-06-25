---
name: {{skill-name}}
description: |
  {{One or two sentences naming WHEN Cowork should use this skill and for what.}}
  Use when the user asks to "{{trigger phrase 1}}", "{{trigger phrase 2}}", or "{{trigger phrase 3}}".
license: MIT
metadata:
  author: "{{Publisher or Org}}"
  version: "1.0"
---

# {{Skill Title}}

## What This Skill Does

{{One short paragraph: the outcome this skill produces.}}

## Workflow

1. {{First concrete action — read a file, call a tool, gather an input.}}
2. {{Second action. If you use a connector tool, name it: "use the `tool_name` tool".}}
3. {{Third action.}}
4. {{Produce the output.}}

## Output Format

{{Show the exact structure the user should get — a table, list, or document outline. Being explicit here
greatly improves consistency.}}

<!--
Rules:
- `name` (above) MUST be kebab-case and identical to this skill's folder name, or the skill is rejected
  (validation ASKILL-P006/P007).
- `description` is how Cowork decides when to activate the skill — include real trigger phrases.
- Keep this body lean (< ~2,000 words). Move deep material into a `references/` subfolder and name those
  files here. Put executable helpers in `scripts/`. Companion files: ≤20, ≤5 MB each, ≤10 MB total.
- Never put secrets in this file — use a connector (agentConnectors) with auth instead.
-->
