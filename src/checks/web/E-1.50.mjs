import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.50";

export function run({ packageJson }) {
  const apply = packageJson?.eliware?.conventions?.apply;
  return Array.isArray(apply) && apply.includes("application")
    ? pass(ruleId)
    : fail(ruleId, "Web repositories must also apply the application convention group.");
}
