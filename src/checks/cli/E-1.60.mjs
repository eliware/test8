import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.60";
export function run({ packageJson }) {
  return packageJson?.eliware?.apply?.includes("cli")
    ? pass(ruleId)
    : fail(ruleId, "CLI repositories must apply the cli convention group.");
}
