import { fail, pass } from "../../check-result.mjs";

export const ruleId = "E-1.40.6";
export const parentRuleId = "E-1.40";

export function run({ packageJson }) {
  if (typeof packageJson?.scripts?.typecheck !== "string" || !packageJson.scripts.typecheck.trim()) return fail(ruleId, "Libraries must define a nonempty typecheck script.");
  return pass(ruleId);
}
