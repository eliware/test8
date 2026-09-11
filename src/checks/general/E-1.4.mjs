import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.4";
export function run({ packageJson }) {
  return typeof packageJson?.scripts?.lint === "string" && packageJson.scripts.lint.trim()
    ? pass(ruleId)
    : fail(ruleId, "Repositories must define a lint validation command.");
}
