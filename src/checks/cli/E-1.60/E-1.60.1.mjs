import { pass } from "../../check-result.mjs";

export const ruleId = "E-1.60.1";
export const parentRuleId = "E-1.60";

export function run() {
  return pass(ruleId);
}
