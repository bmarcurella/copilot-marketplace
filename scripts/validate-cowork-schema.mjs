#!/usr/bin/env node
/**
 * Validates every cowork-plugins/<name>/manifest.json against its declared Unified App Manifest schema
 * and the M365 validation rules, using the Microsoft 365 Agents Toolkit CLI (`atk validate`).
 *
 * validate.mjs checks repo conventions (skills, icons, companion files); this checks the manifest itself —
 * e.g. it catches a v1.28 manifest whose remoteMcpServer omits the then-required mcpToolDescription.
 * No sign-in is needed.
 *
 *   npm install -g @microsoft/m365agentstoolkit-cli
 *   node scripts/validate-cowork-schema.mjs
 */

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const coworkDir = path.join(root, "cowork-plugins");
// Arguments are fixed literals, so run each as one command string (avoids Node's DEP0190 with shell: true).
const atk = (args, options = {}) => spawnSync(`atk ${args}`, { encoding: "utf8", shell: true, ...options });

const probe = atk("--version");
if (probe.status !== 0) {
  console.error("✖ atk (Microsoft 365 Agents Toolkit CLI) not found. Install it with:\n");
  console.error("  npm install -g @microsoft/m365agentstoolkit-cli");
  process.exit(1);
}

const plugins = existsSync(coworkDir)
  ? readdirSync(coworkDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(path.join(coworkDir, d.name, "manifest.json")))
      .map((d) => d.name)
  : [];

const failed = [];
for (const name of plugins) {
  // Run from the plugin folder with a relative path so paths with spaces never reach the shell.
  const result = atk("validate --manifest-file manifest.json --interactive false", { cwd: path.join(coworkDir, name) });
  if (result.status === 0) {
    console.log(`✔ ${name}: manifest passes schema and validation rules`);
  } else {
    failed.push(name);
    console.error(`✖ ${name}: atk validate failed\n`);
    console.error(`${result.stdout ?? ""}${result.stderr ?? ""}`.trim());
  }
}

if (failed.length) process.exit(1);
console.log(plugins.length ? `✔ ${plugins.length} Cowork manifest(s) valid (atk ${probe.stdout.trim()})` : "no Cowork plugins found");
