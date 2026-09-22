---
description: "Config and secret handling for MCP servers — root .env + per-server loader, three config planes, and never committing secrets."
applyTo: "**/server/**/*.ts"
---

# MCP server configuration & secrets

Conventions for any Node/TypeScript MCP server in this repo (or copied into a project).

## Three config planes — keep them separate

A single `.env` only covers local dev. Do **not** try to unify these:

| Plane | Holds | Source | Notes |
| --- | --- | --- | --- |
| Local dev | base URLs, dev tokens, `PORT` | root `.env` (gitignored) | the `.env` story below |
| Cloud deploy | same vars, per environment | `azd env` + Container Apps secrets (optionally Key Vault-backed) | never a committed file |
| Per-user auth | the end user's OAuth token | forwarded at runtime by the host (e.g. Cowork `OAuthPluginVault`) | never stored server-side |

## One root `.env`, auto-loaded per server

- Keep a single gitignored `.env` at the **repo root**, with variables **namespaced by prefix**
  (e.g. `SALESFORCE_BASE_URL`) so one file serves every server.
- Keep a per-server `.env.example` as the documented contract of what that server needs, and
  aggregate all vars into a root `.env.example` template.
- Each server auto-loads env files in `config.ts` using Node's built-in `process.loadEnvFile`
  (Node ≥ 20.12, zero dependencies). Load **server-local first, then root**, because
  `loadEnvFile` keeps the first-defined value — this yields precedence:

  `real process env  >  server/.env  >  root .env`

  It is a no-op in Azure (no `.env` ships; vars are already on the process), so the same code
  runs locally and in a container unchanged.

```ts
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
// server-local first, then repo root (loadEnvFile keeps the first-defined value)
for (const p of [resolve(here, '../.env'), resolve(here, '../../../../.env')]) {
  if (existsSync(p)) {
    try { process.loadEnvFile(p); } catch { /* ignore malformed local env */ }
  }
}
```

> Adjust the `../../../../.env` depth to reach the repo root from the compiled/source file's
> folder (from `server/src` or `server/dist` it is four levels up).

## Never commit secrets

- `.gitignore` must ignore `.env` and `.env.*` while keeping `.env.example` tracked:
  ```gitignore
  .env
  .env.*
  !.env.example
  node_modules/
  ```
- No tokens, keys, or connection strings in source, `manifest.json`, skills, or committed JSON.
  Use env vars locally, Container Apps secrets / Key Vault in Azure, and the host token vault for
  per-user auth.
- Before vendoring a third-party server, scrub stray deployment dumps (e.g. an `az ... show`
  JSON) — they leak subscription IDs, tenant/admin UPNs, and FQDNs.
