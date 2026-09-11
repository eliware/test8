import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.20.18";
export function run({ packageJson }) {
  return packageJson?.scripts?.test && packageJson?.scripts?.lint && packageJson?.scripts?.format
    ? pass(ruleId)
    : fail(ruleId, "Node package scripts must expose the standard validation commands.");
}
