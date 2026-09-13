import { pass } from "../../../check-result.mjs";

export const ruleId = "A-1.9.8";
export const parentRuleId = "E-1.9";

export function run() {
  return pass(ruleId);
}
