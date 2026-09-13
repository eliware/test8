import { pass } from "../../check-result.mjs";

export const ruleId = "A-1.140.4";
export const parentRuleId = "E-1.140";

export function run() {
  return pass(ruleId);
}
