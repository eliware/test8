import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.0.7";
export function run({ packageJson }) {
  return packageJson?.eliware?.conventions
    ? pass(ruleId)
    : fail(ruleId, "Convention metadata must document deviations and applicability.");
}
