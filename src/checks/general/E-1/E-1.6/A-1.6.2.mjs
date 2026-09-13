import { pass } from "../../../check-result.mjs";

export const ruleId = "A-1.6.2";
export const parentRuleId = "E-1.6";

export function run() {
  return pass(ruleId);
}
