import { pass } from "../../../check-result.mjs";

export const ruleId = "E-1.10.1";
export const parentRuleId = "E-1.10";

export function run() {
  return pass(ruleId);
}
