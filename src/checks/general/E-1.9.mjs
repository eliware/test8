import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.9";

export function run({ packageJson }) {
  const eliware = packageJson?.eliware;
  if (!eliware || typeof eliware !== "object" || Array.isArray(eliware)) {
    return fail(ruleId, "package.json must define eliware metadata.");
  }
  return pass(ruleId);
}
