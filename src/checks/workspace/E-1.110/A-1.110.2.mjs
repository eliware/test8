import { pass } from "../../check-result.mjs";

export const ruleId = "A-1.110.2";
export const parentRuleId = "E-1.110";

export function run() {
  return pass(ruleId);
}
