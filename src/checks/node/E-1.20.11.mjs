import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.20.11";
export function run({ packageJson }) {
  return packageJson?.packageManager || packageJson?.engines?.node
    ? pass(ruleId)
    : fail(ruleId, "Node repositories must declare runtime tooling metadata.");
}
