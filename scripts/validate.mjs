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
 *  - Cowork skill descriptions fit the 1024-char limit and names are kebab-case (ASKILL-P007)
 *  - companion files obey the Cowork limits (<=20 per skill, <=5 MB each, <=10 MB total, no hidden
 *    files, no `..` traversal, safe characters only)
 *  - every `references/*.md` path named in a SKILL.md body actually exists
 *  - no placeholder values (example.com, {{TOKEN}}) in shippable manifests
 *  - no .zip files tracked in git (built artifacts ship via GitHub Releases)
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
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

// Reads `description:` whether written inline or as a `|` / `>` block scalar.
function readDescription(frontmatter) {
  const inline = frontmatter.match(/^description:[ \t]*([^|>\s].*)$/m);
  if (inline) return inline[1].trim();
  const block = frontmatter.match(/^description:[ \t]*[|>][-+]?[ \t]*\r?\n((?:[ \t]+.*(?:\r?\n|$))+)/m);
  if (!block) return null;
  return block[1]
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ");
}

// Cowork companion-file rules; see cowork-plugin-development#companion-file-validation.
const WINDOWS_RESERVED = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i;
const SAFE_NAME = /^[A-Za-z0-9._! -]+$/;
const MB = 1024 * 1024;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const full = path.join(dir, d.name);
    return d.isDirectory() ? walk(full) : [full];
  });
}

function checkCompanionFiles(skillDir) {
  const companions = walk(skillDir).filter((f) => path.basename(f) !== "SKILL.md");
  if (companions.length > 20) {
    fail(`${rel(skillDir)}: ${companions.length} companion files (max 20)`);
  }
  let total = 0;
  for (const file of companions) {
    const base = path.basename(file);
    const size = statSync(file).size;
    total += size;
    if (size > 5 * MB) fail(`${rel(file)}: companion file exceeds 5 MB`);
    if (base.startsWith(".")) fail(`${rel(file)}: hidden companion files are not allowed`);
    if (!SAFE_NAME.test(base)) fail(`${rel(file)}: unsafe characters in companion file name`);
    if (WINDOWS_RESERVED.test(base)) fail(`${rel(file)}: Windows reserved file name`);
  }
  if (total > 10 * MB) fail(`${rel(skillDir)}: companion files total ${(total / MB).toFixed(1)} MB (max 10 MB)`);
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
  const folder = path.basename(skillDir);
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = readDescription(fm[1]);

  if (!name) fail(`${rel(skillMd)}: frontmatter missing "name"`);
  if (!description) fail(`${rel(skillMd)}: frontmatter missing "description"`);
  if (name && name !== folder) {
    fail(`${rel(skillMd)}: frontmatter name "${name}" does not match folder "${folder}"`);
  }
  // ASKILL-P007: kebab-case, no leading/trailing/consecutive hyphens.
  if (name && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    fail(`${rel(skillMd)}: name "${name}" is not kebab-case`);
  }
  if (name && name.length > 64) fail(`${rel(skillMd)}: name exceeds 64 characters`);
  if (description && description.length > 1024) {
    fail(`${rel(skillMd)}: description is ${description.length} chars (max 1024)`);
  }

  // Every concrete references/<file>.<ext> named in the body must exist, and must not escape the skill
  // folder. Globs (`references/*`) are prose, not paths, so they're skipped.
  const body = text.slice(fm[0].length);
  for (const [, refPath] of body.matchAll(/`(references\/[A-Za-z0-9._/-]+\.[A-Za-z0-9]+)`/g)) {
    if (refPath.includes("..")) {
      fail(`${rel(skillMd)}: reference "${refPath}" uses path traversal (not allowed in companion files)`);
    } else if (!existsSync(path.join(skillDir, refPath))) {
      fail(`${rel(skillMd)}: references "${refPath}" but that file does not exist`);
    }
  }

  checkCompanionFiles(skillDir);
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
