import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.9.1";
export function run({ packageJson }) {
  return typeof packageJson?.version === "string" &&
    /^\d+\.\d+\.\d+$/.test(packageJson.version) &&
    Array.isArray(packageJson?.eliware?.apply) &&
    packageJson.eliware.apply.length > 0
    ? pass(ruleId)
    : fail(ruleId, "package.json version and eliware.apply must identify the convention baseline.");
}
