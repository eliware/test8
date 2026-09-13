import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.20.6";
export const parentRuleId = "E-1.20";

export async function run({ root, packageJson }) {
  let lockfile;
  try {
    lockfile = JSON.parse(await readFile(join(root, "package-lock.json"), "utf8"));
  } catch {
    return fail(ruleId, "package-lock.json is required and must be valid JSON for npm repositories.");
  }
  if (lockfile.name !== packageJson?.name || lockfile.version !== packageJson?.version) {
    return fail(ruleId, "package-lock.json name and version must match package.json.");
  }
  if (lockfile.lockfileVersion !== 3) return fail(ruleId, "package-lock.json must use lockfileVersion 3.");
  return pass(ruleId);
}
