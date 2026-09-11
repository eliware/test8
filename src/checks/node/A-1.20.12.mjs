import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.20.12";
export function run({ packageJson }) {
  return packageJson?.scripts?.test && packageJson?.scripts?.lint
    ? pass(ruleId)
    : fail(ruleId, "Node repositories must expose deterministic test and lint entrypoints.");
}
