---
name: agent-scaffolder
description: |
  Generates the actual agent or MCP files a demo needs — persona/instructions, tool definitions, and
  manifest/config files with placeholder IDs and env-var secret references. Use when the user asks to
  "scaffold an agent", "create the agent files", "generate the MCP server", "write the agent instructions",
  "wire up the tools", "build the manifest", or "a Copilot agent that calls our API". To choose the
  architecture or hosting rather than generate files, use solution-architect.
license: MIT
metadata:
  author: "Brandon Marcurella"
  version: "1.0"
---

# Agent Scaffolder

## What This Skill Does

Generates demo-ready agent/MCP scaffolding: a persona/instructions block, tool definitions, and
manifest/config files with placeholder IDs and environment-variable secret references — never literal
secrets.

## Intake — ask once

Target surface (Copilot declarative agent, MCP server/client, Azure AI Foundry); the exact actions/tools to
expose; the hosting target; the auth model. Take these from the architecture if it already exists.

## Grounding

Confirm manifest versions, required fields, and auth patterns via the **Microsoft Learn MCP** connector (the
`microsoft_docs_search` and `microsoft_docs_fetch` tools) — don't guess schema versions. If the connector is
off, proceed but mark versions and fields "verify".

## Workflow

1. Confirm the surface and the tool/action list from the architecture.
2. Produce the scaffold: instructions/persona block, tool/connector list, and manifest or config files. Use
   placeholders for IDs, endpoints, and secrets — secrets are environment-variable references only, never
   literal tokens or keys.
3. For MCP servers: define each tool (name, description, inputs, outputs) and the hosting target (for example,
   Azure Container Apps).
4. Provide the local test/run loop and a clear definition of "working".
5. Flag what must be created in a portal/UI (Copilot Studio, Foundry) versus what is file-based; when part of
   an end-to-end build, continue into the deliverables (`artifact-producer`) for any written design.

## Output Format

- An agent instructions/persona block.
- A tool table: tool, description, inputs, outputs.
- Manifest/config files with placeholders (no secrets), created as actual files where useful.
- Test/run steps and the definition of "working".
