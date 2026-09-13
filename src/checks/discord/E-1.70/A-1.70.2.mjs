import { pass } from "../../check-result.mjs";

export const ruleId = "A-1.70.2";
export const parentRuleId = "E-1.70";

export function run() {
  return pass(ruleId);
}
