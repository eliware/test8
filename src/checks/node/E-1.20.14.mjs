import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.20.14";
export function run({ packageJson }) {
  return packageJson?.files
    ? pass(ruleId)
    : fail(ruleId, "Published Node packages must define an intentional file allowlist.");
}
