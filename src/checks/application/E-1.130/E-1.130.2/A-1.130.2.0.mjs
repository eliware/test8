import { pass } from "../../../check-result.mjs";

export const ruleId = "A-1.130.2.0";
export const parentRuleId = "E-1.130.2";

export function run() {
  return pass(ruleId);
}
