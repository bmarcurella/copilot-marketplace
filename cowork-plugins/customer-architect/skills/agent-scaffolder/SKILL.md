---
name: agent-scaffolder
description: |
  Scaffolds the AI agents or MCP servers a demo needs — instructions, tools, manifests, and wiring. Use when
  the user asks to "scaffold an agent", "create the agent", "build an MCP server for the demo", "agent
  instructions", "wire up the tools", or "a Copilot agent that calls our API".
license: MIT
metadata:
  author: "{{Publisher or Org}}"
  version: "1.0"
---

# Agent Scaffolder

## What This Skill Does

Generates agent/MCP scaffolding for the demo: persona/instructions, tool definitions, and manifest/config
files with placeholder IDs and environment-variable secret references.

## Workflow

1. Confirm the target surface from the architecture (Copilot declarative agent, MCP server/client, Azure AI
   Foundry) and the exact actions/tools to expose.
2. Ground the scaffold in current docs through the **Microsoft Learn MCP** connector — use
   `microsoft_docs_search` and `microsoft_docs_fetch` to confirm manifest versions, required fields, and auth
   patterns. Don't guess schema versions.
3. Produce the scaffold: instructions/persona, tool/connector list, and manifest or config files. Use
   placeholders for IDs, endpoints, and secrets — secrets are environment-variable references only, never
   literal tokens or keys.
4. For MCP servers: define each tool (name, description, inputs, outputs) and note the hosting target (for
   example, Azure Container Apps).
5. Provide the local test/run loop and a clear definition of "working".
6. Flag what must be created in a portal/UI (Copilot Studio, Foundry) versus what is file-based, and hand off
   to `artifact-producer` for any written design.

## Output Format

- An agent instructions/persona block
- A tool table: tool, description, inputs, outputs
- Manifest/config files with placeholders (no secrets)
- Test/run steps
