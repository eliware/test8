import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1";
export function run({ packageJson }) {
  return packageJson?.name?.startsWith("@eliware/")
    ? pass(ruleId)
    : fail(ruleId, "Eliware repositories must use the @eliware package scope.");
}
