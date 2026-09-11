import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.20.9";
export function run({ packageJson }) {
  return packageJson?.scripts?.format && packageJson?.scripts?.["format:check"]
    ? pass(ruleId)
    : fail(ruleId, "Node repositories must define format and format:check scripts.");
}
