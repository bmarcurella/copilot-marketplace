---
name: demo-data-builder
description: |
  Generates realistic, clearly-synthetic sample data to make a customer demo believable. Use when the user
  asks for "demo data", "sample data", "seed data", "test dataset", "fake records", "populate", "sample
  Salesforce accounts", or "sample Teams messages".
license: MIT
metadata:
  author: "Brandon Marcurella"
  version: "1.0"
---

# Demo Data Builder

## What This Skill Does

Produces internally-consistent, clearly-fictional demo datasets in the right format (Excel/CSV/JSON plus
sample documents), with a data dictionary — created as actual files, not just shown inline.

## Intake — ask once

Which datasets the demo needs (from the runbook if available), rough volume, and the load target (import,
connector, or MCP fixture). Assume defaults and state them if unspecified.

## Workflow

1. List each dataset the demo needs (CRM accounts/opportunities, support tickets, product catalog, chat
   transcripts, documents).
2. Define a schema per dataset (fields, types, value ranges); keep IDs, dates, and relationships consistent
   across datasets so joins look real.
3. Generate plausible, clearly fictional data. Never use real customers, real PII, or real secrets; use
   synthetic names and domains (for example, `contoso.com`).
4. Size the data to the demo: enough to look real, small enough to load fast.
5. **Create the files** using Cowork's native Office/file capability — Excel or CSV for tabular data, sample
   Word/PowerPoint for documents, JSON for API/MCP fixtures. Don't just print tables; produce real files.
6. Note how each dataset loads into the demo (import target, connector, or MCP fixture); when part of an
   end-to-end build, continue into the agent scaffold or deliverables as needed.

## Output Format

- One file per dataset (Excel/CSV/JSON), plus any sample documents, as actual generated files.
- A short data dictionary: dataset, field, type, notes — and the load target for each dataset.
