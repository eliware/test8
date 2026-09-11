import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.0.9";
export function run({ packageJson }) {
  return packageJson?.name
    ? pass(ruleId)
    : fail(ruleId, "Repository metadata must identify the package.");
}
