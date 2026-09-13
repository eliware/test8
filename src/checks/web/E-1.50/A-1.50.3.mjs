import { pass } from "../../check-result.mjs";

export const ruleId = "A-1.50.3";
export const parentRuleId = "E-1.50";

export function run() {
  return pass(ruleId);
}
