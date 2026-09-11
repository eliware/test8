import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.0.10";
export function run({ packageJson }) {
  return packageJson?.eliware?.conventions?.version === "8.0"
    ? pass(ruleId)
    : fail(ruleId, "Project conventions must use the v8 baseline.");
}
