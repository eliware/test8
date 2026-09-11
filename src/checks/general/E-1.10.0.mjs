import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.10.0";
export function run({ packageJson }) {
  return packageJson?.scripts?.test
    ? pass(ruleId)
    : fail(ruleId, "Knit must remain secondary to the package validation gate.");
}
