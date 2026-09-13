import { pass } from "../../../check-result.mjs";

export const ruleId = "A-1.3.0";
export const parentRuleId = "E-1.3";

export function run() {
  return pass(ruleId);
}
