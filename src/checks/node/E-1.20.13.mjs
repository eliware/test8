import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.20.13";
export function run({ packageJson }) {
  return packageJson?.scripts?.pack
    ? pass(ruleId)
    : fail(ruleId, "Published Node packages must define package validation.");
}
