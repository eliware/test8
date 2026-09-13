import { pass } from "../../check-result.mjs";

export const ruleId = "E-1.4";
export const parentRuleId = "E-1";

export function run() {
  return pass(ruleId);
}
