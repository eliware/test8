import { pass } from "../../check-result.mjs";

export const ruleId = "A-1.150.1";
export const parentRuleId = "E-1.150";

export function run() {
  return pass(ruleId);
}
