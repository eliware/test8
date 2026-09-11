import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.3";

export function run({ packageJson }) {
  const command = packageJson?.scripts?.test;
  if (typeof command !== "string" || command.trim() === "") {
    return fail(ruleId, "package.json scripts.test must be a non-empty string.");
  }
  if (command.trim() !== "eliware-test") {
    return fail(ruleId, "package.json scripts.test must be exactly eliware-test.");
  }
  return pass(ruleId);
}
