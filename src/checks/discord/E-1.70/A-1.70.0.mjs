import { pass } from "../../check-result.mjs";

export const ruleId = "A-1.70.0";
export const parentRuleId = "E-1.70";

export function run() {
  return pass(ruleId);
}
