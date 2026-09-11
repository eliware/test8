import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.20.12.0";
export function run({ packageJson }) {
  return packageJson?.type === "module" && packageJson?.engines?.node
    ? pass(ruleId)
    : fail(ruleId, "Node runtime and module metadata must be explicit.");
}
