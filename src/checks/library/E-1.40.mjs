import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.40";

export function run({ packageJson }) {
  const apply = packageJson?.eliware?.conventions?.apply;
  return Array.isArray(apply) && apply.includes("node")
    ? pass(ruleId)
    : fail(ruleId, "Library repositories must apply the node convention group when using Node.js.");
}
