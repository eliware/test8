import { fail, pass } from "../../check-result.mjs";
import { readWorkflows } from "../read-workflows.mjs";

export const ruleId = "E-1.160.5";
export const parentRuleId = "E-1.160";

export async function run({ root }) {
  try {
    const publication = (await readWorkflows(root)).find(({ content }) => /docker\s+push|ghcr\.io/i.test(content));
    if (!publication || !/actions\/attest@v4|attest-build-provenance/i.test(publication.content) || !/id-token:\s*write/i.test(publication.content) || !/attestations:\s*write/i.test(publication.content)) return fail(ruleId, "GHCR publication must produce a signed artifact attestation with the required permissions.");
  } catch (error) {
    return fail(ruleId, `GHCR workflows could not be inspected: ${error.message}`);
  }
  return pass(ruleId);
}
