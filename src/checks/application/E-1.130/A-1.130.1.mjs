import { pass } from "../../check-result.mjs";

export const ruleId = "A-1.130.1";
export const parentRuleId = "E-1.130";

export function run() {
  return pass(ruleId);
}
