import { pass } from "../../../../check-result.mjs";

export const ruleId = "A-1.20.11.0";
export const parentRuleId = "A-1.20.11";

export function run() {
  return pass(ruleId);
}
