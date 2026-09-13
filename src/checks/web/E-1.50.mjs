import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.50";

export function run({ packageJson }) {
  const apply = packageJson?.eliware?.apply;
  return Array.isArray(apply) && apply.includes("web")
    ? pass(ruleId)
    : fail(ruleId, "Web repositories must apply the web convention group.");
}
