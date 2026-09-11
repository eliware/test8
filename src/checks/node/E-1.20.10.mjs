import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.20.10";
export function run({ packageJson }) {
  return packageJson?.scripts?.audit || packageJson?.scripts?.test
    ? pass(ruleId)
    : fail(ruleId, "Node repositories must define a validation lifecycle.");
}
