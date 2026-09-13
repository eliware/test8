import { pass } from "../../check-result.mjs";

export const ruleId = "A-1.50.0";
export const parentRuleId = "E-1.50";

export function run() {
  return pass(ruleId);
}
