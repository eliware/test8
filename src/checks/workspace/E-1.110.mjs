import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.110";

export function run({ root }) {
  return root ? pass(ruleId) : fail(ruleId, "Workspace repositories require a repository root.");
}
