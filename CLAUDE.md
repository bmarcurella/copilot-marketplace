# copilot-marketplace — repo conventions

Shareable marketplace monorepo for Microsoft Copilot artifacts. Everything in this repo is
**inert content** (manifests, SKILL.md files, templates) — runnable MCP servers live in the
separate [mcp-servers](https://github.com/bmarcurella/mcp-servers) repo.

## The one structural rule

**One top-level folder per distribution surface.** Artifacts are grouped by *how they ship*,
not by topic:

| Folder | Surface | Ships via |
| --- | --- | --- |
| `cli-plugins/` | GitHub Copilot CLI / VS Code | `.github/plugin/marketplace.json` git marketplace |
| `cowork-plugins/` | Microsoft 365 Copilot Cowork | `.zip` app package attached to a GitHub Release |
| `library/` | none (reusable building blocks) | copied into a project or bundled into a plugin |

Adding a new surface later (MS Scout, Copilot Studio, …) = add a new top-level folder following
the same pattern. Never mix surfaces inside one folder.

## Adding artifacts

Scaffolding templates live in `cli-plugins/copilot-extension-builder/skills/*/templates/` —
use them (or the installed `copilot-extension-builder` plugin) rather than writing manifests
from scratch.

- **CLI plugin** → `cli-plugins/<name>/` with `.github/plugin/plugin.json`, then **register it**
  in `.github/plugin/marketplace.json` with `"source": "cli-plugins/<name>"` and a matching version.
- **Cowork plugin** → `cowork-plugins/<name>/` with `manifest.json` (Unified App Manifest v1.29),
  `color.png` (192×192), `outline.png` (32×32), and `skills/<skill>/SKILL.md`.
- **Standalone skill/agent/prompt/instruction** → `library/<type>/` (see `library/README.md`).
- Every `SKILL.md` needs frontmatter with `name` (matching its folder) and a `description` that
  states when to use it (USE-FOR trigger phrases).

## Cowork orchestration constraint

Cowork skills **cannot invoke each other**, and companion files may not use `..` traversal — so a skill can
never read a sibling skill's files. An orchestrator skill must carry its own copy of each phase's method
under its `references/` folder (the sanctioned on-demand layer) and reference those paths explicitly in its
`SKILL.md` body. Never write "apply the `<other-skill>` method" and expect it to work.

For `customer-architect`, those reference files are **generated** from the `<!-- method:start -->` … 
`<!-- method:end -->` blocks in the specialist skills. Edit the specialist, then run
`node scripts/sync-cowork-references.mjs`. CI fails if they drift.

## Validation and releases

- Run `node scripts/validate.mjs` and `node scripts/sync-cowork-references.mjs --check` before finishing any
  change — CI runs both on PRs.
- Build a Cowork package with `./scripts/build-cowork.sh <plugin>` (zips with `manifest.json` at the zip
  root, which Cowork requires).
- **Never commit `.zip` files or secrets.** Built packages go to gitignored `dist/` locally and
  ship via GitHub Releases.
- Cowork release flow: bump `version` in the plugin's `manifest.json`, then tag
  `cowork/<plugin>-v<version>` — the `release-cowork.yml` workflow builds the zip (manifest at
  zip root, no `__MACOSX`) and attaches it to a Release.
- CLI plugin release flow: bump `version` in both the plugin's `plugin.json` **and** its
  `.github/plugin/marketplace.json` entry (the validator enforces they match).

## Using this repo's plugins while working in it

Folder presence alone does not make plugins available — they must be installed (user-level,
then available in every project):

```
copilot plugin marketplace add bmarcurella/copilot-marketplace
copilot plugin install copilot-extension-builder@copilot-marketplace
```

## Git

- Work on branches; never commit directly to `main`. Brandon reviews every commit — always ask
  before committing.
