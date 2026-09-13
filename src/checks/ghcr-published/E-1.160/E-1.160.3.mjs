import { fail, pass } from "../../check-result.mjs";
import { readWorkflows } from "../read-workflows.mjs";

export const ruleId = "E-1.160.3";
export const parentRuleId = "E-1.160";

export async function run({ root }) {
  try {
    const workflows = await readWorkflows(root);
    const validation = workflows.filter(({ content }) => /npm\s+ci\b/.test(content) && /npm\s+test\b/.test(content));
    const publication = workflows.filter(({ content }) => /docker\s+push|ghcr\.io/i.test(content));
    if (validation.length === 0 || publication.length === 0 || validation.some(({ name }) => publication.some((item) => item.name === name))) return fail(ruleId, "GHCR publication must be separate from the npm validation workflow.");
  } catch (error) {
    return fail(ruleId, `GHCR workflows could not be inspected: ${error.message}`);
  }
  return pass(ruleId);
}
