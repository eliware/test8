import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.100";

export function run({ root }) {
  return root
    ? pass(ruleId)
    : fail(ruleId, "Documentation repositories require a repository root.");
}
