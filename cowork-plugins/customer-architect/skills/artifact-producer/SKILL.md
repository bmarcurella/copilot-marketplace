---
name: artifact-producer
description: |
  Turns architecture, plans, data, or scaffolds into polished Word, Excel, or PowerPoint deliverables. Use
  when the user asks to "make a deck", "write the design doc", "create a PowerPoint", "Word document",
  "export to Excel", "create the deliverable", or "polish this into a doc".
license: MIT
metadata:
  author: "{{Publisher or Org}}"
  version: "1.0"
---

# Artifact Producer

## What This Skill Does

Renders source content (architecture brief, demo runbook, demo data, or agent scaffold) into a
customer-ready Word doc, PowerPoint deck, or Excel workbook using Cowork's native Office capabilities.

## Workflow

1. Confirm the deliverable type and audience: Word design doc, PowerPoint deck, or Excel workbook.
2. Pull source content from the relevant companion skill's output, or from what the user provides.
3. Structure for the audience: executive summary first for business stakeholders; component detail and
   sequence flows for technical reviewers.
4. For decks: one idea per slide, an architecture-diagram slide, an options-comparison slide, and a
   next-steps slide.
5. For workbooks: a tab per dataset/section, typed headers, and a summary/dashboard tab where useful.
6. Keep branding neutral and content synthetic; use placeholders for the customer name and logos.
7. Produce the file and summarize what's inside and what to review.

## Output Format

A finished Word, PowerPoint, or Excel file plus a short summary of its contents and review notes.
