import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.20.2";
export const parentRuleId = "E-1.20";

export function run({ packageJson }) {
  if (packageJson?.type !== "module") return fail(ruleId, "Node.js repositories must use native ESM with package.json.type=module.");
  return pass(ruleId);
}
