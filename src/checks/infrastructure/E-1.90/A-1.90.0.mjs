import { pass } from "../../check-result.mjs";

export const ruleId = "A-1.90.0";
export const parentRuleId = "E-1.90";

export function run() {
  return pass(ruleId);
}
