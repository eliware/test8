import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.20.15";
export function run({ packageJson }) {
  return packageJson?.license
    ? pass(ruleId)
    : fail(ruleId, "Node packages must declare a license.");
}
