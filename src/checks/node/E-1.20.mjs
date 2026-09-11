import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.20";
export function run({ packageJson }) {
  return packageJson?.engines?.node
    ? pass(ruleId)
    : fail(ruleId, "Node repositories must declare a Node.js engine range.");
}
