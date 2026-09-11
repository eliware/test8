import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.20.4";
export function run({ packageJson }) {
  return packageJson?.scripts?.lint
    ? pass(ruleId)
    : fail(ruleId, "Node repositories must define npm lint.");
}
