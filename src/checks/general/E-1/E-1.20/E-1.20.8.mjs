import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.20.8";
export const parentRuleId = "E-1.20";

async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    else if (entry.isFile() && entry.name.endsWith(".mjs")) files.push(path);
  }
  return files;
}

export async function run({ root }) {
  let sources;
  try {
    sources = await collect(join(root, "src"));
  } catch {
    return fail(ruleId, "src/ is required for environment-reference validation.");
  }
  const variables = new Set();
  for (const source of sources) {
    const content = await readFile(source, "utf8");
    for (const [, name] of content.matchAll(/(?:process\.env|env)\.([A-Z][A-Z0-9_]*)/g)) variables.add(name);
  }
  if (variables.size === 0) return pass(ruleId);
  let example;
  try {
    example = await readFile(join(root, ".env.example"), "utf8");
  } catch {
    return fail(ruleId, "Repositories using environment variables must provide .env.example.");
  }
  const documented = new Set(example.split(/\r?\n/).map((line) => line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=/)?.[1]).filter(Boolean));
  const missing = [...variables].filter((name) => !documented.has(name));
  if (missing.length > 0) return fail(ruleId, `Environment variables are missing from .env.example: ${missing.join(", ")}.`);
  return pass(ruleId);
}
