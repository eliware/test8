import { pass } from "../../../check-result.mjs";

export const ruleId = "A-1.22.1";
export const parentRuleId = "E-1.22";

export function run() {
  return pass(ruleId);
}
