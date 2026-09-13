import { pass } from "../../../check-result.mjs";

export const ruleId = "A-1.24.0";
export const parentRuleId = "E-1.24";

export function run() {
  return pass(ruleId);
}
