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
- When an item graduates into a plugin, move it (don't copy) so there's one source of truth.
