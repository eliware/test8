import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.9.1";
export function run({ packageJson }) {
  return packageJson?.eliware?.conventions?.version
    ? pass(ruleId)
    : fail(ruleId, "eliware.conventions.version is required.");
}
