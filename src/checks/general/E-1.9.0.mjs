import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.9.0";

export function run({ packageJson }) {
  const conventions = packageJson?.eliware?.conventions;
  if (!conventions || conventions.version !== "8.0") {
    return fail(ruleId, "eliware.conventions.version must be 8.0.");
  }
  if (
    !Array.isArray(conventions.apply) ||
    conventions.apply.some((group) => typeof group !== "string")
  ) {
    return fail(ruleId, "eliware.conventions.apply must be an array of group names.");
  }
  if (Object.hasOwn(conventions, "exemptions")) {
    return fail(ruleId, "Exemptions must be stored in package.json.eliware.exempt.");
  }
  return pass(ruleId);
}
