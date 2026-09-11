import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.20.19.0";
export function run({ packageJson }) {
  return packageJson?.engines?.node
    ? pass(ruleId)
    : fail(ruleId, "Node package metadata must declare supported Node versions.");
}
