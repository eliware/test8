import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.40";

export function run({ packageJson }) {
  const apply = packageJson?.eliware?.apply;
  return Array.isArray(apply) && apply.includes("library")
    ? pass(ruleId)
    : fail(ruleId, "Library repositories must apply the library convention group.");
}
