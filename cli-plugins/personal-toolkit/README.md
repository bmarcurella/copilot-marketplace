# personal-toolkit

Brandon's personal agents and skills — the "graduation target" for anything in `library/` that has
proven itself. Install once at user level and every component is available in **both** the Copilot
CLI and VS Code (which auto-discovers CLI-installed plugins), on every machine:

```powershell
copilot plugin marketplace add bmarcurella/copilot-marketplace
copilot plugin install personal-toolkit@copilot-marketplace
```

## Contents

| Component | Type | What it does |
| --- | --- | --- |
| `com.github.copilot/agents/skill-scout.agent.md` | agent | Reviews recent work for recurring workflows and drafts SKILL.md / .agent.md candidates for `library/`. |
| `com.github.copilot/agents/demo-brief.agent.md` | agent | One-pass intake interview for a new customer demo — writes a structured `demo-brief.md` that the Cowork `customer-architect` plugin (or repo scaffolding) consumes. |
| `skills/marketplace-ops` | skill | The runbook for operating this marketplace — graduation loop, version rules, Cowork release flow, troubleshooting — available in every session. |
| `skills/learning-log` | skill | Captures lessons to the versioned journal at `docs/learning-log.md` ("log what I learned"), and summarizes or quizzes from it. |

The plugin uses the [Agent Plugins 1.0](https://agent-plugins.org/) layout: `plugin.json` at the root holds
metadata only, skills load from `skills/`, and Copilot-only agents load from `com.github.copilot/agents/`.

## The graduation loop

1. Notice a repeated workflow (or ask **Skill Scout** to find one).
2. Draft it as a standalone item in `library/<type>/`.
3. Once it earns its keep, **move** it here: agents into `com.github.copilot/agents/`, skills into
   `skills/<name>/`. Nothing to list in the manifest; both folders are discovered automatically.
4. Bump `version` in `plugin.json` **and** the matching entry in
   `../../.github/plugin/marketplace.json`, then run `node ../../scripts/validate.mjs`.
5. Try it without installing: `copilot --plugin-dir ./cli-plugins/personal-toolkit` (or, in VS Code,
   the `chat.pluginLocations` setting pointing at this folder). After merging, update installed copies:
   `copilot plugin update personal-toolkit`.
