import { pass } from "../../../check-result.mjs";

export const ruleId = "A-1.80.0.1";
export const parentRuleId = "A-1.80.0";

export function run() {
  return pass(ruleId);
}
