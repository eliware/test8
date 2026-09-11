import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.9.2";
export function run({ packageJson }) {
  return Array.isArray(packageJson?.eliware?.conventions?.apply) &&
    packageJson.eliware.conventions.apply.length > 0
    ? pass(ruleId)
    : fail(ruleId, "eliware.conventions.apply must list applicable convention groups.");
}
