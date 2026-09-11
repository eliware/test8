import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.0.6";
export function run({ packageJson }) {
  return packageJson?.files
    ? pass(ruleId)
    : fail(ruleId, "Package metadata must define a controlled file surface.");
}
