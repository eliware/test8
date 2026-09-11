import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-1.3.0";

export function run({ packageJson }) {
  const command = packageJson?.scripts?.test;
  const selfHosted =
    packageJson?.name === "@eliware/test" && command === "node bin/eliware-test.mjs";
  return (typeof command === "string" && /(^|\s)eliware-test(?:\s|$)/.test(command)) || selfHosted
    ? pass(ruleId)
    : fail(ruleId, "The aggregate test command must invoke eliware-test.");
}
