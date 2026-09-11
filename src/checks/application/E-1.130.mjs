import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.130";
export function run({ packageJson }) {
  return packageJson?.eliware?.conventions?.apply?.includes("application")
    ? pass(ruleId)
    : fail(ruleId, "Application convention group is not applied.");
}
