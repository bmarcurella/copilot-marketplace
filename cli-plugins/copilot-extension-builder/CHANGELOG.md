# Changelog

Dated record of knowledge-sync changes and notable manual updates. Newest first. Each entry cites the
source it came from.

- **Maintainer mode** syncs edit this file directly (then you commit & publish).
- **Consumer mode** syncs write to `${COPILOT_PLUGIN_DATA}/CHANGELOG.md` instead, leaving this read-only.

Format:

```text
## YYYY-MM-DD
- [source-id] what changed -> what was edited. (source: URL) [auto|review]
```

## 2026-06-25
- Initial release of **copilot-extension-builder**. Baseline knowledge captured from Microsoft Learn and
  GitHub Copilot docs; seven sources seeded in `references/sources.json` with `last_checked` 2026-06-25
  and `check_interval_days` 14.
- [github-cli] Verified during build that direct path installs are deprecated by the CLI → README and
  `build-cli-plugin` now lead with `plugin@marketplace`. (source: cli-plugin-reference) [auto]
- [github-cli] Verified that a local `marketplace add` requires an absolute path (a relative `./` is read
  as a GitHub repo). Documented in README and `build-cli-plugin`. (source: cli-plugin-reference) [auto]
