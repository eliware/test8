import { pass } from "../../../check-result.mjs";

export const ruleId = "A-1.0.1";
export const parentRuleId = "E-1.0";

export function run() {
  return pass(ruleId);
}
