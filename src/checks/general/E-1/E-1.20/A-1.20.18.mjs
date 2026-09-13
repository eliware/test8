import { pass } from "../../../check-result.mjs";

export const ruleId = "A-1.20.18";
export const parentRuleId = "E-1.20";

export function run() {
  return pass(ruleId);
}
