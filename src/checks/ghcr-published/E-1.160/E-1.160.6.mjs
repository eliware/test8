import { access } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../check-result.mjs";
import { readWorkflows } from "../read-workflows.mjs";

export const ruleId = "E-1.160.6";
export const parentRuleId = "E-1.160";

export async function run({ root }) {
  try {
    await access(join(root, "Dockerfile"));
    if (!(await readWorkflows(root)).some(({ content }) => /docker\s+build/i.test(content))) return fail(ruleId, "GHCR repositories must build their owned Dockerfile in a publication workflow.");
  } catch (error) {
    return fail(ruleId, `GHCR build definition could not be inspected: ${error.message}`);
  }
  return pass(ruleId);
}
