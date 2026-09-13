import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fail, pass } from "../../check-result.mjs";

export const ruleId = "A-1.110.2";
export const parentRuleId = "E-1.110";

async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(file)));
    else if (entry.isFile() && entry.name.endsWith(".json")) files.push(file);
  }
  return files;
}

async function collectReferenceSurfaces(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".git", "node_modules", "coverage", "build", "dist"].includes(entry.name)) continue;
    const file = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectReferenceSurfaces(file)));
    else if (entry.isFile() && /\.(?:json|md)$/i.test(entry.name)) files.push(file);
  }
  return files;
}

async function validateReferences(root, recordsByPath) {
  const pattern = /((?:\.\.?\/)?runbooks\/[^#\s"'`]+\.json)#id=([A-Za-z0-9._-]+)/g;
  const surfaces = await collectReferenceSurfaces(root);
  for (const surface of surfaces) {
    const content = await readFile(surface, "utf8");
    for (const [, reference, id] of content.matchAll(pattern)) {
      const target = resolve(dirname(surface), reference.split("#")[0]);
      const record = recordsByPath.get(target);
      if (!record || record.id !== id) {
        return `Runbook reference does not resolve to the declared record: ${reference}#id=${id}.`;
      }
    }
  }
  return null;
}

export async function run({ root }) {
  let records;
  try {
    const runbooks = join(root, "runbooks");
    await readFile(join(runbooks, "README.md"), "utf8");
    records = await collect(runbooks);
  } catch {
    return fail(ruleId, "Workspace repositories require runbooks/README.md and JSON runbook records.");
  }
  const ids = new Set();
  const recordsByPath = new Map();
  try {
    for (const file of records) {
      const record = JSON.parse(await readFile(file, "utf8"));
      for (const field of ["id", "purpose", "owner", "boundaries", "steps"]) {
        const value = record[field];
        if (!((typeof value === "string" && value.trim()) || (Array.isArray(value) && value.length > 0))) {
          return fail(ruleId, `Runbook ${file} must contain a non-empty ${field}.`);
        }
      }
      if (ids.has(record.id)) return fail(ruleId, `Runbook IDs must be unique: ${record.id}.`);
      ids.add(record.id);
      recordsByPath.set(file, record);
    }
    const referenceError = await validateReferences(root, recordsByPath);
    if (referenceError) return fail(ruleId, referenceError);
  } catch (error) {
    return fail(ruleId, `Runbook records must be valid JSON: ${error.message}`);
  }
  return pass(ruleId);
}
