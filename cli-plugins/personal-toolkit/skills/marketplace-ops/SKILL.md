---
name: marketplace-ops
description: "Use for any question or task about operating Brandon's personal Copilot marketplace (bmarcurella/copilot-marketplace) — adding or graduating items, versioning, installing/updating plugins, releasing the Cowork plugin, or fixing 'my plugin/skill isn't showing up'. USE FOR: release my cowork plugin, publish a new version, graduate a skill from library, add an agent to my toolkit, update my plugins, why isn't my skill showing up, how does my marketplace work, bump the version. DO NOT USE FOR: building brand-new plugins from scratch (use copilot-extension-builder) or non-marketplace repos."
license: MIT
metadata:
  author: bmarcurella
---

# Marketplace ops (Brandon's runbook)

Operating manual for `bmarcurella/copilot-marketplace`. Follow this instead of re-deriving the
process. House rules: work on branches (never main), every commit is reviewed, run
`node scripts/validate.mjs` before pushing, never commit `.zip` files or secrets.

## The mental model

- The repo IS the marketplace: `.github/plugin/marketplace.json` is the catalog; each
  `cli-plugins/<name>/` folder is an installable plugin. Only what's on `main` is installable.
- One install channel: `copilot plugin install <name>@copilot-marketplace` puts the plugin in
  `~/.copilot/installed-plugins/`, and VS Code auto-discovers that folder. Never install the same
  plugin separately through VS Code's marketplace UI — that creates a second clone that drifts.
- Per-project control is enable/disable (VS Code Plugins view, or `/skills` in the CLI), never
  uninstall.
- `library/` is inert staging. Nothing there reaches any machine until it graduates into
  `personal-toolkit` (or another plugin) and the version is bumped.
- Cowork is different: `cowork-plugins/customer-architect` ships as a `.zip` on GitHub Releases,
  built by CI — never via the CLI marketplace and never committed to git.

## Graduate an item into personal-toolkit

1. Move (don't copy) the item: agents → `cli-plugins/personal-toolkit/agents/<name>.agent.md`;
   skills → `cli-plugins/personal-toolkit/skills/<name>/SKILL.md` (frontmatter `name` must equal
   the folder name, kebab-case) and list new skill folders in the plugin's `skills` array.
2. Bump `version` in `cli-plugins/personal-toolkit/.github/plugin/plugin.json` **and** in its
   `.github/plugin/marketplace.json` entry — they must match (the validator enforces it, and
   VS Code only detects updates on a version change).
3. Update the plugin README contents table. Run `node scripts/validate.mjs`.
4. Branch → commit → PR → merge. Then on each machine:
   `copilot plugin marketplace update copilot-marketplace && copilot plugin update personal-toolkit`.

## Release the Cowork plugin

1. Bump `version` in `cowork-plugins/customer-architect/manifest.json`; merge to main.
2. Run the **Release Cowork plugin** workflow from the repo's Actions tab (workflow_dispatch,
   input: plugin folder name). It validates, builds the zip (manifest at zip root), creates the
   `cowork/<plugin>-v<version>` tag, and publishes the GitHub Release with the zip attached.
   (Pushing that tag manually still works too; existing releases are skipped cleanly.)
3. Download the zip from the Release and upload in **Cowork → Customize → Plugins → Upload
   plugin** — that last step is always manual.

## Troubleshooting

- "Not showing up after an edit": installed components are cached — reinstall the plugin, then
  `/skills reload` in an open CLI session; restart VS Code or refresh the Plugins view.
- "Installed but stale": you probably skipped a version bump — bump both files and reinstall.
- "Skill silently ignored": frontmatter `name` doesn't match its folder, or invalid frontmatter —
  run `node scripts/validate.mjs`; in VS Code use Chat right-click → **Diagnostics**.
- "Marketplace add fails for a local path": pass an absolute path — relative paths are read as
  GitHub repo specs.
- Name collisions: project `.github/skills/` and `.github/agents/` beat plugin-provided ones
  (first-found-wins) — rename rather than fight precedence.
