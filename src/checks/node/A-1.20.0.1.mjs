import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.20.0.1";
export function run({ packageJson }) {
  const scripts = packageJson?.scripts ?? {};
  return typeof scripts.test === "string" && typeof scripts.lint === "string"
    ? pass(ruleId)
    : fail(ruleId, "Node repositories must define test and lint npm scripts.");
}
