---
name: demo-data-builder
description: |
  Generates realistic, clearly-synthetic sample data to make a customer demo believable. Use when the user
  asks for "demo data", "sample data", "seed data", "test dataset", "fake records", "populate", "sample
  Salesforce accounts", or "sample Teams messages". For a complete end-to-end demo package — architecture,
  plan, data, and deliverables — use demo-architect.
license: MIT
metadata:
  author: "Brandon Marcurella"
  version: "1.1.0"
---

# Demo Data Builder

## What This Skill Does

Produces internally-consistent, clearly-fictional demo datasets in the right format (Excel/CSV/JSON plus
sample documents), with a data dictionary — created as actual files, not just shown inline.

## Intake

If a demo runbook already names the datasets it needs, use that list and do not ask again. Otherwise ask
once: which datasets the demo needs, rough volume, and the load target (import, connector, or MCP fixture).
Assume defaults and state them if unspecified.

<!-- method:start -->
## Workflow

1. List each dataset the demo needs (CRM accounts/opportunities, support tickets, product catalog, chat
   transcripts, documents).
2. Define a schema per dataset (fields, types, value ranges); keep IDs, dates, and relationships consistent
   across datasets so joins look real.
3. Generate plausible, clearly fictional data. Never use real customers, real PII, or real secrets; use
   synthetic names and domains (for example, `contoso.com`).
4. Size the data to the demo: enough to look real, small enough to load fast.
5. **Create the files.** Delegate to Cowork's built-in **Excel** skill for tabular data (or write `.csv`
   directly), the **Word** and **PowerPoint** skills for sample documents, and write `.json` directly for
   API/MCP fixtures. Produce real files in the conversation's output folder — don't just print tables.
6. Note how each dataset loads into the demo (import target, connector, or MCP fixture).

## Output Format

- One file per dataset (Excel/CSV/JSON), plus any sample documents, as actual generated files.
- A short data dictionary: dataset, field, type, notes — and the load target for each dataset.
<!-- method:end -->

## When run standalone

After generating the data, tell the user where to find the files (side panel **Output folder**, and the
OneDrive **Cowork** folder) and what to review before the demo.
