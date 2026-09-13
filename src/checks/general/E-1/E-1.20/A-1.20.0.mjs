import { pass } from "../../../check-result.mjs";

export const ruleId = "A-1.20.0";
export const parentRuleId = "E-1.20";

export function run() {
  return pass(ruleId);
}
