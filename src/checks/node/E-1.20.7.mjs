import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.20.7";

export function run({ packageJson }) {
  const jest = packageJson?.jest;
  if (!jest || typeof jest !== "object" || Array.isArray(jest)) {
    return fail(ruleId, "package.json must contain a Jest configuration object.");
  }
  return pass(ruleId);
}
