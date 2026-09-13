import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.9.0";

export function run({ packageJson }) {
  if (
    !Array.isArray(packageJson?.eliware?.apply) ||
    packageJson.eliware.apply.length === 0 ||
    packageJson.eliware.apply.some((group) => typeof group !== "string")
  ) {
    return fail(ruleId, "eliware.apply must be an array of group names.");
  }
  if (Object.hasOwn(packageJson?.eliware ?? {}, "exemptions")) {
    return fail(ruleId, "Exemptions must be stored in package.json.eliware.exempt.");
  }
  return pass(ruleId);
}
