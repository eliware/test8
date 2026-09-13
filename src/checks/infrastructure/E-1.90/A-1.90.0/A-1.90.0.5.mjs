import { pass } from "../../../check-result.mjs";

export const ruleId = "A-1.90.0.5";
export const parentRuleId = "A-1.90.0";

export function run() {
  return pass(ruleId);
}
