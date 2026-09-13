import { fail, pass } from "../../check-result.mjs";

export const ruleId = "E-1.50.4";
export const parentRuleId = "E-1.50";

export function run({ packageJson }) {
  if (typeof packageJson?.scripts?.build !== "string" || !packageJson.scripts.build.trim()) {
    return fail(ruleId, "Web applications must define a nonempty build script.");
  }
  return pass(ruleId);
}
