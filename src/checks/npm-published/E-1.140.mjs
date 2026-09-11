import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.140";

export function run({ packageJson }) {
  if (packageJson?.private === true) {
    return fail(ruleId, "Public npm repositories must not set package.json private to true.");
  }
  return pass(ruleId);
}
