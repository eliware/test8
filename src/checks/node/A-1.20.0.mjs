import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.20.0";
export function run({ packageJson }) {
  return packageJson?.type === "module"
    ? pass(ruleId)
    : fail(ruleId, "Node repositories must use native ESM.");
}
