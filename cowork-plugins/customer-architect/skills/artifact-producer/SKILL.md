---
name: artifact-producer
description: |
  Turns architecture, plans, data, or scaffolds into polished Word, Excel, or PowerPoint deliverables. Use
  when the user asks to "make a deck", "write the design doc", "create a PowerPoint", "Word document",
  "export to Excel", "create the deliverable", or "polish this into a doc".
license: MIT
metadata:
  author: "Brandon Marcurella"
  version: "1.0"
---

# Artifact Producer

## What This Skill Does

Renders source content (architecture brief, demo runbook, demo data, or agent scaffold) into a customer-ready
Word doc, PowerPoint deck, or Excel workbook using Cowork's native Office capability — as actual generated
files.

## Intake — ask once

Deliverable type(s) and audience; customer name/branding (use placeholders if not provided); which source
content to render. Default to neutral branding and synthetic content.

## Workflow

1. Confirm the deliverable type(s) and audience: Word design doc, PowerPoint deck, and/or Excel workbook.
2. Pull source content from the relevant companion skill's output, or from what the user provides.
3. Structure for the audience: executive summary first for business stakeholders; component detail and
   sequence flows for technical reviewers.
4. For decks: one idea per slide, plus an architecture-diagram slide, an options-comparison slide, and a
   next-steps slide.
5. For workbooks: a tab per dataset/section, typed headers, and a summary/dashboard tab where useful.
6. Keep branding neutral and content synthetic; use placeholders for the customer name and logos.
7. **Create the file(s)** using Cowork's native Office capability, then summarize what's inside and what to
   review. Don't just describe the document — produce it.

## Output Format

The finished Word, PowerPoint, and/or Excel file(s) as actual generated files, plus a short summary of each
file's contents and review notes.
