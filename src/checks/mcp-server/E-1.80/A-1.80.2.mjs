import { pass } from "../../check-result.mjs";

export const ruleId = "A-1.80.2";
export const parentRuleId = "E-1.80";

export function run() {
  return pass(ruleId);
}
