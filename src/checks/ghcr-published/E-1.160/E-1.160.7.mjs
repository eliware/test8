import { fail, pass } from "../../check-result.mjs";
import { readWorkflows } from "../read-workflows.mjs";

export const ruleId = "E-1.160.7";
export const parentRuleId = "E-1.160";

export async function run({ root }) {
  try {
    const publication = (await readWorkflows(root)).find(({ content }) => /docker\s+push|ghcr\.io/i.test(content));
    if (!publication || !/digest|sha256/i.test(publication.content) || /docker\s+push[^\n]*:latest\b/i.test(publication.content)) return fail(ruleId, "GHCR release identity must use an exact version tag and recorded digest, not latest.");
  } catch (error) {
    return fail(ruleId, `GHCR workflows could not be inspected: ${error.message}`);
  }
  return pass(ruleId);
}
