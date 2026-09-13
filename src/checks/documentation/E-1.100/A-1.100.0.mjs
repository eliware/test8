import { pass } from "../../check-result.mjs";

export const ruleId = "A-1.100.0";
export const parentRuleId = "E-1.100";

export function run() {
  return pass(ruleId);
}
