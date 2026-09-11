import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.14";
export function run({ packageJson }) {
  return packageJson?.scripts?.test
    ? pass(ruleId)
    : fail(ruleId, "Repositories with npm dependencies require a validation lifecycle.");
}
