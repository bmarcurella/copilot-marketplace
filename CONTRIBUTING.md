# Contributing

Thanks for adding to the marketplace! This repo holds **content-only** Copilot artifacts,
organized by distribution surface — see the [README](README.md) for the layout. Runnable MCP
servers belong in [mcp-servers](https://github.com/bmarcurella/mcp-servers) instead.

## Adding a plugin or skill

1. **Branch** off `main` (or fork).
2. **Scaffold** — either install the builder and let it interview you:

   ```
   copilot plugin marketplace add bmarcurella/copilot-marketplace
   copilot plugin install copilot-extension-builder@copilot-marketplace
   ```

   or copy the templates from `cli-plugins/copilot-extension-builder/skills/*/templates/`.
3. **Place it by surface:**
   - GitHub Copilot CLI / VS Code plugin → `cli-plugins/<name>/` and **add an entry** to
     `.github/plugin/marketplace.json` (`"source": "cli-plugins/<name>"`, version matching
     the plugin's `plugin.json`).
   - Cowork plugin → `cowork-plugins/<name>/` (`manifest.json` v1.29, `color.png` 192×192,
     `outline.png` 32×32, `skills/<skill>/SKILL.md`). Do **not** add it to marketplace.json —
     Cowork packages ship as Release zips.
   - Standalone skill/agent/prompt/instruction → `library/<type>/` (see `library/README.md`).
4. **Validate locally:** `node scripts/validate.mjs` (Node 20.11+). If you edited a `customer-architect`
   specialist skill, also run `node scripts/sync-cowork-references.mjs` to regenerate the orchestrator's
   `references/`. CI runs both checks.
5. **Open a PR.**

## PR checklist

- [ ] `node scripts/validate.mjs` passes
- [ ] No placeholder values left (`example.com`, `{{TOKEN}}`, "Publisher or Org", …)
- [ ] No `.zip` files or secrets committed (packages ship via GitHub Releases)
- [ ] Every `SKILL.md` has `name` (matching its folder) and a `description` with clear
      when-to-use triggers
- [ ] Versions bumped where changed (CLI plugins: `plugin.json` **and** its marketplace.json entry)
- [ ] README tables updated if you added a plugin

## Releasing a Cowork plugin

Bump `version` in the plugin's `manifest.json`, merge to `main`, then push a tag:

```
git tag cowork/<plugin>-v<version> && git push origin cowork/<plugin>-v<version>
```

The `release-cowork.yml` workflow builds the app package and attaches it to a GitHub Release.
