import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.20.19";
export function run({ packageJson }) {
  return packageJson?.dependencies && Object.keys(packageJson.dependencies).length > 0
    ? pass(ruleId)
    : fail(ruleId, "Node repositories must declare runtime dependencies explicitly.");
}
