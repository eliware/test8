import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.20.6";
export function run({ packageJson }) {
  return packageJson?.dependencies?.oxlint
    ? pass(ruleId)
    : fail(ruleId, "Node repositories using Oxlint must declare it as a dependency.");
}
