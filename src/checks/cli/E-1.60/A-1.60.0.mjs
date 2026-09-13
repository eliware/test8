import { pass } from "../../check-result.mjs";

export const ruleId = "A-1.60.0";
export const parentRuleId = "E-1.60";

export function run() {
  return pass(ruleId);
}
