import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.0.10";
export function run({ packageJson }) {
  return packageJson?.eliware?.apply?.length > 0
    ? pass(ruleId)
    : fail(ruleId, "Project-specific rules require an explicit convention selection.");
}
