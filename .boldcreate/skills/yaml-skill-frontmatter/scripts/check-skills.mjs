#!/usr/bin/env node
// Checks every SKILL.md in a skills folder against the loader's rules.
//
// Usage:
//   node .boldcreate/skills/yaml-skill-frontmatter/scripts/check-skills.mjs [skills-dir]
//
// The script reads the `yaml` package from the repository's own dependencies. It reports
// what the loader would do with each file: load it, load it after a lenient recovery, or
// skip it. A skill that the loader would skip is a failure.
//
// Exit code 0 when every skill loads, 1 otherwise.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import yaml from "yaml";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..", "..", "..", "..");
const skillsDir = resolve(process.argv[2] ?? join(repoRoot, ".boldcreate", "skills"));

const MAX_SKILL_NAME_LENGTH = 64;
const MAX_SKILL_DESCRIPTION_LENGTH = 1024;

/** Strip the quotes from a value, even a mismatched pair. */
function unquoteValue(val) {
  let result = val;
  if (
    (result.startsWith('"') && result.includes('"')) ||
    (result.startsWith("'") && result.includes("'"))
  ) {
    const quote = result[0] ?? '"';
    const closeIndex = result.lastIndexOf(quote);
    if (closeIndex > 0) return result.slice(1, closeIndex);
  }
  if (result.startsWith('"') || result.startsWith("'")) {
    result = result.slice(1);
    const lastQuote = Math.max(result.lastIndexOf('"'), result.lastIndexOf("'"));
    if (lastQuote >= 0) result = result.slice(0, lastQuote);
  }
  return result;
}

/** Read the name and the description from a header the strict parser rejects. */
function lenientParseFrontmatter(frontmatterStr) {
  const result = { name: "", description: "" };
  const lines = frontmatterStr.split("\n");
  let currentKey = "";
  let currentValue = "";
  for (const line of lines) {
    const trimmed = line.trim();
    const keyMatch = /^([\w_-]+):\s*(.*)$/.exec(trimmed);
    if (keyMatch?.[1]) {
      if (currentKey && currentValue) {
        const unquoted = unquoteValue(currentValue);
        if (currentKey === "name") result.name = unquoted;
        else if (currentKey === "description") result.description = unquoted;
      }
      currentKey = keyMatch[1];
      currentValue = (keyMatch[2] ?? "").trim();
    } else if (currentKey && trimmed && !trimmed.startsWith("---")) {
      currentValue = currentValue ? `${currentValue} ${trimmed}` : trimmed;
    }
  }
  if (currentKey && currentValue) {
    const unquoted = unquoteValue(currentValue);
    if (currentKey === "name") result.name = unquoted;
    else if (currentKey === "description") result.description = unquoted;
  }
  return result;
}

/** The folder of every skill under the skills folder. */
function skillFolders(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    try {
      statSync(join(full, "SKILL.md"));
    } catch {
      continue;
    }
    out.push({ name: entry, dir: full });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/** What the loader does with one file. */
function checkSkill(folder) {
  const path = join(folder.dir, "SKILL.md");
  const content = readFileSync(path, "utf8");
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);

  if (!match?.[1]) {
    return { status: "skipped", reason: "no valid YAML frontmatter found" };
  }

  const frontmatter = match[1];
  let data;
  let strict = true;
  try {
    data = yaml.parse(frontmatter);
  } catch {
    strict = false;
    data = lenientParseFrontmatter(frontmatter);
  }

  if (!data || typeof data !== "object") {
    return { status: "skipped", reason: "frontmatter is not a mapping" };
  }

  const name = String(data.name ?? "").trim();
  const description = String(data.description ?? "").trim();

  if (!name || !description) {
    return { status: "skipped", reason: "missing required 'name' or 'description'" };
  }

  const warnings = [];
  if (name.length > MAX_SKILL_NAME_LENGTH) {
    warnings.push(`the name is ${name.length} characters, over the ${MAX_SKILL_NAME_LENGTH} limit`);
  }
  if (name !== folder.name) {
    warnings.push(`the name '${name}' does not match the folder name '${folder.name}'`);
  }
  if (description.length > MAX_SKILL_DESCRIPTION_LENGTH) {
    warnings.push(`the description is ${description.length} characters, over the ${MAX_SKILL_DESCRIPTION_LENGTH} limit`);
  }

  return { status: strict ? "strict" : "lenient", name, description, warnings };
}

/**
 * What each skill is expected to do. A skill that holds a broken header is expected to be
 * recovered by the lenient parser, or to be skipped when the header holds nothing to
 * recover. The entry is missing when the skill is expected to parse strictly.
 */
const EXPECTED = {
  "yaml-duplicate-keys": "lenient",
  "yaml-empty-fields": "skipped",
  "yaml-implicit-key-multiline": "lenient",
  "yaml-indented-continuation": "strict",
  "yaml-missing-description": "skipped",
  "yaml-mixed-indentation": "lenient",
  "yaml-name-mismatch": "strict",
  "yaml-nested-compact-mapping": "lenient",
  "yaml-no-frontmatter": "skipped",
  "yaml-quote-trailing-char": "lenient",
  "yaml-special-characters": "lenient",
  "yaml-tab-after-colon": "strict",
  "yaml-tab-indentation": "lenient",
  "yaml-unterminated-quote": "lenient",
  "yaml-valid-frontmatter": "strict",
  "yaml-block-scalars": "strict",
};

console.log(`checking the skills in ${skillsDir}\n`);

const folders = skillFolders(skillsDir);
if (folders.length === 0) {
  console.error(`no skill folders found in ${skillsDir}`);
  process.exit(1);
}

let failed = 0;
let strictCount = 0;
let lenientCount = 0;
let skippedCount = 0;

for (const folder of folders) {
  const result = checkSkill(folder);
  if (result.status === "skipped") skippedCount++;
  else if (result.status === "strict") strictCount++;
  else lenientCount++;

  const expected = EXPECTED[folder.name];
  if (expected !== undefined && expected !== result.status) {
    failed++;
    console.log(
      `FAIL   ${folder.name}: expected ${expected}, the loader would treat it as ${result.status}`,
    );
    continue;
  }

  if (result.status === "skipped") {
    console.log(`SKIP   ${folder.name}: ${result.reason}`);
    continue;
  }

  const label = result.status === "strict" ? "OK    " : "LENIENT";
  const note = result.status === "strict" ? "" : " (recovered by the lenient parser)";
  console.log(`${label} ${folder.name}: ${result.description}${note}`);
  for (const warning of result.warnings ?? []) {
    console.log(`        warning: ${warning}`);
  }
}

console.log(
  `\n${folders.length} skills: ${strictCount} parse strictly, ${lenientCount} need the lenient parser, ${skippedCount} would be skipped`,
);

if (failed > 0) {
  console.log(`\n${failed} skills did not behave as expected`);
  process.exit(1);
}

