import { pass } from "../../../check-result.mjs";

export const ruleId = "A-1.25.0";
export const parentRuleId = "E-1.25";

export function run() {
  return pass(ruleId);
}
