---
name: demo-data-builder
description: |
  Generates realistic, clearly-synthetic sample data to make a customer demo believable. Use when the user
  asks for "demo data", "sample data", "seed data", "test dataset", "fake records", "populate", "sample
  Salesforce accounts", or "sample Teams messages".
license: MIT
metadata:
  author: "{{Publisher or Org}}"
  version: "1.0"
---

# Demo Data Builder

## What This Skill Does

Produces internally-consistent, fictional demo datasets in the right format (Excel/CSV/JSON plus sample
documents), with a data dictionary.

## Workflow

1. Identify each dataset the demo needs (CRM accounts/opportunities, support tickets, product catalog, chat
   transcripts, documents).
2. Define a schema per dataset (fields, types, value ranges); keep IDs, dates, and relationships consistent
   across datasets.
3. Generate plausible, clearly fictional data. Never use real customers, real PII, or real secrets; use
   synthetic names and domains (for example, `contoso.com`).
4. Size the data to the demo: enough to look real, small enough to load fast.
5. Produce each dataset in the right format — Excel/CSV for tabular data, sample Word/PowerPoint for
   documents, JSON for API/MCP fixtures.
6. Note how each dataset loads into the demo (import target, connector, or MCP fixture) and hand back to
   `demo-planner`.

## Output Format

- One file per dataset (Excel/CSV/JSON) plus any sample documents
- A short data dictionary: dataset, field, type, notes
