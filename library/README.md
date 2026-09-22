# library/ — reusable building blocks

Standalone pieces that aren't tied to one plugin. Everything here is **inert** — nothing in this
folder is installed or discovered automatically. Items get used one of two ways:

1. **Copied** into a project's own `.github/` (instructions, prompts, agents) or skills folder.
2. **Bundled** ("graduated") into a plugin under `cli-plugins/` or `cowork-plugins/` once it's
   worth distributing properly.

## What goes where

| Folder | Contents | File convention |
| --- | --- | --- |
| `skills/` | On-demand workflows | `<name>/SKILL.md` (frontmatter: `name`, `description`) |
| `agents/` | Custom subagent personas | `<name>.agent.md` |
| `instructions/` | Always-on guidance for a repo/path | `<name>.instructions.md` |
| `prompts/` | Reusable prompt files | `<name>.prompt.md` |

## Conventions

- Kebab-case names; a skill's frontmatter `name` must match its folder name.
- Descriptions state *when to use it* (trigger phrases), not just what it does.
- Keep items self-contained — no references to files outside their own folder.
- When an item graduates into a plugin, move it (don't copy) so there's one source of truth. The
  default graduation target for personal items is
  [`cli-plugins/personal-toolkit`](../cli-plugins/personal-toolkit) — one user-level install makes
  them available in both the Copilot CLI and VS Code.

## Or skip the copy: native discovery

Copying into `.github/` is no longer the only way standalone items get used. Both the CLI and
VS Code discover repo-local items directly — `.github/skills/<name>/SKILL.md` (also picked up by
Copilot code review and the cloud agent) and `.github/agents/*.agent.md` — and personal, everywhere
skills go in `~/.copilot/skills/` (`copilot plugins install --skill <path> --scope user`). Use the
library for items you're still shaping; use a plugin (or those native paths) once you want them
everywhere.
