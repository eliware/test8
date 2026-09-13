import { pass } from "../../../../check-result.mjs";

export const ruleId = "A-1.20.10.0";
export const parentRuleId = "E-1.20.10";

export function run() {
  return pass(ruleId);
}
