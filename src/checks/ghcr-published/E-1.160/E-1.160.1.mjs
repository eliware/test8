import { fail, pass } from "../../check-result.mjs";
import { readWorkflows } from "../read-workflows.mjs";

export const ruleId = "E-1.160.1";
export const parentRuleId = "E-1.160";

export async function run({ root, packageJson }) {
  try {
    const repository = String(packageJson?.name ?? "").replace(/^@[^/]+\//, "");
    const image = `ghcr.io/eliware/${repository}`;
    const workflows = await readWorkflows(root);
    if (!workflows.some(({ content }) => content.toLowerCase().includes(image.toLowerCase()))) return fail(ruleId, `GHCR workflow must publish ${image}.`);
  } catch (error) {
    return fail(ruleId, `GHCR workflows could not be inspected: ${error.message}`);
  }
  return pass(ruleId);
}
