import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.90.0.5";
export function run({ packageJson }) {
  return packageJson?.eliware?.authority
    ? pass(ruleId)
    : fail(ruleId, "Infrastructure subtypes require an explicit authority record.");
}
