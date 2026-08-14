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
| `agents/skill-scout.agent.md` | agent | Reviews recent work for recurring workflows and drafts SKILL.md / .agent.md candidates for `library/`. |
| `agents/demo-brief.agent.md` | agent | One-pass intake interview for a new customer demo — writes a structured `demo-brief.md` that the Cowork `customer-architect` plugin (or repo scaffolding) consumes. |

## The graduation loop

1. Notice a repeated workflow (or ask **Skill Scout** to find one).
2. Draft it as a standalone item in `library/<type>/`.
3. Once it earns its keep, **move** it here (agents into `agents/`, skills into `skills/` +
   a `skills` entry in `.github/plugin/plugin.json`).
4. Bump `version` in `.github/plugin/plugin.json` **and** the matching entry in
   `../../.github/plugin/marketplace.json`, then run `node ../../scripts/validate.mjs`.
5. Reinstall to pick up changes (components are cached):
   `copilot plugin install personal-toolkit@copilot-marketplace`.
