import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.10.1";
export const parentRuleId = "E-1.10";

export async function run({ root }) {
  try {
    const content = await readFile(join(root, ".knit", "validate.mjs"), "utf8");
    const pull = Math.max(content.indexOf("git pull --ff-only origin main"), content.indexOf('["git", ["pull", "--ff-only", "origin", "main"]]'));
    const install = Math.max(content.indexOf("npm ci"), content.indexOf('["npm", ["ci"]]'));
    const test = Math.max(content.indexOf("npm test"), content.indexOf('["npm", ["test"]]'));
    if (pull < 0 || install < 0 || test < 0 || !(pull < install && install < test)) {
      return fail(ruleId, ".knit/validate.mjs must begin with the required synchronization and validation command sequence.");
    }
  } catch {
    return fail(ruleId, ".knit/validate.mjs is required for Knit validation.");
  }
  return pass(ruleId);
}
