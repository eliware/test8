import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.0.11";
export function run({ packageJson }) {
  return packageJson?.files
    ? pass(ruleId)
    : fail(ruleId, "Repository package metadata must identify required published structure.");
}
