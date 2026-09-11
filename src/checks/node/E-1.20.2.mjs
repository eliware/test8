import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.20.2";

export function run({ packageJson }) {
  if (packageJson?.type !== "module") {
    return fail(ruleId, "package.json must declare native ESM with type: module.");
  }
  return pass(ruleId);
}
