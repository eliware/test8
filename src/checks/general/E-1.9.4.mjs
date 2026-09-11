import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.9.4";
export function run({ packageJson }) {
  const authority = packageJson?.eliware?.authority;
  return Array.isArray(authority?.authoritativeFor) &&
    authority.authoritativeFor.length > 0 &&
    Array.isArray(authority?.notAuthoritativeFor) &&
    authority.notAuthoritativeFor.length > 0
    ? pass(ruleId)
    : fail(ruleId, "eliware.authority must declare both authority boundaries.");
}
