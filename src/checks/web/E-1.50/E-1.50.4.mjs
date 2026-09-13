import { pass } from "../../check-result.mjs";

export const ruleId = "E-1.50.4";
export const parentRuleId = "E-1.50";

export function run() {
  return pass(ruleId);
}
