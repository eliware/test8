import { pass } from "../../../../check-result.mjs";

export const ruleId = "A-1.25.1";
export const parentRuleId = "A-1.25.0";

export function run() {
  return pass(ruleId);
}
