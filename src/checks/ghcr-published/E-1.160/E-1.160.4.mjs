import { fail, pass } from "../../check-result.mjs";
import { readWorkflows } from "../read-workflows.mjs";

export const ruleId = "E-1.160.4";
export const parentRuleId = "E-1.160";

export async function run({ root }) {
  try {
    const publication = (await readWorkflows(root)).find(({ content }) => /docker\s+push|ghcr\.io/i.test(content));
    if (!publication || !/contents:\s*read/i.test(publication.content) || !/packages:\s*write/i.test(publication.content)) return fail(ruleId, "GHCR publication must grant only the required read and package-write permissions.");
  } catch (error) {
    return fail(ruleId, `GHCR workflows could not be inspected: ${error.message}`);
  }
  return pass(ruleId);
}
