import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.0.8";
export function run({ root }) {
  return root ? pass(ruleId) : fail(ruleId, "Repository instructions require a root.");
}
