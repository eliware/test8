import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.20.7";
export const parentRuleId = "E-1.20";

export function run({ packageJson }) {
  if (!packageJson?.jest || typeof packageJson.jest !== "object") {
    return fail(ruleId, "Jest configuration must be declared in package.json.");
  }
  return pass(ruleId);
}
