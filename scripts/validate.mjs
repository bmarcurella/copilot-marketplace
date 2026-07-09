#!/usr/bin/env node
/**
 * Repo validation for copilot-marketplace. No dependencies — run with `node scripts/validate.mjs`.
 *
 * Checks:
 *  - .github/plugin/marketplace.json parses; every entry's source folder + plugin.json exist,
 *    and name/version match the plugin's own plugin.json
 *  - every cli-plugins/* plugin is registered in marketplace.json
 *  - every plugin.json skills[] and Cowork manifest agentSkills[] folder exists and contains a
 *    SKILL.md with `name` (matching the folder) and `description` frontmatter
 *  - Cowork manifests parse, use the Unified App Manifest schema, and their icon files exist
 *  - no placeholder values (example.com, {{TOKEN}}) in shippable manifests
 *  - no .zip files tracked in git (built artifacts ship via GitHub Releases)
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const errors = [];
const fail = (msg) => errors.push(msg);

const rel = (p) => path.relative(root, p);

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    fail(`${rel(file)}: invalid JSON — ${e.message}`);
    return null;
  }
}

function listDirs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => path.join(dir, d.name));
}

function checkPlaceholders(file) {
  const text = readFileSync(file, "utf8");
  if (text.includes("example.com")) fail(`${rel(file)}: contains placeholder "example.com"`);
  const token = text.match(/\{\{[^}]+\}\}/);
  if (token) fail(`${rel(file)}: contains unfilled template token ${token[0]}`);
}

function checkSkill(skillDir, owner) {
  const skillMd = path.join(skillDir, "SKILL.md");
  if (!existsSync(skillMd)) {
    fail(`${owner}: skill folder ${rel(skillDir)} is missing SKILL.md`);
    return;
  }
  const text = readFileSync(skillMd, "utf8");
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) {
    fail(`${rel(skillMd)}: missing YAML frontmatter (--- block)`);
    return;
  }
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = fm[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (!name) fail(`${rel(skillMd)}: frontmatter missing "name"`);
  if (!description) fail(`${rel(skillMd)}: frontmatter missing "description"`);
  if (name && name !== path.basename(skillDir)) {
    fail(`${rel(skillMd)}: frontmatter name "${name}" does not match folder "${path.basename(skillDir)}"`);
  }
}

// --- CLI plugins + marketplace catalog ---------------------------------------------------------

const marketplaceFile = path.join(root, ".github/plugin/marketplace.json");
const marketplace = existsSync(marketplaceFile)
  ? readJson(marketplaceFile)
  : (fail("missing .github/plugin/marketplace.json"), null);
const registered = new Map((marketplace?.plugins ?? []).map((p) => [p.name, p]));

for (const [name, entry] of registered) {
  const pluginDir = path.join(root, entry.source ?? "");
  const pluginFile = path.join(pluginDir, ".github/plugin/plugin.json");
  if (!entry.source || !existsSync(pluginFile)) {
    fail(`marketplace.json: plugin "${name}" source "${entry.source}" has no .github/plugin/plugin.json`);
    continue;
  }
  const plugin = readJson(pluginFile);
  if (!plugin) continue;
  if (plugin.name !== name) fail(`marketplace.json: entry "${name}" but ${rel(pluginFile)} says "${plugin.name}"`);
  if (plugin.version !== entry.version) {
    fail(`marketplace.json: "${name}" version ${entry.version} != plugin.json version ${plugin.version}`);
  }
}

for (const pluginDir of listDirs(path.join(root, "cli-plugins"))) {
  const pluginFile = path.join(pluginDir, ".github/plugin/plugin.json");
  if (!existsSync(pluginFile)) {
    fail(`${rel(pluginDir)}: missing .github/plugin/plugin.json`);
    continue;
  }
  const plugin = readJson(pluginFile);
  if (!plugin) continue;
  checkPlaceholders(pluginFile);
  if (!registered.has(plugin.name)) {
    fail(`${rel(pluginDir)}: "${plugin.name}" is not registered in .github/plugin/marketplace.json`);
  }
  for (const skillRef of plugin.skills ?? []) {
    checkSkill(path.join(pluginDir, skillRef), rel(pluginFile));
  }
  if (plugin.hooks && !existsSync(path.join(pluginDir, plugin.hooks))) {
    fail(`${rel(pluginFile)}: hooks file "${plugin.hooks}" does not exist`);
  }
}

// --- Cowork plugins ----------------------------------------------------------------------------

for (const pluginDir of listDirs(path.join(root, "cowork-plugins"))) {
  const manifestFile = path.join(pluginDir, "manifest.json");
  if (!existsSync(manifestFile)) {
    fail(`${rel(pluginDir)}: missing manifest.json`);
    continue;
  }
  const manifest = readJson(manifestFile);
  if (!manifest) continue;
  checkPlaceholders(manifestFile);
  if (!manifest.manifestVersion) fail(`${rel(manifestFile)}: missing manifestVersion`);
  for (const icon of Object.values(manifest.icons ?? {})) {
    if (!existsSync(path.join(pluginDir, icon))) fail(`${rel(manifestFile)}: icon "${icon}" does not exist`);
  }
  for (const { folder } of manifest.agentSkills ?? []) {
    checkSkill(path.join(pluginDir, folder), rel(manifestFile));
  }
}

// --- No tracked build artifacts ----------------------------------------------------------------

try {
  const zips = execFileSync("git", ["ls-files", "--", "*.zip"], { cwd: root, encoding: "utf8" }).trim();
  if (zips) fail(`tracked .zip files found (ship via GitHub Releases instead):\n  ${zips.split("\n").join("\n  ")}`);
} catch {
  console.warn("warning: git not available — skipped tracked-zip check");
}

// --- Report ------------------------------------------------------------------------------------

if (errors.length) {
  console.error(`✖ validation failed with ${errors.length} error(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("✔ marketplace, plugins, and skills all valid");
