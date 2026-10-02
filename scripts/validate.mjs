#!/usr/bin/env node
/**
 * Repo validation for copilot-marketplace. No dependencies — run with `node scripts/validate.mjs`.
 *
 * Checks:
 *  - .github/plugin/marketplace.json parses; every entry's source folder has a plugin manifest,
 *    and name/version match it
 *  - every cli-plugins/* plugin is registered in marketplace.json
 *  - CLI plugin manifests in either format:
 *      Agent Plugins 1.0/1.1 — root plugin.json with a recognized $schema, closed field set, spec
 *        name rules, skills from skills/*, optional root mcp.json on the same spec version, and
 *        Copilot-only components under com.github.copilot/
 *      legacy — .plugin/, root, .github/plugin/, or .claude-plugin/ plugin.json (CLI search order);
 *        skills/agents/hooks/mcpServers from manifest paths or the default locations
 *  - every skill (CLI plugin, Cowork agentSkills[], library/skills) has a SKILL.md with `name`
 *    (matching the folder) and `description` frontmatter
 *  - every agent (*.agent.md in plugins and library/agents) has frontmatter with a `description`
 *  - library/instructions and library/prompts files use the .instructions.md / .prompt.md suffixes
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
const fail = (msg) => {
  if (!errors.includes(msg)) errors.push(msg);
};

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

function checkAgent(file) {
  const text = readFileSync(file, "utf8");
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) {
    fail(`${rel(file)}: missing YAML frontmatter (--- block)`);
    return;
  }
  if (!readDescription(fm[1])) fail(`${rel(file)}: frontmatter missing "description"`);
}

function listFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => path.join(dir, d.name));
}

const asArray = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

// A skills path may point at one skill folder (has SKILL.md) or a parent folder of skill folders.
function checkSkillsPath(dir, owner) {
  if (!existsSync(dir)) {
    fail(`${owner}: skills path ${rel(dir)} does not exist`);
    return;
  }
  if (existsSync(path.join(dir, "SKILL.md"))) checkSkill(dir, owner);
  else for (const skillDir of listDirs(dir)) checkSkill(skillDir, owner);
}

function checkAgentsPath(dir, owner) {
  if (!existsSync(dir)) {
    fail(`${owner}: agents path ${rel(dir)} does not exist`);
    return;
  }
  for (const file of listFiles(dir).filter((f) => f.endsWith(".agent.md"))) checkAgent(file);
}

function checkJsonFile(file, owner) {
  if (!existsSync(file)) fail(`${owner}: ${rel(file)} does not exist`);
  else readJson(file);
}

// --- CLI plugins + marketplace catalog ---------------------------------------------------------

const AGENT_PLUGINS_SCHEMA = /^https:\/\/agent-plugins\.org\/schemas\/(1\.0\.0|1\.1\.0)\/plugin\.schema\.json$/;
const AGENT_PLUGINS_FIELDS = new Set([
  "$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords", "extensions",
]);
// Legacy manifest locations, in the order the Copilot CLI searches them.
const LEGACY_MANIFESTS = [".plugin/plugin.json", "plugin.json", ".github/plugin/plugin.json", ".claude-plugin/plugin.json"];

// Returns { file, plugin, spec } for the manifest the CLI would load, or null.
function loadPluginManifest(pluginDir) {
  const isSpec = (p) => typeof p?.$schema === "string" && p.$schema.includes("agent-plugins.org");
  // A root manifest that targets Agent Plugins wins over every legacy location (spec §5.1).
  const rootFile = path.join(pluginDir, "plugin.json");
  if (existsSync(rootFile)) {
    const plugin = readJson(rootFile);
    if (!plugin) return null;
    if (isSpec(plugin)) return { file: rootFile, plugin, spec: true };
  }
  for (const candidate of LEGACY_MANIFESTS) {
    const file = path.join(pluginDir, candidate);
    if (!existsSync(file)) continue;
    const plugin = readJson(file);
    if (!plugin) return null;
    if (isSpec(plugin)) {
      fail(`${rel(file)}: Agent Plugins manifests must be at the plugin root (plugin.json), not ${candidate}`);
    }
    return { file, plugin, spec: false };
  }
  return null;
}

function checkAgentPlugin(pluginDir, file, plugin) {
  const owner = rel(file);
  if (!AGENT_PLUGINS_SCHEMA.test(plugin.$schema)) {
    fail(`${owner}: unsupported Agent Plugins $schema "${plugin.$schema}" (CLI accepts 1.0.0 and 1.1.0)`);
  }
  const name = plugin.name ?? "";
  if (!/^[a-z0-9](?:[a-z0-9.-]{0,62}[a-z0-9])?$/.test(name) || name.includes("--") || name.includes("..")) {
    fail(`${owner}: name "${name}" breaks Agent Plugins rules (1-64 chars, a-z 0-9 . -, alphanumeric ends, no -- or ..)`);
  }
  for (const key of Object.keys(plugin)) {
    if (!AGENT_PLUGINS_FIELDS.has(key)) {
      fail(`${owner}: "${key}" is not an Agent Plugins field and would be ignored — components use fixed folders (skills/, mcp.json, com.github.copilot/)`);
    }
  }
  const skillsDir = path.join(pluginDir, "skills");
  if (existsSync(skillsDir)) checkSkillsPath(skillsDir, owner);

  const mcpFile = path.join(pluginDir, "mcp.json");
  if (existsSync(mcpFile)) {
    const mcp = readJson(mcpFile);
    const pluginVersion = plugin.$schema?.match(/schemas\/([\d.]+)\//)?.[1];
    const mcpVersion = mcp?.$schema?.match(/agent-plugins\.org\/schemas\/([\d.]+)\//)?.[1];
    if (mcp && mcpVersion !== pluginVersion) {
      fail(`${rel(mcpFile)}: $schema must be an Agent Plugins ${pluginVersion} URL to match plugin.json`);
    }
  }
  if (existsSync(path.join(pluginDir, ".mcp.json"))) {
    fail(`${owner}: Agent Plugins load MCP servers from mcp.json — .mcp.json is ignored`);
  }

  const copilotDir = path.join(pluginDir, "com.github.copilot");
  if (existsSync(path.join(copilotDir, "agents"))) checkAgentsPath(path.join(copilotDir, "agents"), owner);
  if (existsSync(path.join(copilotDir, "hooks/hooks.json"))) readJson(path.join(copilotDir, "hooks/hooks.json"));
  if (existsSync(path.join(copilotDir, "lsp.json"))) readJson(path.join(copilotDir, "lsp.json"));
}

function checkLegacyPlugin(pluginDir, file, plugin) {
  const owner = rel(file);
  const resolve = (p) => path.join(pluginDir, p);

  const skills = asArray(plugin.skills);
  if (skills.length) for (const p of skills) checkSkillsPath(resolve(p), owner);
  else if (existsSync(resolve("skills"))) checkSkillsPath(resolve("skills"), owner);

  const agents = asArray(plugin.agents);
  if (agents.length) for (const p of agents) checkAgentsPath(resolve(p), owner);
  else if (existsSync(resolve("agents"))) checkAgentsPath(resolve("agents"), owner);

  if (typeof plugin.hooks === "string") checkJsonFile(resolve(plugin.hooks), owner);
  if (typeof plugin.mcpServers === "string") checkJsonFile(resolve(plugin.mcpServers), owner);
}

const marketplaceFile = path.join(root, ".github/plugin/marketplace.json");
const marketplace = existsSync(marketplaceFile)
  ? readJson(marketplaceFile)
  : (fail("missing .github/plugin/marketplace.json"), null);
const registered = new Map((marketplace?.plugins ?? []).map((p) => [p.name, p]));

for (const [name, entry] of registered) {
  const loaded = entry.source ? loadPluginManifest(path.join(root, entry.source)) : null;
  if (!loaded) {
    fail(`marketplace.json: plugin "${name}" source "${entry.source}" has no plugin manifest`);
    continue;
  }
  const { file, plugin } = loaded;
  if (plugin.name !== name) fail(`marketplace.json: entry "${name}" but ${rel(file)} says "${plugin.name}"`);
  if (plugin.version !== entry.version) {
    fail(`marketplace.json: "${name}" version ${entry.version} != ${rel(file)} version ${plugin.version}`);
  }
}

for (const pluginDir of listDirs(path.join(root, "cli-plugins"))) {
  const loaded = loadPluginManifest(pluginDir);
  if (!loaded) {
    fail(`${rel(pluginDir)}: missing plugin manifest (plugin.json or .github/plugin/plugin.json)`);
    continue;
  }
  const { file, plugin, spec } = loaded;
  checkPlaceholders(file);
  if (!registered.has(plugin.name)) {
    fail(`${rel(pluginDir)}: "${plugin.name}" is not registered in .github/plugin/marketplace.json`);
  }
  if (spec) checkAgentPlugin(pluginDir, file, plugin);
  else checkLegacyPlugin(pluginDir, file, plugin);
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

// --- Library (inert building blocks) -----------------------------------------------------------

const library = path.join(root, "library");
for (const skillDir of listDirs(path.join(library, "skills"))) checkSkill(skillDir, "library/skills");
const LIBRARY_SUFFIX = { agents: ".agent.md", instructions: ".instructions.md", prompts: ".prompt.md" };
for (const [folder, suffix] of Object.entries(LIBRARY_SUFFIX)) {
  for (const file of listFiles(path.join(library, folder))) {
    const base = path.basename(file);
    if (base === ".gitkeep" || base === "README.md") continue;
    if (!base.endsWith(suffix)) fail(`${rel(file)}: files in library/${folder}/ must end with ${suffix}`);
    else if (folder === "agents") checkAgent(file);
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
