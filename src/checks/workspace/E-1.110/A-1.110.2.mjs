import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
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
    }
  } catch (error) {
    return fail(ruleId, `Runbook records must be valid JSON: ${error.message}`);
  }
  return pass(ruleId);
}
