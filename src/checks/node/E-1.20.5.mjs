import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.20.5";
export function run({ packageJson }) {
  return packageJson?.dependencies?.jest
    ? pass(ruleId)
    : fail(ruleId, "Node repositories using Jest must declare it as a dependency.");
}
