import { pass } from "../../check-result.mjs";

export const ruleId = "E-1.24";
export const parentRuleId = "E-1";

export function run() {
  return pass(ruleId);
}
