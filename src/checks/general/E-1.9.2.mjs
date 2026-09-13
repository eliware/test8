import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.9.2";
export function run({ packageJson }) {
  return Array.isArray(packageJson?.eliware?.apply) && packageJson.eliware.apply.length > 0
    ? pass(ruleId)
    : fail(ruleId, "eliware.apply must list applicable convention groups.");
}
