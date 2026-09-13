import { pass } from "../../check-result.mjs";

export const ruleId = "A-1.40.0";
export const parentRuleId = "E-1.40";

export function run() {
  return pass(ruleId);
}
