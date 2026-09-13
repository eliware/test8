import { fail, pass } from "../../check-result.mjs";
import { readWorkflows } from "../read-workflows.mjs";

export const ruleId = "E-1.160.2";
export const parentRuleId = "E-1.160";

export async function run({ root }) {
  try {
    const workflows = await readWorkflows(root);
    if (!workflows.some(({ content }) => /refs\/tags\/v\d+\.\d+\.\d+|ref_type\s*==?\s*['"]tag['"]|v\$\{\{\s*github\.ref_name/i.test(content))) return fail(ruleId, "GHCR publication must be gated by an exact semantic-version tag.");
  } catch (error) {
    return fail(ruleId, `GHCR workflows could not be inspected: ${error.message}`);
  }
  return pass(ruleId);
}
