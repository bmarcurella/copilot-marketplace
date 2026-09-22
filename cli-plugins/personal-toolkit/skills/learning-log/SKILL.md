---
name: learning-log
description: "Use when Brandon wants to capture or revisit something he learned about agentic engineering, Copilot, or the Microsoft stack. USE FOR: log what I learned, add this to my learning log, capture that lesson, note that down for later, what have I learned about X, review my lessons, quiz me on my learning log. Appends dated entries to docs/learning-log.md in the copilot-marketplace repo so lessons survive the chat session; can also summarize or quiz from past entries."
license: MIT
metadata:
  author: bmarcurella
---

# Learning log

Turn in-session insights into a permanent, versioned journal instead of losing them when the chat
ends. The journal is `docs/learning-log.md` in Brandon's `copilot-marketplace` clone.

## Find the journal

1. If the current workspace is the `copilot-marketplace` repo, use `docs/learning-log.md` directly.
2. Otherwise, look for a clone in the obvious places (e.g. sibling folders of the workspace, or a
   path the user has mentioned). If not found, ask once where the clone lives, and remember the
   answer for the rest of the session.
3. If there is genuinely no clone available, write the entry to the chat and say it needs to be
   pasted into the journal — never silently drop a lesson.

## Capture a lesson ("log what I learned")

1. Identify the lesson(s) from the conversation — the non-obvious things: corrected assumptions,
   mental models that clicked, gotchas hit and their fixes. Skip routine facts.
2. Append under a `## YYYY-MM-DD` heading (create it if today's is missing, newest date at the
   top of the file). One bullet per lesson, in this shape:
   `- **<topic>** — <the insight in one or two sentences>. *(context: <what prompted it>)*`
3. Keep each bullet self-contained — readable in six months without the original chat.
4. Show the added entry, and remind Brandon to commit (house rule: he reviews every commit; the
   journal is content, so a simple `docs: log lessons` commit on a branch is the pattern).

## Review ("what have I learned about X" / "quiz me")

- **Summarize:** read the journal, group relevant entries by theme, and answer from them —
  citing the entry dates so he can find the originals.
- **Quiz:** pick 3–5 entries (favor older ones), turn each into a question, ask them one at a
  time, then correct answers against what the journal actually says.

## Rules

- Never record secrets, customer names under NDA, or personal data — generalize the lesson.
- Never rewrite or delete past entries; the log is append-only. Corrections get a new entry
  that references the old date.
