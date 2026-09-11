import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.9";

export function run({ packageJson }) {
  const conventions = packageJson?.eliware?.conventions;
  if (!conventions || typeof conventions !== "object" || Array.isArray(conventions)) {
    return fail(ruleId, "package.json must define eliware.conventions.");
  }
  return pass(ruleId);
}
