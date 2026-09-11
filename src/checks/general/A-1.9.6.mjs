import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.9.6";
const relations = new Set([
  "dependsOn",
  "consumedBy",
  "relatedAuthority",
  "implements",
  "supersedes",
]);
export function run({ packageJson }) {
  const links = packageJson?.eliware?.crosslinks;
  return Array.isArray(links) && links.every((link) => relations.has(link.relation))
    ? pass(ruleId)
    : fail(ruleId, "Crosslink relationships must use documented relation types.");
}
