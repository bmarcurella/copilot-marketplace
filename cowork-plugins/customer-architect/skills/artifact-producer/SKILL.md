---
name: artifact-producer
description: |
  Structures architecture, plans, data, or scaffolds into polished customer-ready Word, Excel, or PowerPoint
  deliverables. Use when the user asks to "make a deck", "write the design doc", "create a PowerPoint",
  "Word document", "export to Excel", "create the deliverable", or "polish this into a doc". For a complete
  end-to-end demo package — architecture, plan, data, and deliverables — use demo-architect.
license: MIT
metadata:
  author: "Brandon Marcurella"
  version: "1.1.0"
---

# Artifact Producer

## What This Skill Does

Adds customer-deliverable *structure* to source content (architecture brief, demo runbook, demo data, or
agent scaffold), then delegates file creation to Cowork's built-in **Word**, **Excel**, and **PowerPoint**
skills. This skill contributes the document architecture — audience-appropriate ordering, slide discipline,
and workbook layout — not the file writing itself.

## Intake

If the source content and audience are already established in the conversation, use them and do not ask
again. Otherwise ask once: deliverable type(s) and audience; customer name/branding (use placeholders if not
provided); which source content to render. Default to neutral branding and synthetic content.

<!-- method:start -->
## Workflow

1. Confirm the deliverable type(s) and audience: Word design doc, PowerPoint deck, and/or Excel workbook.
2. Pull the source content from earlier phases of the conversation, or from what the user provides.
3. Structure for the audience: executive summary first for business stakeholders; component detail and
   sequence flows for technical reviewers.
4. For decks: one idea per slide, plus an architecture-diagram slide, an options-comparison slide, and a
   next-steps slide.
5. For workbooks: a tab per dataset/section, typed headers, and a summary/dashboard tab where useful.
6. Keep branding neutral and content synthetic; use placeholders for the customer name and logos.
7. **Create the file(s)** by delegating to the built-in **Word**, **PowerPoint**, and **Excel** skills. Don't
   just describe the document — produce it in the conversation's output folder.

## Output Format

The finished Word, PowerPoint, and/or Excel file(s) as actual generated files, plus a short summary of each
file's contents and review notes.
<!-- method:end -->

## When run standalone

Point the user at the side panel **Output folder** (and the OneDrive **Cowork** folder) to download the
files, and list what to customize before showing them to a customer.
