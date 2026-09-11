import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.60";
export function run({ packageJson }) {
  return packageJson?.eliware?.conventions?.apply?.includes("application")
    ? pass(ruleId)
    : fail(ruleId, "CLI repositories must also apply application conventions.");
}
