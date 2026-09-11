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
  if (conventions.exemptions !== undefined && !Array.isArray(conventions.exemptions)) {
    return fail(ruleId, "eliware.conventions.exemptions must be an array when present.");
  }
  return pass(ruleId);
}
