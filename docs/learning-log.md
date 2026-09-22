# Learning log

Append-only journal of agentic-engineering lessons. Maintained by the `learning-log` skill in
`personal-toolkit` — say "log what I learned" in any session to add entries. Newest date first.

## 2026-08-14

- **Marketplace = git repo** — A Copilot plugin marketplace is just a repo with a
  `marketplace.json` catalog; GitHub's own catalogs (`copilot-plugins`, `awesome-copilot`) are the
  same mechanism. Only what's merged to `main` is installable, and updates only get detected when
  the version bumps in both `plugin.json` and the catalog entry. *(context: reviewing how my
  marketplace compares to Microsoft's)*
- **One install channel, per-workspace toggles** — Install everything user-level via the CLI
  (`~/.copilot/installed-plugins/`); VS Code auto-discovers it (Agent Plugins 1.0, Aug 2026).
  Installing the same plugin through VS Code's own marketplace UI creates a second clone that
  drifts. Control clutter with per-workspace enable/disable, never uninstall. *(context: worried
  the setup was creating duplicates)*
- **User vs workspace scope** — User scope = my toolbox, travels with me, repos know nothing about
  it. Workspace scope (`.github/`, `.vscode/`) = the project's contract, applies to anyone and any
  agent (code review, cloud agent) touching the repo. Test: "would this matter to someone who
  isn't me cloning this repo?" A project's runtime MCP connections belong in the repo; my build
  tools don't. *(context: deciding what goes in .github vs my profile)*
- **Prompts are local-only; skills are the portable standard** — VS Code user prompt files live in
  AppData (fragile, machine-local) and don't work with the newer Copilot agent host at all; skills
  work across CLI, VS Code, Copilot code review, and the cloud agent. Prefer skills; VS Code even
  offers a prompt→skill migration. *(context: found mystery prompts in AppData)*
- **Releases are the shelf for build artifacts** — Cowork requires an uploaded `.zip`, but zips
  don't belong in git history. GitHub Releases hold CI-built zips tied to exact tagged commits —
  ready to go, versioned, and rollback-able. A workflow_dispatch can create the tag + Release
  itself, so no local tag pushes needed. *(context: v0.1.0 release had silently fallen behind the
  1.1.0 manifest)*
- **Knowledge rots on a schedule** — My builder's doc sources went 50 days without a sync and
  missed a platform-defining change (Agent Plugins 1.0 GA). The freshness-gate pattern
  (sources.json + interval + session-start nudge) only works if the sync actually runs. *(context:
  repo review found sources.json stale)*
